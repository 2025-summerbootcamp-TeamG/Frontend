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
export interface GuideLineCheckRequest {
  image: string; // base64 등
}

export interface GuideLineCheckResponse {
  success?: boolean; // 백엔드에서 success 대신 is_in_guide만 반환할 수도 있으므로 옵셔널
  is_in_guide: boolean;
  message: string;
}

export interface FaceRegisterRequest {
  image: string;
}

export interface FaceRegisterResponse {
  awsFaceId: string;
  success: boolean;
  message: string;
}

export interface SaveFaceToDBRequest {
  awsFaceId: string;
}

export interface SaveFaceToDBResponse {
  success: boolean;
  message: string;
}

export interface FaceAuthResponse {
  message: string;
  FaceId?: string;
  ExternalImageId?: string;
  Similarity?: number;
  success?: boolean; // 필요시
}

export interface Seat {
  seat_id: number;
  seat_number: string;
  price: number;
  seat_status: string;
  event_time_id: number;
  available_count?: number; // available_count 추가
  event_date?: string; // ← 추가
  start_time?: string; // ← 추가
}

export interface ZoneSeatsResponse {
  statusCode: number;
  message: string;
  // data가 객체가 아닌 Seat 배열을 직접 담고 있도록 수정
  data: Seat[];
}
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

export interface TicketCertificationResponse {
  message: string;
  ticket: {
    id: number;
    ticket_status: string;
    verified_at?: string; // 추가
  };
}
