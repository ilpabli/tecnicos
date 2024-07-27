import axios from "axios";
import Constants from "expo-constants";
import { eventEmitter } from "./eventEmitter";

const backendUrl = Constants?.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        eventEmitter.emit("unauthorized");
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
