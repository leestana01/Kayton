'use strict';

/* ═══════════════════════════════════════════════════════
   케이튼 교수와 사라진 소스코드 — 게임 엔진
   ═══════════════════════════════════════════════════════ */

const SAVE_KEY = 'kayton_save_v1';
const app = document.getElementById('app');

const state = {
  nodeIndex: 0,
  picarats: 0,
  coins: 10,
  solved: {},      // { p1: { earned, wrongs } }
  hintsOpen: {},   // { p1: 2 }  — 열어본 힌트 개수
  foundCoins: {},  // { garden: [0, 2] } — 찾은 코인 인덱스
  sound: true,
  started: false,
};

/* ── 저장 / 불러오기 ─────────────────────────────────── */
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* 사생활 보호 모드 등 */ }
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (typeof data.nodeIndex !== 'number') return false;
    Object.assign(state, data);
    return state.started === true;
  } catch (e) { return false; }
}
function resetState() {
  state.nodeIndex = 0; state.picarats = 0; state.coins = 10;
  state.solved = {}; state.hintsOpen = {}; state.foundCoins = {};
  state.started = true;
  save();
}

/* ── 효과음 (Web Audio) ──────────────────────────────── */
let audioCtx = null;
function tone(freq, dur = 0.09, type = 'triangle', gain = 0.06, delay = 0) {
  if (!state.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(t); osc.stop(t + dur + 0.02);
  } catch (e) { /* 오디오 미지원 */ }
}
const sfx = {
  tap:     () => tone(660, 0.05, 'sine', 0.04),
  coin:    () => { tone(880, 0.08, 'square', 0.04); tone(1320, 0.12, 'square', 0.04, 0.08); },
  correct: () => { tone(523, 0.1, 'triangle', 0.06); tone(659, 0.1, 'triangle', 0.06, 0.1); tone(784, 0.22, 'triangle', 0.06, 0.2); },
  wrong:   () => { tone(220, 0.16, 'sawtooth', 0.05); tone(185, 0.24, 'sawtooth', 0.05, 0.14); },
  fanfare: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.06, i * 0.13)); },
};

/* ── 유틸 ────────────────────────────────────────────── */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function currentPuzzleValue(p) {
  const wrongs = (state.solved[p.id] && state.solved[p.id].wrongs) || pendingWrongs[p.id] || 0;
  return Math.max(Math.round(p.picarats * (1 - 0.1 * wrongs)), Math.ceil(p.picarats * 0.5));
}
const pendingWrongs = {}; // 아직 못 푼 퍼즐의 오답 횟수 (세션 내)

function normalizeAnswer(s) {
  return String(s).trim().replace(/\s+/g, '').toUpperCase();
}
function isCorrect(puzzle, value) {
  const a = normalizeAnswer(puzzle.answer);
  const v = normalizeAnswer(value);
  if (/^\d+$/.test(a) && /^\d+$/.test(v)) return Number(a) === Number(v);
  return a === v;
}

/* ── HUD ─────────────────────────────────────────────── */
function hudHTML(label) {
  return `
  <header class="hud">
    <button class="hud-menu" id="btn-menu" aria-label="메뉴">☰</button>
    <span class="hud-label">${esc(label || '')}</span>
    <span class="hud-stats">
      <span class="stat picarat" title="피카랫"><i>✦</i>${state.picarats}</span>
      <span class="stat coin" title="힌트 코인"><i>◉</i>${state.coins}</span>
    </span>
  </header>`;
}
function bindMenu() {
  const btn = document.getElementById('btn-menu');
  if (btn) btn.addEventListener('click', () => { sfx.tap(); openMenu(); });
}

/* ── 화면: 타이틀 ────────────────────────────────────── */
function showTitle() {
  const hasSave = !!localStorage.getItem(SAVE_KEY) && state.started;
  app.innerHTML = `
  <div class="screen title-screen">
    <div class="title-art">
      <div class="title-hat">${PORTRAITS.kayton}</div>
    </div>
    <p class="title-sub">PROFESSOR KAYTON</p>
    <h1 class="title-logo">케이튼 교수<span>와</span><br>사라진 소스코드</h1>
    <p class="title-tag">신사를 위한 코딩 퍼즐 어드벤처</p>
    <div class="title-buttons">
      ${hasSave ? '<button class="btn btn-gold" id="btn-continue">이어서 하기</button>' : ''}
      <button class="btn ${hasSave ? '' : 'btn-gold'}" id="btn-new">새 게임</button>
    </div>
    <p class="title-credit">퍼즐 12문 · 피카랫 ${TOTAL_PICARATS} · 백엔드 없음, 순수한 두뇌만 필요</p>
  </div>`;
  const cont = document.getElementById('btn-continue');
  if (cont) cont.addEventListener('click', () => { sfx.tap(); renderNode(); });
  document.getElementById('btn-new').addEventListener('click', () => {
    sfx.tap();
    if (hasSave && !confirm('저장된 모험을 지우고 처음부터 시작할까요?')) return;
    resetState();
    renderNode();
  });
}

