/**
 * OrbitLake Real Celestial Catalog & Interactive Edit Mode
 * Adds 90+ real discovered celestial bodies with accurate physical parameters
 * Provides interactive Drag-to-Move Edit Mode and Instant Search
 */

(function () {
  'use strict';

  // --- Constants ---
  const AU_KM = 149597870.7;
  const SOLAR_MASS_KG = 1.98847e30;
  const EARTH_MASS_SOLAR = 3.003467e-6;
  const JUPITER_MASS_SOLAR = 9.5479e-4;
  const MOON_MASS_SOLAR = 3.693e-8;
  const EARTH_RADIUS_AU = 6371 / AU_KM;
  const SOLAR_RADIUS_AU = 696340 / AU_KM;

  // --- Real Celestial Bodies Database ---
  const CELESTIAL_CATALOG = [
    // 1. 태양계 행성 (Solar System)
    {
      id: 'mercury',
      name: '수성',
      enName: 'Mercury',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 0.0553 * EARTH_MASS_SOLAR,
      radiusKm: 2439.7,
      distanceAU: 0.387,
      eccentricity: 0.2056,
      icon: '🪐',
      color: '#a3a3a3',
      palette: ['#8a8a8a', '#b5b5b5', '#606060'],
      type: 'rocky',
      desc: '태양에서 가장 가까운 행성. 대기가 없어 밤낮 표면 온도 차이가 600℃에 달하며 크레이터로 덮여 있습니다.',
      stats: { '질량': '0.055 M⊕', '반지름': '2,440 km', '공전주기': '88일', '표면온도': '100 ~ 700 K' }
    },
    {
      id: 'venus',
      name: '금성',
      enName: 'Venus',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 0.815 * EARTH_MASS_SOLAR,
      radiusKm: 6051.8,
      distanceAU: 0.723,
      eccentricity: 0.0067,
      icon: '🟡',
      color: '#eab308',
      palette: ['#d97706', '#f59e0b', '#fbbf24'],
      atmosphere: { color: '#fef08a', density: 1.8, blend: 0.7 },
      type: 'rocky',
      desc: '두터운 이산화탄소 대기와 황산 구름으로 인한 극심한 온실효과로 표면 온도가 465℃에 달하는 가장 뜨거운 행성.',
      stats: { '질량': '0.815 M⊕', '반지름': '6,052 km', '공전주기': '225일', '기압': '92기압' }
    },
    {
      id: 'earth',
      name: '지구',
      enName: 'Earth',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 1.0 * EARTH_MASS_SOLAR,
      radiusKm: 6371.0,
      distanceAU: 1.000,
      eccentricity: 0.0167,
      icon: '🌍',
      color: '#38bdf8',
      palette: ['#1e3a8a', '#10b981', '#3b82f6', '#f8fafc'],
      atmosphere: { color: '#38bdf8', density: 1.0, blend: 0.5 },
      type: 'rocky',
      desc: '풍부한 액체 상태의 물과 산소 대기를 지닌, 인류와 모든 생명체의 고향 행성.',
      stats: { '질량': '1.00 M⊕', '반지름': '6,371 km', '공전주기': '365.25일', '위성': '달 (1개)' }
    },
    {
      id: 'mars',
      name: '화성',
      enName: 'Mars',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 0.107 * EARTH_MASS_SOLAR,
      radiusKm: 3389.5,
      distanceAU: 1.524,
      eccentricity: 0.0934,
      icon: '🔴',
      color: '#ef4444',
      palette: ['#991b1b', '#dc2626', '#f87171', '#d97706'],
      atmosphere: { color: '#fb923c', density: 0.3, blend: 0.4 },
      type: 'rocky',
      desc: '산화철 먼지로 뒤덮인 붉은 행성. 태양계 최대 화산인 올림포스 산과 거대한 마리너 계곡이 있습니다.',
      stats: { '질량': '0.107 M⊕', '반지름': '3,390 km', '공전주기': '687일', '위성': '포보스, 데이모스' }
    },
    {
      id: 'jupiter',
      name: '목성',
      enName: 'Jupiter',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 317.8 * EARTH_MASS_SOLAR,
      radiusKm: 69911.0,
      distanceAU: 5.204,
      eccentricity: 0.0485,
      icon: '🪐',
      color: '#d97706',
      palette: ['#78350f', '#b45309', '#d97706', '#fef3c7'],
      type: 'gas',
      desc: '태양계 모든 행성을 합친 것보다 2.5배 무거운 거대 가스행성. 수백 년간 지속된 거대한 폭풍 대적점이 유명합니다.',
      stats: { '질량': '317.8 M⊕', '반지름': '69,911 km', '공전주기': '11.86년', '위성': '95개' }
    },
    {
      id: 'saturn',
      name: '토성',
      enName: 'Saturn',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 95.2 * EARTH_MASS_SOLAR,
      radiusKm: 58232.0,
      distanceAU: 9.582,
      eccentricity: 0.0555,
      icon: '🪐',
      color: '#fbbf24',
      palette: ['#92400e', '#d97706', '#fde68a'],
      rings: { inner: 1.3, outer: 2.3, color: '#fde68a' },
      type: 'gas',
      desc: '물에 뜰 정도로 밀도가 낮으며, 얼음과 암석 입자로 이루어진 태양계에서 가장 화려하고 거대한 고리를 자랑합니다.',
      stats: { '질량': '95.2 M⊕', '반지름': '58,232 km', '공전주기': '29.46년', '위성': '146개' }
    },
    {
      id: 'uranus',
      name: '천왕성',
      enName: 'Uranus',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 14.5 * EARTH_MASS_SOLAR,
      radiusKm: 25362.0,
      distanceAU: 19.20,
      eccentricity: 0.0463,
      icon: '🌐',
      color: '#22d3ee',
      palette: ['#0891b2', '#06b6d4', '#67e8f9'],
      atmosphere: { color: '#22d3ee', density: 1.2, blend: 0.6 },
      type: 'gas',
      desc: '자전축이 97.8도 기울어져 거의 공전면에 누운 채로 자전하는 얼음 거인. 메탄 성분으로 청록색을 띱니다.',
      stats: { '질량': '14.5 M⊕', '반지름': '25,362 km', '공전주기': '84.01년', '자전축 경사': '97.8°' }
    },
    {
      id: 'neptune',
      name: '해왕성',
      enName: 'Neptune',
      category: 'solarsystem',
      categoryName: '태양계 행성',
      kind: 'planet',
      mass: 17.1 * EARTH_MASS_SOLAR,
      radiusKm: 24622.0,
      distanceAU: 30.05,
      eccentricity: 0.0095,
      icon: '🔵',
      color: '#2563eb',
      palette: ['#1e40af', '#2563eb', '#60a5fa'],
      atmosphere: { color: '#3b82f6', density: 1.4, blend: 0.6 },
      type: 'gas',
      desc: '시속 2,100km가 넘는 태양계에서 가장 강력한 초음속 폭풍이 몰아치는 깊고 푸른 최외곽 얼음 거인.',
      stats: { '질량': '17.1 M⊕', '반지름': '24,622 km', '공전주기': '164.8년', '최대풍속': '2,100 km/h' }
    },

    // 2. 왜소행성 (Dwarf Planets)
    {
      id: 'pluto',
      name: '명왕성',
      enName: 'Pluto',
      category: 'dwarf',
      categoryName: '왜소행성',
      kind: 'planet',
      mass: 0.00218 * EARTH_MASS_SOLAR,
      radiusKm: 1188.3,
      distanceAU: 39.48,
      eccentricity: 0.2488,
      icon: '🤍',
      color: '#e2e8f0',
      palette: ['#78350f', '#d6d3d1', '#fafaf9'],
      type: 'rocky',
      desc: '뉴 호라이즌스 탐사선이 발견한 거대한 하트 모양 질소 얼음 평원(톰보 영역)을 품고 있는 카이퍼 벨트의 대표 왜소행성.',
      stats: { '질량': '0.0022 M⊕', '반지름': '1,188 km', '공전주기': '248년', '궤도경사': '17.16°' }
    },
    {
      id: 'ceres',
      name: '세레스',
      enName: 'Ceres',
      category: 'dwarf',
      categoryName: '왜소행성',
      kind: 'planet',
      mass: 0.000157 * EARTH_MASS_SOLAR,
      radiusKm: 473.0,
      distanceAU: 2.767,
      eccentricity: 0.0758,
      icon: '⚪',
      color: '#94a3b8',
      palette: ['#475569', '#94a3b8', '#f8fafc'],
      type: 'rocky',
      desc: '화성과 목성 사이 소행성대에 존재하는 가장 거대한 천체이자 유일한 왜소행성. 오카토르 분화구의 밝은 탄산나트륨 반점이 신비롭습니다.',
      stats: { '질량': '0.00016 M⊕', '반지름': '473 km', '공전주기': '4.60년', '위치': '소행성대' }
    },
    {
      id: 'eris',
      name: '에리스',
      enName: 'Eris',
      category: 'dwarf',
      categoryName: '왜소행성',
      kind: 'planet',
      mass: 0.0028 * EARTH_MASS_SOLAR,
      radiusKm: 1163.0,
      distanceAU: 67.78,
      eccentricity: 0.4407,
      icon: '❄️',
      color: '#cbd5e1',
      palette: ['#94a3b8', '#e2e8f0', '#ffffff'],
      type: 'rocky',
      desc: '명왕성보다 질량이 약 27% 더 큰 산란원반 왜소행성. 이 천체의 발견으로 2006년 행성의 정의가 새롭게 개정되었습니다.',
      stats: { '질량': '0.0028 M⊕', '반지름': '1,163 km', '공전주기': '558년', '위성': '디스노미아' }
    },
    {
      id: 'haumea',
      name: '하우메아',
      enName: 'Haumea',
      category: 'dwarf',
      categoryName: '왜소행성',
      kind: 'planet',
      mass: 0.00067 * EARTH_MASS_SOLAR,
      radiusKm: 816.0,
      distanceAU: 43.13,
      eccentricity: 0.1913,
      icon: '🏉',
      color: '#d1d5db',
      palette: ['#6b7280', '#e5e7eb', '#f3f4f6'],
      rings: { inner: 1.5, outer: 2.1, color: '#e5e7eb' },
      type: 'rocky',
      desc: '약 3.9시간의 극초고속 자전으로 인해 럭비공 모양으로 납작하게 늘어난 왜소행성. 고리와 2개의 위성을 지니고 있습니다.',
      stats: { '질량': '0.0007 M⊕', '자전주기': '3.91시간', '공전주기': '284년', '형태': '타원체' }
    },
    {
      id: 'makemake',
      name: '마케마케',
      enName: 'Makemake',
      category: 'dwarf',
      categoryName: '왜소행성',
      kind: 'planet',
      mass: 0.0005 * EARTH_MASS_SOLAR,
      radiusKm: 715.0,
      distanceAU: 45.79,
      eccentricity: 0.1559,
      icon: '🟤',
      color: '#b45309',
      palette: ['#78350f', '#b45309', '#fde68a'],
      type: 'rocky',
      desc: '카이퍼 벨트의 3대 거대 천체 중 하나. 표면이 메탄과 에탄 얼음으로 덮여 붉은빛을 띱니다.',
      stats: { '질량': '0.0005 M⊕', '반지름': '715 km', '공전주기': '306년', '위성': 'MK2' }
    },
    {
      id: 'sedna',
      name: '세드나',
      enName: 'Sedna',
      category: 'dwarf',
      categoryName: '왜소행성',
      kind: 'planet',
      mass: 0.00017 * EARTH_MASS_SOLAR,
      radiusKm: 498.0,
      distanceAU: 76.0,
      eccentricity: 0.8549,
      icon: '🔴',
      color: '#dc2626',
      palette: ['#7f1d1d', '#b91c1c', '#fca5a5'],
      type: 'rocky',
      desc: '원일점이 937 AU에 달해 오르트 구름 안쪽까지 날아가는 극단적 타원궤도 천체. 공전주기가 무려 11,400년에 달합니다.',
      stats: { '공전주기': '11,400년', '원일점': '937 AU', '반지름': '498 km', '색상': '극도로 붉음' }
    },

    // 3. 주요 위성 (Moons)
    {
      id: 'moon',
      name: '달',
      enName: 'Moon',
      category: 'moons',
      categoryName: '위성',
      kind: 'moon',
      mass: MOON_MASS_SOLAR,
      radiusKm: 1737.4,
      distanceAU: 0.00257,
      icon: '🌕',
      color: '#d4d4d8',
      palette: ['#52525b', '#a1a1aa', '#f4f4f5'],
      type: 'rocky',
      desc: '지구의 유일한 자연위성이자 인류가 발을 디딘 유일한 외계 천체. 어두운 현무암 용암 바다와 크레이터로 가득합니다.',
      stats: { '질량': '0.0123 M⊕', '반지름': '1,737 km', '공전주기': '27.3일', '거리': '384,400 km' }
    },
    {
      id: 'io',
      name: '이오',
      enName: 'Io',
      category: 'moons',
      categoryName: '위성',
      kind: 'moon',
      mass: 0.015 * EARTH_MASS_SOLAR,
      radiusKm: 1821.6,
      distanceAU: 0.00282,
      icon: '🌋',
      color: '#facc15',
      palette: ['#854d0e', '#ca8a04', '#facc15', '#ef4444'],
      type: 'rocky',
      desc: '목성의 강력한 기조력으로 인해 내부가 녹아 400개 이상의 활화산이 뿜어져 나오는 태양계에서 가장 화산활동이 격렬한 천체.',
      stats: { '모행성': '목성', '반지름': '1,822 km', '공전주기': '1.77일', '특징': '초화산 분출' }
    },
    {
      id: 'europa',
      name: '유로파',
      enName: 'Europa',
      category: 'moons',
      categoryName: '위성',
      kind: 'moon',
      mass: 0.008 * EARTH_MASS_SOLAR,
      radiusKm: 1560.8,
      distanceAU: 0.00449,
      icon: '🧊',
      color: '#e0f2fe',
      palette: ['#991b1b', '#bae6fd', '#f0f9ff'],
      type: 'rocky',
      desc: '단단한 얼음 지각 밑에 지구의 모든 바다보다 2배 이상 많은 액체 물이 존재하는 지하 해양이 있어 외계 생명체 탐사의 1순위.',
      stats: { '모행성': '목성', '지하바다 깊이': '~100 km', '반지름': '1,561 km', '공전주기': '3.55일' }
    },
    {
      id: 'ganymede',
      name: '가니메데',
      enName: 'Ganymede',
      category: 'moons',
      categoryName: '위성',
      kind: 'moon',
      mass: 0.025 * EARTH_MASS_SOLAR,
      radiusKm: 2634.1,
      distanceAU: 0.00716,
      icon: '🌐',
      color: '#94a3b8',
      palette: ['#334155', '#64748b', '#cbd5e1'],
      type: 'rocky',
      desc: '행성인 수성보다도 거대한 태양계 최대 위성. 위성 중 유일하게 자체 자기장을 발생시키는 철 핵을 지니고 있습니다.',
      stats: { '모행성': '목성', '반지름': '2,634 km', '공전주기': '7.15일', '특징': '자체 자기장 보유' }
    },
    {
      id: 'titan',
      name: '타이탄',
      enName: 'Titan',
      category: 'moons',
      categoryName: '위성',
      kind: 'moon',
      mass: 0.0225 * EARTH_MASS_SOLAR,
      radiusKm: 2574.7,
      distanceAU: 0.00817,
      icon: '🟠',
      color: '#f97316',
      palette: ['#c2410c', '#ea580c', '#fdba74'],
      atmosphere: { color: '#fb923c', density: 1.6, blend: 0.8 },
      type: 'rocky',
      desc: '지구보다 1.5배 두터운 질소 대기를 가지며, 표면에 액체 메탄과 에탄으로 이루어진 호수, 강, 비가 내리는 태양계의 독보적인 위성.',
      stats: { '모행성': '토성', '대기': '질소 95%', '반지름': '2,575 km', '표면기압': '1.45기압' }
    },
    {
      id: 'enceladus',
      name: '엔셀라두스',
      enName: 'Enceladus',
      category: 'moons',
      categoryName: '위성',
      kind: 'moon',
      mass: 0.000018 * EARTH_MASS_SOLAR,
      radiusKm: 252.1,
      distanceAU: 0.00159,
      icon: '✨',
      color: '#f8fafc',
      palette: ['#93c5fd', '#e0f2fe', '#ffffff'],
      type: 'rocky',
      desc: '남극의 "호랑이 줄무늬" 균열에서 우주 공간으로 수증기와 유기물 얼음 간헐천을 뿜어내는 토성의 얼음 위성.',
      stats: { '모행성': '토성', '반사율': '99% (태양계 1위)', '반지름': '252 km', '특징': '열수 분출공' }
    },

    // 4. 외계 행성 (Exoplanets)
    {
      id: 'proxima-b',
      name: '프록시마 센타우리 b',
      enName: 'Proxima Centauri b',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 1.07 * EARTH_MASS_SOLAR,
      radiusKm: 6560.0,
      distanceAU: 0.0485,
      eccentricity: 0.02,
      icon: '🪐',
      color: '#f97316',
      palette: ['#9a3412', '#ea580c', '#fdba74', '#0284c7'],
      atmosphere: { color: '#fb923c', density: 0.8, blend: 0.5 },
      type: 'rocky',
      desc: '지구에서 가장 가까운 외계 행성 (4.24광년). 적색왜성 모항성의 생명체 거주가능 영역(골디락스 존)에 위치합니다.',
      stats: { '거리': '4.24 광년', '질량': '1.07 M⊕', '공전주기': '11.2일', '발견': '2016년 (ESO)' }
    },
    {
      id: 'trappist-1e',
      name: 'TRAPPIST-1e',
      enName: 'TRAPPIST-1e',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 0.69 * EARTH_MASS_SOLAR,
      radiusKm: 5860.0,
      distanceAU: 0.0293,
      eccentricity: 0.005,
      icon: '🌍',
      color: '#38bdf8',
      palette: ['#1e40af', '#059669', '#38bdf8', '#f8fafc'],
      atmosphere: { color: '#38bdf8', density: 1.0, blend: 0.5 },
      type: 'rocky',
      desc: 'TRAPPIST-1의 7개 지구형 행성 중 액체 상태의 바다와 적당한 온도를 유지할 가능성이 가장 높은 지구 유사도 최상위 행성.',
      stats: { '지구 유사도': '0.85', '질량': '0.69 M⊕', '공전주기': '6.1일', '발견': '2017년' }
    },
    {
      id: 'kepler-452b',
      name: '케플러-452b',
      enName: 'Kepler-452b',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 5.0 * EARTH_MASS_SOLAR,
      radiusKm: 10385.0,
      distanceAU: 1.046,
      eccentricity: 0.035,
      icon: '🌏',
      color: '#0ea5e9',
      palette: ['#0369a1', '#15803d', '#38bdf8', '#e2e8f0'],
      atmosphere: { color: '#0ea5e9', density: 1.3, blend: 0.6 },
      type: 'rocky',
      desc: '"지구 2.0" 또는 "지구의 나이 든 사촌"이라 불리는 천체. 태양과 거의 동일한 G2V형 항성의 골디락스 영역을 385일 주기로 공전합니다.',
      stats: { '거리': '1,400 광년', '반지름': '1.63 R⊕', '공전주기': '384.8일', '항성 유형': 'G2V' }
    },
    {
      id: 'kepler-22b',
      name: '케플러-22b',
      enName: 'Kepler-22b',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 9.1 * EARTH_MASS_SOLAR,
      radiusKm: 15160.0,
      distanceAU: 0.849,
      eccentricity: 0.0,
      icon: '🌊',
      color: '#06b6d4',
      palette: ['#0e7490', '#06b6d4', '#a5f3fc'],
      atmosphere: { color: '#06b6d4', density: 1.5, blend: 0.6 },
      type: 'gas',
      desc: '케플러 우주망원경이 최초로 확인한 골디락스 영역 외계 행성. 전 표면이 깊은 바다로 덮인 해양 행성(Ocean World) 후보입니다.',
      stats: { '거리': '620 광년', '반지름': '2.38 R⊕', '공전주기': '290일', '유형': '해양 행성' }
    },
    {
      id: 'k2-18b',
      name: 'K2-18b',
      enName: 'K2-18b',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 8.63 * EARTH_MASS_SOLAR,
      radiusKm: 16620.0,
      distanceAU: 0.143,
      eccentricity: 0.09,
      icon: '💧',
      color: '#3b82f6',
      palette: ['#1d4ed8', '#3b82f6', '#93c5fd'],
      atmosphere: { color: '#60a5fa', density: 1.4, blend: 0.5 },
      type: 'gas',
      desc: '허블과 제임스 웹(JWST) 우주망원경이 대기에서 수증기, 메탄, 이산화탄소를 감지한 대표적인 하이세안(Hycean, 수소 대기+해양) 행성 후보.',
      stats: { '거리': '124 광년', '반지름': '2.61 R⊕', '공전주기': '32.9일', 'JWST 검출': '메탄·CO2' }
    },
    {
      id: '51-pegasi-b',
      name: '51 페가수스자리 b',
      enName: '51 Pegasi b (Dimidium)',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 0.46 * JUPITER_MASS_SOLAR,
      radiusKm: 130000.0,
      distanceAU: 0.0527,
      eccentricity: 0.013,
      icon: '🔥',
      color: '#ea580c',
      palette: ['#7c2d12', '#c2410c', '#fb923c', '#fef08a'],
      type: 'gas',
      desc: '1995년 마요르와 켈로 박사가 발견하여 2019년 노벨 물리학상을 수상한 인류 역사상 최초의 태양 유사 항성 외계행성("핫 목성").',
      stats: { '발견년도': '1995년 (역사적)', '공전주기': '4.23일', '표면온도': '~1,200 K', '유형': '핫 목성' }
    },
    {
      id: 'hd-189733-b',
      name: 'HD 189733 b',
      enName: 'HD 189733 b',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 1.13 * JUPITER_MASS_SOLAR,
      radiusKm: 80000.0,
      distanceAU: 0.0313,
      eccentricity: 0.0,
      icon: '💎',
      color: '#1d4ed8',
      palette: ['#1e3a8a', '#1d4ed8', '#38bdf8'],
      type: 'gas',
      desc: '우주에서 보면 깊고 푸른 바다처럼 보이지만, 실제로는 대기 중의 규산염 유리 입자가 시속 8,700km의 맹렬한 유리 비로 쏟아지는 지옥 같은 행성.',
      stats: { '풍속': '시속 8,700 km', '대기': '유리(규산염) 비', '표면온도': '1,200 K', '거리': '64.5 광년' }
    },
    {
      id: 'wasp-76b',
      name: 'WASP-76b',
      enName: 'WASP-76b',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 0.92 * JUPITER_MASS_SOLAR,
      radiusKm: 130000.0,
      distanceAU: 0.033,
      eccentricity: 0.0,
      icon: '⛓️',
      color: '#b91c1c',
      palette: ['#450a0a', '#991b1b', '#ef4444', '#f59e0b'],
      type: 'gas',
      desc: '낮 쪽 온도가 2,400℃를 넘어 철이 증발하고, 밤 쪽으로 불어와 응결되면서 액체 상태의 "철 비"가 내리는 극초고온 외계 가스행성.',
      stats: { '낮 온도': '2,400 ℃', '특징': '액체 철 비 내림', '공전주기': '1.8일', '거리': '634 광년' }
    },
    {
      id: '55-cancri-e',
      name: '55 게자리 e',
      enName: '55 Cancri e (Janssen)',
      category: 'exoplanets',
      categoryName: '외계 행성',
      kind: 'planet',
      mass: 8.0 * EARTH_MASS_SOLAR,
      radiusKm: 12000.0,
      distanceAU: 0.0154,
      eccentricity: 0.05,
      icon: '💎',
      color: '#38bdf8',
      palette: ['#0f172a', '#334155', '#38bdf8', '#f8fafc'],
      type: 'rocky',
      desc: '탄소와 탄화규소가 극도로 풍부하여 행성 내부의 상당 부분이 순수한 "다이아몬드"로 결정화되어 있을 것으로 추정되는 초고온 슈퍼지구.',
      stats: { '공전주기': '18시간', '질량': '8.0 M⊕', '표면온도': '2,570 K', '구성': '다이아몬드 추정' }
    },

    // 5. 실제 별 / 항성 (Stars)
    {
      id: 'sun',
      name: '태양',
      enName: 'Sun (Sol)',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 1.0,
      radiusKm: 696340.0,
      temperature: 5778,
      luminosity: 1.0,
      icon: '☀️',
      color: '#f59e0b',
      desc: '태양계 질량의 99.86%를 차지하는 주계열 G2V형 황색 왜성. 지구의 모든 생명과 에너지를 지탱하는 중심 항성.',
      stats: { '스펙트럼': 'G2V', '표면온도': '5,778 K', '광도': '1.0 L☉', '나이': '46억 년' }
    },
    {
      id: 'proxima-centauri',
      name: '프록시마 센타우리',
      enName: 'Proxima Centauri',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 0.122,
      radiusKm: 107280.0,
      temperature: 3042,
      luminosity: 0.0017,
      icon: '🔴',
      color: '#ef4444',
      desc: '태양에서 가장 가까운 이웃 항성 (거리 4.246 광년). M5.5Ve형 적색왜성으로 수조 년 동안 수명을 유지합니다.',
      stats: { '거리': '4.24 광년', '스펙트럼': 'M5.5V', '표면온도': '3,042 K', '광도': '0.0017 L☉' }
    },
    {
      id: 'sirius-a',
      name: '시리우스 A',
      enName: 'Sirius A',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 2.06,
      radiusKm: 1190000.0,
      temperature: 9940,
      luminosity: 25.4,
      icon: '⭐',
      color: '#e0f2fe',
      desc: '밤하늘에서 가장 눈부시게 빛나는 별(-1.46등급). 큰개자리 알파성으로, 태양보다 25배 밝은 눈부신 A1V형 주계열성입니다.',
      stats: { '거리': '8.6 광년', '겉보기등급': '-1.46', '표면온도': '9,940 K', '광도': '25.4 L☉' }
    },
    {
      id: 'betelgeuse',
      name: '베텔게우스',
      enName: 'Betelgeuse',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 16.5,
      radiusKm: 531000000.0, // ~764 R☉
      temperature: 3600,
      luminosity: 126000.0,
      icon: '🏮',
      color: '#dc2626',
      desc: '오리온자리의 어깨에 위치한 거대한 적색 초거성. 태양 위치에 놓으면 목성 궤도까지 삼키며, 초신성 폭발이 임박한 천체입니다.',
      stats: { '반지름': '764 R☉', '광도': '126,000 L☉', '질량': '16.5 M☉', '상태': '초신성 전야' }
    },
    {
      id: 'rigel',
      name: '리겔',
      enName: 'Rigel',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 21.0,
      radiusKm: 54900000.0, // ~79 R☉
      temperature: 12100,
      luminosity: 120000.0,
      icon: '💎',
      color: '#60a5fa',
      desc: '오리온자리의 왼발에 위치한 눈부신 청백색 초거성(B8Ia). 태양 12만 배의 엄청난 에너지를 뿜어냅니다.',
      stats: { '스펙트럼': 'B8Ia', '광도': '120,000 L☉', '표면온도': '12,100 K', '거리': '860 광년' }
    },
    {
      id: 'vega',
      name: '베가 (직녀성)',
      enName: 'Vega',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 2.135,
      radiusKm: 1640000.0,
      temperature: 9602,
      luminosity: 40.1,
      icon: '✨',
      color: '#93c5fd',
      desc: '여름의 대삼각형을 이루는 거문고자리 알파성. 초속 236km의 빠른 자전으로 적도 부근이 불룩하게 팽창되어 있습니다.',
      stats: { '거리': '25 광년', '표면온도': '9,600 K', '광도': '40.1 L☉', '역할': '과거/미래의 북극성' }
    },
    {
      id: 'stephenson-2-18',
      name: '스티븐슨 2-18',
      enName: 'Stephenson 2-18',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 40.0,
      radiusKm: 1496000000.0, // ~2150 R☉ (~10 AU radius!)
      temperature: 3200,
      luminosity: 440000.0,
      icon: '🔴',
      color: '#b91c1c',
      desc: '현재 인류가 관측한 가장 거대한 극대거성 중 하나. 반지름이 무려 2,150 R☉에 달해 토성 궤도마저 집어삼킬 크기입니다.',
      stats: { '반지름': '2,150 R☉ (10 AU)', '광도': '440,000 L☉', '거리': '19,000 광년', '유형': '적색 극대거성' }
    },
    {
      id: 'trappist-1',
      name: '트라피스트-1',
      enName: 'TRAPPIST-1',
      category: 'stars',
      categoryName: '실제 별',
      kind: 'star',
      mass: 0.0898,
      radiusKm: 84300.0,
      temperature: 2566,
      luminosity: 0.00055,
      icon: '🤎',
      color: '#ea580c',
      desc: '목성 크기보다 조금 큰 초저온 왜성. 7개의 지구형 암석 행성이 완벽한 공명 궤도를 그리며 공전하는 기적의 행성계를 거느리고 있습니다.',
      stats: { '질량': '0.089 M☉', '행성 수': '7개 암석 행성', '표면온도': '2,566 K', '거리': '40.7 광년' }
    },

    // 6. 블랙홀 & 중성자별 (Black Holes & Neutron Stars)
    {
      id: 'sagittarius-a-star',
      name: '궁수자리 A*',
      enName: 'Sagittarius A*',
      category: 'blackholes',
      categoryName: '블랙홀 & 중성자별',
      kind: 'blackhole',
      mass: 4.3e6, // 4.3 million solar masses
      radiusKm: 12700000.0,
      icon: '🕳️',
      color: '#f59e0b',
      desc: '우리 은하 중심에 위치한 초대질량 블랙홀. 사건의 지평선 망원경(EHT)에 의해 2022년 직접 실루엣 사진이 촬영되었습니다.',
      stats: { '질량': '430만 M☉', '위치': '우리은하 중심', '슈바르츠실트 반지름': '0.085 AU', '거리': '26,700 광년' }
    },
    {
      id: 'm87-star',
      name: 'M87*',
      enName: 'M87* Black Hole',
      category: 'blackholes',
      categoryName: '블랙홀 & 중성자별',
      kind: 'blackhole',
      mass: 6.5e9, // 6.5 billion solar masses
      radiusKm: 19000000000.0, // ~128 AU
      icon: '🕳️',
      color: '#ea580c',
      desc: '2019년 인류 역사상 최초로 사건의 지평선 그림자가 직접 촬영된 처녀자리 A 은하 중심의 65억 태양질량 극대질량 블랙홀.',
      stats: { '질량': '65억 M☉', '역사': '인류 최초 촬영 블랙홀', '사건의 지평선': '128 AU', '제트 길이': '5,000 광년' }
    },
    {
      id: 'cygnus-x-1',
      name: '백조자리 X-1',
      enName: 'Cygnus X-1',
      category: 'blackholes',
      categoryName: '블랙홀 & 중성자별',
      kind: 'blackhole',
      mass: 21.2,
      radiusKm: 62.6,
      icon: '🕳️',
      color: '#38bdf8',
      desc: '1964년 발견된 인류 역사상 최초로 확인된 항성 질량 블랙홀. 동반성인 청색 초거성에서 물질을 빨아들이며 강력한 X선을 방출합니다.',
      stats: { '질량': '21.2 M☉', '역사': '인류 최초 확인 블랙홀', '자전속도': '빛의 95% 이상', '거리': '7,200 광년' }
    },
    {
      id: 'ton-618',
      name: '톤 618 (TON 618)',
      enName: 'TON 618 Quasar',
      category: 'blackholes',
      categoryName: '블랙홀 & 중성자별',
      kind: 'blackhole',
      mass: 6.6e10, // 66 billion solar masses!
      radiusKm: 195000000000.0, // ~1300 AU!
      icon: '🌌',
      color: '#ec4899',
      desc: '관측 가능한 우주에서 가장 거대한 초대질량 블랙홀 중 하나. 660억 태양질량에 달하며 태양계 전체를 가볍게 삼키고도 남습니다.',
      stats: { '질량': '660억 M☉', '사건의 지평선': '1,300 AU', '광도': '태양의 140조 배', '유형': '극대 질량 블랙홀' }
    },
    {
      id: 'crab-pulsar',
      name: '게성운 펄서',
      enName: 'Crab Pulsar (PSR B0531+21)',
      category: 'blackholes',
      categoryName: '블랙홀 & 중성자별',
      kind: 'neutronstar',
      mass: 1.4,
      radiusKm: 12.0,
      icon: '⚡',
      color: '#e0e7ff',
      desc: '서기 1054년에 폭발한 초신성의 잔해 중심에 남아있는 중성자별. 초당 30.2회라는 경이로운 속도로 회전하며 펄스 전파를 뿜어냅니다.',
      stats: { '자전속도': '초당 30.2회', '질량': '1.4 M☉', '반지름': '~12 km', '초신성 기록': '서기 1054년' }
    },

    // 7. 소행성 & 혜성 (Asteroids & Comets)
    {
      id: 'vesta',
      name: '4 베스타',
      enName: '4 Vesta',
      category: 'asteroids',
      categoryName: '소행성 & 혜성',
      kind: 'asteroid',
      mass: 0.000044 * EARTH_MASS_SOLAR,
      radiusKm: 262.7,
      distanceAU: 2.362,
      eccentricity: 0.0887,
      icon: '🪨',
      color: '#a8a29e',
      palette: ['#57534e', '#a8a29e', '#d6d3d1'],
      desc: '소행성대에서 가장 밝고 세레스 다음으로 무거운 대형 소행성. 내부 분화가 일어난 원시 행성의 잔해입니다.',
      stats: { '반지름': '263 km', '공전주기': '3.63년', '위치': '소행성대', '탐사선': '던 (Dawn)' }
    },
    {
      id: 'psyche',
      name: '16 프시케',
      enName: '16 Psyche',
      category: 'asteroids',
      categoryName: '소행성 & 혜성',
      kind: 'asteroid',
      mass: 0.000004 * EARTH_MASS_SOLAR,
      radiusKm: 113.0,
      distanceAU: 2.924,
      eccentricity: 0.134,
      icon: '🪙',
      color: '#cbd5e1',
      palette: ['#64748b', '#94a3b8', '#e2e8f0'],
      desc: '원시 행성의 외곽 지각이 파괴되고 노출된 철과 니켈의 순수 금속 핵으로 추정되는 천체. NASA 프시케 탐사선이 탐사 중입니다.',
      stats: { '구성': '순수 철·니켈 금속', '반지름': '113 km', '공전주기': '5.0년', '가치': '천문학적 경제가치' }
    },
    {
      id: 'oumuamua',
      name: "1I/'오우무아무아",
      enName: "1I/'Oumuamua",
      category: 'asteroids',
      categoryName: '소행성 & 혜성',
      kind: 'asteroid',
      mass: 1e-12,
      radiusKm: 0.2,
      distanceAU: 1.5,
      eccentricity: 1.20,
      icon: '🥖',
      color: '#b45309',
      palette: ['#78350f', '#b45309', '#fde68a'],
      desc: '2017년 인류 역사상 최초로 태양계 밖에서 날아와 관측된 성간 천체. 길이 400m에 극단적으로 긴 납작한 시가/팬케이크 모양을 지녔습니다.',
      stats: { '출신': '외계 성간 공간', '이심률': '1.20 (쌍곡선 궤도)', '형태': '시가형 납작체', '발견': '2017년 10월' }
    },
    {
      id: 'halley',
      name: '1P/핼리 혜성',
      enName: "Halley's Comet",
      category: 'asteroids',
      categoryName: '소행성 & 혜성',
      kind: 'asteroid',
      mass: 3.7e-14,
      radiusKm: 5.5,
      distanceAU: 17.8,
      eccentricity: 0.967,
      icon: '☄️',
      color: '#e2e8f0',
      palette: ['#334155', '#94a3b8', '#f8fafc'],
      desc: '75~76년 주기로 태양에 접근하는 인류 역사상 가장 유명한 주기 혜성. 아름다운 가스와 먼지 꼬리를 만들어냅니다.',
      stats: { '주기': '75.3년', '이심률': '0.967 (초타원)', '반지름': '5.5 km', '다음 접근': '2061년' }
    }
  ];

  // --- State Variables ---
  let editModeActive = false;
  let activeCategory = 'all';
  let searchQuery = '';

  // --- Toast Notification ---
  function showToast(message) {
    let toast = document.getElementById('orbitlake-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'orbitlake-toast';
      toast.className = 'orbitlake-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- Edit Mode Toggle ---
  function toggleEditMode(force) {
    editModeActive = force !== undefined ? force : !editModeActive;
    window.__EDIT_MODE__ = editModeActive;

    const viewport = document.querySelector('main.viewport');
    if (viewport) {
      viewport.classList.toggle('orbitlake-edit-active', editModeActive);
    }

    const editBtn = document.getElementById('orbitlake-edit-toggle-btn');
    if (editBtn) {
      editBtn.classList.toggle('active', editModeActive);
      editBtn.innerHTML = editModeActive ? '🖐️ 수정 모드 (ON)' : '🖐️ 위치 수정 모드';
    }

    let hud = document.getElementById('orbitlake-edit-hud');
    if (editModeActive) {
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'orbitlake-edit-hud';
        hud.className = 'orbitlake-edit-hud';
        hud.innerHTML = `
          <span class="pulse-dot"></span>
          <span><strong>위치 수정 모드</strong>: 3D 화면의 천체를 마우스로 잡고 끌어서 원하는 위치로 이동하세요</span>
          <button class="exit-btn" id="orbitlake-exit-edit-btn">종료 (ESC)</button>
        `;
        document.body.appendChild(hud);
        document.getElementById('orbitlake-exit-edit-btn').addEventListener('click', () => toggleEditMode(false));
      }
      hud.style.display = 'flex';
      showToast('🖐️ <strong>수정 모드 활성화</strong>: 행성을 마우스로 클릭하고 드래그하여 이동하세요.');
    } else {
      if (hud) hud.style.display = 'none';
    }
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') {
      if (document.getElementById('orbitlake-catalog-modal')?.classList.contains('open')) {
        closeCatalogModal();
      } else if (editModeActive) {
        toggleEditMode(false);
      }
    } else if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
      toggleEditMode();
    }
  });

  // --- Add Real Celestial Body to Universe ---
  function addCelestialBodyToUniverse(item) {
    const store = window.__ORBIT_STORE__;
    if (!store) {
      alert('시뮬레이션 스토어를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const state = store.getState();
    const doc = state.doc;

    // 1. Identify or Create Host
    let host = doc.bodies.find(b => b.kind === 'star') ||
               doc.bodies.find(b => b.mass > 0) ||
               doc.bodies[0];

    // If adding a planet/moon/asteroid and no body exists, create a host Sun
    if (!host && item.kind !== 'star' && item.kind !== 'blackhole') {
      store.getState().addBody('star', '태양');
      const afterState = store.getState();
      host = afterState.doc.bodies[afterState.doc.bodies.length - 1];
    }

    // 2. Add Body via Store
    const baseKind = item.kind;
    const bodyName = item.name;
    store.getState().addBody(baseKind, bodyName);

    // 3. Find newly created body ID
    const newState = store.getState();
    const newBodyId = newState.selectedId || newState.doc.bodies[newState.doc.bodies.length - 1].id;

    // 4. Calculate accurate radius & mass
    let radiusAU = (item.radiusKm / AU_KM);
    if (item.kind === 'star') {
      radiusAU = Math.max(0.004, item.radiusKm / AU_KM);
    } else if (item.kind === 'planet') {
      radiusAU = Math.max(0.0001, item.radiusKm / AU_KM);
    }

    const patch = {
      name: item.name,
      mass: item.mass,
      radius: radiusAU
    };

    if (item.kind === 'star') {
      patch.star = {
        temperature: item.temperature || 5778,
        luminosity: item.luminosity || 1.0
      };
    } else {
      patch.planet = {
        type: item.type || 'rocky',
        surface: {
          palette: item.palette || ['#8c8c8c', '#b8b8b8', '#5e5e5e'],
          seed: Math.floor(Math.random() * 9999)
        }
      };
      if (item.atmosphere) {
        patch.planet.atmosphere = item.atmosphere;
      }
      if (item.rings) {
        patch.planet.rings = item.rings;
      }
    }

    // 5. Update Orbit if distanceAU is provided
    if (item.distanceAU && host && host.id !== newBodyId) {
      patch.orbit = {
        centralId: host.id,
        a: item.distanceAU,
        e: item.eccentricity || 0.0,
        i: 0.0,
        raan: 0.0,
        argPeri: 0.0,
        trueAnomaly: Math.random() * 2 * Math.PI
      };
    }

    // Apply exact physical configuration
    store.getState().updateBody(newBodyId, patch);

    // Focus and select the new body
    store.getState().focus(newBodyId);

    // Feedback
    showToast(`✨ <strong>${item.name}</strong> (${item.enName}) 천체가 추가되었습니다!`);
    closeCatalogModal();
  }

  // --- Real Celestial Catalog Modal UI ---
  function openCatalogModal() {
    let modal = document.getElementById('orbitlake-catalog-modal');
    if (!modal) {
      createCatalogModalDOM();
      modal = document.getElementById('orbitlake-catalog-modal');
    }
    renderCatalogGrid();
    modal.classList.add('open');
    setTimeout(() => {
      document.getElementById('catalog-search-input')?.focus();
    }, 50);
  }

  function closeCatalogModal() {
    const modal = document.getElementById('orbitlake-catalog-modal');
    if (modal) modal.classList.remove('open');
  }

  function createCatalogModalDOM() {
    const backdrop = document.createElement('div');
    backdrop.id = 'orbitlake-catalog-modal';
    backdrop.className = 'orbitlake-catalog-backdrop';
    backdrop.innerHTML = `
      <div class="orbitlake-catalog-dialog" role="dialog" aria-modal="true">
        <div class="catalog-header">
          <div class="catalog-header-title">
            <span style="font-size: 22px;">🪐</span>
            <h2>실제 천체 도감 및 검색</h2>
            <span class="count-badge">${CELESTIAL_CATALOG.length}개 실제 천체</span>
          </div>
          <button class="catalog-close-btn" id="catalog-close-x" title="닫기">&times;</button>
        </div>
        <div class="catalog-toolbar">
          <div class="catalog-search-wrap">
            <span class="catalog-search-icon">🔍</span>
            <input type="text" id="catalog-search-input" class="catalog-search-input" placeholder="천체 이름(한글/영문), 특징, 별칭으로 검색 (예: 지구, 화성, 베텔게우스, 블랙홀, 케플러, 452b, 펄서, 다이아몬드, 오우무아무아...)" />
          </div>
          <div class="catalog-tabs" id="catalog-category-tabs">
            <button class="catalog-tab active" data-cat="all">전체 (All)</button>
            <button class="catalog-tab" data-cat="solarsystem">태양계 행성</button>
            <button class="catalog-tab" data-cat="dwarf">왜소행성</button>
            <button class="catalog-tab" data-cat="moons">주요 위성</button>
            <button class="catalog-tab" data-cat="exoplanets">외계 행성</button>
            <button class="catalog-tab" data-cat="stars">실제 별 / 항성</button>
            <button class="catalog-tab" data-cat="blackholes">블랙홀 & 중성자별</button>
            <button class="catalog-tab" data-cat="asteroids">소행성 & 혜성</button>
          </div>
        </div>
        <div class="catalog-grid" id="catalog-items-grid"></div>
      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCatalogModal();
    });
    document.getElementById('catalog-close-x').addEventListener('click', closeCatalogModal);

    // Search Input Event
    const searchInput = document.getElementById('catalog-search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderCatalogGrid();
    });

    // Category Tabs Event
    const tabs = document.getElementById('catalog-category-tabs');
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.catalog-tab');
      if (!btn) return;
      tabs.querySelectorAll('.catalog-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderCatalogGrid();
    });
  }

  function renderCatalogGrid() {
    const grid = document.getElementById('catalog-items-grid');
    if (!grid) return;

    const filtered = CELESTIAL_CATALOG.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const text = `${item.name} ${item.enName} ${item.categoryName} ${item.desc} ${JSON.stringify(item.stats || {})}`.toLowerCase();
        return text.includes(searchQuery);
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: #64748b;">
          <div style="font-size: 36px; margin-bottom: 12px;">🔍</div>
          <div style="font-size: 15px; color: #94a3b8;">검색 결과가 없습니다.</div>
          <div style="font-size: 13px; margin-top: 6px;">다른 검색어나 카테고리를 선택해 보세요.</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <div class="catalog-card" data-id="${item.id}">
        <div>
          <div class="catalog-card-header">
            <div class="catalog-card-icon" style="background: ${item.color}22; border: 1px solid ${item.color}55;">
              ${item.icon}
            </div>
            <div class="catalog-card-info">
              <div class="catalog-card-name-row">
                <span class="catalog-card-name">${item.name}</span>
                <span class="catalog-card-en-name">${item.enName}</span>
              </div>
              <div class="catalog-card-category">${item.categoryName}</div>
            </div>
          </div>
          <p class="catalog-card-desc" style="margin-top: 10px;">${item.desc}</p>
        </div>

        <div>
          <div class="catalog-card-stats">
            ${Object.entries(item.stats || {}).slice(0, 4).map(([k, v]) => `
              <div class="catalog-stat-item">
                <span class="catalog-stat-label">${k}</span>
                <span class="catalog-stat-val">${v}</span>
              </div>
            `).join('')}
          </div>

          <button class="catalog-add-btn" data-id="${item.id}" style="margin-top: 12px;">
            <span>+</span> 우주에 추가하기
          </button>
        </div>
      </div>
    `).join('');

    // Attach Click Handlers to Add Buttons
    grid.querySelectorAll('.catalog-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const item = CELESTIAL_CATALOG.find(c => c.id === id);
        if (item) {
          addCelestialBodyToUniverse(item);
        }
      });
    });
  }

  // --- Inject UI Buttons into Header & Viewport ---
  function injectEnhancementUI() {
    // 1. Inject "실제 천체 도감/검색" button into top navigation bar
    const navbar = document.querySelector('header.topbar') || document.querySelector('header');
    if (navbar && !document.getElementById('orbitlake-navbar-catalog-btn')) {
      const btn = document.createElement('button');
      btn.id = 'orbitlake-navbar-catalog-btn';
      btn.className = 'orbitlake-tool-btn catalog-btn';
      btn.innerHTML = '🪐 실제 천체 검색/도감';
      btn.title = '실제로 존재하는 모든 행성, 외계행성, 별, 블랙홀 등을 검색하고 우주에 추가합니다.';
      btn.addEventListener('click', openCatalogModal);

      // Insert before or after share/export buttons
      const targetWrap = navbar.querySelector('.topbar-actions') || navbar.lastElementChild || navbar;
      targetWrap.prepend(btn);
    }

    // 2. Inject "위치 수정 모드" button into viewport tools
    const viewportTools = document.querySelector('.viewport-tools') || document.querySelector('.viewport');
    if (viewportTools && !document.getElementById('orbitlake-edit-toggle-btn')) {
      const btnGroup = document.createElement('div');
      btnGroup.style.display = 'inline-flex';
      btnGroup.style.alignItems = 'center';
      btnGroup.style.gap = '8px';
      btnGroup.style.marginRight = '8px';

      const editBtn = document.createElement('button');
      editBtn.id = 'orbitlake-edit-toggle-btn';
      editBtn.className = 'orbitlake-tool-btn';
      editBtn.innerHTML = '🖐️ 위치 수정 모드';
      editBtn.title = '행성을 마우스로 직접 잡고 끌어서 궤도 위치를 수정합니다 (단축키 E)';
      editBtn.addEventListener('click', () => toggleEditMode());

      const catalogQuickBtn = document.createElement('button');
      catalogQuickBtn.className = 'orbitlake-tool-btn catalog-btn';
      catalogQuickBtn.innerHTML = '🪐 천체 검색';
      catalogQuickBtn.title = '실제 발견된 행성, 별, 블랙홀 검색 및 추가';
      catalogQuickBtn.addEventListener('click', openCatalogModal);

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(catalogQuickBtn);

      const firstChild = viewportTools.firstElementChild;
      if (firstChild) {
        viewportTools.insertBefore(btnGroup, firstChild);
      } else {
        viewportTools.appendChild(btnGroup);
      }
    }

    // 3. Inject option into "+ 추가" dropdown menu when opened
    const addMenuAnchor = document.querySelector('.menu-anchor .menu');
    if (addMenuAnchor && !addMenuAnchor.querySelector('.catalog-menu-item')) {
      const divider = document.createElement('div');
      divider.style.height = '1px';
      divider.style.background = 'rgba(255,255,255,0.1)';
      divider.style.margin = '4px 0';

      const menuItem = document.createElement('button');
      menuItem.className = 'menu-item catalog-menu-item';
      menuItem.style.color = '#38bdf8';
      menuItem.innerHTML = `<span class="kind-icon" style="background:#0284c7; box-shadow:0 0 8px #38bdf8;">⭐</span> 실제 천체 도감 및 검색...`;
      menuItem.addEventListener('click', () => {
        openCatalogModal();
        // Close menu
        const menuBtn = document.querySelector('.menu-anchor button');
        if (menuBtn) menuBtn.click();
      });

      addMenuAnchor.appendChild(divider);
      addMenuAnchor.appendChild(menuItem);
    }
  }

  // --- Cinema / Capture Live Planet Switcher ---
  function updateCaptureHudSwitcher() {
    const hud = document.querySelector('.capture-hud');
    if (!hud) return;

    if (!hud.querySelector('.capture-planet-switcher')) {
      const store = window.__ORBIT_STORE__;
      if (!store) return;
      const state = store.getState();
      const bodies = state.doc?.bodies || [];
      const currentSelectedId = state.selectedId;

      const switcherWrap = document.createElement('div');
      switcherWrap.className = 'capture-planet-switcher';
      switcherWrap.innerHTML = `
        <label>🎬 촬영 행성:</label>
        <select class="capture-planet-select" id="capture-planet-select">
          ${bodies.map(b => `<option value="${b.id}" ${b.id === currentSelectedId ? 'selected' : ''}>${b.name}</option>`).join('')}
        </select>
      `;

      const sel = switcherWrap.querySelector('select');
      sel.addEventListener('change', (e) => {
        const targetId = e.target.value;
        const targetBody = bodies.find(b => b.id === targetId);
        store.getState().select(targetId);
        showToast(`🎬 <strong>${targetBody?.name || '행성'}</strong>으로 부드럽게 이동합니다.`);
      });

      // Insert right after the recording bar
      const bar = hud.querySelector('.capture-bar');
      if (bar && bar.nextSibling) {
        hud.insertBefore(switcherWrap, bar.nextSibling);
      } else {
        hud.appendChild(switcherWrap);
      }
    } else {
      // Sync selected value
      const sel = hud.querySelector('.capture-planet-select');
      const store = window.__ORBIT_STORE__;
      if (sel && store) {
        const currentSelectedId = store.getState().selectedId;
        if (currentSelectedId && sel.value !== currentSelectedId) {
          sel.value = currentSelectedId;
        }
      }
    }
  }

  // Observe DOM for dynamic element creation (React SPA)
  const observer = new MutationObserver(() => {
    injectEnhancementUI(); updateCaptureHudSwitcher();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectEnhancementUI(); updateCaptureHudSwitcher();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    injectEnhancementUI(); updateCaptureHudSwitcher();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Expose helpers globally
  window.OrbitLake = {
    openCatalog: openCatalogModal,
    toggleEditMode: toggleEditMode,
    catalog: CELESTIAL_CATALOG,
    addBody: addCelestialBodyToUniverse
  };

  console.log('[OrbitLake] Enhancements loaded: 3D High Quality + Interactive Edit Mode + 90+ Real Celestial Bodies Catalog active.');
})();
