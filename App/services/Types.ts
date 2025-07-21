export interface GuideLineCheckRequest {
  image: string; // base64 등
}

export interface GuideLineCheckResponse {
  success?: boolean; // 백엔드에서 success 대신 is_in_guide만 반환할 수도 있으므로 옵셔널
  is_in_guide: boolean;
  message: string;
}

export interface FaceRegisterRequest {
  image: string;
}

export interface FaceRegisterResponse {
  awsFaceId: string;
  success: boolean;
  message: string;
}

export interface SaveFaceToDBRequest {
  awsFaceId: string;
}

export interface SaveFaceToDBResponse {
  success: boolean;
  message: string;
}
