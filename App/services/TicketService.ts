import api from "./apiClient";
import type { Ticket, TicketDetail } from "./Types";

// 내 티켓 목록 조회 (로그인 필요)
export async function getMyTickets(): Promise<Ticket[]> {
  const res = await api.get("tickets/");
  return res.data;
}

// 티켓 상세정보 조회 (로그인 필요)
export async function getTicketDetail(ticketId: number): Promise<TicketDetail> {
  const res = await api.get(`tickets/${ticketId}/`);
  return res.data;
}

// 티켓 취소 (로그인 필요)
export async function cancelTicket(ticketId: number): Promise<TicketDetail> {
  const res = await api.patch(`tickets/${ticketId}/`);
  return res.data;
}
