import api from './apiClient';
import { PayRequest } from './Types';

export const payForTicket = async (
  purchaseId: string,
  data: PayRequest
) => {
  return api.patch(`events/${purchaseId}/tickets/pay/`, data);
};