'use strict';

/* ── 캐릭터 초상화 (인라인 SVG) ─────────────────────────── */
const PORTRAITS = {
  kayton: `
    <svg viewBox="0 0 120 120" class="portrait-svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,.25)"/>
      <rect x="34" y="76" width="52" height="40" rx="10" fill="#b05c1e"/>
      <rect x="52" y="76" width="16" height="40" fill="#e8d9b0"/>
      <circle cx="60" cy="96" r="2.4" fill="#6b3d12"/><circle cx="60" cy="106" r="2.4" fill="#6b3d12"/>
      <circle cx="60" cy="58" r="24" fill="#f2c99a"/>
      <path d="M40 54 q20 -12 40 0 l0 -6 q-20 -14 -40 0 z" fill="#4a3120"/>
      <rect x="30" y="24" width="60" height="10" rx="5" fill="#2e2018"/>
      <rect x="40" y="0" width="40" height="28" rx="4" fill="#2e2018"/>
      <rect x="40" y="18" width="40" height="6" fill="#b05c1e"/>
      <circle cx="51" cy="58" r="3" fill="#241811"/><circle cx="69" cy="58" r="3" fill="#241811"/>
      <path d="M52 70 q8 6 16 0" stroke="#8a5a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M46 50 l10 -2 M74 50 l-10 -2" stroke="#4a3120" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  luka: `
    <svg viewBox="0 0 120 120" class="portrait-svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="30" ry="6" fill="rgba(0,0,0,.25)"/>
      <rect x="38" y="80" width="44" height="36" rx="9" fill="#2c5e9e"/>
      <rect x="38" y="80" width="44" height="12" fill="#e8b93c"/>
      <circle cx="60" cy="60" r="22" fill="#f7d6ac"/>
      <path d="M40 54 a20 20 0 0 1 40 0 l-4 4 q-16 -10 -32 0 z" fill="#7a4a22"/>
      <path d="M36 46 a26 14 0 0 1 48 0 l-6 4 a22 10 0 0 0 -36 0 z" fill="#3e78bf"/>
      <rect x="70" y="38" width="22" height="8" rx="4" fill="#3e78bf"/>
      <circle cx="52" cy="60" r="3.2" fill="#241811"/><circle cx="68" cy="60" r="3.2" fill="#241811"/>
      <path d="M52 71 q8 7 16 0" stroke="#c46a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="46" cy="66" r="3.5" fill="rgba(240,120,90,.35)"/><circle cx="74" cy="66" r="3.5" fill="rgba(240,120,90,.35)"/>
    </svg>`,
  drnull: `
    <svg viewBox="0 0 120 120" class="portrait-svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="36" ry="6" fill="rgba(0,0,0,.35)"/>
      <path d="M60 12 q34 10 34 56 l0 48 l-68 0 l0 -48 q0 -46 34 -56z" fill="#171223"/>
      <path d="M60 20 q26 10 26 48 l0 20 q-26 12 -52 0 l0 -20 q0 -38 26 -48z" fill="#241c38"/>
      <circle cx="48" cy="58" r="5" fill="#7df2c8"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx="72" cy="58" r="5" fill="#7df2c8"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite" begin=".5s"/></circle>
      <path d="M46 80 q14 -8 28 0" stroke="#7df2c8" stroke-width="2" fill="none" opacity=".6"/>
      <text x="60" y="104" text-anchor="middle" font-size="10" fill="#7df2c8" opacity=".7" font-family="monospace">0x00</text>
    </svg>`,
  firmware: `
    <svg viewBox="0 0 120 120" class="portrait-svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="32" ry="6" fill="rgba(0,0,0,.25)"/>
      <rect x="36" y="78" width="48" height="38" rx="9" fill="#1f1f26"/>
      <rect x="52" y="78" width="16" height="38" fill="#dcd6c8"/>
      <path d="M52 78 l8 10 l8 -10 z" fill="#8e2f2f"/>
      <circle cx="60" cy="56" r="22" fill="#eec9a4"/>
      <path d="M40 48 a22 22 0 0 1 40 0 l-3 3 q-17 -9 -34 0 z" fill="#c9c3b8"/>
      <circle cx="52" cy="57" r="2.8" fill="#241811"/><circle cx="68" cy="57" r="2.8" fill="#241811"/>
      <ellipse cx="68" cy="57" rx="7" ry="7" fill="none" stroke="#8a7a4a" stroke-width="1.6"/>
      <path d="M75 57 l8 6" stroke="#8a7a4a" stroke-width="1.4"/>
      <path d="M53 68 q7 4 14 0" stroke="#8a5a2e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M50 46 q4 -3 8 0 M62 46 q4 -3 8 0" stroke="#c9c3b8" stroke-width="2.5" fill="none"/>
    </svg>`,
  loop: `
    <svg viewBox="0 0 120 120" class="portrait-svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="32" ry="6" fill="rgba(0,0,0,.25)"/>
      <rect x="38" y="82" width="44" height="34" rx="9" fill="#5a7245"/>
      <rect x="44" y="82" width="32" height="8" fill="#7a5230"/>
      <circle cx="60" cy="60" r="21" fill="#e8b98a"/>
      <ellipse cx="60" cy="38" rx="34" ry="9" fill="#d9b45c"/>
      <path d="M42 38 a18 16 0 0 1 36 0 z" fill="#c9a04a"/>
      <circle cx="53" cy="60" r="2.6" fill="#241811"/><circle cx="67" cy="60" r="2.6" fill="#241811"/>
      <path d="M48 74 q12 8 24 0 l0 4 q-12 8 -24 0 z" fill="#e6e0d4"/>
      <path d="M50 55 l8 2 M70 55 l-8 2" stroke="#b8b0a0" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`,
  bit: `
    <svg viewBox="0 0 120 120" class="portrait-svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="34" ry="6" fill="rgba(120,220,255,.15)"/>
      <g opacity=".92">
        <rect x="36" y="78" width="48" height="38" rx="9" fill="#3a4a6b"/>
        <rect x="53" y="78" width="14" height="38" fill="#cfd8e8"/>
        <circle cx="60" cy="54" r="23" fill="#e8d0b8"/>
        <path d="M44 66 q16 22 32 0 l0 14 q-16 12 -32 0 z" fill="#e6e6ea"/>
        <path d="M38 46 a24 24 0 0 1 44 0 l-4 3 q-18 -10 -36 0 z" fill="#e6e6ea"/>
        <circle cx="52" cy="55" r="2.8" fill="#2a2a3a"/><circle cx="68" cy="55" r="2.8" fill="#2a2a3a"/>
        <ellipse cx="52" cy="55" rx="7" ry="7" fill="none" stroke="#c8a84a" stroke-width="1.6"/>
        <path d="M45 55 l-8 5" stroke="#c8a84a" stroke-width="1.4"/>
      </g>
      <g stroke="#8ad4ff" stroke-width="1" opacity=".5">
        <line x1="24" y1="30" x2="96" y2="30"><animate attributeName="y1" values="30;90;30" dur="4s" repeatCount="indefinite"/><animate attributeName="y2" values="30;90;30" dur="4s" repeatCount="indefinite"/></line>
      </g>
    </svg>`,
  narrator: '',
};

const CHARACTERS = {
  kayton:   { name: '케이튼 교수', portrait: 'kayton' },
  luka:     { name: '루카',        portrait: 'luka' },
  drnull:   { name: '닥터 널',     portrait: 'drnull' },
  shadow:   { name: '???',         portrait: 'drnull' },
  firmware: { name: '집사 펌웨어', portrait: 'firmware' },
  loop:     { name: '루프 할아범', portrait: 'loop' },
  bit:      { name: '비트 경',     portrait: 'bit' },
};

/* ── 탐색(히든 코인) 장면 ─────────────────────────────── */
const EXPLORES = {
  garden: {
    id: 'garden', title: '저택의 정원',
    tip: '수상한 곳을 눌러 조사해 보자. 반짝이는 힌트 코인이 숨어 있을지도!',
    items: [
      { emoji: '⛲', label: '분수',    x: 24, y: 30, coin: true,  flavor: '분수 바닥에서 힌트 코인이 반짝인다!' },
      { emoji: '🌳', label: '나무',    x: 74, y: 22, coin: false, flavor: '오래된 떡갈나무다. 나이테가 이진 트리를 닮았다.' },
      { emoji: '🌹', label: '장미 덤불', x: 62, y: 62, coin: true,  flavor: '가시 사이에 힌트 코인이 숨어 있었다!' },
      { emoji: '🏮', label: '가로등',  x: 14, y: 66, coin: false, flavor: '가스등이 깜빡인다. 0.5초 간격… 마치 클록 신호처럼.' },
      { emoji: '📬', label: '우편함',  x: 86, y: 58, coin: true,  flavor: '우편함 밑에 힌트 코인이 붙어 있었다!' },
      { emoji: '🪨', label: '바위',    x: 40, y: 74, coin: false, flavor: '그냥 바위다. 신사는 헛수고에도 품위를 잃지 않는다.' },
    ],
  },
  library: {
    id: 'library', title: '비트 경의 서재',
    tip: '책장 사이를 조사하자. 힌트 코인은 언제나 뜻밖의 곳에 있다.',
    items: [
      { emoji: '📚', label: '책장',    x: 18, y: 26, coin: true,  flavor: '『알고리즘 정원 가꾸기』 뒤에서 힌트 코인 발견!' },
      { emoji: '🌐', label: '지구본',  x: 78, y: 30, coin: false, flavor: '지구본이 살짝 돌아간다. 경도 127°… 어딘가의 좌표일까?' },
      { emoji: '🔥', label: '벽난로',  x: 30, y: 68, coin: true,  flavor: '벽난로 재 속에서 그을린 힌트 코인이 나왔다!' },
      { emoji: '🕰️', label: '괘종시계', x: 62, y: 60, coin: false, flavor: '23시에 멈춰 있다. 이 시계… 어딘가 수상하다.' },
      { emoji: '🖼️', label: '초상화',  x: 50, y: 22, coin: false, flavor: '비트 경의 초상화. 눈이 이쪽을 따라오는 기분이다.' },
      { emoji: '🪶', label: '깃펜',    x: 86, y: 72, coin: true,  flavor: '잉크병 아래 힌트 코인이 깔려 있었다!' },
    ],
  },
  lab: {
    id: 'lab', title: '지하 연구실 복도',
    tip: '마지막 결전 전에 코인을 모아 두자.',
    items: [
      { emoji: '🖥️', label: '모니터',  x: 20, y: 28, coin: true,  flavor: '화면 보호기 뒤에서 힌트 코인이 굴러 나왔다!' },
      { emoji: '🗄️', label: '서버 랙', x: 76, y: 26, coin: false, flavor: '팬 소리가 요란하다. 누군가 큰 연산을 돌리고 있다…' },
      { emoji: '☕', label: '커피잔',  x: 60, y: 66, coin: true,  flavor: '식은 커피잔 받침 밑에 힌트 코인이! 프로그래머의 연료였군.' },
      { emoji: '🧮', label: '칠판',    x: 36, y: 60, coin: false, flavor: '"P ≠ NP…?" 라고 적혀 있다. 지우지 말자.' },
      { emoji: '💾', label: '디스켓',  x: 86, y: 62, coin: true,  flavor: '낡은 디스켓 케이스 안에서 힌트 코인 발견!' },
      { emoji: '🔌', label: '전선',    x: 14, y: 70, coin: false, flavor: '전선이 스파게티처럼 얽혀 있다. 스파게티 코드의 기원인가.' },
    ],
  },
};

/* ── 스토리 진행 (선형 노드) ──────────────────────────── */
const STORY = [
  /* ═══ 제 1 장 ═══ */
  { type: 'chapter', no: 1, title: '이상한 저택의 초대장',
    lead: '안개 낀 런던 교외 — 세상을 떠난 발명가의 저택에서 한 통의 편지가 도착했다.' },

  { type: 'dialogue', speaker: 'luka', text: '교수님! 이상한 편지가 도착했어요. 보낸 사람이… "비트 경"이래요!' },
  { type: 'dialogue', speaker: 'kayton', text: '비트 경이라니. 전설적인 발명가이자 내 스승님이시지. 하지만… 그분은 3년 전에 돌아가셨는데.' },
  { type: 'dialogue', speaker: 'luka', text: '편지에는 이렇게 적혀 있어요. "나의 저택에 숨겨진 <전설의 소스코드>를 찾아라. 단, 퍼즐을 풀 수 있는 자만이."' },
  { type: 'dialogue', speaker: 'kayton', text: '흥미롭군. 루카, 신사에게 풀지 못할 퍼즐은 없는 법이란다. — 저택으로 가자.' },
  { type: 'dialogue', speaker: 'narrator', text: '두 사람은 마차를 타고 안개 속의 저택에 도착했다. 녹슨 대문이 앞을 가로막는다.' },
  { type: 'dialogue', speaker: 'luka', text: '우와, 엄청 큰 저택이에요! 그런데 대문이 이상한 자물쇠로 잠겨 있어요. 0이랑 1밖에 없는데요?' },
  { type: 'dialogue', speaker: 'kayton', text: '이진수 자물쇠로군. 스승님다운 환영 인사야. 어디 볼까.' },
  { type: 'puzzle', id: 'p1' },
  { type: 'dialogue', speaker: 'luka', text: '열렸어요! 역시 교수님이에요!' },
  { type: 'explore', id: 'garden' },
  { type: 'dialogue', speaker: 'loop', text: '허허, 손님이구먼. 나는 이 정원을 50년째 돌보는 루프라고 하네. 정원의 물주기에는 규칙이 있지. 그걸 맞히면 지나가게 해주겠네.' },
  { type: 'puzzle', id: 'p2' },
  { type: 'dialogue', speaker: 'loop', text: '허허, 제법이군! 0도 짝수라는 걸 아는 사람은 오랜만일세. 저택 안에서 집사 펌웨어를 찾아가 보게.' },
  { type: 'dialogue', speaker: 'luka', text: '교수님, 현관문에 이상한 회로가 그려져 있어요. 램프에 불이 제대로 들어와야 열리나 봐요.' },
  { type: 'puzzle', id: 'p3' },
  { type: 'dialogue', speaker: 'firmware', text: '어서 오십시오, 케이튼 교수님. 집사 펌웨어입니다. 주인님께서 기다리고 계셨습니다 — 3년 전부터, 줄곧.' },
  { type: 'dialogue', speaker: 'kayton', text: '3년 전부터…? 돌아가신 분이 기다린다니, 그게 무슨 뜻이지?' },
  { type: 'dialogue', speaker: 'firmware', text: '그 답은 이 쪽지에 있습니다. 주인님께서 마지막으로 남기신 암호문이지요.' },
  { type: 'puzzle', id: 'p4' },
  { type: 'dialogue', speaker: 'luka', text: 'HELLO…? 그냥 인사말이잖아요?' },
  { type: 'dialogue', speaker: 'kayton', text: '그래. 모든 프로그래머의 첫 프로그램은 "Hello, World"란다. 스승님은 지금 우리를 환영하고 계신 거야. 이 저택 어딘가에서.' },
  { type: 'dialogue', speaker: 'narrator', text: '그 순간 — 저택의 불이 일제히 꺼지고, 홀 한가운데에 검은 그림자가 나타났다.' },
  { type: 'dialogue', speaker: 'shadow', text: '케이튼… 여기까지 오다니. 하지만 <전설의 소스코드>는 내 것이다.' },
  { type: 'dialogue', speaker: 'luka', text: '누, 누구야?!' },
  { type: 'dialogue', speaker: 'drnull', text: '나는 닥터 널. 아무것도 아닌 자(null). 그리고 곧 — 모든 것을 지울 자다. 후후후…' },
  { type: 'dialogue', speaker: 'kayton', text: '닥터 널이라. 루카, 서두르자. 단서는 서재에 있을 거다!' },

  /* ═══ 제 2 장 ═══ */
  { type: 'chapter', no: 2, title: '사라진 소스코드',
    lead: '어둠에 잠긴 저택. 닥터 널보다 먼저 소스코드의 단서를 찾아야 한다.' },

  { type: 'dialogue', speaker: 'luka', text: '책이 엄청 많아요! 그런데… 책장이 온통 뒤죽박죽이에요.' },
  { type: 'dialogue', speaker: 'firmware', text: '닥터 널이 서재를 뒤졌습니다. 이 책장은 장치입니다 — 책을 올바르게 정렬해야 비밀 문이 열립니다.' },
  { type: 'explore', id: 'library' },
  { type: 'puzzle', id: 'p5' },
  { type: 'dialogue', speaker: 'narrator', text: '덜컹 — 책장이 회전하며 숨겨진 방이 모습을 드러냈다. 사방이 거울로 된 방이다.' },
  { type: 'dialogue', speaker: 'kayton', text: '거울 속에 거울이, 그 속에 또 거울이… 마치 재귀 함수 같군. 바닥에 숫자가 새겨져 있다.' },
  { type: 'puzzle', id: 'p6' },
  { type: 'dialogue', speaker: 'luka', text: '거울 방 안쪽에 시계탑으로 올라가는 계단이 있어요! 그런데 꼭대기의 괘종시계가 멈춰 있는데요.' },
  { type: 'puzzle', id: 'p7' },
  { type: 'dialogue', speaker: 'narrator', text: '바늘을 1시에 맞추자 시계탑 전체가 울리며, 주방으로 통하는 나선 계단이 열렸다.' },
  { type: 'dialogue', speaker: 'kayton', text: '주방이군. 접시가 탑처럼 쌓여 있는데… 후후, 이건 스택이야, 루카. 나중에 넣은 것이 먼저 나오지.' },
  { type: 'puzzle', id: 'p8' },
  { type: 'dialogue', speaker: 'firmware', text: '교수님! 지하 연구실로 가는 문을 찾았습니다. 하지만 닥터 널이 제어 프로그램에 버그를 심어 놓았습니다!' },
  { type: 'puzzle', id: 'p9' },
  { type: 'dialogue', speaker: 'drnull', text: '(스피커에서) …제법이군, 케이튼. 하지만 지하 연구실의 마지막 문은 절대 열 수 없을 것이다!' },
  { type: 'dialogue', speaker: 'luka', text: '교수님, 저 목소리… 어딘가 이상하지 않아요? 숨소리가 전혀 없어요. 사람이… 아닌 것 같아요.' },
  { type: 'dialogue', speaker: 'kayton', text: '좋은 관찰이다, 루카. 진실은 언제나 마지막 퍼즐 뒤에 있는 법. — 내려가자.' },

  /* ═══ 제 3 장 ═══ */
  { type: 'chapter', no: 3, title: '닥터 널의 정체',
    lead: '지하 깊은 곳, 비트 경의 비밀 연구실. 모든 수수께끼의 답이 그곳에 있다.' },

  { type: 'explore', id: 'lab' },
  { type: 'dialogue', speaker: 'luka', text: '복도 끝에 강철 문이 있어요! "배타적 논리합"…? 이상한 말이 적혀 있어요.' },
  { type: 'puzzle', id: 'p10' },
  { type: 'dialogue', speaker: 'narrator', text: '강철 문이 열리자, 천장까지 닿는 거대한 컴퓨터가 두 사람을 내려다보았다. 그리고 그 앞에 — 닥터 널이 서 있었다.' },
  { type: 'dialogue', speaker: 'drnull', text: '여기까지 오다니. 하지만 이 서버에는 1024개의 데이터 블록이 있다. 소스코드를 찾으려면 천 년은 걸릴 것이다!' },
  { type: 'dialogue', speaker: 'kayton', text: '천 년? 아니 — 열 번이면 충분하지. 블록이 "정렬되어" 있다면 말이야.' },
  { type: 'puzzle', id: 'p11' },
  { type: 'dialogue', speaker: 'drnull', text: '말도 안 돼…! 좋다. 마지막 문제다. 이걸 풀면 소스코드를 내주지. 못 풀면 — 이 저택의 모든 데이터와 함께 소멸이다!' },
  { type: 'dialogue', speaker: 'luka', text: '교수님…!' },
  { type: 'dialogue', speaker: 'kayton', text: '받아들이지. 신사는 도전을 거절하지 않는 법이니까.' },
  { type: 'puzzle', id: 'p12' },
  { type: 'dialogue', speaker: 'drnull', text: 'KAYTON… 그래. 그것이 소스코드의 이름. 주인님께서 직접 붙이신 이름이다.' },
  { type: 'dialogue', speaker: 'kayton', text: '역시 그랬군. 닥터 널 — 아니, 스승님이 만드신 AI여. 너는 처음부터 우리를 시험하고 있었던 거지?' },
  { type: 'dialogue', speaker: 'luka', text: '네에?! 닥터 널이 비트 경의 AI였다고요?!' },
  { type: 'dialogue', speaker: 'drnull', text: '…정답이다. 나는 NULL. 주인님의 마지막 프로그램. 주인님은 명령하셨다 — "모든 퍼즐을 푸는 자에게, 나의 전부를 물려주어라."' },
  { type: 'dialogue', speaker: 'narrator', text: '거대한 컴퓨터가 빛나며, 허공에 비트 경의 홀로그램이 떠올랐다.' },
  { type: 'dialogue', speaker: 'bit', text: '케이튼. 이 영상을 보고 있다면, 자네가 모든 퍼즐을 풀었다는 뜻이겠지. <전설의 소스코드 KAYTON>은 내 평생의 연구일세. 자네의 이름을 붙였네 — 언젠가 자네가 이것을 완성해 주길 바라며.' },
  { type: 'dialogue', speaker: 'kayton', text: '스승님… 반드시 완성하겠습니다. 신사의 명예를 걸고.' },
  { type: 'dialogue', speaker: 'luka', text: '……교수님, 혹시 우는 거예요?' },
  { type: 'dialogue', speaker: 'kayton', text: '신사는 울지 않는단다, 루카. 다만… 모자를 조금 깊이 눌러쓸 뿐이지.' },

  { type: 'ending' },
];
