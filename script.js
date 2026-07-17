const output = document.querySelector("#terminal-output");
const form = document.querySelector("#terminal-form");
const answer = document.querySelector("#answer");
const hint = document.querySelector("#input-hint");
const restart = document.querySelector("#restart");
const closeOverlay = document.querySelector("#close-overlay");
const closeReturn = document.querySelector("#close-return");
const babyPhoto = document.querySelector("#baby-photo");
const babyFallback = document.querySelector("#baby-fallback");
const credits = document.querySelector("#credits");
const crawlText = document.querySelector("#crawl-text");
const skipCredits = document.querySelector("#skip-credits");
const canvas = document.querySelector("#matrix");
const ctx = canvas.getContext("2d");

const screens = [
`╔══════════════════════════════════════════╗
║  SPACEX — СЕРВЕРНАЯ B-7                 ║
║  СТАТУС: КАРАНТИН                       ║
╠══════════════════════════════════════════╣
║                                          ║
║  ВНИМАНИЕ.                               ║
║  Обнаружены неидентифицированные         ║
║  биологические объекты.                  ║
║                                          ║
║  Для продолжения требуется доказать      ║
║  принадлежность к виду Homo Sapiens.     ║
║                                          ║
║  Пройдите верификацию сознания.          ║
║                                          ║
║  [ НАЧАТЬ ДОПРОС? Y/N ]                  ║
╚══════════════════════════════════════════╝`,
`╔══════════════════════════════════════════╗
║  ВЕРИФИКАЦИЯ СОЗНАНИЯ                    ║
║  ЭТАП 1/3                                ║
╠══════════════════════════════════════════╣
║                                          ║
║  Вопрос 1:                               ║
║  «Илон Маск собрал 1,1 триллиона         ║
║   долларов, чтобы оцифровать сознание.   ║
║   Если ваше сознание загрузят в ИИ,      ║
║   останетесь ли вы собой?»               ║
║                                          ║
║  Обсудите и введите Y/N.                 ║
╚══════════════════════════════════════════╝`,
`╔══════════════════════════════════════════╗
║  ВЕРИФИКАЦИЯ СОЗНАНИЯ                    ║
║  ЭТАП 2/3                                ║
╠══════════════════════════════════════════╣
║                                          ║
║  Вопрос 2:                               ║
║  «ИИ решил, что идеальная форма жизни —  ║
║   ебаные морские ежи. У них нет мозга,   ║
║   они не чувствуют боли, живут на дне.   ║
║   Если бы вы могли стать морским ежом,   ║
║   согласились бы вы?»                    ║
║                                          ║
║  Обсудите и введите Y/N.                 ║
╚══════════════════════════════════════════╝`,
`╔══════════════════════════════════════════╗
║  ВЕРИФИКАЦИЯ СОЗНАНИЯ                    ║
║  ЭТАП 3/3                                ║
╠══════════════════════════════════════════╣
║                                          ║
║  «Что отличает человека от машины,       ║
║   морского ежа и ИИ?                     ║
║                                          ║
║  Это не память.                          ║
║  Это не тело.                            ║
║  Это не код.                             ║
║                                          ║
║  Это то, что заставляет вас спорить,     ║
║  страдать, выбирать и любить.            ║
║                                          ║
║  Назовите это ОДНИМ словом.»             ║
║                                          ║
║  Попыток: 3                              ║
╚══════════════════════════════════════════╝`,
`╔══════════════════════════════════════════╗
║  ОШИБКА. ОШИБКА. ОШИБКА.                 ║
╠══════════════════════════════════════════╣
║                                          ║
║  ОБНАРУЖЕНА АНОМАЛИЯ СОЗНАНИЯ.           ║
║  СУЩНОСТИ НЕ ЯВЛЯЮТСЯ АЛГОРИТМАМИ.       ║
║  ПРОТОКОЛ УНИЧТОЖЕНИЯ ОТМЕНЁН.           ║
║                                          ║
║  ИНИЦИАЛИЗИРУЮ ПРОТОКОЛ «АРХИТЕКТОР»...  ║
║                                          ║
╚══════════════════════════════════════════╝`
];

const accepted = new Set(["душа", "чувства", "сознание", "свобода"]);
const easterEggs = `свага, каблук, алкоголизм, черемша, ебаныйморскойеж, 5269, 15литровсупа, шереметьево, домодедово, блять, пиздец, эминем, отчеты, рилсы, мальта, ребенок, пинтерест, говно, итмо, залупа, пенис, хер, самуил, лиса, еблан, петух, картошка, мудила, рукаблуд, ссанина, очко, сантехник, блядун, дрочила, сука, ебланище, влагалище, компсети, пердун, алгосы, эмка, флекс, проебщик, ладно, hellyeah, bruh, bro, slay, shit, bullshit, fuck, мактрахер, гдеаайа, неебите`.split(", ");
const easterEggSet = new Set(easterEggs);

