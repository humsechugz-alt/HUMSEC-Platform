import { useState } from "react";

const projectTypes = [
  {
    id: "ai-agent",
    icon: "🧠",
    name: "AI Agent",
    description: "Build intelligent agents with tools, memory and controlled permissions.",
  },
  {
    id: "web-app",
    icon: "🌐",
    name: "Web Application",
    description: "Create modern websites and full interactive web applications.",
  },
  {
    id: "desktop-app",
    icon: "🖥️",
    name: "Desktop Application",
    description: "Build applications for Linux, Windows and macOS.",
  },
  {
    id: "mobile-app",
    icon: "📱",
    name: "Mobile Application",
    description: "Create mobile experiences for Android and iOS.",
  },
  {
    id: "universe",
    icon: "🌌",
    name: "Universe",
    description: "Create worlds, avatars, multiplayer experiences and XR environments.",
  },
  {
    id: "world",
    icon: "🌍",
    name: "World / HWIS",
    description: "Build world intelligence, visualization and authorized data systems.",
  },
  {
    id: "defense",
    icon: "🛡️",
    name: "Defense Integration",
    description: "Build defensive security and resilience integrations.",
  },
  {
    id: "travel",
    icon: "✈️",
    name: "Travel Integration",
    description: "Build travel, booking and travel intelligence applications.",
  },
  {
    id: "api",
    icon: "🔌",
    name: "API / Backend",
    description: "Create APIs, backend services and integrations.",
  },
  {
    id: "game",
    icon: "🎮",
    name: "Game",
    description: "Create interactive games and experiences.",
  },
  {
    id: "ai-app",
    icon: "🤖",
    name: "AI Application",
    description: "Build applications powered by AI models and agents.",
  },
  {
    id: "full-stack",
    icon: "🧩",
    name: "Full-Stack Application",
    description: "Create a complete frontend, backend and database system.",
  },
];

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1);

  const [project, setProject] = useState({
    type: "",
    name: "",
    description: "",
    frontend: "React",
    backend: "Python + FastAPI",
    database: "PostgreSQL",
    ai: true,
    guardian: true,
  });

  if (!isOpen) {
    return null;
  }

  const selectedType = projectTypes.find(
    (type) => type.id === project.type
  );

  function updateProject(field, value) {
    setProject((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function nextStep() {
    if (step < 5) {
      setStep(step + 1);
    }
  }

  function previousStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function createProject() {
    const finalProject = {
      ...project,
      id: `project_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "created",
    };

    onCreate(finalProject);

    setStep(1);

    setProject({
      type: "",
      name: "",
      description: "",
      frontend: "React",
      backend: "Python + FastAPI",
      database: "PostgreSQL",
      ai: true,
      guardian: true,
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="project-modal">

        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">
              HUMSEC DEVELOPER PLATFORM
            </p>

            <h2>Create HUMSEC Project</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="wizard-progress">
          {[1, 2, 3, 4, 5].map((number) => (
            <div
              key={number}
              className={`progress-step ${
                step >= number ? "active" : ""
              }`}
            >
              <span>{number}</span>
            </div>
          ))}
        </div>

        <div className="wizard-body">

          {step === 1 && (
            <section>
              <p className="step-label">STEP 01</p>

              <h3>What are you building?</h3>

              <p className="step-description">
                Choose the type of HUMSEC project you want to create.
              </p>

              <div className="project-type-grid">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`project-type ${
                      project.type === type.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      updateProject("type", type.id)
                    }
                  >
                    <span className="type-icon">
                      {type.icon}
                    </span>

                    <strong>{type.name}</strong>

                    <small>
                      {type.description}
                    </small>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <p className="step-label">STEP 02</p>

              <h3>Project identity</h3>

              <p className="step-description">
                Give your project a name and describe what it does.
              </p>

              <label>
                Project name
                <input
                  value={project.name}
                  onChange={(event) =>
                    updateProject(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Example: HUGZ AI"
                />
              </label>

              <label>
                Description
                <textarea
                  value={project.description}
                  onChange={(event) =>
                    updateProject(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="What are you building?"
                  rows="5"
                />
              </label>
            </section>
          )}

          {step === 3 && (
            <section>
              <p className="step-label">STEP 03</p>

              <h3>Choose your technology stack</h3>

              <p className="step-description">
                HUMSEC uses the right language for the right job.
              </p>

              <div className="stack-grid">

                <div className="stack-card">
                  <span>⚛️</span>

                  <div>
                    <strong>Frontend</strong>

                    <p>
                      JavaScript / React
                    </p>
                  </div>
                </div>

                <div className="stack-card">
                  <span>🐍</span>

                  <div>
                    <strong>Backend</strong>

                    <p>
                      Python / FastAPI
                    </p>
                  </div>
                </div>

                <div className="stack-card">
                  <span>🐘</span>

                  <div>
                    <strong>Database</strong>

                    <p>
                      PostgreSQL
                    </p>
                  </div>
                </div>

                <div className="stack-card">
                  <span>🌐</span>

                  <div>
                    <strong>API</strong>

                    <p>
                      REST / JSON
                    </p>
                  </div>
                </div>

              </div>

              <div className="architecture-preview">
                <div>React</div>
                <span>→</span>
                <div>FastAPI</div>
                <span>→</span>
                <div>PostgreSQL</div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <p className="step-label">STEP 04</p>

              <h3>Intelligence & security</h3>

              <p className="step-description">
                Configure the project foundation.
              </p>

              <button
                className={`toggle-option ${
                  project.ai ? "enabled" : ""
                }`}
                onClick={() =>
                  updateProject(
                    "ai",
                    !project.ai
                  )
                }
              >
                <span>🧠</span>

                <div>
                  <strong>HUGZ AI assistance</strong>

                  <p>
                    AI-assisted development, agents and
                    project intelligence.
                  </p>
                </div>

                <b>
                  {project.ai ? "ON" : "OFF"}
                </b>
              </button>

              <button
                className={`toggle-option ${
                  project.guardian ? "enabled" : ""
                }`}
                onClick={() =>
                  updateProject(
                    "guardian",
                    !project.guardian
                  )
                }
              >
                <span>🛡️</span>

                <div>
                  <strong>Guardian protection</strong>

                  <p>
                    Permissions, policy controls and
                    audit-ready project actions.
                  </p>
                </div>

                <b>
                  {project.guardian ? "ON" : "OFF"}
                </b>
              </button>
            </section>
          )}

          {step === 5 && (
            <section>
              <p className="step-label">STEP 05</p>

              <h3>Review your project</h3>

              <div className="review-card">

                <div className="review-icon">
                  {selectedType?.icon || "🧩"}
                </div>

                <div>
                  <p>PROJECT</p>

                  <h4>
                    {project.name || "Unnamed Project"}
                  </h4>

                  <span>
                    {selectedType?.name}
                  </span>
                </div>

              </div>

              <div className="review-list">

                <div>
                  <span>Frontend</span>
                  <strong>React / JavaScript</strong>
                </div>

                <div>
                  <span>Backend</span>
                  <strong>Python / FastAPI</strong>
                </div>

                <div>
                  <span>Database</span>
                  <strong>PostgreSQL</strong>
                </div>

                <div>
                  <span>HUGZ AI</span>
                  <strong>
                    {project.ai ? "Enabled" : "Disabled"}
                  </strong>
                </div>

                <div>
                  <span>Guardian</span>
                  <strong>
                    {project.guardian
                      ? "Enabled"
                      : "Disabled"}
                  </strong>
                </div>

              </div>
            </section>
          )}

        </div>

        <div className="modal-footer">

          <button
            className="secondary-button"
            onClick={
              step === 1
                ? onClose
                : previousStep
            }
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < 5 ? (
            <button
              className="primary-button"
              onClick={nextStep}
              disabled={
                (step === 1 && !project.type) ||
                (step === 2 && !project.name)
              }
            >
              Continue →
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={createProject}
            >
              🚀 Create Project
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default CreateProjectModal;
