import apiClient from './apiClient';
import {
  GuideLineCheckRequest,
  GuideLineCheckResponse,
  FaceRegisterRequest,
  FaceRegisterResponse,
  SaveFaceToDBRequest,
  SaveFaceToDBResponse
} from './Types';

// 얼굴 가이드라인 체크
export const FaceGuideCheck = async (
  data: GuideLineCheckRequest
): Promise<GuideLineCheckResponse> => {
  const response = await apiClient.post('face/check/', data);
  return response.data;
};

// AWS Rekognition 얼굴 등록
export const AWSFaceRecognitionRegister = async (
  ticketId: number,
  data: FaceRegisterRequest
): Promise<FaceRegisterResponse> => {
  const response = await apiClient.post(`tickets/${ticketId}/aws-register/`, data);
  return response.data;
};

// DB 기반 얼굴 등록 상태 변경
export const FaceRegister = async (
  ticketId: number,
  data: { face_verified: boolean }
): Promise<AxiosResponse<SaveFaceToDBResponse>> => {
  return await apiClient.patch(`tickets/${ticketId}/register/`, data);
};
