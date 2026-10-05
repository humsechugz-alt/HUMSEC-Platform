import { useEffect, useMemo, useState } from "react";

import CreateProjectModal from "./components/CreateProjectModal";
import DeveloperWorkspace from "./components/workspace/DeveloperWorkspace";

import {
  createProject,
  getHealth,
  getPlatformInfo,
  getProjects,
} from "./services/api";

import "./App.css";

const demoProjects = [
  {
    id: "demo-universe",
    name: "HUMSEC Universe",
    slug: "humsec-universe",
    project_type: "Universe",
    description:
      "A cinematic virtual world platform with avatars, cities, adventures and multiplayer experiences.",
    framework: "JavaScript / React / Three.js",
    backend: "Python / FastAPI",
    database: "PostgreSQL",
    api_style: "REST / WebSockets",
    hugz_ai_enabled: true,
    guardian_enabled: true,
    status: "demo",
    source: "demo",
  },
  {
    id: "demo-world",
    name: "HUGZ World Intelligence System",
    slug: "hugz-world-intelligence-system",
    project_type: "World / HWIS",
    description:
      "World intelligence, visualization and authorized data integrations.",
    framework: "React / Three.js",
    backend: "Python / FastAPI",
    database: "PostgreSQL",
    api_style: "REST / WebSockets",
    hugz_ai_enabled: true,
    guardian_enabled: true,
    status: "demo",
    source: "demo",
  },
  {
    id: "demo-defense",
    name: "HUGZ Defense",
    slug: "hugz-defense",
    project_type: "Defense Integration",
    description:
      "Defensive security, risk evaluation, policy controls and resilience systems.",
    framework: "Python",
    backend: "Python / FastAPI",
    database: "PostgreSQL",
    api_style: "REST / Events",
    hugz_ai_enabled: true,
    guardian_enabled: true,
    status: "demo",
    source: "demo",
  },
  {
    id: "demo-travel",
    name: "HUGZ Travel",
    slug: "hugz-travel",
    project_type: "Travel Integration",
    description:
      "Global travel booking, supplier integrations, travel intelligence and protection.",
    framework: "React / Three.js",
    backend: "Python / FastAPI",
    database: "PostgreSQL",
    api_style: "REST / WebSockets",
    hugz_ai_enabled: true,
    guardian_enabled: true,
    status: "demo",
    source: "demo",
  },
];

const workspaceFiles = [
  "src/App.jsx",
  "src/main.jsx",
  "src/App.css",
  "backend/main.py",
  "backend/routes.py",
  "database/schema.sql",
  "package.json",
  "README.md",
];

const apiItems = [
  {
    method: "GET",
    path: "/api/health",
    description: "Check platform health.",
  },
  {
    method: "GET",
    path: "/api/platform",
    description: "Get platform information.",
  },
  {
    method: "GET",
    path: "/api/projects/",
    description: "List developer projects.",
  },
  {
    method: "POST",
    path: "/api/projects/",
    description: "Create a new project.",
  },
];

const guardianItems = [
  "Identity verification",
  "Permission policies",
  "Tool authorization",
  "Sandbox boundaries",
  "Audit logging",
  "Human approval gates",
];

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProjectIcon(projectType = "") {
  const type = projectType.toLowerCase();

  if (type.includes("ai")) return "🧠";
  if (type.includes("universe")) return "🌌";
  if (type.includes("world")) return "🌍";
  if (type.includes("defense")) return "🛡️";
  if (type.includes("travel")) return "✈️";
  if (type.includes("game")) return "🎮";
  if (type.includes("mobile")) return "📱";
  if (type.includes("desktop")) return "🖥️";
  if (type.includes("api")) return "🔌";
  if (type.includes("web")) return "🌐";

  return "🧩";
}

