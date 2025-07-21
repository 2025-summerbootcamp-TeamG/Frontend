import apiClient from "./apiClient";
import { EventListResponse } from "./Types";

export const getEvents = async (params: any): Promise<EventListResponse> => {
  const response = await apiClient.get<EventListResponse>("events/view/", {
    params,
  });
  return response.data;
};
