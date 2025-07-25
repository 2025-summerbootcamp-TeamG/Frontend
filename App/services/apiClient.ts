import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const apiClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (accessToken 자동 부착)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

let onForceLogout: (() => void) | null = null;
export const setForceLogoutHandler = (handler: () => void) => {
  onForceLogout = handler;
};

const forceLogout = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
  if (onForceLogout) onForceLogout(); // 콜백 호출
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // accessToken 만료(401) & 재시도 안 한 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 이미 갱신 중이면 큐에 넣고 기다림
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        // 실제 refresh 엔드포인트에 맞게 경로 수정
        const res = await axios.post(
          `${Constants.expoConfig?.extra?.API_BASE_URL}user/token/refresh/`,
          { refresh: refreshToken }
        );
        const newAccessToken = res.data.access;
        await AsyncStorage.setItem("accessToken", newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // refreshToken도 만료 → 로그아웃 처리
        await forceLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