/* ── 노드 진행 ───────────────────────────────────────── */
function advance() {
  state.nodeIndex++;
  save();
  renderNode();
}
function chapterOfNode(index) {
  let ch = null;
  for (let i = 0; i <= index && i < STORY.length; i++) {
    if (STORY[i].type === 'chapter') ch = STORY[i];
  }
  return ch;
}
function renderNode() {
  const node = STORY[state.nodeIndex];
  if (!node) { showEnding(); return; }
  switch (node.type) {
    case 'chapter':  showChapterCard(node); break;
    case 'dialogue': showDialogue(node); break;
    case 'explore':  showExplore(EXPLORES[node.id]); break;
    case 'puzzle':
      if (state.solved[node.id]) { advance(); return; }
      showPuzzle(PUZZLE_MAP[node.id]);
      break;
    case 'ending':   showEnding(); break;
    default: advance();
  }
}

/* ── 화면: 챕터 카드 ─────────────────────────────────── */
function showChapterCard(node) {
  app.innerHTML = `
  <div class="screen chapter-screen">
    <div class="chapter-card">
      <p class="chapter-no">제 ${node.no} 장</p>
      <div class="chapter-rule"></div>
      <h2 class="chapter-title">${esc(node.title)}</h2>
      <div class="chapter-rule"></div>
      <p class="chapter-lead">${esc(node.lead)}</p>
      <button class="btn btn-gold" id="btn-next">이야기 시작</button>
    </div>
  </div>`;
  document.getElementById('btn-next').addEventListener('click', () => { sfx.tap(); advance(); });
}

/* ── 화면: 대화 ──────────────────────────────────────── */
let typeTimer = null;
function showDialogue(node) {
  const ch = chapterOfNode(state.nodeIndex);
  const isNarr = node.speaker === 'narrator';
  const who = CHARACTERS[node.speaker] || { name: '', portrait: 'narrator' };
  const portrait = PORTRAITS[who.portrait] || '';

  app.innerHTML = `
  <div class="screen dialogue-screen">
    ${hudHTML(ch ? `제${ch.no}장 · ${ch.title}` : '')}
    <div class="stage">
      ${isNarr ? '<div class="stage-narr-deco">✦ ✦ ✦</div>' : `<div class="stage-portrait">${portrait}</div>`}
    </div>
    <div class="dialogue-box ${isNarr ? 'narr' : ''}" id="dlg">
      ${isNarr ? '' : `<div class="nameplate">${esc(who.name)}</div>`}
      <p class="dialogue-text" id="dlg-text"></p>
      <span class="dialogue-next" id="dlg-arrow" hidden>▼</span>
    </div>
  </div>`;
  bindMenu();

  const textEl = document.getElementById('dlg-text');
  const arrow = document.getElementById('dlg-arrow');
  const full = node.text;
  let i = 0, done = false;

  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    i += 1;
    textEl.textContent = full.slice(0, i);
    if (i >= full.length) { clearInterval(typeTimer); done = true; arrow.hidden = false; }
  }, 26);

  document.getElementById('dlg').addEventListener('click', () => {
    if (!done) {
      clearInterval(typeTimer);
      textEl.textContent = full;
      done = true; arrow.hidden = false;
    } else {
      sfx.tap(); advance();
    }
  });
}

