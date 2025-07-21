import apiClient from "./apiClient";
import { EventListResponse } from "./Types";
import { PayRequest } from './Types';

export const getEvents = async (params: any): Promise<EventListResponse> => {
  const response = await apiClient.get<EventListResponse>("events/view/", {
    params,
  });
  return response.data;
};

export const payForTicket = async (
  purchaseId: string,
  data: PayRequest
) => {
  return apiClient.patch(`events/${purchaseId}/tickets/pay/`, data);
};

export const getEventsByGenre = async (genre: string): Promise<EventListResponse> => {
  // category 파라미터로 요청해야 백엔드에서 genre 필드로 필터링함
  const response = await apiClient.get<EventListResponse>("events/view/", {
    params: { category: genre }
  });
  return response.data;
};