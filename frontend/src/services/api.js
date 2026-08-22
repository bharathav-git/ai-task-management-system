const API_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("access_token");

const request = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
};

export const loginUser = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

export const registerUser = (user) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user)
  });

export const getMyTasks = (status = "") =>
  request(`/tasks/my${status ? `?status=${encodeURIComponent(status)}` : ""}`);

export const updateTask = (taskId, status) =>
  request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });

export const createTask = (task) =>
  request("/tasks/", {
    method: "POST",
    body: JSON.stringify(task)
  });

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/documents/upload", {
    method: "POST",
    body: formData
  });
};

export const searchDocuments = (query) =>
  request(`/documents/search?q=${encodeURIComponent(query)}`);

export const askDocument = (question) =>
  request("/documents/ask", {
    method: "POST",
    body: JSON.stringify({ question })
  });

export const getAnalytics = () => request("/analytics/");

export { API_URL };