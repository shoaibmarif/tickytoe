# Tic Tac Toe Monorepo

A production-ready, feature-rich, and aesthetically stunning online game and Chrome Extension built with TypeScript, React 19, Tailwind CSS, and Vite.

## Architecture

```text
├── packages/
│   ├── core/                        # Zero-dependency, platform-agnostic TypeScript game & AI engine
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── board.ts             # Dynamic combo generator (3x3, 4x4, 5x5)
│   │   │   ├── ai.ts                # Minimax with Alpha-Beta pruning (Easy, Medium, Hard, Master)
│   │   │   └── engine.ts            # State machine with undo/redo & history
│   │   └── tests/
│   │       └── core.test.ts         # Vitest unit tests (unbeatable AI verification)
│   │
│   ├── web/                         # Web Application (React 19 + Vite + Tailwind CSS)
│   │   ├── public/
│   │   │   ├── _redirects           # Netlify SPA redirect
│   │   │   ├── robots.txt           # Googlebot crawling rules
│   │   │   ├── sitemap.xml          # Canonical homepage sitemap
│   │   │   ├── site.webmanifest     # PWA manifest
│   │   │   ├── favicon.svg          # Scalable vector icon
│   │   │   ├── favicon-48x48.png    # Critical Google Search SERP multiple
│   │   │   └── favicon.ico          # Multi-size binary ICO (16, 32, 48)
│   │   ├── src/
│   │   │   ├── components/          # Glassmorphic UI, Sound, GameBoard, Modals
│   │   │   ├── hooks/               # useAudio, useTheme, useConfetti
│   │   │   ├── App.tsx              # Zero-dependency lightweight SPA router
│   │   │   └── index.html           # Schema.org JSON-LD + Zero-FOUC <noscript> block
│   │
│   └── extension/                   # Manifest V3 Google Chrome Extension
│       ├── public/
│       │   ├── manifest.json
│       │   └── icons/               # 16px, 48px, 128px
│       └── src/
│           ├── background/          # Context menus & streak badge sync
│           └── popup/               # Toolbar mini-game
│
├── scripts/
│   └── build-favicons.mjs           # Automated headless Chrome icon builder
├── netlify.toml                     # Caching headers, SPA redirects, MIME types
└── package.json                     # Monorepo workspaces root
```

## Features

- **Multiple Grid Modes**: Classic 3x3 (3-in-a-row), Expanded 4x4 (4-in-a-row), and Epic 5x5 (4-in-a-row).
- **Unbeatable Minimax AI**: Multi-tiered AI with mathematically proven Minimax and alpha-beta pruning.
- **Synthesized Audio Engine**: Zero-asset sound effects generated with the Web Audio API.
- **Celebratory Confetti**: Lightweight canvas particle explosion upon victory.
- **Turn Speed Timer**: Optional blitz timer (5s, 10s, 15s) with tick countdown sounds.
- **Comprehensive Statistics**: Total matches, win rate, win streaks, and match history stored locally.
- **Theme & Symbol Customization**: Dark/Light mode and Classic, Cyber Glow, or Emoji (⚔️ / 🛡️) symbols.
- **Full Keyboard Accessibility**: Numpad and Arrow key support with instant keyboard shortcuts (`R` for reset, `U` for undo, `S` for stats, `M` for audio).
- **Offline & Private**: Zero tracking, zero telemetry, and 100% client-side privacy.

## Google Search SEO Architecture

1. **Favicon Suite**: Meets all Googlebot requirements with multi-size `favicon.ico` (16, 32, 48) and `favicon-48x48.png` served at root with `image/x-icon` MIME type.
2. **Schema.org JSON-LD**: Declares `WebSite`, `WebApplication`, and `FAQPage` with alternate brand names to eliminate third-party hosting branding.
3. **Zero-FOUC `<noscript>` Block**: Server-side fallback content for search spiders without causing layout shifts or flashing UI for human visitors.
4. **Privacy Policy Protection**: `/privacy` route contains `<meta name="robots" content="noindex, follow">`, preventing it from cannibalizing homepage search equity while passing authority back.

## Commands

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Build favicons from favicon.svg
npm run build:favicons

# Develop Web Application locally
npm run dev:web

# Build Web Application for production
npm run build:web

# Build Chrome Extension
npm run build:ext
```
