import { useState } from "react";

const workspaceFiles = [
  {
    type: "folder",
    name: "src",
    children: [
      { type: "file", name: "App.jsx" },
      { type: "file", name: "main.jsx" },
      { type: "file", name: "App.css" },
    ],
  },
  {
    type: "folder",
    name: "backend",
    children: [
      { type: "file", name: "main.py" },
      { type: "file", name: "routes.py" },
    ],
  },
  {
    type: "folder",
    name: "database",
    children: [
      { type: "file", name: "schema.sql" },
    ],
  },
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
];

const fileContents = {
  "App.jsx": `import React from "react";

function App() {
  return (
    <main>
      <h1>HUMSEC AI</h1>
      <p>Powered by HUMSEC Developers.</p>
    </main>
  );
}

export default App;
`,

  "main.jsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,

  "App.css": `body {
  margin: 0;
  font-family: sans-serif;
}

main {
  padding: 40px;
}
`,

  "main.py": `from fastapi import FastAPI

app = FastAPI(
    title="HUMSEC AI API"
)

@app.get("/")
def home():
    return {
        "name": "HUMSEC AI",
        "status": "online"
    }
)
`,

  "routes.py": `from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def status():
    return {
        "status": "online"
    }
`,

  "schema.sql": `CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`,

  "package.json": `{
  "name": "humsec-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
`,

  "README.md": `# HUMSEC AI

Built by Humsec Hugz.

Powered by HUMSEC Developers.

Frontend:
JavaScript / React / Vite

Backend:
Python / FastAPI

Database:
PostgreSQL
`,
};

function DeveloperWorkspace({ project, onBack }) {
  const [activeFile, setActiveFile] = useState("App.jsx");
  const [terminalLines, setTerminalLines] = useState([
    "$ HUGZNETS Developer Workspace",
    "$ Project environment initialized",
    "$ Ready for development",
  ]);

  function openFile(fileName) {
    setActiveFile(fileName);
  }

  function runCommand(command) {
    setTerminalLines((current) => [
      ...current,
      `$ ${command}`,
      "HUGZNETS: command accepted",
    ]);
  }

  function renderTree(items, depth = 0) {
    return items.map((item) => {
      if (item.type === "folder") {
        return (
          <div key={item.name}>
            <div
              className="workspace-tree-folder"
              style={{ paddingLeft: `${16 + depth * 14}px` }}
            >
              <span>📁</span>
              <strong>{item.name}</strong>
            </div>

            {renderTree(item.children, depth + 1)}
          </div>
        );
      }

      return (
        <button
          key={item.name}
          className={`workspace-tree-file ${
            activeFile === item.name ? "active" : ""
          }`}
          style={{ paddingLeft: `${30 + depth * 14}px` }}
          onClick={() => openFile(item.name)}
        >
          <span>📄</span>
          {item.name}
        </button>
      );
    });
  }

  const code =
    fileContents[activeFile] ||
    `// ${activeFile}\n\n// File ready for development.\n`;

  return (
    <div className="developer-workspace">
      <header className="workspace-topbar">
        <div className="workspace-project-info">
          <button
            className="workspace-back-button"
            onClick={onBack}
          >
            ← Projects
          </button>

          <div className="workspace-project-divider" />

          <div>
            <p>PROJECT WORKSPACE</p>
            <h2>{project?.name || "HUMSEC Project"}</h2>
          </div>
        </div>

        <div className="workspace-status">
          <span className="workspace-status-dot" />
          DEVELOPMENT
        </div>
      </header>

      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <div className="workspace-sidebar-header">
            <span>PROJECT EXPLORER</span>
          </div>

          <div className="workspace-project-root">
            <span>◆</span>
            <strong>{project?.name || "HUMSEC Project"}</strong>
          </div>

          <div className="workspace-tree">
            {renderTree(workspaceFiles)}
          </div>

          <div className="workspace-sidebar-footer">
            <button>⚙ Project Settings</button>
            <button>🛡 Guardian</button>
          </div>
        </aside>

        <main className="workspace-main">
          <div className="workspace-tabs">
            <div className="workspace-tab active">
              <span>📄</span>
              {activeFile}
              <button>×</button>
            </div>
          </div>

          <section className="workspace-editor">
            <div className="workspace-editor-header">
              <span>{activeFile}</span>
              <span className="workspace-language">
                {activeFile.endsWith(".py")
                  ? "PYTHON"
                  : activeFile.endsWith(".sql")
                  ? "SQL"
                  : "JAVASCRIPT / JSX"}
              </span>
            </div>

            <pre className="workspace-code">
              <code>{code}</code>
            </pre>
          </section>

          <section className="workspace-terminal">
            <div className="workspace-terminal-header">
              <div>
                <span className="terminal-active-dot" />
                TERMINAL
              </div>

              <button
                onClick={() =>
                  setTerminalLines([
                    "$ HUGZNETS Developer Workspace",
                    "$ Terminal cleared",
                  ])
                }
              >
                Clear
              </button>
            </div>

            <div className="workspace-terminal-output">
              {terminalLines.map((line, index) => (
                <div key={`${line}-${index}`}>
                  {line}
                </div>
              ))}

              <div className="workspace-terminal-input">
                <span>$</span>
                <input
                  placeholder="Type a command..."
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      const command = event.currentTarget.value.trim();

                      if (!command) {
                        return;
                      }

                      runCommand(command);
                      event.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DeveloperWorkspace;
