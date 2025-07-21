import axios from 'axios';
import {
  GuideLineCheckRequest,
  GuideLineCheckResponse,
  FaceRegisterRequest,
  FaceRegisterResponse,
  SaveFaceToDBRequest,
  SaveFaceToDBResponse
} from './Types';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL } from '@env';

// 임시: 실제로는 Context, SecureStore 등에서 불러오도록 구현
export const getToken = () => {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUzMTEyMDI3LCJpYXQiOjE3NTMxMTE3MjcsImp0aSI6ImI0YWRjNTRkNzAyYTQ0MTdiZTgxODM2MTg2NTRmODE1IiwidXNlcl9pZCI6MSwibmFtZSI6Ilx1ZDE0Y1x1YzJhNFx1ZDJiOCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.tONFeGCeTr0GKL73-LSblLhht42Z5YrCuEP-_5UsHsE"
};

// 얼굴 가이드라인 체크 (FaceGuideCheckAPIView)
export const FaceGuideCheck = async (
  data: { image: string }
): Promise<GuideLineCheckResponse> => {
  const token = getToken();
  const response = await axios.post(`${API_BASE_URL}/face/check/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// AWS Rekognition 얼굴 등록 (AWSFaceRecognitionRegister)
export const AWSFaceRecognitionRegister = async (
  ticketId: number,
  data: { image: string }
): Promise<FaceRegisterResponse> => {
  const token = getToken();
  const response = await axios.post(`${API_BASE_URL}/tickets/${ticketId}/aws-register/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// DB 기반 얼굴 등록 상태 변경 (FaceRegisterAPIView)
export const FaceRegister = async (
  ticketId: number,
  data: { face_verified: boolean }
): Promise<AxiosResponse<SaveFaceToDBResponse>> => {
  const token = getToken();
  const response = await axios.patch(`${API_BASE_URL}/tickets/${ticketId}/register/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};
