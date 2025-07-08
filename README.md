# 2025 Summer Bootcamp TeamG - Frontend (Expo + TypeScript)

## 프로젝트 구조

```
App/
  ├── App.tsx
  ├── node_modules/
  ├── package.json
  ├── tailwind.config.js
  ├── babel.config.js
  └── ...
```

## 시작하기

### 1. 필수 프로그램 설치 (최초 1회)

#### [공통] Node.js 설치

- [Node.js 공식 다운로드](https://nodejs.org/ko/) (최소 18버전 이상 권장)
- 설치 후 터미널에서 `node -v`로 버전 확인

#### [공통] Expo CLI 설치 (선택)

- 전역 설치(권장):
  ```bash
  npm install -g expo-cli
  ```
- 또는 npx로 명령어마다 실행 가능

#### [모바일] Expo Go 앱 설치

- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- QR코드로 앱을 바로 테스트할 수 있음

#### [Mac] iOS 개발자

- Xcode 설치 (App Store에서)

#### [Windows] Android 개발자

- Android Studio 설치 ([공식 다운로드](https://developer.android.com/studio))
- Android 에뮬레이터 설정

---

### 2. 프로젝트 클론 및 의존성 설치

```bash
git clone https://github.com/2025-summerbootcamp-TeamG/Frontend.git
cd Frontend/App
npm install
```

---

### 3. 추가 라이브러리 설치 (이미 설치되어 있으면 생략)

#### NativeWind (Tailwind 스타일)


#### React Navigation

```bash
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

#### (선택) 상태관리, axios 등

```bash
npm install zustand axios
```

---

### 4. NativeWind Babel 플러그인 설정

`babel.config.js` 파일에 아래 플러그인 추가:

```js
plugins: ['nativewind/babel'],
```

---

## 실행 방법

```bash
npx expo start
```

- QR코드로 실기기(Expo Go 앱)에서 바로 테스트 가능
- iOS 시뮬레이터: `i`
- Android 에뮬레이터: `a`

---

## 주요 라이브러리

- Expo
- TypeScript
- NativeWind (Tailwind 스타일)
- React Navigation
- (선택) Zustand, axios 등

---

## 프로덕션 빌드

- Expo EAS 빌드 권장: [EAS Build 공식문서](https://docs.expo.dev/build/introduction/)
- 또는 Expo Go 앱 내에서 직접 테스트 가능

---

## 프로젝트 설정

- **브랜치 전략**
  - main: 배포/릴리즈
  - develop: 개발 기본 브랜치
  - feature/이름: 기능 개발 브랜치
- **커밋 메시지 규칙**
  - feat: 새로운 기능
  - fix: 버그 수정
  - docs: 문서 수정
  - style: 코드 포맷팅 등

---

## 문제 해결

- **빌드 오류**
  - 의존성 재설치: `npm install`
  - 캐시 삭제: `npx expo start -c`
  - Expo Go 앱 재설치
- **에뮬레이터 문제**
  - 기기 재부팅, 에뮬레이터 재설정
- **기타**
  - [Expo 공식문서](https://docs.expo.dev/)
  - [NativeWind 공식문서](https://www.nativewind.dev/quick-starts/expo)
  - 깃허브 이슈/팀 채널 문의
