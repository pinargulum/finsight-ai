const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function registerUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Register failed");
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Login failed");
  const data = await res.json();
  localStorage.setItem("token", data.access_token); // basit yöntem
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getMe() {
  const token = getToken();
  if (!token) throw new Error("No token");

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error((await res.json()).detail || "Me failed");
  return res.json();
}

  export  function analyzeText(prompt) {
  try {
    const res =  fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
       },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return  res.json();
  } catch (err) {
    console.error(err);
    return { response: "Request failed." };
  }
}
