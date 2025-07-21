import apiClient from "./apiClient";
import { ShareRequest } from './Types';

export const ShareTicket = async (
    purchaseId: string,
    data: ShareRequest
  ) => {
    return apiClient.post(`tickets/${purchaseId}/share/`, data);
  };
