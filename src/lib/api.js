const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Refresh token tidak tersedia");

  const res = await fetch(`${API_BASE_URL}/api/authentications`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Gagal refresh token");

  const data = await res.json();
  localStorage.setItem("accessToken", data.data.accessToken);
  localStorage.setItem("refreshToken", data.data.refreshToken);

  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
}


export function logoutUser() {
  localStorage.clear();
}

export async function fetchWithRefresh(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  if (!options.headers) options.headers = {};
  options.headers["Authorization"] = `Bearer ${accessToken}`;

  let res = await fetch(url, options);

  if (res.status === 401) {
    try {
      const tokens = await refreshToken(); 
      accessToken = tokens.accessToken;
      options.headers["Authorization"] = `Bearer ${accessToken}`;
      res = await fetch(url, options);
    } catch (error) {
      localStorage.clear();
      throw new Error("Session habis, silakan login ulang");
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request gagal");
  }

  return res.json();
}

export async function getUserProfile() {
  return await fetchWithRefresh(`${API_BASE_URL}/api/users/profile/me`);
}


export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/authentications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Login gagal");
  }

  const data = await res.json();

  localStorage.setItem("accessToken", data.data.accessToken);
  localStorage.setItem("refreshToken", data.data.refreshToken);

  const profile = await getUserProfile();
  localStorage.setItem("userProfile", JSON.stringify(profile));

  return { tokens: data.data, profile };
}
