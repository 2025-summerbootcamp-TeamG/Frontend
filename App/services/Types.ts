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
