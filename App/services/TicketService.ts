import api from "./apiClient";
import {
  GuideLineCheckRequest,
  GuideLineCheckResponse,
  FaceRegisterRequest,
  FaceRegisterResponse,
  SaveFaceToDBRequest,
  SaveFaceToDBResponse,
} from "./Types";
import type { AxiosResponse } from "axios";
import type { Ticket, TicketDetail } from "./Types";

// 얼굴 가이드라인 체크
export const FaceGuideCheck = async (
  data: GuideLineCheckRequest
): Promise<GuideLineCheckResponse> => {
  const response = await api.post("face/check/", data);
  return response.data;
};

// AWS Rekognition 얼굴 등록
export const AWSFaceRecognitionRegister = async (
  ticketId: number,
  data: FaceRegisterRequest
): Promise<FaceRegisterResponse> => {
  const response = await api.post(`tickets/${ticketId}/aws-register/`, data);
  return response.data;
};

// DB 기반 얼굴 등록 상태 변경
export const FaceRegister = async (
  ticketId: number,
  data: { face_verified: boolean }
): Promise<AxiosResponse<SaveFaceToDBResponse>> => {
  return await api.patch(`tickets/${ticketId}/register/`, data);
};
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

export const TicketQRcode = async (
  ticketId: number) => {
  const response = await api.get(`tickets/${ticketId}/qr`);
  return response.data;
};