/* ── 화면: 탐색 ──────────────────────────────────────── */
function showExplore(scene) {
  const ch = chapterOfNode(state.nodeIndex);
  const found = state.foundCoins[scene.id] || [];
  const totalCoins = scene.items.filter(it => it.coin).length;

  app.innerHTML = `
  <div class="screen explore-screen">
    ${hudHTML(ch ? `제${ch.no}장 · ${ch.title}` : '')}
    <div class="explore-head">
      <h2>🔍 ${esc(scene.title)}</h2>
      <p>${esc(scene.tip)}</p>
      <p class="explore-count" id="explore-count">힌트 코인 ${found.length} / ${totalCoins}</p>
    </div>
    <div class="explore-scene" id="scene">
      ${scene.items.map((it, idx) => `
        <button class="explore-item ${it.coin && !found.includes(idx) ? 'has-secret' : ''}"
                style="left:${it.x}%; top:${it.y}%"
                data-idx="${idx}" aria-label="${esc(it.label)}">
          <span class="explore-emoji">${it.emoji}</span>
          <span class="explore-label">${esc(it.label)}</span>
        </button>`).join('')}
    </div>
    <div class="explore-toast" id="toast" hidden></div>
    <div class="explore-footer">
      <button class="btn btn-gold" id="btn-done">조사를 마친다</button>
    </div>
  </div>`;
  bindMenu();

  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg, isCoin) {
    toast.innerHTML = (isCoin ? '<b>◉ 힌트 코인 +1!</b><br>' : '') + esc(msg);
    toast.hidden = false;
    toast.classList.remove('pop'); void toast.offsetWidth; toast.classList.add('pop');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
  }

  document.getElementById('scene').addEventListener('click', (e) => {
    const btn = e.target.closest('.explore-item');
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    const it = scene.items[idx];
    const foundArr = state.foundCoins[scene.id] || (state.foundCoins[scene.id] = []);
    if (it.coin && !foundArr.includes(idx)) {
      foundArr.push(idx);
      state.coins += 1;
      save();
      sfx.coin();
      btn.classList.remove('has-secret');
      showToast(it.flavor, true);
      document.getElementById('explore-count').textContent = `힌트 코인 ${foundArr.length} / ${totalCoins}`;
      const coinStat = document.querySelector('.stat.coin');
      if (coinStat) coinStat.innerHTML = `<i>◉</i>${state.coins}`;
    } else {
      sfx.tap();
      showToast(it.flavor, false);
    }
  });

  document.getElementById('btn-done').addEventListener('click', () => { sfx.tap(); advance(); });
}

