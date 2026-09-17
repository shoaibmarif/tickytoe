import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Cpu,
  Database,
  Radio,
  FileText,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Set robots meta tag for privacy policy page
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    const previousContent = meta.content;
    meta.content = 'index, follow';

    return () => {
      if (meta) {
        if (created) {
          meta.remove();
        } else {
          meta.content = previousContent;
        }
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-14 px-4 sm:px-6 space-y-10">
      {/* Return home link */}
      <div>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Game</span>
        </a>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Client-Side & Zero-Log Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Data Disclosure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Effective Date: September 18, 2026. This Privacy Policy details our strict adherence to privacy-by-design, data minimization, and regulatory standards across our web application and Google Chrome extension.
        </p>
      </div>

      {/* Key Guarantees Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Local Execution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All AI computation (Minimax with alpha-beta pruning) executes directly in your browser JavaScript thread. Zero move computation occurs on remote servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Local Storage Only</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Match statistics, streaks, and audio preferences remain stored strictly on your device via HTML5 LocalStorage. No user database exists.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Zero Telemetry</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No tracking cookies, no Google Analytics pixels, no advertising beacons, and no behavioral fingerprinters are loaded or permitted.
          </p>
        </div>
      </div>

      {/* Detailed Narrative Sections */}
      <div className="prose dark:prose-invert prose-slate max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>1. Information We Do Not Collect</span>
          </h2>
          <p>
            We believe consumer utilities should respect user privacy and independence. Unlike typical web applications, <strong>tickytoe</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Does <strong>not</strong> require user registration, logins, passwords, or email addresses.</li>
            <li>Does <strong>not</strong> collect personally identifiable information (PII) such as real names, physical addresses, or financial details.</li>
            <li>Does <strong>not</strong> use tracking cookies, analytics identifiers, or browser fingerprinting technologies.</li>
            <li>Does <strong>not</strong> record or log IP addresses or gameplay patterns to any centralized backend database.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>2. HTML5 Local Storage & Data Retention</span>
          </h2>
          <p>
            To provide persistent convenience between browser sessions without needing servers or accounts, this application uses standard browser <code>localStorage</code> exclusively:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200">
                  <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700">Storage Key</th>
                  <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700">Purpose</th>
                  <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700">Retention & Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-mono text-[11px] text-indigo-500 font-bold">ttt_settings</td>
                  <td className="p-3">Saves client sound toggle, volume level, symbol theme, and turn timer duration.</td>
                  <td className="p-3">Stored locally until cleared in browser settings.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[11px] text-indigo-500 font-bold">ttt_stats</td>
                  <td className="p-3">Maintains local win/loss tallies, streaks, and match timestamps for your personal record.</td>
                  <td className="p-3">Can be reset anytime with 1-click via the in-game Stats modal.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This data never leaves your computer or phone, is not visible to other domains, and is never synchronized across internet networks.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Radio className="w-4 h-4 text-cyan-500" />
            <span>3. Peer-to-Peer (WebRTC) Online Multiplayer & Signaling</span>
          </h2>
          <p>
            When utilizing <strong>Online Multiplayer Mode</strong>, communication between the two players operates via direct peer-to-peer browser links:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Direct Encryption:</strong> All gameplay moves, emoji reactions, and heartbeats are transmitted directly over WebRTC DataChannels secured by Datagram Transport Layer Security (DTLS) and SCTP encryption.
            </li>
            <li>
              <strong>Room Limits & Isolation:</strong> Each online room is strictly capped at a <strong>maximum of 2 players</strong> (Host and Guest). Any unauthorized third-party attempt to connect to an active room is automatically rejected.
            </li>
            <li>
              <strong>Google STUN Servers:</strong> Standard public Google STUN servers (<code>stun:stun.l.google.com:19302</code>) are queried solely during initial connection negotiation to determine Network Address Translation (NAT) and ICE candidates. STUN servers only handle routing addresses and do not intercept, view, or record game data.
            </li>
            <li>
              <strong>Connection Heartbeats & Tab Close Detection:</strong> Active online games verify connection health every 5 seconds. If either player closes their tab or disconnects, the connection terminates cleanly, declaring the remaining player the winner by forfeit.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>4. Google Chrome Extension (Manifest V3) Security</span>
          </h2>
          <p>
            The official <strong>tickytoe Google Chrome Extension</strong> operates under Google's modern Manifest V3 security model:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Zero Content Scripts:</strong> The extension does not inject scripts or modify DOM elements on third-party websites you visit.
            </li>
            <li>
              <strong>Minimal Permissions:</strong> Only <code>storage</code> (for offline preferences) and <code>contextMenus</code> (for the optional browser context shortcut) are declared.
            </li>
            <li>
              <strong>Offline Execution:</strong> The extension package contains all bundled HTML, CSS, and JS assets locally, allowing instant offline play without network access.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>5. Regulatory Compliance & Legal References</span>
          </h2>
          <p>
            Because we do not collect, process, or sell personal data, our application inherently satisfies the highest global privacy and consumer protection standards:
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                European Union General Data Protection Regulation (GDPR - Regulation (EU) 2016/679)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complies with <strong>Article 5(1)(c)</strong> (Data Minimization) by collecting zero PII, <strong>Article 6</strong> (Lawful Basis), and <strong>Article 17</strong> (Right to Erasure), which users can exercise instantly by clearing browser cache or in-app stats.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                California Consumer Privacy Act & CPRA (Cal. Civ. Code § 1798.100 et seq.)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We do not sell, rent, or share consumer personal information for cross-context behavioral advertising or monetary consideration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Children&apos;s Online Privacy Protection Act (COPPA - 15 U.S.C. §§ 6501–6508)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Our service is safe for users of all ages, including children under 13, as no personal information is solicited, collected, or stored.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                IETF & W3C WebRTC Protocols (RFC 8825, RFC 8827 & RFC 5389)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peer-to-peer data channels implement standard DTLS and SCTP protocol specifications, guaranteeing end-to-end payload confidentiality between browsers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <RotateCcw className="w-4 h-4 text-emerald-500" />
            <span>6. User Rights & Data Deletion</span>
          </h2>
          <p>
            You have complete sovereignty over all data stored on your device:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Clear Game Stats:</strong> Open the in-game Statistics modal and click <em>&ldquo;Reset Statistics&rdquo;</em> to purge all local match records.
            </li>
            <li>
              <strong>Browser Storage Wipe:</strong> At any time, you can delete site cookies and local storage through your browser&apos;s Privacy Settings (Settings &rarr; Privacy & Security &rarr; Clear Browsing Data).
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>7. Contact & Source Code Audit</span>
          </h2>
          <p>
            This project is free and open-source. For technical inquiries, security disclosures, or code audits, please open an issue or pull request via our public GitHub repository.
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <span>View Open Source Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>

      {/* Return home bottom button */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to tickytoe Game</span>
        </a>
      </div>
    </div>
  );
};
