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

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization;
    }

    console.log("API 요청 헤더:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    // 에러 처리 로직
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;