const TOKEN_KEY = "token";
const AUTH_KEY = "auth";

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken() {
  const auth = getAuth();
  if (auth?.token) {
    return auth.token;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  if (auth?.token) {
    localStorage.setItem(TOKEN_KEY, auth.token);
  }
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
