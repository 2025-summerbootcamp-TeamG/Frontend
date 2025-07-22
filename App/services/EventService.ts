import apiClient from "./apiClient";
import { EventListResponse, ZoneSeatsResponse } from "./Types";
import { PayRequest } from "./Types";

export const getEvents = async (params: any): Promise<EventListResponse> => {
  const response = await apiClient.get<EventListResponse>("events/view/", {
    params,
  });
  return response.data;
};

export const payForTicket = async (purchaseId: string, data: PayRequest) => {
  return apiClient.patch(`events/${purchaseId}/tickets/pay/`, data);
};

export const getEventDetail = async (eventId: number) => {
  const response = await apiClient.get(`events/${eventId}/`);
  return response.data;
};

export const getEventsByGenre = async (
  genre: string
): Promise<EventListResponse> => {
  // category 파라미터로 요청해야 백엔드에서 genre 필드로 필터링함
  const response = await apiClient.get<EventListResponse>("events/view/", {
    params: { category: genre },
  });
  return response.data;
};

export const getSeatsByZone = async (
  zoneId: number
): Promise<ZoneSeatsResponse> => {
  const response = await apiClient.get<ZoneSeatsResponse>(
    `events/${zoneId}/seats/`
  );
  return response.data;
};

export const searchEvents = async (keyword: string, page = 1, limit = 20) => {
  const response = await apiClient.get("events/view/", {
    params: { keyword, page, limit },
  });
  return response.data;
};

export async function buyTickets(eventId: any, body: any) {
  // body: { seat_id: [좌석id...], event_time_id: ... }
  return apiClient
    .post("events/${eventId}/tickets/buy", body)
    .then((res) => res.data);
}