/* ── 화면: 퍼즐 ──────────────────────────────────────── */
function showPuzzle(p) {
  const ch = chapterOfNode(state.nodeIndex);
  let selected = -1;

  app.innerHTML = `
  <div class="screen puzzle-screen">
    ${hudHTML(ch ? `제${ch.no}장 · ${ch.title}` : '')}
    <div class="puzzle-scroll">
      <div class="puzzle-head">
        <span class="puzzle-no">퍼즐 ${String(p.no).padStart(2, '0')}</span>
        <span class="puzzle-value" id="pz-value"><i>✦</i>${currentPuzzleValue(p)} 피카랫</span>
      </div>
      <h2 class="puzzle-title">${esc(p.title)}</h2>
      <p class="puzzle-intro">${esc(p.intro)}</p>
      <div class="puzzle-body" id="pz-body">
        <div class="puzzle-desc">${p.desc}</div>
        ${p.code ? `<pre class="puzzle-code"><code>${esc(p.code)}</code></pre>` : ''}
        ${p.type === 'input'
          ? `<input class="puzzle-input" id="pz-input" type="text" autocomplete="off" autocapitalize="characters" enterkeyhint="done" placeholder="${esc(p.placeholder || '답을 입력하세요')}">`
          : `<div class="puzzle-choices" id="pz-choices">
              ${p.choices.map((c, i) => `<button class="choice" data-i="${i}"><span class="choice-key">${'㉮㉯㉰㉱'[i] || i + 1}</span>${esc(c)}</button>`).join('')}
            </div>`}
      </div>
    </div>
    <div class="puzzle-actions">
      <button class="btn btn-hint" id="btn-hint">◉ 힌트</button>
      <button class="btn btn-gold" id="btn-submit">해답을 제출한다</button>
    </div>
    <div class="modal-layer" id="modal-layer" hidden></div>
  </div>`;
  bindMenu();

  const layer = document.getElementById('modal-layer');

  if (p.type === 'choice') {
    document.getElementById('pz-choices').addEventListener('click', (e) => {
      const btn = e.target.closest('.choice');
      if (!btn) return;
      sfx.tap();
      selected = Number(btn.dataset.i);
      document.querySelectorAll('.choice').forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
    });
  } else {
    const input = document.getElementById('pz-input');
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  }

  /* 힌트 모달 */
  document.getElementById('btn-hint').addEventListener('click', () => { sfx.tap(); openHints(); });
  function openHints() {
    const opened = state.hintsOpen[p.id] || 0;
    layer.hidden = false;
    layer.innerHTML = `
      <div class="modal">
        <h3 class="modal-title">힌트</h3>
        <div class="hint-tabs">
          ${[0, 1, 2].map(i => `<button class="hint-tab ${i < opened ? 'open' : ''}" data-i="${i}">힌트 ${i + 1}</button>`).join('')}
        </div>
        <div class="hint-body" id="hint-body">${
          opened > 0 ? esc(p.hints[opened - 1]) : '힌트를 열려면 힌트 코인 ◉ 1개가 필요합니다.'
        }</div>
        <div class="modal-buttons"><button class="btn" id="hint-close">닫기</button></div>
      </div>`;
    const body = document.getElementById('hint-body');
    layer.querySelectorAll('.hint-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const i = Number(tab.dataset.i);
        const openedNow = state.hintsOpen[p.id] || 0;
        if (i < openedNow) { // 이미 연 힌트
          sfx.tap();
          body.textContent = p.hints[i];
        } else if (i === openedNow) { // 다음 힌트 열기
          if (state.coins < 1) { body.textContent = '힌트 코인이 부족합니다! 탐색 장면에서 코인을 찾아보세요.'; sfx.wrong(); return; }
          state.coins -= 1;
          state.hintsOpen[p.id] = i + 1;
          save(); sfx.coin();
          tab.classList.add('open');
          body.textContent = p.hints[i];
          const coinStat = document.querySelector('.stat.coin');
          if (coinStat) coinStat.innerHTML = `<i>◉</i>${state.coins}`;
        } else {
          body.textContent = '힌트는 순서대로만 열 수 있습니다.'; sfx.tap();
        }
      });
    });
    document.getElementById('hint-close').addEventListener('click', () => { sfx.tap(); layer.hidden = true; });
  }

  /* 제출 */
  document.getElementById('btn-submit').addEventListener('click', submit);
  function submit() {
    let ok;
    if (p.type === 'choice') {
      if (selected < 0) { flashResult(false, '먼저 답을 선택하게나.'); return; }
      ok = selected === p.answerIndex;
    } else {
      const v = document.getElementById('pz-input').value;
      if (!normalizeAnswer(v)) { flashResult(false, '답을 입력해 주게.'); return; }
      ok = isCorrect(p, v);
    }
    if (ok) succeed(); else fail();
  }

  function fail() {
    pendingWrongs[p.id] = (pendingWrongs[p.id] || 0) + 1;
    sfx.wrong();
    document.getElementById('pz-value').innerHTML = `<i>✦</i>${currentPuzzleValue(p)} 피카랫`;
    layer.hidden = false;
    layer.innerHTML = `
      <div class="modal modal-wrong">
        <h3 class="modal-title">아쉽군…</h3>
        <p class="modal-text">그 답이 아닐세. 퍼즐은 다른 각도에서 바라보면 새로운 얼굴을 보여 주지.<br><span class="dim">(획득 가능 피카랫이 줄어들었다)</span></p>
        <div class="modal-buttons"><button class="btn btn-gold" id="btn-retry">다시 도전</button></div>
      </div>`;
    document.getElementById('btn-retry').addEventListener('click', () => { sfx.tap(); layer.hidden = true; });
  }

  function flashResult(_, msg) {
    layer.hidden = false;
    layer.innerHTML = `
      <div class="modal">
        <p class="modal-text">${esc(msg)}</p>
        <div class="modal-buttons"><button class="btn" id="btn-ok">알겠다</button></div>
      </div>`;
    document.getElementById('btn-ok').addEventListener('click', () => { sfx.tap(); layer.hidden = true; });
  }

  function succeed() {
    const wrongs = pendingWrongs[p.id] || 0;
    const earned = currentPuzzleValue(p);
    state.solved[p.id] = { earned, wrongs };
    state.picarats += earned;
    delete pendingWrongs[p.id];
    save();
    sfx.correct();
    layer.hidden = false;
    layer.innerHTML = `
      <div class="modal modal-correct">
        <div class="correct-stamp">정답!</div>
        <p class="correct-picarats"><i>✦</i> +${earned} 피카랫</p>
        <div class="modal-explain">${p.explain}</div>
        <div class="modal-buttons"><button class="btn btn-gold" id="btn-go">이야기를 계속한다</button></div>
      </div>`;
    document.getElementById('btn-go').addEventListener('click', () => { sfx.tap(); advance(); });
  }
}

