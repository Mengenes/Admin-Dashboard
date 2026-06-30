import axios from "axios";
import { useUserStore } from "../store/Zustand";

export const apiBaseUrl = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_API_URL,
  withCredentials: true,
});


apiBaseUrl.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (err.response?.status === 401 && !isRefreshCall) {
      try {

        const refreshRes = await apiBaseUrl.post("/auth/refresh");

  
        useUserStore.getState().setUser(refreshRes.data.user);


        return apiBaseUrl(originalRequest);
      } catch (error) {
       
        useUserStore.getState().logoutUser();
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);