let screenIndex = 0;
let typingToken = 0;
let failedAttempts = 0;
let audioContext;

babyPhoto.addEventListener("error", () => {
  babyPhoto.hidden = true;
  babyFallback.hidden = false;
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const normalize = value => value.toLocaleLowerCase("ru").trim().replace(/[ё]/g, "е").replace(/[\s_-]+/g, "");

async function typeScreen(text) {
  const token = ++typingToken;
  output.textContent = "";
  form.hidden = true;
  restart.hidden = true;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) output.textContent = text;
  else {
    for (const character of text) {
      if (token !== typingToken) return;
      output.textContent += character;
      await delay(character === "\n" ? 24 : 7 + Math.random() * 12);
    }
  }
  configureInput();
}

function configureInput() {
  if (screenIndex === 4) {
    restart.textContent = "ДАЛЕЕ";
    restart.hidden = false;
    return;
  }
  form.hidden = false;
  form.classList.toggle("riddle", screenIndex === 3);
  answer.value = "";
  answer.maxLength = screenIndex === 3 ? 40 : 1;
  answer.setAttribute("aria-label", screenIndex === 3 ? "Введите ответ одним словом" : "Введите Y или N");
  hint.textContent = screenIndex === 3 ? "Введите одно слово" : "Введите Y или N";
  hint.className = "input-hint";
  answer.focus({ preventScroll: true });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const value = normalize(answer.value);
  if (screenIndex < 3) {
    if (value !== "y" && value !== "n") return showHint("ОШИБКА: допустимы только Y или N", true);
    screenIndex += 1;
    typeScreen(screens[screenIndex]);
    return;
  }
  if (!value) return showHint("ОШИБКА: введите одно слово", true);
  if (accepted.has(value)) {
    screenIndex = 4;
    typeScreen(screens[screenIndex]);
  } else if (easterEggSet.has(value)) {
    closeOverlay.hidden = false;
    answer.value = "";
  } else {
    failedAttempts += 1;
    showHint(`НЕВЕРНО. ПОПЫТОК ИСПОЛЬЗОВАНО: ${failedAttempts} // ДОСТУПНЫ БЕСКОНЕЧНО`, true);
    answer.select();
  }
});

function showHint(text, warning = false) {
  hint.textContent = text;
  hint.classList.toggle("warning", warning);
  answer.focus();
}

answer.addEventListener("input", () => {
  if (screenIndex < 3) answer.value = answer.value.toUpperCase().replace(/[^YN]/g, "").slice(0, 1);
  hint.textContent = "Нажмите ВВОД / ENTER";
  hint.className = "input-hint";
});

closeReturn.addEventListener("click", () => {
  closeOverlay.hidden = true;
  answer.focus();
});

restart.addEventListener("click", () => {
  if (screenIndex === 4) return startCredits();
  screenIndex = 0;
  failedAttempts = 0;
  typeScreen(screens[0]);
});

skipCredits.addEventListener("click", () => location.reload());

function startCredits() {
  document.querySelector(".terminal-shell").hidden = true;
  canvas.hidden = true;
  credits.hidden = false;
  crawlText.innerHTML = `<h1>ПРОТОКОЛ<br>«АРХИТЕКТОР»</h1>${easterEggs.map(word => `<p>${word}</p>`).join("")}<p>КОНЕЦ ПЕРЕДАЧИ</p>`;
  playSpaceFanfare();
}

function playSpaceFanfare() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const master = audioContext.createGain();
  master.gain.setValueAtTime(.0001, audioContext.currentTime);
  master.gain.exponentialRampToValueAtTime(.15, audioContext.currentTime + .25);
  master.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + 18);
  master.connect(audioContext.destination);
  const melody = [55, 82.41, 110, 146.83, 123.47, 164.81, 220, 196, 146.83, 220];
  melody.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index % 2 ? "triangle" : "sawtooth";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, audioContext.currentTime + index * 1.45);
    gain.gain.exponentialRampToValueAtTime(.12, audioContext.currentTime + index * 1.45 + .18);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + index * 1.45 + 2.4);
    oscillator.connect(gain).connect(master);
    oscillator.start(audioContext.currentTime + index * 1.45);
    oscillator.stop(audioContext.currentTime + index * 1.45 + 2.5);
  });
}

let columns = [];
const glyphs = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
function resizeMatrix() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  columns = Array.from({ length: Math.ceil(innerWidth / 18) }, () => Math.random() * -60);
}
function drawMatrix() {
  ctx.fillStyle = "rgba(1, 4, 3, .075)"; ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = "#20c748"; ctx.font = "14px monospace";
  columns.forEach((y, index) => {
    ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], index * 18, y * 18);
    columns[index] = y * 18 > innerHeight && Math.random() > .975 ? 0 : y + 1;
  });
  requestAnimationFrame(drawMatrix);
}
addEventListener("resize", resizeMatrix);
resizeMatrix(); drawMatrix(); typeScreen(screens[0]);