function App() {
  const [showCreateProject, setShowCreateProject] = useState(false);

  const [activeNav, setActiveNav] = useState("Dashboard");

  const [activeWorkspaceProject, setActiveWorkspaceProject] =
    useState(null);

  const [projects, setProjects] = useState([]);

  const [backendStatus, setBackendStatus] = useState("checking");
  const [databaseStatus, setDatabaseStatus] = useState("checking");

  const [platformInfo, setPlatformInfo] = useState(null);

  const [projectError, setProjectError] = useState("");

  const [projectCreating, setProjectCreating] = useState(false);

  const [projectsLoading, setProjectsLoading] = useState(true);

  const [projectsSource, setProjectsSource] = useState("DATABASE");

  useEffect(() => {
    loadPlatform();
    loadProjects();
  }, []);

  async function loadPlatform() {
    try {
      const health = await getHealth();

      setBackendStatus(
        health?.status === "online" ? "online" : "offline"
      );

      setDatabaseStatus("online");

      const platform = await getPlatformInfo();

      setPlatformInfo(platform);
    } catch (error) {
      console.error("Platform check failed:", error);

      setBackendStatus("offline");
      setDatabaseStatus("unknown");
    }
  }

  async function loadProjects() {
    setProjectsLoading(true);
    setProjectError("");

    try {
      const response = await getProjects();

      const databaseProjects = (response.projects || []).map(
        (project) => ({
          ...project,
          source: "database",
        })
      );

      setProjects(databaseProjects);
      setProjectsSource("DATABASE");
    } catch (error) {
      console.error("Project loading failed:", error);

      setProjects(demoProjects);
      setProjectsSource("DEMO");

      setProjectError(
        "Database projects could not be loaded. Showing demo projects."
      );
    } finally {
      setProjectsLoading(false);
    }
  }

  async function handleCreateProject(project) {
    setProjectCreating(true);
    setProjectError("");

    const projectPayload = {
      name: project.name,
      slug: createSlug(project.name),
      project_type:
        project.type === "ai-app"
          ? "AI Application"
          : project.type,
      description: project.description,
      framework: project.frontend
        ? `${project.frontend} / Vite`
        : "JavaScript / React / Vite",
      backend: project.backend || "Python / FastAPI",
      database: project.database || "PostgreSQL",
      api_style: "REST / JSON",
      hugz_ai_enabled: project.ai,
      guardian_enabled: project.guardian,
    };

    try {
      const response = await createProject(projectPayload);

      const createdProject = {
        ...response.project,
        source: "database",
      };

      setProjects((current) => [
        createdProject,
        ...current.filter(
          (item) => item.id !== createdProject.id
        ),
      ]);

      setProjectsSource("DATABASE");
      setShowCreateProject(false);
    } catch (error) {
      console.error("Project creation failed:", error);

      setProjectError(
        error.message || "Failed to create project."
      );
    } finally {
      setProjectCreating(false);
    }
  }

  function openProject(project) {
    setActiveWorkspaceProject(project);
  }

  function closeWorkspace() {
    setActiveWorkspaceProject(null);
  }

  const databaseProjectCount = useMemo(
    () =>
      projects.filter(
        (project) => project.source === "database"
      ).length,
    [projects]
  );

  if (activeWorkspaceProject) {
    return (
      <DeveloperWorkspace
        project={activeWorkspaceProject}
        onBack={closeWorkspace}
      />
    );
  }

  return (
    <div className="humsec-app">
      <div className="ambient-grid" />

      <header className="topbar">
        <div className="brand">
          <div className="humsec-logo">H</div>

          <div>
            <strong>HUMSEC</strong>
            <span>DEVELOPER PLATFORM</span>
          </div>
        </div>

        <nav className="main-nav">
          {[
            "Dashboard",
            "Projects",
            "API",
            "SDKs",
            "Deployments",
            "Docs",
          ].map((item) => (
            <button
              key={item}
              className={
                activeNav === item ? "nav-active" : ""
              }
              onClick={() => setActiveNav(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          className="launch-button"
          onClick={() => setShowCreateProject(true)}
        >
          + CREATE PROJECT
        </button>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">
              HUMSEC DEVELOPER PLATFORM
            </p>

            <h1>
              Build the
              <span> HUMSEC Ecosystem.</span>
            </h1>

            <p className="hero-description">
              Build, test, secure, deploy and operate intelligent
              applications through one developer platform.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() =>
                  setShowCreateProject(true)
                }
              >
                🚀 CREATE PROJECT
              </button>

              <button className="secondary-button">
                EXPLORE PLATFORM →
              </button>
            </div>
          </div>

          <div className="hero-core">
            <div className="core-ring ring-one" />
            <div className="core-ring ring-two" />
            <div className="core-ring ring-three" />

            <div className="core-center">
              <span>H</span>
              <small>HUMSEC</small>
            </div>
          </div>
        </section>

        <section className="platform-status-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                PLATFORM STATUS
              </p>
              <h2>Developer Infrastructure</h2>
            </div>
          </div>

          <div className="status-grid">
            <div className="status-card">
              <span className="status-icon">⚡</span>
              <div>
                <small>BACKEND</small>
                <strong>
                  {backendStatus === "online"
                    ? "ONLINE"
                    : backendStatus.toUpperCase()}
                </strong>
              </div>
            </div>

            <div className="status-card">
              <span className="status-icon">🐘</span>
              <div>
                <small>POSTGRESQL</small>
                <strong>
                  {databaseStatus === "online"
                    ? "CONNECTED"
                    : databaseStatus.toUpperCase()}
                </strong>
              </div>
            </div>

            <div className="status-card">
              <span className="status-icon">📦</span>
              <div>
                <small>PROJECTS</small>
                <strong>{databaseProjectCount}</strong>
              </div>
            </div>

            <div className="status-card">
              <span className="status-icon">🛡️</span>
              <div>
                <small>GUARDIAN</small>
                <strong>READY</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="projects-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                PROJECT FABRIC
              </p>

              <h2>Your Projects</h2>

              <p className="project-dashboard-meta">
                Source:{" "}
                <strong>{projectsSource}</strong>
                {" · "}
                {projects.length} project
                {projects.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={loadProjects}
            >
              ↻ REFRESH
            </button>
          </div>

          {projectError && (
            <div className="project-error">
              ⚠️ {projectError}
            </div>
          )}

          {projectsLoading ? (
            <div className="project-dashboard-loading">
              <span>⟳</span>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="project-dashboard-empty">
              <div>🧩</div>
              <h3>No projects yet</h3>
              <p>
                Create your first HUMSEC project to begin
                building.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  setShowCreateProject(true)
                }
              >
                CREATE PROJECT
              </button>
            </div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <article
                  className="project-card"
                  key={project.id}
                >
                  <div className="project-card-top">
                    <div className="project-icon">
                      {getProjectIcon(
                        project.project_type
                      )}
                    </div>

                    <div className="project-card-status-area">
                      <span className="project-status">
                        {project.status || "created"}
                      </span>

                      {project.source === "database" && (
                        <span className="project-source">
                          DB
                        </span>
                      )}
                    </div>
                  </div>

                  <h3>{project.name}</h3>

                  <p>
                    {project.description ||
                      "HUMSEC developer project."}
                  </p>

                  <div className="project-stack">
                    <span>
                      {project.framework ||
                        "JavaScript / React"}
                    </span>

                    <span>
                      {project.backend ||
                        "Python / FastAPI"}
                    </span>

                    <span>
                      {project.database ||
                        "PostgreSQL"}
                    </span>
                  </div>

                  <div className="project-card-footer">
                    <span>
                      {project.slug}
                    </span>

                    <button
                      className="project-open-button"
                      onClick={() =>
                        openProject(project)
                      }
                    >
                      OPEN →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="workspace-preview-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                DEVELOPER WORKSPACE
              </p>

              <h2>Build inside HUMSEC</h2>

              <p>
                Code, terminal, project files, AI assistance
                and Guardian controls in one workspace.
              </p>
            </div>
          </div>

          <div className="workspace-preview">
            <aside className="workspace-preview-sidebar">
              <div className="workspace-preview-title">
                PROJECT
              </div>

              {workspaceFiles.map((file) => (
                <div
                  className="workspace-preview-file"
                  key={file}
                >
                  📄 {file}
                </div>
              ))}
            </aside>

            <div className="workspace-preview-main">
              <div className="workspace-preview-toolbar">
                <span>App.jsx</span>
                <span>JAVASCRIPT / JSX</span>
              </div>

              <pre>
{`import React from "react";

function App() {
  return (
    <main>
      <h1>HUMSEC</h1>
      <p>Build the ecosystem.</p>
    </main>
  );
}

export default App;`}
              </pre>

              <div className="workspace-preview-terminal">
                <span>● TERMINAL</span>
                <code>
                  $ npm run dev
                  {"\n"}
                  HUGZNETS development server ready
                </code>
              </div>
            </div>
          </div>
        </section>

        <section className="api-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                API PLATFORM
              </p>

              <h2>Build with HUMSEC APIs</h2>
            </div>
          </div>

          <div className="api-grid">
            {apiItems.map((api) => (
              <div className="api-card" key={api.path}>
                <span className="api-method">
                  {api.method}
                </span>

                <code>{api.path}</code>

                <p>{api.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="guardian-section">
          <div className="guardian-panel">
            <div className="guardian-icon">
              🛡️
            </div>

            <div>
              <p className="section-eyebrow">
                GUARDIAN CONTROL PLANE
              </p>

              <h2>
                Powerful tools.
                <br />
                Controlled authority.
              </h2>

              <p>
                HUMSEC projects can use AI and automation
                while keeping permissions, policies,
                sandboxing and audit controls explicit.
              </p>
            </div>

            <div className="guardian-list">
              {guardianItems.map((item) => (
                <span key={item}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <p className="section-eyebrow">
            HUMSEC DEVELOPER PLATFORM
          </p>

          <h2>
            Your next system starts here.
          </h2>

          <p>
            Create a project and start building the HUMSEC
            ecosystem.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              setShowCreateProject(true)
            }
          >
            🚀 CREATE HUMSEC PROJECT
          </button>
        </section>
      </main>

      <footer className="humsec-footer">
        <div>
          <strong>HUMSEC</strong>
          <span>
            Developer infrastructure for the HUMSEC
            ecosystem.
          </span>
        </div>

        <div>
          <strong>Built by Humsec Hugz</strong>
          <span>
            Powered by HUMSEC Developers.
          </span>
        </div>
      </footer>

      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => {
          if (!projectCreating) {
            setShowCreateProject(false);
          }
        }}
        onCreate={handleCreateProject}
      />
    </div>
  );
}

export default App;
