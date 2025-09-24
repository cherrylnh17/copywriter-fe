const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Refresh token
export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  
  if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
    throw new Error("Refresh token tidak tersedia atau invalid");
  }

  const res = await fetch(`${API_BASE_URL}/api/authentications`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Gagal refresh token");

  const data = await res.json();
  const newAccessToken = data.accessToken || data.data?.accessToken;

  if (!newAccessToken) throw new Error("Server tidak mengembalikan access token");

  localStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
}


// Logout
export async function logoutUser() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/api/authentications`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (err) {
      console.warn("Gagal logout ke server:", err);
    }
  }
  localStorage.clear();
}

// Wrapper fetch -- auto refresh
export async function fetchWithRefresh(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  if (!options.headers) options.headers = {};
  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, options);

  if (res.status === 401) {
    try {
      const newAccessToken = await refreshToken();
      options.headers["Authorization"] = `Bearer ${newAccessToken}`;
      res = await fetch(url, options); 
    } catch (error) {
      logoutUser();
      throw new Error("Session habis, silakan login ulang");
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request gagal");
  }

  return res.json();
}

// Get profile
export async function getUserProfile() {
  return await fetchWithRefresh(`${API_BASE_URL}/api/users/profile/me`);
}

// Login
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

  const accessToken = data.accessToken || data.data?.accessToken;
  const refreshToken = data.refreshToken || data.data?.refreshToken;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  const profile = await getUserProfile();
  localStorage.setItem("userProfile", JSON.stringify(profile));

  return { tokens: { accessToken, refreshToken }, profile };
}