/* ── 화면: 엔딩 ──────────────────────────────────────── */
function showEnding() {
  const solvedCount = Object.keys(state.solved).length;
  const pts = state.picarats;
  let rank, rankDesc;
  if (pts >= 500)      { rank = '전설의 코드 고고학자'; rankDesc = '비트 경도 미소 지을 완벽한 추리력! 당신이야말로 진정한 후계자입니다.'; }
  else if (pts >= 420) { rank = '일급 퍼즐 수사관'; rankDesc = '날카로운 논리와 품위를 겸비했습니다. 신사(숙녀)의 칭호가 어울리는군요.'; }
  else if (pts >= 300) { rank = '견습 탐정'; rankDesc = '훌륭한 첫 모험이었습니다. 힌트 코인을 아껴 쓰면 더 높은 곳에 닿을 수 있어요.'; }
  else                 { rank = '퍼즐 초심자'; rankDesc = '모든 위대한 프로그래머의 시작은 Hello, World였습니다. 다시 도전해 보세요!'; }

  sfx.fanfare();
  app.innerHTML = `
  <div class="screen ending-screen">
    <div class="ending-card">
      <p class="ending-fin">— FIN —</p>
      <h2 class="ending-title">사건 해결!</h2>
      <div class="chapter-rule"></div>
      <div class="ending-stats">
        <div class="ending-stat"><span>획득 피카랫</span><b><i>✦</i> ${pts} / ${TOTAL_PICARATS}</b></div>
        <div class="ending-stat"><span>해결한 퍼즐</span><b>${solvedCount} / ${PUZZLES.length}</b></div>
        <div class="ending-stat"><span>남은 힌트 코인</span><b><i>◉</i> ${state.coins}</b></div>
      </div>
      <div class="chapter-rule"></div>
      <p class="ending-rank-label">당신의 칭호</p>
      <p class="ending-rank">${rank}</p>
      <p class="ending-rank-desc">${rankDesc}</p>
      <div class="title-buttons">
        <button class="btn btn-gold" id="btn-title">타이틀로 돌아가기</button>
        <button class="btn" id="btn-restart">처음부터 다시</button>
      </div>
      <p class="title-credit">케이튼 교수는 다음 사건에서 다시 돌아옵니다…</p>
    </div>
  </div>`;
  document.getElementById('btn-title').addEventListener('click', () => { sfx.tap(); showTitle(); });
  document.getElementById('btn-restart').addEventListener('click', () => {
    sfx.tap();
    if (!confirm('기록을 지우고 처음부터 시작할까요?')) return;
    resetState(); renderNode();
  });
}

/* ── 메뉴 모달 ───────────────────────────────────────── */
function openMenu() {
  let layer = document.getElementById('menu-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'menu-layer';
    layer.className = 'modal-layer';
    document.querySelector('.screen').appendChild(layer);
  }
  layer.hidden = false;
  const solvedCount = Object.keys(state.solved).length;
  layer.innerHTML = `
    <div class="modal">
      <h3 class="modal-title">수사 수첩</h3>
      <div class="menu-stats">
        <p><i>✦</i> 피카랫 <b>${state.picarats}</b> / ${TOTAL_PICARATS}</p>
        <p><i>◉</i> 힌트 코인 <b>${state.coins}</b></p>
        <p>🧩 해결한 퍼즐 <b>${solvedCount}</b> / ${PUZZLES.length}</p>
      </div>
      <div class="menu-buttons">
        <button class="btn" id="menu-sound">${state.sound ? '🔔 소리 켜짐' : '🔕 소리 꺼짐'}</button>
        <button class="btn" id="menu-title">타이틀 화면으로</button>
        <button class="btn btn-danger" id="menu-reset">기록 삭제 후 처음부터</button>
        <button class="btn btn-gold" id="menu-close">수사로 돌아간다</button>
      </div>
    </div>`;
  document.getElementById('menu-sound').addEventListener('click', (e) => {
    state.sound = !state.sound; save(); sfx.tap();
    e.target.textContent = state.sound ? '🔔 소리 켜짐' : '🔕 소리 꺼짐';
  });
  document.getElementById('menu-title').addEventListener('click', () => { sfx.tap(); layer.hidden = true; showTitle(); });
  document.getElementById('menu-reset').addEventListener('click', () => {
    if (!confirm('정말 모든 기록을 지울까요? 되돌릴 수 없습니다.')) return;
    resetState(); renderNode();
  });
  document.getElementById('menu-close').addEventListener('click', () => { sfx.tap(); layer.hidden = true; });
}

/* ── 시작 ────────────────────────────────────────────── */
loadSave();
showTitle();
