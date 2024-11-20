import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const getRolesFromToken = (token) => {
  if (!token) return [];
  try {
    const decodedToken = jwtDecode(token);
    const sub = typeof decodedToken.sub === "string" ? JSON.parse(decodedToken.sub) : decodedToken.sub;
    return sub.roles || [];
  } catch (error) {
    return [];
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Invalid token", error);
    return true;
  }
};

export const refreshToken = async () => {
  try {
    // Get the refresh token from local storage
    let refreshToken = localStorage.getItem("refresh_token");

    const response = await axios.post(
      "http://127.0.0.1:5000/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const { access_token } = response.data;
    // Store the new access token in local storage
    localStorage.setItem("access_token", access_token);

    return access_token;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
};

export const axiosWithAuth = async (config) => {
  let token = localStorage.getItem("token");

  if (isTokenExpired(token)) {
    token = await refreshToken();
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      token = await refreshToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return await axios(config);
      }
    }
    throw error;
  }
};

export const truncateString = (str, num) => {
  if (!str) return;
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};
