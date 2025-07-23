import api from './apiClient';

// 회원가입
export async function signup({ email, password, password2, name, phone }: { email: string; password: string; password2: string; name: string; phone: string }) {
  const res = await api.post('user/signup/', { email, password, password2, name, phone });
  return res.data;
}

// 로그인 (JWT 토큰 발급)
export async function login({ email, password }: { email: string; password: string }) {
  const res = await api.post('user/login/', { email, password });
  return res.data;
}

// 로그아웃 (refresh 토큰 필요)
export async function logout(refresh: string) {
  const res = await api.post(
    'user/logout/',
    { refresh }
  );
  return res.data;
}

// 내 티켓 목록 조회 (인증 필요)
export async function getMyTickets() {
  const res = await api.get('tickets/'); // 실제 엔드포인트에 맞게 수정
  return res.data;
}
