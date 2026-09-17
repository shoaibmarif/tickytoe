import { useCallback, useEffect, useRef, useState } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { GridSize, Player } from '@tictactoe/core';

export type OnlineConnectionStatus =
  | 'idle'
  | 'creating'
  | 'waiting'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type WebRTCMessage =
  | { type: 'move'; index: number }
  | { type: 'reset'; gridSize?: GridSize }
  | { type: 'rematch_request' }
  | { type: 'rematch_accept' }
  | { type: 'emote'; emoji: string }
  | { type: 'ping'; timestamp: number }
  | { type: 'pong'; timestamp: number }
  | { type: 'room_full'; message: string }
  | { type: 'leave' };

const STUN_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export function useWebRTC(
  onMessageReceived?: (msg: WebRTCMessage) => void,
  onOpponentDisconnect?: () => void
) {
  const [status, setStatus] = useState<OnlineConnectionStatus>('idle');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastEmote, setLastEmote] = useState<{ emoji: string; id: number } | null>(null);
  const [rematchRequestedByOpponent, setRematchRequestedByOpponent] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // References
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const lastHeartbeatReceivedRef = useRef<number>(Date.now());
  const onMessageRef = useRef(onMessageReceived);
  onMessageRef.current = onMessageReceived;
  const onOpponentDisconnectRef = useRef(onOpponentDisconnect);
  onOpponentDisconnectRef.current = onOpponentDisconnect;

  // Clean up connection
  const disconnect = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (connRef.current) {
      try {
        connRef.current.close();
      } catch {}
      connRef.current = null;
    }
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch {}
      peerRef.current = null;
    }

    setStatus('idle');
    setRoomCode(null);
    setLatency(null);
    setErrorMessage(null);
    setRematchRequestedByOpponent(false);
    setOpponentDisconnected(false);
  }, []);

  // Send raw message across active channel
  const sendMessage = useCallback((msg: WebRTCMessage) => {
    if (connRef.current && connRef.current.open) {
      try {
        connRef.current.send(msg);
      } catch (err) {
        console.warn('Failed to send WebRTC message:', err);
      }
    }
  }, []);

  // Gracefully notify opponent when closing the tab / unloading
  useEffect(() => {
    const handleTabClose = () => {
      if (connRef.current && connRef.current.open) {
        try {
          connRef.current.send({ type: 'leave' });
          connRef.current.close();
        } catch {}
      }
      if (peerRef.current) {
        try {
          peerRef.current.destroy();
        } catch {}
      }
    };

    window.addEventListener('beforeunload', handleTabClose);
    window.addEventListener('pagehide', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('pagehide', handleTabClose);
      disconnect();
    };
  }, [disconnect]);

  // Handle incoming message
  const handleIncomingData = useCallback(
    (data: unknown) => {
      lastHeartbeatReceivedRef.current = Date.now();

      let msg: WebRTCMessage | null = null;
      if (typeof data === 'string') {
        try {
          msg = JSON.parse(data);
        } catch {
          return;
        }
      } else if (typeof data === 'object' && data !== null) {
        msg = data as WebRTCMessage;
      }

      if (!msg) return;

      if (msg.type === 'ping') {
        sendMessage({ type: 'pong', timestamp: msg.timestamp });
        return;
      }

      if (msg.type === 'pong') {
        const rtt = Date.now() - msg.timestamp;
        setLatency(Math.max(1, Math.round(rtt / 2)));
        return;
      }

      if (msg.type === 'room_full') {
        setStatus('error');
        setErrorMessage(msg.message || 'Room is full (maximum 2 players allowed).');
        if (connRef.current) {
          try {
            connRef.current.close();
          } catch {}
          connRef.current = null;
        }
        return;
      }

      if (msg.type === 'leave') {
        setStatus('disconnected');
        setOpponentDisconnected(true);
        onOpponentDisconnectRef.current?.();
        return;
      }

      if (msg.type === 'emote') {
        setLastEmote({ emoji: msg.emoji, id: Date.now() });
      }

      if (msg.type === 'rematch_request') {
        setRematchRequestedByOpponent(true);
      }

      if (msg.type === 'rematch_accept' || msg.type === 'reset') {
        setRematchRequestedByOpponent(false);
      }

      onMessageRef.current?.(msg);
    },
    [sendMessage]
  );

  // Setup 5-second bidirectional heartbeat ping/pong & timeout check
  const startPingLoop = useCallback(() => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    lastHeartbeatReceivedRef.current = Date.now();

    // Check each 5s (5000ms)
    pingIntervalRef.current = window.setInterval(() => {
      // 1. Send heartbeat ping
      sendMessage({ type: 'ping', timestamp: Date.now() });

      // 2. Check if opponent is still alive (no response for >12s = missed 2 heartbeats)
      const silenceDuration = Date.now() - lastHeartbeatReceivedRef.current;
      if (silenceDuration > 12000) {
        console.warn('Opponent heartbeat timed out after 12 seconds');
        setStatus('disconnected');
        setOpponentDisconnected(true);
        onOpponentDisconnectRef.current?.();
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      }
    }, 5000);
  }, [sendMessage]);

  // Wire up DataConnection handlers
  const setupDataConnection = useCallback(
    (conn: DataConnection) => {
      connRef.current = conn;

      conn.on('open', () => {
        setStatus('connected');
        setErrorMessage(null);
        setOpponentDisconnected(false);
        lastHeartbeatReceivedRef.current = Date.now();
        startPingLoop();
      });

      conn.on('data', (data) => {
        handleIncomingData(data);
      });

      conn.on('close', () => {
        setStatus('disconnected');
        setLatency(null);
        setOpponentDisconnected(true);
        onOpponentDisconnectRef.current?.();
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      });

      conn.on('error', (err) => {
        console.error('DataConnection error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Connection error');
      });
    },
    [handleIncomingData, startPingLoop]
  );

  // -------------------------------------------------------------
  // 1. Create Room (Host - Max 2 players enforced)
  // -------------------------------------------------------------
  const createRoom = useCallback(
    async (preferredCode?: string): Promise<string> => {
      disconnect();
      setStatus('creating');
      setIsHost(true);
      setErrorMessage(null);
      setOpponentDisconnected(false);

      const code =
        preferredCode?.trim().replace(/\D/g, '').slice(0, 6) ||
        Math.floor(100000 + Math.random() * 900000).toString();

      const peerId = `ttt-v1-${code}`;

      return new Promise<string>((resolve, reject) => {
        try {
          const peer = new Peer(peerId, {
            config: STUN_CONFIG,
            debug: 0,
          });
          peerRef.current = peer;

          peer.on('open', () => {
            setStatus('waiting');
            setRoomCode(code);
            resolve(code);
          });

          peer.on('connection', (conn) => {
            // ENFORCE MAX 2 PLAYERS:
            // If host already has an active guest connection, reject the 3rd person immediately!
            if (
              connRef.current &&
              (connRef.current.open ||
                connRef.current.peerConnection?.connectionState === 'connected')
            ) {
              conn.on('open', () => {
                try {
                  conn.send({
                    type: 'room_full',
                    message: 'Room is full! Maximum 2 players allowed.',
                  });
                } catch {}
                setTimeout(() => {
                  conn.close();
                }, 400);
              });
              return;
            }

            setupDataConnection(conn);
          });

          peer.on('error', (err) => {
            console.error('PeerJS Host error:', err);
            if (err.type === 'unavailable-id') {
              setErrorMessage(`Room code ${code} is currently active. Please generate a new code.`);
            } else {
              setErrorMessage(err.message || 'Failed to connect to matchmaking service.');
            }
            setStatus('error');
            reject(err);
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setStatus('error');
          setErrorMessage(message);
          reject(err);
        }
      });
    },
    [disconnect, setupDataConnection]
  );

  // -------------------------------------------------------------
  // 2. Join Room (Guest)
  // -------------------------------------------------------------
  const joinRoom = useCallback(
    async (code: string): Promise<void> => {
      disconnect();
      setStatus('connecting');
      setIsHost(false);
      setErrorMessage(null);
      setOpponentDisconnected(false);

      const cleanCode = code.trim().replace(/\D/g, '').slice(0, 6);
      if (cleanCode.length !== 6) {
        setStatus('error');
        setErrorMessage('Please enter a valid 6-digit room code.');
        return;
      }

      setRoomCode(cleanCode);
      const targetPeerId = `ttt-v1-${cleanCode}`;

      return new Promise<void>((resolve, reject) => {
        try {
          const peer = new Peer({
            config: STUN_CONFIG,
            debug: 0,
          });
          peerRef.current = peer;

          peer.on('open', () => {
            const conn = peer.connect(targetPeerId, {
              reliable: true,
            });
            setupDataConnection(conn);
            resolve();
          });

          peer.on('error', (err) => {
            console.error('PeerJS Guest error:', err);
            setStatus('error');
            if (err.type === 'peer-unavailable') {
              setErrorMessage(`Room ${cleanCode} not found. Ensure host created the room first.`);
            } else {
              setErrorMessage(err.message || 'Connection failed.');
            }
            reject(err);
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setStatus('error');
          setErrorMessage(message);
          reject(err);
        }
      });
    },
    [disconnect, setupDataConnection]
  );

  // Game Action Helpers
  const sendMove = useCallback(
    (index: number) => {
      sendMessage({ type: 'move', index });
    },
    [sendMessage]
  );

  const sendReset = useCallback(
    (gridSize?: GridSize) => {
      sendMessage({ type: 'reset', gridSize });
    },
    [sendMessage]
  );

  const sendRematchRequest = useCallback(() => {
    sendMessage({ type: 'rematch_request' });
  }, [sendMessage]);

  const sendRematchAccept = useCallback(() => {
    setRematchRequestedByOpponent(false);
    sendMessage({ type: 'rematch_accept' });
  }, [sendMessage]);

  const sendEmote = useCallback(
    (emoji: string) => {
      sendMessage({ type: 'emote', emoji });
      setLastEmote({ emoji, id: Date.now() });
    },
    [sendMessage]
  );

  const mySymbol: Player = isHost ? 'X' : 'O';
  const opponentSymbol: Player = isHost ? 'O' : 'X';

  return {
    status,
    roomCode,
    isHost,
    mySymbol,
    opponentSymbol,
    latency,
    errorMessage,
    lastEmote,
    rematchRequestedByOpponent,
    opponentDisconnected,
    createRoom,
    joinRoom,
    sendMove,
    sendReset,
    sendRematchRequest,
    sendRematchAccept,
    sendEmote,
    disconnect,
  };
}
