const API_BASE_URL = "http://127.0.0.1:8000";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}


export async function getHealth() {
  return request(`${API_BASE_URL}/api/health`);
}


export async function getPlatformInfo() {
  return request(`${API_BASE_URL}/api/platform`);
}


export async function getProjects() {
  return request(`${API_BASE_URL}/api/projects/`);
}


export async function getProject(projectId) {
  return request(`${API_BASE_URL}/api/projects/${projectId}`);
}


export async function createProject(project) {
  return request(`${API_BASE_URL}/api/projects/`, {
    method: "POST",
    body: JSON.stringify(project),
  });
}


export async function deleteProject(projectId) {
  return request(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "DELETE",
  });
}


export { API_BASE_URL };
