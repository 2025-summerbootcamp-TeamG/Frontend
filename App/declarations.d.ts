declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
declare module'@env' {
  export const API_BASE_URL: string;
  // 필요한 환경변수명을 여기에 추가
}
