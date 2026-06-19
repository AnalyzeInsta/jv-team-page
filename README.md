# AI Agent Task Delegation Center (Public Standalone Release)

An interactive, glassmorphic React component for managing, scheduling, and orchestrating virtual AI employees (Content Writers, Outreach Agents, SEO Specialists, Research Analysts, and Community Managers).

This standalone UI center is developed, branded, and published by **[AnalyzeInsta](https://analyzeinsta.com)**.

---

## 🚀 Key Features

* **Fully Interactive & Client-Side**: No database or backend servers are required to test or run. All employee profiles, tasks, stats, and activity feeds persist directly in the browser's `localStorage`.
* **Simulated Background Agent Lifecycles**:
  * **Alex (Research Analyst)**: Simulates web scraping and research dossier generation in response to content ideas.
  * **Olivia (Outreach Agent)**: Simulates email discovery, mailbox validation, MX record checks, and campaign dispatch.
  * **Emma (Content Writer)**: Simulates article drafting, style validation checks, and automatic publishing hooks.
* **Premium Glassmorphic Design**: Tailored visual layouts with sleek dark-mode variables, smooth keyframe animations, customized inputs, and micro-interactions.
* **Open for Contributions**: Fully structured for the developer community to import, extend, and wire up to real LLMs or agentic platforms (like LangChain, Hono, or Bun).

---

## 🛠️ Getting Started

Follow these quick commands to spin up the standalone dashboard locally:

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the dashboard.

### 3. Compile Production Bundle
To build a clean, static distribution bundle ready to host on GitHub Pages:
```bash
npm run build
```

---

## 📂 Project Structure

```bash
jv-team-page/
├── index.html          # Web entry point with SEO tags
├── package.json        # Node configuration & dependencies
├── tailwind.config.js  # Premium color palettes and configuration
├── postcss.config.js   # Autoprefixer settings
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite builder settings
└── src/
    ├── main.tsx        # React mounting entry
    ├── App.tsx         # Main layout wrapper with AnalyzeInsta headers/footers
    ├── lib/
    │   └── utils.ts    # Class merger utilities (clsx + tailwind-merge)
    ├── index.css       # Core theme variables, custom keyframes, scrollbars
    └── components/
        └── Team.tsx    # Standalone Team component & simulator engine
```

---

## 🤝 Contributing

We welcome community enhancements! 
1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

*Published and maintained by [AnalyzeInsta](https://analyzeinsta.com).*
