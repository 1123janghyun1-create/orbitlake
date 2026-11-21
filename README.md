# orbitlake 🪐🌌

> **브라우저에서 우주를 설계하고 중력 시뮬레이션을 돌려 보세요. Create. Simulate. Explore.**
> `orbitpond.pages.dev` 웹 애플리케이션의 구조, N-Body 중력 물리 엔진, Three.js 3D 셰이더 및 인터랙션을 100% 동일하게 분석하여 구축한 고정밀 우주 시뮬레이터 프로젝트입니다.

---

## 🚀 빠른 시작 (Quick Start)

### 1. 개발 서버 실행
Node.js 또는 Python 환경에서 바로 실행할 수 있습니다:

```bash
# Python 서버 실행 (포트 3333)
npm run dev
# 또는
python server.py
```

브라우저에서 **[http://localhost:3333](http://localhost:3333)** 에 접속하면 즉시 시뮬레이터를 조작할 수 있습니다.

---

## 🔭 핵심 아키텍처 및 3D 물리 엔진 분석

### 1. 정교한 3D 그래픽 엔진 (Three.js & Custom GLSL Shaders)
- **Three.js Viewport (`Viewport3D`)**:
  - `PerspectiveCamera` 및 `OrthographicCamera` 동적 전환 지원
  - `OrbitControls`: 자유로운 패닝, 줌, 천체 중심 궤도 추적 (`focusId` 기반 자동 카메라 추적)
- **후처리 효과 (Post-Processing Pipeline)**:
  - `EffectComposer`, `RenderPass`
  - `UnrealBloomPass` / `SelectiveBloomEffect`: 항성(Star) 및 펄서(Pulsar) 표면의 자발광 코로나 블룸 효과
  - `SMAA / KawaseBlur` 안티앨리어싱
- **커스텀 GLSL 셰이더 구현**:
  - **대기 산란 셰이더 (Atmospheric Scattering)**: 프레넬 림 글로우(Fresnel rim glow) 효과 및 대기 밀도(`uDensity`), 대기색(`uColor`), 안쪽 에지 감쇠(`uInnerEdge`) 구현
  - **블랙홀 & 강착원반 (Black Hole & Accretion Disk)**: 사건의 지평선(Event Horizon), 중력 렌즈(Gravitational Lensing) 효과 및 고열 회전 강착원반 셰이더
  - **펄서 & 중성자별 제트 (Pulsar Beams)**: 고속 회전하는 자기장 축을 따라 방출되는 상대론적 제트 빔
  - **행성 고리 (Planetary Rings)**: 토성 등 고리형 천체의 미세 먼지 입자 산란 및 천체 본체에 드리우는 고리 그림자 셰이딩
  - **궤도 잔상 (Orbit Trails)**: 시간에 따른 궤적 점감 페이드 및 3D 공간 상의 스플라인 잔상

### 2. 고정밀 N-Body 중력 물리 엔진 (`sim.worker`)
- **웹 워커(Web Worker) 분리**:
  - 메인 UI 스레드 렌더링 프레임레이트(60~120fps)를 저해하지 않도록 별도의 Web Worker 스레드에서 물리 연산 병렬 수행
- **심플렉틱 수치 적분기 (Symplectic Integrator)**:
  - **Yoshida 4차 적분기 (Yoshida 4th-Order Symplectic Integrator)**: 장기 궤도 안정성과 에너지 보존율이 극대화된 수치 적분
  - **Leapfrog (Kick-Drift-Kick)**: 빠르고 가벼운 연산 모드 지원
- **현대 천체물리학 효과 반영**:
  - **일반 상대성 이론 (General Relativity - Post-Newtonian Correction)**: 수성 근일점 이동(Perihelion Precession) 및 블랙홀 주변 궤도 세차 운동 근사 반영
  - **중력파 방출 (Gravitational Wave Radiation)**: 서로 공전하는 고밀도 천체(쌍성, 중성자별 쌍)의 에너지 손실 및 궤도 수축(GW170817 모사)
  - **조석 파괴 및 충돌 병합 (Tidal Disruption & Merger)**: 천체 반지름 접촉 시 운동량 보존 법칙에 기반한 충돌/병합 물리 구현

### 3. 풍부한 시뮬레이션 기능 & UI
- **프리셋 템플릿 카탈로그**:
  1. `태양계 (Solar System)`: 8개 행성과 달의 2000년 1월 1일 실제 역학적 궤도
  2. `태양 · 지구 · 달 (Sun-Earth-Moon)`: 고전적 3체 역학 모델
  3. `두 개의 태양 (Binary Stars)`: 쌍성계 및 주변을 도는 세 번째 별과 행성
  4. `8자 3체 궤도 (Figure-Eight)`: 동일 질량 3체가 8자 형태를 순환하는 유명한 안정 3체 해
  5. `트로이 소행성 (Trojans)`: 목성 L4/L5 라그랑주 점 소행성군
  6. `블랙홀과 별 (Black Hole & Star)`: 조석 파괴 및 강착 현상
  7. `두 중성자별 충돌 (Neutron Star Collision)`: 킬로노바 및 블랙홀 붕괴
  8. `우리 은하 중심 (Galactic Center)`: 궁수자리 A* 초대질량 블랙홀과 별들의 고속 공전
  9. `8개 무작위 천체 카오스 (Chaos 8)`
- **만약에 (What-If) 우주 분기 모드**:
  - 현재 시뮬레이션 상태를 보존한 채 파라미터를 변경하여 원본 우주와 분기된 우주를 나란히 동시 시뮬레이션
- **미디어 & 분석 도구**:
  - **WebM 영상 촬영**: 캔버스 다이렉트 렌더링 캡처로 고품질 우주 영상 생성
  - **에너지 보존 & 궤도 분석 그래프**: 에너지 오차 $\Delta E/E$ 및 천체 간 거리 실시간 플롯
  - **우주 저장 및 공유**: JSON 형식 우주 내보내기/가져오기, 클립보드 공유

---

## 📁 프로젝트 구조

```
orbitlake/
├── dist/                      # 배포 가능한 완전한 정적 웹 앱
│   ├── index.html             # 애플리케이션 진입점
│   ├── favicon.svg            # 벡터 파비콘
│   ├── apple-touch-icon.png   # 모바일 아이콘
│   ├── site.webmanifest       # PWA 매니페스트
│   ├── brand/                 # 브랜드 아이콘 및 심볼
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── symbol.svg
│   └── assets/                # 컴파일된 모듈 및 번들
│       ├── index-inCOgxLd.js          # React 앱 메인 번들
│       ├── index-kf8V3_nX.css         # Tailwind & 스타일시트
│       ├── Viewport3D-CZPRPyYP.js     # Three.js 3D 뷰포트 & 커스텀 셰이더
│       ├── sim.worker-BQXDNcfs.js     # Yoshida 4차 N-Body 물리 웹워커
│       ├── AnalysisPanel-Cqqtlwxf.js  # 분석 및 그래프 패널
│       └── DocsPage-BHssFNno.js       # 문서 및 튜토리얼 뷰어
├── server.py                  # SPA 라우팅 및 정적 에셋 지원 Python 서버
├── package.json               # 프로젝트 설정 및 실행 스크립트
└── README.md                  # 프로젝트 설명서
```

---

## 🌐 배포 가이드 (Deployment)

본 프로젝트는 정적 파일(SPA)로 완전히 패키징되어 있어 다양한 플랫폼에 무설정으로 배포할 수 있습니다:

- **Cloudflare Pages**: `dist` 폴더를 빌드 출력 디렉토리로 지정하여 배포
- **Vercel / Netlify**: `dist` 디렉토리를 배포 디렉토리로 지정하여 배포
- **GitHub Pages**: `dist` 폴더의 내용을 `gh-pages` 브랜치에 푸시
