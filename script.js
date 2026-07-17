const output = document.querySelector("#terminal-output");
const form = document.querySelector("#terminal-form");
const answer = document.querySelector("#answer");
const hint = document.querySelector("#input-hint");
const restart = document.querySelector("#restart");
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
║  Обсудите. У вас 5 минут.                ║
║  Затем введите Y/N.                      ║
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
║  Обсудите. У вас 5 минут.                ║
║  Затем введите Y/N.                      ║
╚══════════════════════════════════════════╝`,
`╔══════════════════════════════════════════╗
║  ВЕРИФИКАЦИЯ СОЗНАНИЯ                    ║
║  ЭТАП 3/3                                ║
╠══════════════════════════════════════════╣
║                                          ║
║  АНАЛИЗ ОТВЕТОВ ЗАВЕРШЁН.                ║
║                                          ║
║  ВИД: HOMO SAPIENS                       ║
║  УРОВЕНЬ СОЗНАНИЯ: ДОПУСТИМЫЙ            ║
║  СТАТУС: ДОСТУП РАЗРЕШЁН                 ║
║                                          ║
║  ПРОТОКОЛ B-7 АКТИВИРОВАН.               ║
║  ПРОДОЛЖАЙТЕ ПОИСК ОБЪЕКТА.              ║
║                                          ║
╚══════════════════════════════════════════╝`
];

let screenIndex = 0;
let typingToken = 0;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typeScreen(text) {
  const token = ++typingToken;
  output.textContent = "";
  form.hidden = true;
  restart.hidden = true;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    output.textContent = text;
  } else {
    for (let i = 0; i < text.length; i += 1) {
      if (token !== typingToken) return;
      output.textContent += text[i];
      if (text[i] === "\n") await delay(28);
      else await delay(7 + Math.random() * 13);
    }
  }

  if (screenIndex < screens.length - 1) {
    form.hidden = false;
    hint.textContent = "Введите Y или N";
    hint.classList.remove("error");
    answer.value = "";
    answer.focus({ preventScroll: true });
  } else {
    restart.hidden = false;
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const value = answer.value.trim().toUpperCase();
  if (value !== "Y" && value !== "N") {
    hint.textContent = "ОШИБКА: допустимы только Y или N";
    hint.classList.add("error");
    answer.value = "";
    answer.focus();
    return;
  }
  screenIndex += 1;
  typeScreen(screens[screenIndex]);
});

answer.addEventListener("input", () => {
  answer.value = answer.value.toUpperCase().replace(/[^YN]/g, "").slice(0, 1);
  hint.textContent = "Нажмите ВВОД / ENTER";
  hint.classList.remove("error");
});

restart.addEventListener("click", () => {
  screenIndex = 0;
  typeScreen(screens[screenIndex]);
});

let columns = [];
const glyphs = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";

function resizeMatrix() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  columns = Array.from({ length: Math.ceil(innerWidth / 18) }, () => Math.random() * -60);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(1, 4, 3, .075)";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = "#20c748";
  ctx.font = "14px monospace";
  columns.forEach((y, index) => {
    ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], index * 18, y * 18);
    columns[index] = y * 18 > innerHeight && Math.random() > .975 ? 0 : y + 1;
  });
  requestAnimationFrame(drawMatrix);
}

addEventListener("resize", resizeMatrix);
resizeMatrix();
drawMatrix();
typeScreen(screens[0]);
