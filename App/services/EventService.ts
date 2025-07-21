import apiClient from "./apiClient";
import { EventListResponse } from "./Types";
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
