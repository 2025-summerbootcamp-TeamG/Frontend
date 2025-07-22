export interface Event {
  id: number;
  name: string;
  artist: string;
  location: string;
  description: string;
  genre: string;
  age_rating: string;
  max_reserve: number;
  thumbnail: string; // 썸네일
  view_count: number;
  date: string; // 공연 날짜
  price: number; // 가격
  status: string; // 상태
  created_at: string; // 생성일(신규 정렬용)
}

export interface EventListResponse {
  page: number;
  limit: number;
  totalCount: number;
  events: Event[];
  message: string;
}

export type PayRequest = {
  name: string;
  phone: string;
  email: string;
};

// 티켓 목록(내 티켓) 응답 타입
export interface Ticket {
  id: number;
  ticket_status: string;
  booked_at: string;
  face_verified: boolean;
  verified_at: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user: number;
  seat: number;
  purchase: number;
}

// 티켓 상세정보 응답 타입
export interface TicketDetail {
  id: number;
  user: number;
  ticket_status: string;
  seat: number;
  purchase: number;
  face_verified: boolean;
  verified_at: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
