import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// 회원가입
export async function signup({ email, password, password2, name, phone }: { email: string; password: string; password2: string; name: string; phone: string }) {
  const res = await axios.post(`${API_BASE_URL}user/signup/`, { email, password, password2, name, phone });
  return res.data;
}

// 로그인 (JWT 토큰 발급)
export async function login({ email, password }: { email: string; password: string }) {
  const res = await axios.post(`${API_BASE_URL}user/login/`, { email, password });
  return res.data;
}

// 로그아웃 (refresh 토큰 필요)
export async function logout(refresh: string, access?: string) {
  const res = await axios.post(
    `${API_BASE_URL}user/logout/`,
    { refresh },
    access
      ? { headers: { Authorization: `Bearer ${access}` } }
      : undefined
  );
  return res.data;
}
