# 2025 Summer Bootcamp TeamG - Frontend (Expo + TypeScript)

---

## 1. 개발 환경 준비

### 1) Node.js 설치

- [Node.js 공식 다운로드](https://nodejs.org/ko/) (18버전 이상 권장)
- 설치 후 터미널에서 `node -v`로 버전 확인

### 2) Expo CLI 설치 (선택)

- 전역 설치(권장):
  ```bash
  npm install -g expo-cli
  ```
- 또는 npx로 명령어마다 실행 가능

### 3) Expo Go 앱 설치 (모바일 테스트용)

- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 4) (Mac) iOS 개발자: Xcode 설치 (App Store)

### 5) (Windows) Android 개발자: Android Studio 설치 및 에뮬레이터 설정

---

## 2. 프로젝트 시작하기

### 1) 저장소 클론 및 폴더 이동

```bash
git clone https://github.com/2025-summerbootcamp-TeamG/Frontend.git
cd Frontend/App
```

### 2) 의존성 설치

```bash
npm install
```

---

## 3. 추가 라이브러리 설치 및 설정

### 1) NativeWind (Tailwind 스타일)

- 이미 설치되어 있음. 아래 파일이 있는지 확인:
  - tailwind.config.js
  - babel.config.js (plugins에 'nativewind/babel' 포함)

```bash
npm install nativewind
npx nativewind init
```

- 이미 설치되어 있음. 필요시 아래 명령어로 재설치:

```bash
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

---

## 4. 주요 폴더 구조 예시

```
App/
  ├── App.tsx
  ├── assets/
  ├── node_modules/
  ├── package.json
  ├── tailwind.config.js
  ├── babel.config.js
  └── ...
```

---

## 5. 앱 실행 방법

```bash
npx expo start
```

- 터미널에 뜨는 QR코드를 Expo Go 앱으로 스캔하면 실기기에서 바로 테스트 가능
- iOS 시뮬레이터: 터미널에서 `i` 입력
- Android 에뮬레이터: 터미널에서 `a` 입력

---

## 6. 문제 해결

- 의존성 재설치: `npm install`
- 캐시 삭제: `npx expo start -c`
- Expo Go 앱 재설치
- [Expo 공식문서](https://docs.expo.dev/)
- [NativeWind 공식문서](https://www.nativewind.dev/quick-starts/expo)
- 깃허브 이슈/팀 채널 문의

---

## 7. 브랜치 전략

- main: 배포/릴리즈
- develop: 개발 기본 브랜치
- feature/이름: 기능 개발 브랜치
