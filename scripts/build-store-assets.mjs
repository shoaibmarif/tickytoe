import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(rootDir, 'packages/extension/store-assets');
fs.mkdirSync(outputDir, { recursive: true });

const tempHtmlPath = path.join(rootDir, 'temp_store_render.html');

console.log('Generating Chrome Web Store uploading assets...');

const assets = [
  // 1. Store Icon (128x128)
  {
    name: 'icon-128.png',
    width: 128,
    height: 128,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 128px;
      height: 128px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
    }
    .icon-box {
      width: 124px;
      height: 124px;
      border-radius: 28px;
      background: linear-gradient(135deg, #0f172a 0%, #090d16 100%);
      border: 2px solid #312e81;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 26px);
      grid-template-rows: repeat(3, 26px);
      gap: 4px;
    }
    .cell {
      background: #172033;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
    }
    .x { color: #06b6d4; text-shadow: 0 0 8px rgba(6, 182, 212, 0.8); }
    .o { color: #f43f5e; text-shadow: 0 0 8px rgba(244, 63, 94, 0.8); }
    .win { background: #0e2a3a; border: 1px solid #06b6d4; }
  </style>
</head>
<body>
  <div class="icon-box">
    <div class="grid">
      <div class="cell x win">✕</div>
      <div class="cell o">○</div>
      <div class="cell o">○</div>
      <div class="cell"></div>
      <div class="cell x win">✕</div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell x win">✕</div>
    </div>
  </div>
</body>
</html>`
  },

  // 2. Small Promo Tile (440x280)
  {
    name: 'promo-small-440x280.png',
    width: 440,
    height: 280,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 440px;
      height: 280px;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      color: #ffffff;
      display: flex;
      position: relative;
    }
    .bg-glow-1 {
      position: absolute;
      width: 260px;
      height: 260px;
      top: -80px;
      right: -60px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
    }
    .bg-glow-2 {
      position: absolute;
      width: 220px;
      height: 220px;
      bottom: -60px;
      left: -40px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
    }
    .container {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #1e293b;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .version-pill {
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #818cf8;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin: 8px 0;
    }
    .left-info {
      flex: 1;
    }
    .headline {
      font-size: 17px;
      font-weight: 700;
      line-height: 1.3;
      color: #f1f5f9;
      margin-bottom: 6px;
    }
    .headline span {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    .tag {
      font-size: 10px;
      font-weight: 600;
      padding: 3px 7px;
      border-radius: 6px;
      background: #172033;
      border: 1px solid #1e293b;
      color: #94a3b8;
    }
    .tag.highlight {
      background: rgba(6, 182, 212, 0.12);
      border-color: rgba(6, 182, 212, 0.3);
      color: #38bdf8;
    }
    .mini-board {
      width: 96px;
      height: 96px;
      background: #0f172a;
      border-radius: 12px;
      border: 1px solid #1e293b;
      padding: 6px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    }
    .mini-cell {
      background: #172033;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 900;
    }
    .mini-x { color: #06b6d4; text-shadow: 0 0 6px rgba(6, 182, 212, 0.8); }
    .mini-o { color: #f43f5e; text-shadow: 0 0 6px rgba(244, 63, 94, 0.8); }
    .win-cell { background: #0e2a3a; border: 1px solid #06b6d4; }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #1e293b;
      padding-top: 8px;
      font-size: 10px;
      color: #64748b;
    }
    .author {
      color: #94a3b8;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>
  <div class="container">
    <div class="header">
      <div class="brand">
        <div class="logo-badge">✕○</div>
        <div class="title">tickytoe</div>
      </div>
      <div class="version-pill">v1.0.0 • Manifest V3</div>
    </div>

    <div class="content">
      <div class="left-info">
        <div class="headline">Offline Tic Tac Toe with <span>Unbeatable AI</span></div>
        <div class="tags">
          <span class="tag highlight">⚡ Minimax AI</span>
          <span class="tag">3x3, 4x4, 5x5</span>
          <span class="tag">Pass & Play</span>
          <span class="tag">100% Private</span>
        </div>
      </div>

      <div class="mini-board">
        <div class="mini-cell mini-x win-cell">✕</div>
        <div class="mini-cell mini-o">○</div>
        <div class="mini-cell mini-o">○</div>
        <div class="mini-cell"></div>
        <div class="mini-cell mini-x win-cell">✕</div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell"></div>
        <div class="mini-cell mini-x win-cell">✕</div>
      </div>
    </div>

    <div class="footer">
      <span>Free & Open Source</span>
      <span class="author">By Shoaib M Arif</span>
    </div>
  </div>
</body>
</html>`
  },

  // 3. Marquee Promo Tile (1400x560)
  {
    name: 'promo-marquee-1400x560.png',
    width: 1400,
    height: 560,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 1400px;
      height: 560px;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      color: #ffffff;
      display: flex;
      position: relative;
    }
    .glow-left {
      position: absolute;
      width: 600px;
      height: 600px;
      top: -150px;
      left: -150px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
    }
    .glow-right {
      position: absolute;
      width: 700px;
      height: 700px;
      bottom: -200px;
      right: -100px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
    }
    .layout {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      padding: 60px 80px;
      align-items: center;
      gap: 40px;
    }
    .left-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
    }
    .brand-name {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.03em;
    }
    .version-tag {
      font-size: 13px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #818cf8;
    }
    .main-title {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }
    .main-title span {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 18px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .features-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 6px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #cbd5e1;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #06b6d4;
      box-shadow: 0 0 8px #06b6d4;
    }
    .creator-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
      padding-top: 18px;
      border-top: 1px solid #1e293b;
      font-size: 14px;
      color: #94a3b8;
    }
    .creator-bar strong {
      color: #ffffff;
    }
    .social-badge {
      padding: 4px 10px;
      border-radius: 6px;
      background: #172033;
      border: 1px solid #334155;
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 600;
    }
    .right-col {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .popup-frame {
      width: 360px;
      background: #0c1220;
      border: 2px solid #334155;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.2);
    }
    .frame-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .score-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: #141c2e;
      padding: 8px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 12px;
    }
    .score-num {
      font-size: 16px;
      font-weight: 900;
      color: #ffffff;
    }
    .score-lbl {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
    }
    .board-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #141c2e;
      padding: 12px;
      border-radius: 14px;
      aspect-ratio: 1/1;
      margin-bottom: 14px;
    }
    .b-cell {
      background: #1e293b;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 900;
    }
    .b-cell.x { color: #06b6d4; }
    .b-cell.o { color: #f43f5e; }
    .b-cell.win {
      background: rgba(6, 182, 212, 0.25);
      border: 2px solid #06b6d4;
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.5);
    }
    .cta-btn {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      padding: 10px;
      border-radius: 10px;
      text-align: center;
      font-weight: 700;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
  </style>
</head>
<body>
  <div class="glow-left"></div>
  <div class="glow-right"></div>
  <div class="layout">
    <div class="left-col">
      <div class="brand-row">
        <div class="brand-icon">✕○</div>
        <div class="brand-name">tickytoe</div>
        <div class="version-tag">v1.0.0 • MV3</div>
      </div>

      <div class="main-title">
        Offline Tic Tac Toe with <span>Unbeatable AI</span>
      </div>

      <div class="subtitle">
        Play instantly from your browser toolbar. Free, zero tracking, and completely offline with 3x3, 4x4 & 5x5 multi-grids.
      </div>

      <div class="features-list">
        <div class="feature-item"><div class="dot"></div> Unbeatable Minimax AI</div>
        <div class="feature-item"><div class="dot"></div> Local 2-Player Pass & Play</div>
        <div class="feature-item"><div class="dot"></div> 3x3, 4x4, 5x5 Grid Options</div>
        <div class="feature-item"><div class="dot"></div> Win Streak Toolbar Badges</div>
      </div>

      <div class="creator-bar">
        <span>Created by <strong>Shoaib M Arif</strong></span>
        <span class="social-badge">GitHub: @shoaibmarif</span>
        <span class="social-badge">LinkedIn: /in/shoaibmarif</span>
      </div>
    </div>

    <div class="right-col">
      <div class="popup-frame">
        <div class="frame-header">
          <div style="font-weight:800; font-size:14px;">tickytoe Extension</div>
          <div style="font-size:11px; color:#38bdf8; font-weight:700;">● Online & Offline</div>
        </div>

        <div class="score-row">
          <div><div class="score-lbl" style="color:#06b6d4">YOU (X)</div><div class="score-num">5</div></div>
          <div><div class="score-lbl">DRAWS</div><div class="score-num">1</div></div>
          <div><div class="score-lbl" style="color:#f43f5e">AI (O)</div><div class="score-num">2</div></div>
          <div><div class="score-lbl" style="color:#f59e0b">🔥 STREAK</div><div class="score-num" style="color:#fbbf24">3</div></div>
        </div>

        <div class="board-grid">
          <div class="b-cell x win">✕</div>
          <div class="b-cell o">○</div>
          <div class="b-cell o">○</div>
          <div class="b-cell"></div>
          <div class="b-cell x win">✕</div>
          <div class="b-cell"></div>
          <div class="b-cell"></div>
          <div class="b-cell"></div>
          <div class="b-cell x win">✕</div>
        </div>

        <div class="cta-btn">🎉 Player X Wins! (Victory Streak +1)</div>
      </div>
    </div>
  </div>
</body>
</html>`
  },

  // 4. Store Screenshot 1 (1280x800) - Unbeatable AI & Classic Gameplay
  {
    name: 'screenshot-1-gameplay.png',
    width: 1280,
    height: 800,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 1280px;
      height: 800px;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .bg-glow {
      position: absolute;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%);
      z-index: 1;
    }
    .header-banner {
      position: relative;
      z-index: 2;
      text-align: center;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #818cf8;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .title {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .title span {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 16px;
      color: #94a3b8;
    }
    .card-mockup {
      position: relative;
      z-index: 2;
      width: 380px;
      background: #0c1220;
      border: 2px solid #1e293b;
      border-radius: 20px;
      padding: 18px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2);
    }
    .row-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #1e293b;
    }
    .brand-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 800;
    }
    .pills-row {
      display: flex;
      gap: 6px;
      margin: 12px 0 8px 0;
    }
    .pill {
      flex: 1;
      text-align: center;
      padding: 6px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      background: #172033;
      color: #94a3b8;
    }
    .pill.active {
      background: #6366f1;
      color: #ffffff;
    }
    .pill.active-cyan {
      background: #06b6d4;
      color: #ffffff;
    }
    .score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: #141c2e;
      padding: 8px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 10px;
    }
    .status-alert {
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      padding: 6px;
      border-radius: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      margin-bottom: 10px;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #141c2e;
      padding: 10px;
      border-radius: 14px;
      aspect-ratio: 1/1;
      margin-bottom: 12px;
    }
    .cell {
      background: #1e293b;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 900;
    }
    .cell.x { color: #06b6d4; }
    .cell.o { color: #f43f5e; }
    .cell.win {
      background: rgba(6, 182, 212, 0.25);
      border: 2px solid #06b6d4;
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.5);
    }
    .action-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .btn-new {
      flex: 1;
      background: #6366f1;
      color: #ffffff;
      padding: 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }
    .btn-undo {
      background: #1e293b;
      color: #cbd5e1;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      border: 1px solid #334155;
    }
    .ext-footer {
      border-top: 1px solid #1e293b;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="header-banner">
    <div class="badge">CHROME EXTENSION (MANIFEST V3) • VERSION 1.0.0</div>
    <div class="title">Play Instant <span>Tic Tac Toe</span> Anywhere Offline</div>
    <div class="subtitle">Built-in Minimax AI, Audio Feedback, Score Tracking & Instant Undo</div>
  </div>

  <div class="card-mockup">
    <div class="row-head">
      <div class="brand-tag">
        <span style="display:inline-block;width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#6366f1,#06b6d4);text-align:center;line-height:24px;font-size:12px;">✕</span>
        <span>tickytoe</span>
        <span style="font-size:9px;background:#1e1b4b;color:#818cf8;padding:1px 6px;border-radius:999px;">v1.0.0</span>
      </div>
      <div style="font-size:11px;color:#38bdf8;font-weight:700;">🔊 Sound On</div>
    </div>

    <div class="pills-row">
      <div class="pill active">🤖 Vs AI</div>
      <div class="pill">👥 2-Player</div>
      <div class="pill active-cyan">3x3</div>
      <div class="pill">4x4</div>
      <div class="pill">5x5</div>
    </div>

    <div class="score-grid">
      <div><div style="font-size:9px;color:#06b6d4;font-weight:800;">YOU (X)</div><div style="font-size:15px;font-weight:900;">4</div></div>
      <div><div style="font-size:9px;color:#94a3b8;font-weight:700;">DRAWS</div><div style="font-size:15px;font-weight:900;">1</div></div>
      <div><div style="font-size:9px;color:#f43f5e;font-weight:800;">AI (O)</div><div style="font-size:15px;font-weight:900;">2</div></div>
      <div><div style="font-size:9px;color:#f59e0b;font-weight:800;">🔥 STREAK</div><div style="font-size:15px;font-weight:900;color:#fbbf24;">3</div></div>
    </div>

    <div class="status-alert">🏆 Player X Wins! Great Job!</div>

    <div class="board">
      <div class="cell x win">✕</div>
      <div class="cell o">○</div>
      <div class="cell o">○</div>
      <div class="cell"></div>
      <div class="cell x win">✕</div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell"></div>
      <div class="cell x win">✕</div>
    </div>

    <div class="action-row">
      <div class="btn-new">🔄 New Game</div>
      <div class="btn-undo">⤺ Undo</div>
    </div>

    <div class="ext-footer">
      <span>By Shoaib M Arif</span>
      <span style="color:#38bdf8;">github.com/shoaibmarif</span>
    </div>
  </div>
</body>
</html>`
  },

  // 5. Store Screenshot 2 (1280x800) - Multi-Grid 4x4 & 5x5 Battles
  {
    name: 'screenshot-2-multigrid.png',
    width: 1280,
    height: 800,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 1280px;
      height: 800px;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .header-banner {
      position: relative;
      z-index: 2;
      text-align: center;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #38bdf8;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .title {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .title span {
      background: linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 16px;
      color: #94a3b8;
    }
    .showcase-row {
      display: flex;
      gap: 40px;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }
    .card-mockup {
      width: 350px;
      background: #0c1220;
      border: 2px solid #1e293b;
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
    }
    .board-4x4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      background: #141c2e;
      padding: 10px;
      border-radius: 12px;
      aspect-ratio: 1/1;
      margin: 10px 0;
    }
    .board-5x5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 5px;
      background: #141c2e;
      padding: 10px;
      border-radius: 12px;
      aspect-ratio: 1/1;
      margin: 10px 0;
    }
    .cell-4 {
      background: #1e293b;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
    }
    .cell-5 {
      background: #1e293b;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
    }
    .x { color: #06b6d4; }
    .o { color: #f43f5e; }
    .win {
      background: rgba(6, 182, 212, 0.25);
      border: 1px solid #06b6d4;
    }
    .pill-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      background: #172033;
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="badge">EXPANDED GRID DIMENSIONS • 4-IN-A-ROW TARGET</div>
    <div class="title">Challenge Yourself on <span>4x4 and 5x5</span> Grids</div>
    <div class="subtitle">Higher strategic depth with Connect-4 mechanics and pass-and-play local multiplayer</div>
  </div>

  <div class="showcase-row">
    <!-- 4x4 Card -->
    <div class="card-mockup">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:800; font-size:14px;">4x4 Grid Mode</span>
        <span class="pill-tag">Connect 4</span>
      </div>
      <div class="board-4x4">
        <div class="cell-4 x win">✕</div>
        <div class="cell-4 x win">✕</div>
        <div class="cell-4 x win">✕</div>
        <div class="cell-4 x win">✕</div>
        <div class="cell-4 o">○</div>
        <div class="cell-4 o">○</div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
        <div class="cell-4 o">○</div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
        <div class="cell-4"></div>
      </div>
      <div style="text-align:center; font-size:11px; color:#34d399; font-weight:700;">Horizontal 4-in-a-Row Victory!</div>
    </div>

    <!-- 5x5 Card -->
    <div class="card-mockup">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:800; font-size:14px;">5x5 Tactical Mode</span>
        <span class="pill-tag">Master AI</span>
      </div>
      <div class="board-5x5">
        <div class="cell-5"></div>
        <div class="cell-5 x">✕</div>
        <div class="cell-5 o">○</div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5 x">✕</div>
        <div class="cell-5 o">○</div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5 x">✕</div>
        <div class="cell-5 o">○</div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5 x win">✕</div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
        <div class="cell-5"></div>
      </div>
      <div style="text-align:center; font-size:11px; color:#38bdf8; font-weight:700;">Diagonal Tactical Defense</div>
    </div>
  </div>
</body>
</html>`
  },

  // 6. Store Screenshot 3 (1280x800) - Offline Ready & Creator Links
  {
    name: 'screenshot-3-features.png',
    width: 1280,
    height: 800,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 1280px;
      height: 800px;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .header-banner {
      text-align: center;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .title {
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .title span {
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 16px;
      color: #94a3b8;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 340px);
      gap: 24px;
    }
    .f-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .f-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .f-title {
      font-size: 17px;
      font-weight: 800;
      color: #f8fafc;
    }
    .f-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .f-link {
      margin-top: auto;
      font-size: 12px;
      font-weight: 700;
      color: #38bdf8;
    }
    .author-strip {
      margin-top: 36px;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 24px;
      border-radius: 999px;
      background: #0e1526;
      border: 1px solid #1e293b;
      font-size: 14px;
      color: #cbd5e1;
    }
    .author-strip strong {
      color: #ffffff;
    }
    .author-link {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="badge">100% PRIVATE • ZERO DATA TRACKING • FULL APP ACCESS</div>
    <div class="title">Built for Speed, Privacy & <span>Seamless Gameplay</span></div>
    <div class="subtitle">Enjoy quick popup matches or switch to the full web app with single-click access</div>
  </div>

  <div class="features-grid">
    <div class="f-card">
      <div class="f-icon">🔒</div>
      <div class="f-title">100% Offline & Private</div>
      <div class="f-desc">No network requests required. All AI computation and score persistence happens directly inside your browser. Zero telemetry.</div>
      <div class="f-link">Manifest V3 Secure</div>
    </div>

    <div class="f-card">
      <div class="f-icon">🌐</div>
      <div class="f-title">Full Web App Link</div>
      <div class="f-desc">Want full screen, leaderboards, or custom sound themes? Launch the full web app with a single click anytime.</div>
      <div class="f-link">tictactoe-pro.netlify.app ↗</div>
    </div>

    <div class="f-card">
      <div class="f-icon">🔥</div>
      <div class="f-title">Win Streak Badges</div>
      <div class="f-desc">Shows your current winning streak on your Chrome toolbar icon so you can track your gaming record at a glance.</div>
      <div class="f-link">Chrome Toolbar Sync</div>
    </div>
  </div>

  <div class="author-strip">
    <span>Developed by <strong>Shoaib M Arif</strong></span>
    <span>•</span>
    <span class="author-link">GitHub: github.com/shoaibmarif</span>
    <span>•</span>
    <span class="author-link">LinkedIn: linkedin.com/in/shoaibmarif</span>
  </div>
</body>
</html>`
  }
];

for (const asset of assets) {
  const outputPath = path.join(outputDir, asset.name);
  fs.writeFileSync(tempHtmlPath, asset.html);

  try {
    execFileSync(
      chromePath,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        asset.name.includes('icon') ? '--default-background-color=00000000' : '--default-background-color=090d16ff',
        `--window-size=${asset.width},${asset.height}`,
        `--screenshot=${outputPath}`,
        `file://${tempHtmlPath.replace(/\\/g, '/')}`,
      ],
      { stdio: 'pipe' }
    );
    console.log(`Generated ${asset.name} (${asset.width}x${asset.height})`);
  } catch (err) {
    console.error(`Error rendering ${asset.name}:`, err.message);
  }
}

if (fs.existsSync(tempHtmlPath)) {
  fs.unlinkSync(tempHtmlPath);
}

console.log('Chrome Web Store assets generation completed successfully!');
