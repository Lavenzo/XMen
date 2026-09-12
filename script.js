"use strict";

let W = 1280;
let H = 720;
let TOP = 425;
let BOTTOM = 658;
let TAU = Math.PI * 2;
let clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let rand = (a, b) => a + Math.random() * (b - a);
let choose = (a) => a[Math.floor(Math.random() * a.length)];
let dist = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * 1.6);
let approach = (a, b, step) =>
  a < b ? Math.min(b, a + step) : Math.max(b, a - step);
let noise = (n) => {
  let v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// Image defined for background image + character selection chage
let gameMenuBackground = new Image();
let charSelectionBackground = new Image();
gameMenuBackground.src = "image/GameMenuBackground.png";
charSelectionBackground.src = "image/CharSelection.png";
const stage1Background = new Image();
stage1Background.src = "image/Stage1Background.png";
const stage2Background = new Image();
stage2Background.src = "image/Stage2Background.png";

let language = "en";
try {
  language = localStorage.getItem("mutant-wars-language") || "en";
} catch (_) {}

let WORDS = {
  start: ["START GAME", "开始游戏"],
  select: ["SELECT YOUR X-MAN", "选择你的X战警"],
  deploy: ["ENTER THE BATTLE", "进入战斗"],
  health: ["HEALTH", "生命值"],
  special: ["SPECIAL", "特殊能力"],
  ready: ["READY!", "已就绪！"],
  lives: ["LIVES", "生命"],
  score: ["SCORE", "分数"],
  stage: ["STAGE", "关卡"],
  wave: ["WAVE", "敌人波次"],
  combo: ["COMBO", "连击"],
  attack: ["ATTACK", "攻击"],
  heavy: ["HEAVY", "重击"],
  jump: ["JUMP", "跳跃"],
  pickup: ["PICK UP", "拾取"],
  speed: ["SPEED", "速度"],
  defence: ["DEFENCE", "防御"],
  ability: ["SPECIAL ABILITY", "特殊技能"],
  music: ["MUSIC", "音乐"],
  sound: ["SOUND", "音效"],
  on: ["ON", "开"],
  off: ["OFF", "关"],
  touch: ["TOUCH", "触控"],
  pause: ["PAUSE", "暂停"],
  paused: ["PAUSED", "已暂停"],
  resume: ["RESUME", "继续游戏"],
  gameover: ["GAME OVER", "游戏结束"],
  continue: ["CONTINUE", "继续挑战"],
  restart: ["RESTART", "重新开始"],
  menu: ["MAIN MENU", "主菜单"],
  clear: ["STAGE CLEAR", "关卡完成"],
  next: ["NEXT STAGE", "下一关"],
  total: ["TOTAL SCORE", "总分"],
  healthBonus: ["HEALTH BONUS", "生命奖励"],
  comboBonus: ["COMBO BONUS", "连击奖励"],
  warning: ["WARNING!", "警告！"],
  incoming: ["BOSS APPROACHING", "首领接近中"],
  dodge: ["DODGE!", "闪避！"],
  vulnerable: ["VULNERABLE!", "破绽！"],
  shield: ["MAGNETIC SHIELD", "磁力护盾"],
  shieldbreak: ["SHIELD BROKEN!", "护盾击破！"],
  enraged: ["PHASE TWO!", "第二阶段！"],
  critical: ["CRITICAL!", "暴击！"],
  recharge: ["ENERGY RECHARGING", "能量恢复中"],
  broken: ["WEAPON BROKEN", "武器损坏"],
  rescue: ["BACK IN THE FIGHT!", "重返战场！"],
  surprise: ["WRONG UNIVERSE?!", "走错宇宙了？！"],
  go: ["GO!", "前进！"],
  unarmed: ["MUTANT POWER", "变种能力"],
  pipe: ["METAL PIPE", "金属管"],
  bat: ["BASEBALL BAT", "棒球棍"],
  staff: ["BATTLE STAFF", "战斗长棍"],
  blaster: ["ENERGY WEAPON", "能量枪"],
  disc: ["THROWING DISC", "投掷飞盘"],
  landscape: ["LANDSCAPE RECOMMENDED", "建议横屏游玩"],
  titleNote: [
    "8 HEROES / 8 STAGES / ONE MISSION",
    "八位英雄 / 八大关卡 / 同一个使命",
  ],
  titleTop: ["AN ARCADE BATTLE FOR THE FUTURE", "一场为未来而战的街机冒险"],
  titleBottom: [
    "FIGHT FOR YOUR KIND. FIGHT FOR TOMORROW.",
    "为同伴而战。为未来而战。",
  ],
  fan: [
    "DEVELOPED BY LAVENZO • UNOFFICIAL X-MEN FAN GAME",
    "凯凯开发制作 • 非官方X战警同人游戏",
  ],
  help: [
    "ARROWS Move • A Attack • S Heavy • D Special • W Jump • E Pick up • Esc Pause",
    "方向键 移动 • A 攻击 • S 重击 • D 特技 • W 跳跃 • E 拾取 • Esc 暂停",
  ],
  selectHelp: [
    "← → Choose • ENTER Deploy | A,A,A: flurry • A,A,S: launcher",
    "← → 选择 • 回车 出战 | A,A,A：连击 • A,A,S：挑飞",
  ],
  continueNote: [
    "Continue this encounter with 3 lives. Score is reduced by 20%.",
    "从本场战斗继续，获得3条生命。分数扣除20%。",
  ],
  musicMissing: [
    "Add audio/GameMusic06.mp3 to hear your music.",
    "请放入 audio/GameMusic06.mp3 播放背景音乐。",
  ],
  tip: [
    "Jump over shockwaves. Move out of red attack markers.",
    "跳跃躲避冲击波。离开红色攻击预警区域。",
  ],
  stormTip: ["Hold W in the air to hover.", "在空中按住W可以短暂悬浮。"],
  magnetTip: [
    "Dodge the metal. Attack when the shield falls.",
    "躲避金属碎片，护盾消失时攻击。",
  ],
  juggerTip: [
    "Sidestep the charge. Strike after the wall crash.",
    "上下移动躲开冲锋，撞墙后趁机攻击。",
  ],
  victory: ["THE X-MEN HAVE PREVAILED", "X战警取得了胜利"],
  ending: [
    "The mansion lights are on. Tonight, every mutant has a place to call home.",
    "学院的灯再次亮起。今夜，每一位变种人都有了可以回去的家。",
  ],
  credits: [
    "PROCEDURAL CANVAS ART • UNOFFICIAL FAN GAME • THANK YOU FOR PLAYING",
    "程序绘制画面 • 非官方同人游戏 • 感谢游玩",
  ],
};

function tr(key) {
  return WORDS[key] ? WORDS[key][language === "zh" ? 1 : 0] : key;
}
function nameOf(value) {
  return value.name[language === "zh" ? 1 : 0];
}
function localPair(pair) {
  return pair[language === "zh" ? 1 : 0];
}

let HEROES = [
  {
    id: "wolverine",
    name: ["Wolverine", "金刚狼"],
    color: "#f4ca38",
    trim: "#265ba9",
    skin: "#d8a37c",
    hp: 165,
    speed: 265,
    damage: 18,
    range: 110,
    defence: 0.12,
    rate: 0.24,
    power: ["Adamantium claws", "艾德曼合金利爪"],
    ability: ["BERSERKER • 7 seconds of fury", "狂战士 • 7秒狂暴利爪"],
    stats: [8, 8, 6],
  },
  {
    id: "cyclops",
    name: ["Cyclops", "镭射眼"],
    color: "#2857ae",
    trim: "#ecca44",
    skin: "#d6a079",
    hp: 155,
    speed: 235,
    damage: 20,
    range: 118,
    defence: 0.12,
    rate: 0.31,
    power: ["Concussive optic energy", "震荡镭射能量"],
    ability: ["OPTIC OVERDRIVE • piercing beam", "镭射过载 • 穿透光束"],
    stats: [7, 6, 6],
  },
  {
    id: "gambit",
    name: ["Gambit", "牌皇"],
    color: "#b94493",
    trim: "#4c365d",
    skin: "#d4a078",
    hp: 145,
    speed: 255,
    damage: 19,
    range: 160,
    defence: 0.08,
    rate: 0.3,
    power: ["Kinetic cards & bo staff", "动能扑克牌与长棍"],
    ability: ["ROYAL FLUSH • explosive card spin", "皇家同花顺 • 旋转爆破牌阵"],
    stats: [7, 8, 5],
  },
  {
    id: "storm",
    name: ["Storm", "暴风女"],
    color: "#e7eef7",
    trim: "#d9bc62",
    skin: "#86523f",
    hp: 140,
    speed: 245,
    damage: 17,
    range: 178,
    defence: 0.08,
    rate: 0.34,
    power: ["Weather & lightning • hold W to hover", "天气与雷电 • 按住W悬浮"],
    ability: [
      "TEMPEST • repeated lightning strikes",
      "雷霆风暴 • 连续闪电轰击",
    ],
    stats: [8, 7, 4],
  },
  {
    id: "rogue",
    name: ["Rogue", "小淘气"],
    color: "#329267",
    trim: "#ebc744",
    skin: "#e3af87",
    hp: 185,
    speed: 235,
    damage: 25,
    range: 120,
    defence: 0.25,
    rate: 0.34,
    power: ["Super strength & power absorption", "超级力量与能力吸收"],
    ability: ["POWER DRAIN • restore health", "能力吸收 • 恢复生命"],
    stats: [9, 6, 8],
  },
  {
    id: "nightcrawler",
    name: ["Nightcrawler", "夜行者"],
    color: "#c43850",
    trim: "#192442",
    skin: "#4c67b0",
    hp: 135,
    speed: 320,
    damage: 16,
    range: 115,
    defence: 0.06,
    rate: 0.22,
    power: ["Teleportation & acrobatics", "瞬间移动与杂技"],
    ability: ["BAMF! • chained teleport ambushes", "闪现连袭 • 连续瞬移伏击"],
    stats: [6, 10, 4],
  },
  {
    id: "colossus",
    name: ["Colossus", "钢力士"],
    color: "#be3445",
    trim: "#edc84a",
    skin: "#b9cdd9",
    hp: 225,
    speed: 185,
    damage: 34,
    range: 140,
    defence: 0.35,
    rate: 0.43,
    power: ["Organic steel & immense strength", "有机钢铁与巨大力量"],
    ability: ["SEISMIC SLAM • ground shockwaves", "地震猛击 • 地面冲击波"],
    stats: [10, 3, 10],
  },
  {
    id: "jean",
    name: ["Jean Grey", "琴·葛蕾"],
    color: "#d2a34e",
    trim: "#264879",
    skin: "#e5ae91",
    hp: 145,
    speed: 240,
    damage: 20,
    range: 180,
    defence: 0.1,
    rate: 0.32,
    power: ["Telepathy & telekinesis", "心灵感应与念力"],
    ability: [
      "PSYCHIC VORTEX • pull, lift & release",
      "念力漩涡 • 牵引、悬浮与爆发",
    ],
    stats: [9, 6, 5],
  },
];

let ENEMY_TYPES = {
  hunter: {
    hp: 60,
    speed: 112,
    damage: 9,
    color: "#586c85",
    trim: "#edaa57",
    ai: "melee",
    score: 100,
  },
  drone: {
    hp: 45,
    speed: 128,
    damage: 8,
    color: "#90779f",
    trim: "#ee86bd",
    ai: "ranged",
    score: 130,
  },
  elite: {
    hp: 100,
    speed: 140,
    damage: 13,
    color: "#a14b56",
    trim: "#edc276",
    ai: "circle",
    score: 180,
  },
  marauder: {
    hp: 76,
    speed: 155,
    damage: 11,
    color: "#6d814c",
    trim: "#d3a172",
    ai: "circle",
    score: 140,
  },
  assassin: {
    hp: 56,
    speed: 205,
    damage: 12,
    color: "#35334f",
    trim: "#ba8ce8",
    ai: "assassin",
    score: 170,
  },
  heavy: {
    hp: 145,
    speed: 85,
    damage: 18,
    color: "#886650",
    trim: "#dfb878",
    ai: "heavy",
    score: 220,
  },
  gunner: {
    hp: 60,
    speed: 110,
    damage: 10,
    color: "#3d737d",
    trim: "#88e5d3",
    ai: "ranged",
    score: 150,
  },
  shield: {
    hp: 110,
    speed: 98,
    damage: 12,
    color: "#515e8c",
    trim: "#b4c7de",
    ai: "shield",
    score: 190,
  },
  sewer: {
    hp: 90,
    speed: 166,
    damage: 11,
    color: "#628954",
    trim: "#f198c4",
    ai: "circle",
    score: 500,
  },
  ninja: {
    hp: 75,
    speed: 205,
    damage: 11,
    color: "#e99447",
    trim: "#60bed9",
    ai: "assassin",
    score: 500,
  },
  wizard: {
    hp: 85,
    speed: 125,
    damage: 11,
    color: "#9d72bd",
    trim: "#85eed6",
    ai: "ranged",
    score: 500,
  },
};

let BOSSES = [
  {
    id: "sabretooth",
    name: ["Sabretooth", "剑齿虎"],
    hp: 750,
    size: 1.55,
    color: "#b78143",
    trim: "#e4d1a2",
    skin: "#d3a077",
  },
  {
    id: "trask",
    name: ["Master Sentinel / Trask", "主控哨兵 / 特拉斯克"],
    hp: 970,
    size: 2,
    color: "#68528b",
    trim: "#c498c0",
    skin: "#baa4cb",
  },
  {
    id: "sinister",
    name: ["Mister Sinister", "惊恶先生"],
    hp: 950,
    size: 1.55,
    color: "#29364e",
    trim: "#91a4bb",
    skin: "#dce1eb",
  },
  {
    id: "shaw",
    name: ["Sebastian Shaw", "塞巴斯蒂安·肖"],
    hp: 1050,
    size: 1.55,
    color: "#3d4559",
    trim: "#b84c51",
    skin: "#d5a386",
  },
  {
    id: "magneto",
    name: ["Magneto", "万磁王"],
    hp: 1200,
    size: 1.5,
    color: "#bc3656",
    trim: "#795097",
    skin: "#d8aa8f",
  },
  {
    id: "juggernaut",
    name: ["Juggernaut", "红坦克"],
    hp: 1600,
    size: 2.05,
    color: "#a3513c",
    trim: "#d99458",
    skin: "#d99d79",
  },
  {
    id: "nimrod",
    name: ["Nimrod", "宁录"],
    hp: 1350,
    size: 1.85,
    color: "#e8c5dc",
    trim: "#ac649b",
    skin: "#eed9e7",
  },
  {
    id: "apocalypse",
    name: ["Apocalypse", "天启"],
    hp: 1800,
    size: 2.05,
    color: "#3b5979",
    trim: "#83a4bd",
    skin: "#8c9bb2",
  },
];

let STAGES = [
  {
    name: ["NEW YORK MUTANT DISTRICT", "纽约变种人街区"],
    theme: "city",
    sky: "#172a44",
    glow: "#eda783",
    floor: "#2b4052",
    enemies: ["hunter", "marauder", "gunner", "shield"],
    hazard: "traffic",
    weather: "rain",
  },
  {
    name: ["SENTINEL FACTORY", "哨兵工厂"],
    theme: "factory",
    sky: "#201e32",
    glow: "#eea26d",
    floor: "#353c4e",
    enemies: ["drone", "gunner", "heavy", "shield"],
    hazard: "press",
    weather: "sparks",
  },
  {
    name: ["UNDERGROUND GENETICS LAB", "地下基因实验室"],
    theme: "lab",
    sky: "#122c37",
    glow: "#7be5cc",
    floor: "#284651",
    enemies: ["assassin", "hunter", "drone", "elite"],
    hazard: "acid",
    weather: "bubbles",
  },
  {
    name: ["HELLFIRE DISTRICT", "地狱火街区"],
    theme: "hellfire",
    sky: "#2d243b",
    glow: "#e4af78",
    floor: "#483849",
    enemies: ["elite", "shield", "assassin", "heavy"],
    hazard: "fire",
    weather: "embers",
  },
  {
    name: ["MAGNETIC FORTRESS", "磁力堡垒"],
    theme: "fortress",
    sky: "#282342",
    glow: "#ba9ce8",
    floor: "#383e57",
    enemies: ["drone", "heavy", "gunner", "shield"],
    hazard: "magnet",
    weather: "metal",
  },
  {
    name: ["JUGGERNAUT RAMPAGE", "红坦克暴走"],
    theme: "rampage",
    sky: "#433139",
    glow: "#e6a77a",
    floor: "#504449",
    enemies: ["heavy", "marauder", "elite", "hunter"],
    hazard: "rubble",
    weather: "dust",
  },
  {
    name: ["FUTURE SENTINEL CITY", "未来哨兵之城"],
    theme: "future",
    sky: "#202343",
    glow: "#87dafa",
    floor: "#343c57",
    enemies: ["drone", "assassin", "gunner", "elite"],
    hazard: "laser",
    weather: "rain",
  },
  {
    name: ["AGE OF APOCALYPSE", "天启时代"],
    theme: "apocalypse",
    sky: "#39263e",
    glow: "#e9a07d",
    floor: "#503b48",
    enemies: ["elite", "heavy", "assassin", "shield"],
    hazard: "rift",
    weather: "embers",
  },
];

let WEAPONS = {
  pipe: { damage: 14, range: 42, uses: 18 },
  bat: { damage: 19, range: 35, uses: 14 },
  staff: { damage: 11, range: 85, uses: 22 },
  blaster: { damage: 14, range: 250, uses: 12 },
  disc: { damage: 28, range: 300, uses: 6 },
};

function polygon(c, points, fill, stroke = "#111c30", width = 2) {
  c.beginPath();
  points.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
function oval(c, x, y, rx, ry, fill, stroke = null, width = 2) {
  c.beginPath();
  c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = width;
    c.stroke();
  }
}
function line(c, points, color, width = 2) {
  c.beginPath();
  points.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke();
}
function text(c, value, x, y, size = 18, color = "#fff", align = "left") {
  c.font = `bold ${size}px Arial, "Microsoft YaHei", sans-serif`;
  c.textAlign = align;
  c.fillStyle = color;
  c.fillText(value, x, y);
}
function limb(c, points, color, width, shine = null) {
  line(c, points, "#101a2b", width + 5);
  line(c, points, color, width);
  if (shine)
    line(
      c,
      points.map((p) => [p[0] - 2, p[1] - 2]),
      shine,
      3,
    );
}
function star(c, x, y, r, color, count = 8) {
  let points = [];
  for (let i = 0; i < count * 2; i++) {
    let radius = i % 2 ? r * 0.3 : r;
    points.push([
      x + Math.cos((i * Math.PI) / count) * radius,
      y + Math.sin((i * Math.PI) / count) * radius,
    ]);
  }
  polygon(c, points, color, null);
}
function badge(c, x, y, r = 7) {
  oval(c, x, y, r, r, "#e5bd48", "#17243b", 2);
  line(
    c,
    [
      [x - r * 0.5, y - r * 0.5],
      [x + r * 0.5, y + r * 0.5],
    ],
    "#833545",
    2,
  );
  line(
    c,
    [
      [x + r * 0.5, y - r * 0.5],
      [x - r * 0.5, y + r * 0.5],
    ],
    "#833545",
    2,
  );
}

class AudioManager {
  constructor() {
    this.musicOn = true;
    this.soundOn = true;
    this.unlocked = false;
    this.missing = false;
    this.context = null;
    this.theme = 0;
    this.last = {};
    this.music = new Audio("audio/GameMusic06.mp3");
    this.music.loop = true;
    this.music.volume = 0.34;
    this.music.preload = "none";
    this.music.addEventListener("error", () => {
      this.missing = true;
    });
  }
  unlock() {
    if (!this.context) {
      try {
        let AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.context = new AC();
      } catch (_) {}
    }
    if (this.context?.state === "suspended")
      this.context.resume().catch(() => {});
    if (!this.unlocked) {
      this.unlocked = true;
      this.syncMusic();
    }
  }
  syncMusic() {
    if (this.musicOn && this.unlocked && this.music.paused)
      this.music.play().catch(() => {});
    if (!this.musicOn) this.music.pause();
  }
  play(kind = "hit") {
    if (!this.soundOn || !this.context) return;
    let ctx = this.context,
      now = ctx.currentTime;
    if (now - (this.last[kind] ?? -10) < 0.04) return;
    this.last[kind] = now;
    let sounds = {
      punch: [185, 45, 0.1, "triangle"],
      kick: [110, 30, 0.18, "sine"],
      claw: [1350, 170, 0.12, "sawtooth"],
      optic: [650, 90, 0.28, "sawtooth"],
      explosion: [95, 20, 0.35, "square"],
      lightning: [1800, 70, 0.25, "sawtooth"],
      teleport: [230, 1650, 0.18, "sine"],
      heavy: [100, 24, 0.3, "triangle"],
      hit: [230, 65, 0.09, "square"],
      boss: [90, 30, 0.18, "sawtooth"],
      pickup: [500, 1050, 0.16, "sine"],
      clear: [400, 1300, 0.7, "triangle"],
      gameover: [330, 45, 0.85, "triangle"],
      charge: [80, 400, 0.6, "sawtooth"],
      shield: [950, 480, 0.2, "sine"],
      warning: [650, 650, 0.22, "square"],
      wind: [360, 70, 0.4, "triangle"],
      ambience: [65, 40, 0.5, "sine"],
    };
    let [from, to, length, type] = sounds[kind] || sounds.hit;
    if (kind === "ambience") {
      from += this.theme * 14;
      to += this.theme * 9;
      type = this.theme % 2 ? "triangle" : "sine";
    }
    let osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + length);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      kind === "ambience" ? 0.018 : 0.075,
      now + 0.006,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + length + 0.02);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}

class InputManager {
  constructor(game) {
    this.game = game;
    this.keys = new Set();
    this.pressed = new Set();
    this.keyboard = new Set();
    this.pointers = new Map();
    this.allowed = new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "KeyA",
      "KeyS",
      "KeyD",
      "KeyW",
      "KeyE",
      "Escape",
      "Enter",
      "Space",
    ]);
    let vp = document.getElementById("viewport");
    if (vp) {
      vp.addEventListener(
        "touchstart",
        (e) => {
          if (!e.target.closest("button")) e.preventDefault();
        },
        { passive: false },
      );
      vp.addEventListener(
        "touchmove",
        (e) => {
          if (!e.target.closest("button")) e.preventDefault();
        },
        { passive: false },
      );
    }
    let tc = document.getElementById("touchControls");
    if (tc) {
      tc.addEventListener("touchstart", (e) => e.preventDefault(), {
        passive: false,
      });
      tc.addEventListener("touchmove", (e) => e.preventDefault(), {
        passive: false,
      });
    }

    window.addEventListener("keydown", (e) => {
      if (!this.allowed.has(e.code)) return;
      e.preventDefault();
      game.audio.unlock();
      if (!e.repeat) {
        this.keyboard.add(e.code);
        this.keys.add(e.code);
        this.pressed.add(e.code);
      }
    });
    window.addEventListener("keyup", (e) => {
      this.keyboard.delete(e.code);
      if (![...this.pointers.values()].some((p) => p.key === e.code))
        this.keys.delete(e.code);
    });
    let release = (e) => {
      let p = this.pointers.get(e.pointerId);
      if (!p) return;
      this.pointers.delete(e.pointerId);
      if (![...this.pointers.values()].some((v) => v.key === p.key)) {
        if (!this.keyboard.has(p.key)) this.keys.delete(p.key);
        p.button.classList.remove("held");
      }
    };

    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    window.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) this.clear();
    });
    window.addEventListener("touchcancel", (e) => {
      if (e.touches.length === 0) this.clear();
    });

    document.querySelectorAll("[data-key]").forEach((button) => {
      button.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        game.audio.unlock();
        let key = button.dataset.key;
        try {
          button.setPointerCapture(e.pointerId);
        } catch (err) {}
        this.pointers.set(e.pointerId, { key, button });
        this.keys.add(key);
        this.pressed.add(key);
        button.classList.add("held");
      });
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
      button.addEventListener("contextmenu", (e) => e.preventDefault());
    });
    window.addEventListener("blur", () => {
      this.clear();
      if (game.state === "playing") game.pause();
    });
    window.addEventListener("pagehide", () => {
      this.clear();
      if (game.state === "playing") game.pause();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.clear();
        if (game.state === "playing") game.pause();
      }
    });
  }
  down(key) {
    return this.keys.has(key);
  }
  take(key) {
    let value = this.pressed.has(key);
    this.pressed.delete(key);
    return value;
  }
  endFrame() {
    this.pressed.clear();
  }
  clear() {
    this.keys.clear();
    this.pressed.clear();
    this.keyboard.clear();
    this.pointers.clear();
    document
      .querySelectorAll(".held")
      .forEach((b) => b.classList.remove("held"));
  }
}

class Particle {
  constructor(x, y, z, color, size = 4, life = 0.5) {
    Object.assign(this, { x, y, z, color, size, life });
    this.total = life;
    this.vx = rand(-190, 190);
    this.vy = rand(-75, 75);
    this.vz = rand(70, 240);
  }
  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;
    this.vz -= 680 * dt;
  }
  draw(c) {
    c.globalAlpha = clamp(this.life / this.total, 0, 1);
    star(c, this.x, this.y - Math.max(0, this.z), this.size, this.color, 4);
    c.globalAlpha = 1;
  }
}

class FloatingText {
  constructor(x, y, value, color = "#ffe19c", size = 22) {
    Object.assign(this, { x, y, value, color, size });
    this.life = 1;
  }
  update(dt) {
    this.life -= dt;
    this.y -= dt * 42;
  }
  draw(c) {
    c.globalAlpha = clamp(this.life * 2, 0, 1);
    text(c, this.value, this.x + 2, this.y + 2, this.size, "#091124", "center");
    text(c, this.value, this.x, this.y, this.size, this.color, "center");
    c.globalAlpha = 1;
  }
}

class Effect {
  constructor(type, x, y, color, radius = 100, life = 0.5, facing = 1) {
    Object.assign(this, { type, x, y, color, radius, life, facing });
    this.total = life;
  }
  update(dt) {
    this.life -= dt;
  }
  draw(c) {
    let p = 1 - this.life / this.total;
    c.save();
    c.translate(this.x, this.y);
    c.globalAlpha = clamp((1 - p) * 1.4, 0, 1);
    if (this.type === "beam") {
      c.scale(this.facing, 1);
      let g = c.createLinearGradient(0, 0, this.radius, 0);
      g.addColorStop(0, "#fff");
      g.addColorStop(0.1, this.color);
      g.addColorStop(1, "transparent");
      polygon(
        c,
        [
          [0, -15],
          [this.radius, -48],
          [this.radius, 48],
          [0, 15],
        ],
        g,
        null,
      );
      line(
        c,
        [
          [0, 0],
          [this.radius, 0],
        ],
        "#fff7d8",
        8 * (1 - p) + 2,
      );
    } else if (this.type === "lightning") {
      let points = [[0, -560]];
      for (let i = 1; i < 9; i++)
        points.push([Math.sin(i * 17 + p * 40) * 32, -560 + i * 62]);
      points.push([0, 0]);
      line(c, points, this.color, 13);
      line(c, points, "#fff", 4);
      star(c, 0, 0, 45 * (1 - p) + 10, "#fff");
    } else if (this.type === "slash") {
      c.scale(this.facing, 1);
      c.rotate(-0.3 + p * 0.6);
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.ellipse(
          15,
          -15 + i * 13,
          this.radius * (0.6 + p * 0.4),
          35,
          -0.35,
          -1.25,
          1.2,
        );
        c.strokeStyle = i === 1 ? "#fff" : this.color;
        c.lineWidth = 5;
        c.stroke();
      }
    } else if (this.type === "portal") {
      oval(
        c,
        0,
        -50,
        25 + Math.sin(p * Math.PI) * 25,
        66,
        this.color + "44",
        this.color,
        4,
      );
      for (let i = 0; i < 8; i++) {
        oval(
          c,
          Math.cos(i + p * 7) * 38,
          -50 + Math.sin(i + p * 7) * 50,
          10,
          12,
          this.color,
        );
      }
    } else {
      for (let i = 0; i < 3; i++) {
        let r = this.radius * (p * 0.85 + 0.1) + i * 9;
        oval(c, 0, 0, r, r * 0.34, null, this.color, 5 - i);
      }
      if (this.type === "burst") {
        for (let i = 0; i < 12; i++) {
          let a = (i * TAU) / 12;
          line(
            c,
            [
              [
                Math.cos(a) * this.radius * p * 0.5,
                Math.sin(a) * this.radius * p * 0.3,
              ],
              [
                Math.cos(a) * this.radius * p,
                Math.sin(a) * this.radius * p * 0.6,
              ],
            ],
            this.color,
            4,
          );
        }
      }
    }
    c.restore();
  }
}

class Projectile {
  constructor(
    game,
    x,
    y,
    z,
    vx,
    vy,
    damage,
    team,
    type = "orb",
    color = "#91e9ff",
    options = {},
  ) {
    Object.assign(this, { game, x, y, z, vx, vy, damage, team, type, color });
    this.life = 3;
    this.radius = type === "wave" ? 37 : 14;
    this.hit = new Set();
    Object.assign(this, options);
  }
  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.x < 0 || this.x > 4300 || this.y < 365 || this.y > 720)
      this.life = 0;
    let targets =
      this.team === "player" ? this.game.enemies : [this.game.player];
    for (let target of targets) {
      if (target.dead || this.hit.has(target)) continue;
      if (this.type === "wave" && target.z > 40) continue;
      let dz = Math.abs(target.z + 45 - this.z);
      if (
        Math.abs(target.x - this.x) < target.radius + this.radius &&
        Math.abs(target.y - this.y) < (this.type === "wave" ? 40 : 30) &&
        dz < (this.type === "wave" ? 100 : 90)
      ) {
        let hit = target.hurt(this.damage, this, {
          knock: 145,
          heavy: this.type === "wave",
          ranged: true,
        });
        this.hit.add(target);
        if (hit && this.team === "player") this.game.player.registerHit();
        if (!this.pierce) {
          this.life = 0;
          break;
        }
      }
    }
    if (this.team === "player") {
      for (let item of this.game.objects) {
        if (
          !item.dead &&
          !this.hit.has(item) &&
          Math.abs(item.x - this.x) < 35 &&
          Math.abs(item.y - this.y) < 30
        ) {
          item.hurt(this.damage);
          this.hit.add(item);
          if (!this.pierce) this.life = 0;
        }
      }
    }
    if (this.type === "card" && this.life <= 0) {
      this.game.effect("burst", this.x, this.y - 40, this.color, 80, 0.35);
      this.game.audio.play("explosion");
    }
  }
  draw(c) {
    c.save();
    c.translate(this.x, this.y - this.z);
    c.shadowColor = this.color;
    c.shadowBlur = 13;
    if (this.type === "card" || this.type === "disc") {
      c.rotate(this.game.time * 17);
      polygon(
        c,
        [
          [-12, -17],
          [12, -17],
          [12, 17],
          [-12, 17],
        ],
        "#f5e2ef",
        this.color,
        3,
      );
      polygon(
        c,
        [
          [0, -8],
          [6, 0],
          [0, 8],
          [-6, 0],
        ],
        this.color,
        null,
      );
    } else if (this.type === "metal" || this.type === "rock") {
      c.rotate(this.game.time * 6);
      polygon(
        c,
        [
          [-24, -12],
          [-5, -21],
          [24, -8],
          [16, 16],
          [-14, 18],
        ],
        this.type === "metal" ? "#acb8c7" : "#a68b76",
        "#344359",
        3,
      );
      line(
        c,
        [
          [-15, -8],
          [14, 7],
        ],
        "#ede8db",
        3,
      );
    } else if (this.type === "wave") {
      c.translate(0, this.z);
      oval(c, 0, -6, 20, 42, null, this.color, 8);
      oval(c, 0, -6, 12, 30, null, "#fff9", 3);
    } else if (this.type === "optic") {
      line(
        c,
        [
          [-this.vx * 0.05, 0],
          [0, 0],
        ],
        this.color,
        15,
      );
      line(
        c,
        [
          [-this.vx * 0.04, 0],
          [8, 0],
        ],
        "#fff3cd",
        5,
      );
    } else {
      oval(c, 0, 0, this.radius + 4, this.radius, this.color + "55");
      star(c, 0, 0, this.radius, this.color);
      oval(c, 0, 0, 5, 5, "#fff");
    }
    c.restore();
  }
}

class Pickup {
  constructor(game, x, y, type) {
    Object.assign(this, { game, x, y, type });
    this.life = 40;
    this.dead = false;
  }
  update(dt) {
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
    let p = this.game.player;
    if (
      !p.dead &&
      dist(this, p) < 58 &&
      (!WEAPONS[this.type] || this.game.input.take("KeyE"))
    ) {
      if (this.type === "health") p.hp = Math.min(p.maxHp, p.hp + 45);
      else if (this.type === "energy") p.energy = Math.min(100, p.energy + 40);
      else if (this.type === "score") this.game.score += 500;
      else p.weapon = { type: this.type, ...WEAPONS[this.type] };
      this.dead = true;
      this.game.audio.play("pickup");
      this.game.float(
        this.x,
        this.y - 70,
        WEAPONS[this.type]
          ? tr(this.type)
          : this.type === "health"
            ? "+45 HP"
            : this.type === "energy"
              ? "+40 SP"
              : "+500",
        "#a1f6c9",
        18,
      );
    }
  }
  draw(c) {
    if (this.life < 5 && Math.sin(this.life * 18) < 0) return;
    let y = this.y - 22 + Math.sin(this.game.time * 4) * 5;
    oval(c, this.x, this.y, 23, 7, "#0006");
    oval(c, this.x, y, 24, 24, "#13253b", "#9ae5cf", 2);
    if (this.type === "health") {
      c.fillStyle = "#f27d88";
      c.fillRect(this.x - 5, y - 14, 10, 28);
      c.fillRect(this.x - 14, y - 5, 28, 10);
    } else if (this.type === "energy") {
      polygon(
        c,
        [
          [this.x + 3, y - 17],
          [this.x - 10, y + 1],
          [this.x, y + 1],
          [this.x - 3, y + 17],
          [this.x + 12, y - 4],
          [this.x + 2, y - 4],
        ],
        "#9cdfff",
        null,
      );
    } else if (this.type === "score") star(c, this.x, y, 17, "#ffda78", 5);
    else {
      line(
        c,
        [
          [this.x - 13, y + 12],
          [this.x + 13, y - 12],
        ],
        "#c0cfdf",
        7,
      );
      text(c, "E", this.x, this.y + 20, 16, "#ffe191", "center");
    }
  }
}

class BreakableObject {
  constructor(game, x, y, type) {
    Object.assign(this, { game, x, y, type });
    this.hp = 45;
    this.dead = false;
    this.radius = 35;
    this.z = 0;
  }
  hurt(amount) {
    if (this.dead) return;
    this.hp -= amount;
    this.game.burst(this.x, this.y, 30, "#d2b08c", 7);
    if (this.hp <= 0) {
      this.dead = true;
      this.game.score += 75;
      this.game.audio.play("heavy");
      this.game.pickups.push(
        new Pickup(
          this.game,
          this.x,
          this.y,
          choose([
            "health",
            "health",
            "energy",
            "score",
            "pipe",
            "bat",
            "staff",
            "blaster",
            "disc",
          ]),
        ),
      );
    }
  }
  draw(c) {
    oval(c, this.x, this.y + 3, 37, 10, "#0005");
    c.save();
    c.translate(this.x, this.y);
    if (this.type === "barrel") {
      polygon(
        c,
        [
          [-24, -53],
          [24, -53],
          [27, -5],
          [20, 0],
          [-20, 0],
          [-27, -5],
        ],
        "#795d52",
        "#1a2436",
        3,
      );
      oval(c, 0, -53, 24, 8, "#a98a70", "#293449", 3);
      for (let y of [-40, -12])
        line(
          c,
          [
            [-25, y],
            [25, y],
          ],
          "#b6aa9e",
          5,
        );
      star(c, 0, -27, 11, "#e4c677", 3);
    } else if (this.type === "machine") {
      polygon(
        c,
        [
          [-27, -72],
          [24, -72],
          [31, -9],
          [24, 0],
          [-28, 0],
        ],
        "#4c667a",
        "#1c2c40",
        3,
      );
      c.fillStyle = "#122a37";
      c.fillRect(-18, -60, 33, 24);
      line(
        c,
        [
          [-14, -45],
          [-6, -50],
          [0, -41],
          [12, -49],
        ],
        "#8defd2",
        3,
      );
      for (let i = 0; i < 3; i++)
        oval(c, -13 + i * 12, -21, 3, 3, i ? "#dec981" : "#ee8b82");
    } else if (this.type === "sign") {
      line(
        c,
        [
          [0, 0],
          [0, -95],
        ],
        "#a5b0c0",
        7,
      );
      polygon(
        c,
        [
          [-25, -105],
          [17, -105],
          [31, -85],
          [17, -66],
          [-25, -66],
          [-37, -85],
        ],
        "#a2495d",
        "#eed8cb",
        3,
      );
      text(c, "!", -3, -76, 29, "#fff", "center");
    } else {
      polygon(
        c,
        [
          [-30, -52],
          [22, -57],
          [32, -46],
          [32, -2],
          [-25, 3],
          [-30, -7],
        ],
        "#9e7d5c",
        "#2d2d3b",
        3,
      );
      polygon(
        c,
        [
          [-25, -45],
          [23, -48],
          [23, -6],
          [-23, -3],
        ],
        "#755940",
        "#c19f79",
        3,
      );
      line(
        c,
        [
          [-23, -44],
          [22, -6],
        ],
        "#c4a480",
        6,
      );
      line(
        c,
        [
          [22, -45],
          [-22, -5],
        ],
        "#c4a480",
        6,
      );
    }
    c.restore();
  }
}

function drawHumanoid(c, actor, time, scale = 1) {
  let d = actor.def,
    id = d.id || actor.kind;
  let swing = actor.moving ? Math.sin(time * 11) * 16 : Math.sin(time * 3) * 2;
  let attacking = actor.attackAnim > 0;
  let reach = attacking
    ? Math.sin(clamp(actor.attackAnim / 0.32, 0, 1) * Math.PI) * 40 + 20
    : 0;
  let kick = attacking && actor.lastAttack === "heavy" ? reach : 0;
  let col = d.color,
    trim = d.trim,
    skin = d.skin || "#ca9a79";
  let wide = id === "colossus" || id === "heavy" ? 1.23 : 1;

  c.save();
  c.scale(scale * wide * (actor.facing || 1), scale);
  if (actor.stun > 0.05) c.rotate(-0.12);
  c.translate(0, actor.z > 0 ? 0 : Math.sin(time * 3) * 2);

  if (["storm", "gambit", "rogue", "jean"].includes(id)) {
    let cape =
      id === "storm" ? "#dce3ef" : id === "jean" ? "#ad543a" : "#895a43";
    polygon(
      c,
      [
        [-17, -122],
        [-39, -108],
        [-49 - Math.sin(time * 4) * 7, -24],
        [-24, -39],
        [0, -19],
        [24, -47],
        [25, -112],
      ],
      cape,
      "#172236",
      3,
    );
    line(
      c,
      [
        [-30, -103],
        [-34, -37],
      ],
      id === "storm" ? "#d8bd6f" : "#bd865c",
      3,
    );
  }
  if (id === "nightcrawler") {
    let points = [];
    for (let i = 0; i <= 12; i++)
      points.push([
        -19 - i * 4,
        -40 + Math.sin(time * 4 + i * 0.38) * 18 - i * 1.5,
      ]);
    limb(c, points, skin, 5);
    let p = points[points.length - 1];
    polygon(
      c,
      [
        [p[0] - 9, p[1]],
        [p[0] + 2, p[1] - 10],
        [p[0] + 5, p[1] + 5],
      ],
      skin,
    );
  }

  limb(
    c,
    [
      [-12, -54],
      [-16 - swing * 0.5, -30],
      [-13 - swing, -9],
    ],
    trim,
    17,
  );
  polygon(
    c,
    [
      [-22 - swing, -21],
      [-7 - swing, -20],
      [1 - swing, -3],
      [-24 - swing, -3],
    ],
    col,
  );
  limb(
    c,
    [
      [-18, -105],
      [-32, -81],
      [-29 - reach * 0.3, -65],
    ],
    col,
    18,
  );
  oval(c, -29 - reach * 0.3, -63, 10, 11, trim, "#182338");
  polygon(
    c,
    [
      [-23, -115],
      [-9, -122],
      [12, -120],
      [28, -105],
      [24, -77],
      [14, -53],
      [-15, -53],
      [-25, -81],
    ],
    col,
    "#121f33",
    3,
  );
  polygon(
    c,
    [
      [-19, -110],
      [-5, -112],
      [-4, -65],
      [-16, -61],
      [-23, -82],
    ],
    "#0002",
    null,
  );
  line(
    c,
    [
      [-15, -106],
      [0, -99],
      [18, -107],
    ],
    "#ffffff44",
    3,
  );
  line(
    c,
    [
      [0, -97],
      [0, -77],
    ],
    "#15244155",
    2,
  );

  if (id === "wolverine") {
    for (let i = 0; i < 3; i++) {
      polygon(
        c,
        [
          [-24, -105 + i * 12],
          [-10, -99 + i * 12],
          [-23, -94 + i * 12],
        ],
        trim,
        null,
      );
      polygon(
        c,
        [
          [25, -105 + i * 12],
          [11, -99 + i * 12],
          [22, -94 + i * 12],
        ],
        trim,
        null,
      );
    }
    polygon(
      c,
      [
        [-25, -113],
        [-10, -118],
        [-18, -99],
        [-32, -101],
      ],
      trim,
    );
  } else if (id === "cyclops") {
    line(
      c,
      [
        [-15, -116],
        [-12, -61],
      ],
      trim,
      8,
    );
    line(
      c,
      [
        [-22, -88],
        [24, -88],
      ],
      trim,
      7,
    );
    badge(c, -12, -88, 8);
  } else if (id === "gambit") {
    for (let i = 0; i < 3; i++)
      line(
        c,
        [
          [-14, -96 + i * 11],
          [15, -96 + i * 11],
        ],
        "#d47cb4",
        3,
      );
    polygon(
      c,
      [
        [-25, -116],
        [-8, -111],
        [-20, -58],
        [-35, -26],
        [-32, -101],
      ],
      "#a97451",
    );
    polygon(
      c,
      [
        [20, -114],
        [27, -105],
        [34, -29],
        [14, -58],
        [9, -108],
      ],
      "#a97451",
    );
  } else if (id === "rogue") {
    polygon(
      c,
      [
        [-10, -120],
        [11, -117],
        [18, -70],
        [3, -58],
        [-14, -76],
      ],
      trim,
    );
    polygon(
      c,
      [
        [-25, -118],
        [-6, -115],
        [-17, -78],
        [-28, -83],
      ],
      "#845840",
    );
    badge(c, -15, -102);
  } else if (id === "nightcrawler") {
    polygon(
      c,
      [
        [-26, -119],
        [-5, -92],
        [0, -59],
        [9, -94],
        [29, -116],
        [24, -82],
        [12, -53],
        [-13, -53],
        [-23, -86],
      ],
      "#17243c",
    );
    line(
      c,
      [
        [-28, -121],
        [-8, -103],
      ],
      "#eeeedd",
      6,
    );
    line(
      c,
      [
        [28, -121],
        [11, -102],
      ],
      "#eeeedd",
      6,
    );
  } else if (id === "colossus") {
    polygon(
      c,
      [
        [-27, -116],
        [-13, -123],
        [0, -94],
        [14, -122],
        [29, -114],
        [16, -79],
        [-13, -79],
      ],
      trim,
    );
  } else if (id === "jean") {
    polygon(
      c,
      [
        [-19, -116],
        [-8, -103],
        [0, -90],
        [11, -102],
        [24, -115],
        [15, -83],
        [-12, -82],
      ],
      trim,
    );
    badge(c, 0, -91, 9);
  } else if (id === "storm") {
    badge(c, 0, -101, 8);
    line(
      c,
      [
        [-18, -115],
        [-29, -68],
      ],
      trim,
      3,
    );
    line(
      c,
      [
        [22, -115],
        [32, -66],
      ],
      trim,
      3,
    );
  } else {
    polygon(
      c,
      [
        [-19, -108],
        [18, -108],
        [21, -85],
        [-20, -85],
      ],
      trim,
    );
    for (let i = 0; i < 3; i++)
      line(
        c,
        [
          [-14, -100 + i * 5],
          [14, -100 + i * 5],
        ],
        col,
        2,
      );
    if (id === "sewer") {
      oval(c, 0, -90, 22, 30, "#c5b16f", "#344133", 3);
      line(
        c,
        [
          [-19, -90],
          [20, -90],
        ],
        "#7f7c50",
        3,
      );
    }
    if (id === "wizard") star(c, 0, -95, 13, "#f2d57d", 5);
  }

  line(
    c,
    [
      [-16, -57],
      [15, -57],
    ],
    trim,
    8,
  );
  badge(c, 1, -57, 6);
  limb(
    c,
    [
      [11, -52],
      [17 + swing * 0.4 + kick * 0.3, -29 - kick * 0.4],
      [16 + swing + kick, -8 - kick * 0.5],
    ],
    col,
    19,
  );
  polygon(
    c,
    [
      [7 + swing + kick, -24 - kick * 0.5],
      [25 + swing + kick, -22 - kick * 0.5],
      [37 + swing + kick, -3 - kick * 0.5],
      [7 + swing + kick, -3 - kick * 0.5],
    ],
    trim,
  );

  limb(
    c,
    [
      [1, -117],
      [3, -126],
    ],
    skin,
    12,
  );
  oval(c, 4, -139, 17, 23, skin, "#172438", 2.5);
  oval(c, 18, -139, 4, 7, skin, "#344155", 1.5);
  polygon(
    c,
    [
      [17, -139],
      [24, -134],
      [17, -130],
    ],
    skin,
    null,
  );
  line(
    c,
    [
      [8, -125],
      [17, -127],
    ],
    "#754e4c",
    2,
  );
  line(
    c,
    [
      [3, -144],
      [10, -143],
    ],
    "#4b3138",
    2,
  );
  oval(c, 9, -140, 2, 2, "#172438");

  if (id === "wolverine") {
    polygon(
      c,
      [
        [-14, -132],
        [-24, -175],
        [-4, -159],
        [7, -161],
        [30, -179],
        [23, -139],
        [14, -133],
        [8, -146],
        [-1, -145],
        [-3, -132],
      ],
      col,
    );
    polygon(
      c,
      [
        [-13, -155],
        [-7, -141],
        [0, -140],
        [-2, -155],
      ],
      trim,
      null,
    );
    polygon(
      c,
      [
        [13, -155],
        [10, -140],
        [21, -141],
        [25, -162],
      ],
      trim,
      null,
    );
    line(
      c,
      [
        [-5, -142],
        [0, -143],
      ],
      "#fff",
      2,
    );
    line(
      c,
      [
        [12, -143],
        [19, -144],
      ],
      "#fff",
      2,
    );
  } else if (id === "cyclops") {
    polygon(
      c,
      [
        [-14, -144],
        [-15, -160],
        [-3, -169],
        [12, -165],
        [22, -151],
        [8, -154],
      ],
      "#71472f",
    );
    polygon(
      c,
      [
        [-12, -148],
        [21, -148],
        [23, -137],
        [-12, -137],
      ],
      trim,
    );
    line(
      c,
      [
        [-8, -142],
        [19, -142],
      ],
      "#fa4a59",
      5,
    );
    line(
      c,
      [
        [-4, -143],
        [18, -143],
      ],
      "#ffe8b9",
      1,
    );
  } else if (id === "gambit") {
    polygon(
      c,
      [
        [-13, -139],
        [-23, -156],
        [-11, -155],
        [-13, -171],
        [2, -162],
        [11, -169],
        [23, -153],
        [11, -155],
        [-5, -153],
      ],
      "#674033",
    );
    line(
      c,
      [
        [4, -142],
        [11, -142],
      ],
      "#fb7194",
      3,
    );
    line(
      c,
      [
        [15, -143],
        [20, -143],
      ],
      "#fb7194",
      2,
    );
    line(
      c,
      [
        [-12, -145],
        [-9, -126],
        [0, -120],
      ],
      trim,
      5,
    );
  } else if (id === "storm") {
    polygon(
      c,
      [
        [-16, -129],
        [-26, -145],
        [-19, -164],
        [2, -176],
        [22, -167],
        [29, -150],
        [24, -146],
        [11, -158],
        [-2, -153],
        [-10, -125],
        [-27, -101],
        [-21, -136],
      ],
      "#f4f0f9",
    );
    polygon(
      c,
      [
        [-13, -157],
        [1, -168],
        [19, -158],
        [12, -155],
        [1, -161],
      ],
      trim,
    );
    line(
      c,
      [
        [5, -142],
        [11, -142],
      ],
      "#fff",
      3,
    );
    line(
      c,
      [
        [15, -143],
        [21, -143],
      ],
      "#fff",
      2,
    );
  } else if (id === "rogue") {
    polygon(
      c,
      [
        [-15, -119],
        [-27, -131],
        [-23, -159],
        [-12, -171],
        [15, -169],
        [29, -154],
        [27, -142],
        [15, -153],
        [0, -155],
        [-9, -131],
        [-3, -114],
      ],
      "#a15c38",
    );
    polygon(
      c,
      [
        [-10, -166],
        [1, -170],
        [12, -166],
        [5, -148],
        [-6, -144],
      ],
      "#f4ede4",
      null,
    );
    line(
      c,
      [
        [-15, -156],
        [20, -156],
      ],
      "#438164",
      4,
    );
  } else if (id === "nightcrawler") {
    polygon(
      c,
      [
        [-15, -139],
        [-22, -164],
        [-6, -158],
        [-4, -171],
        [9, -161],
        [17, -166],
        [25, -151],
        [11, -153],
        [-5, -149],
      ],
      "#192b44",
    );
    polygon(
      c,
      [
        [-13, -143],
        [-25, -151],
        [-18, -134],
      ],
      skin,
    );
    line(
      c,
      [
        [4, -141],
        [11, -142],
      ],
      "#f7e77e",
      3,
    );
    line(
      c,
      [
        [12, -126],
        [18, -129],
      ],
      "#fff",
      2,
    );
  } else if (id === "colossus") {
    polygon(
      c,
      [
        [-13, -148],
        [-13, -160],
        [3, -166],
        [19, -159],
        [22, -148],
        [9, -152],
        [-4, -152],
      ],
      "#1b2c40",
    );
    for (let i = 0; i < 4; i++)
      line(
        c,
        [
          [-11, -144 + i * 6],
          [15, -144 + i * 6],
        ],
        "#6b8ba3",
        1.5,
      );
    line(
      c,
      [
        [3, -143],
        [10, -143],
      ],
      "#fff",
      2,
    );
  } else if (id === "jean") {
    polygon(
      c,
      [
        [-17, -118],
        [-27, -134],
        [-22, -160],
        [-7, -171],
        [15, -170],
        [27, -155],
        [25, -143],
        [10, -155],
        [-6, -148],
        [-6, -123],
      ],
      "#b8573d",
    );
    line(
      c,
      [
        [-13, -151],
        [-3, -155],
        [14, -154],
      ],
      "#2c527f",
      5,
    );
  } else if (id === "assassin" || id === "ninja") {
    polygon(
      c,
      [
        [-13, -149],
        [-11, -161],
        [12, -161],
        [23, -148],
        [21, -128],
        [-10, -129],
      ],
      col,
    );
    line(
      c,
      [
        [-10, -144],
        [21, -144],
      ],
      trim,
      6,
    );
    line(
      c,
      [
        [2, -143],
        [17, -143],
      ],
      "#fff0bb",
      2,
    );
    line(
      c,
      [
        [-13, -148],
        [-39, -153],
        [-47, -143],
      ],
      trim,
      7,
    );
  } else if (id === "sewer") {
    oval(c, 4, -140, 20, 20, "#84a76e", "#2b4031", 2);
    line(
      c,
      [
        [-14, -145],
        [24, -145],
      ],
      trim,
      9,
    );
    line(
      c,
      [
        [4, -145],
        [10, -145],
      ],
      "#fff",
      3,
    );
    polygon(
      c,
      [
        [-10, -161],
        [0, -181],
        [18, -171],
        [22, -159],
      ],
      "#efe1c2",
    );
  } else if (id === "wizard") {
    polygon(
      c,
      [
        [-23, -154],
        [-4, -194],
        [25, -153],
      ],
      trim,
    );
    oval(c, 0, -153, 30, 6, col, "#1d2b41");
    star(c, -1, -169, 6, "#fff", 5);
  } else {
    polygon(
      c,
      [
        [-15, -137],
        [-18, -156],
        [-6, -166],
        [15, -163],
        [26, -150],
        [22, -134],
        [14, -137],
        [13, -147],
        [-6, -145],
        [-6, -134],
      ],
      col,
    );
    line(
      c,
      [
        [-5, -144],
        [20, -144],
      ],
      trim,
      5,
    );
  }

  let fx = attacking ? 42 + reach : 31;
  let fy = attacking ? -100 - reach * 0.15 : -72;
  limb(
    c,
    [
      [21, -107],
      [32 + reach * 0.35, -88 - reach * 0.2],
      [fx, fy],
    ],
    id === "colossus" ? skin : col,
    20,
    id === "colossus" ? "#edfaff88" : null,
  );
  oval(c, fx, fy, 11, 12, trim, "#16253b", 2);

  if (id === "colossus") {
    for (let i = 0; i < 4; i++)
      line(
        c,
        [
          [25 + i * 3, -100],
          [35 + i * 3, -94],
        ],
        "#5d7c96",
        1.5,
      );
  }
  if (id === "wolverine") {
    for (let i = 0; i < 3; i++)
      line(
        c,
        [
          [fx + 7, fy - 6 + i * 5],
          [fx + 40 + reach * 0.1, fy - 13 + i * 5],
        ],
        "#edfaff",
        3,
      );
  }
  if (id === "gambit") {
    line(
      c,
      [
        [fx - 22, fy + 63],
        [fx + 24 + reach * 0.2, fy - 85],
      ],
      "#101b2f",
      9,
    );
    line(
      c,
      [
        [fx - 22, fy + 63],
        [fx + 24 + reach * 0.2, fy - 85],
      ],
      "#b0c7dc",
      5,
    );
    line(
      c,
      [
        [fx - 18, fy + 50],
        [fx - 6, fy + 11],
      ],
      "#e59ddd",
      2,
    );
  }
  if (id === "shield") {
    polygon(
      c,
      [
        [fx - 12, -106],
        [fx + 26, -112],
        [fx + 34, -59],
        [fx + 8, -36],
        [fx - 10, -58],
      ],
      "#8b9fb7",
      "#1d314b",
      4,
    );
    line(
      c,
      [
        [fx + 10, -100],
        [fx + 16, -58],
      ],
      "#dfebf7",
      5,
    );
  }
  if (id === "gunner") {
    polygon(
      c,
      [
        [fx - 10, fy - 10],
        [fx + 40, fy - 14],
        [fx + 44, fy - 2],
        [fx + 3, fy + 4],
        [fx, fy + 17],
        [fx - 9, fy + 14],
      ],
      "#2b4053",
      "#a3b4c4",
      2,
    );
    oval(c, fx + 40, fy - 7, 5, 6, trim);
  }
  if (id === "assassin")
    line(
      c,
      [
        [fx, fy],
        [fx + 42, fy - 24],
      ],
      "#e9effa",
      5,
    );
  if (id === "storm" || id === "jean") {
    oval(
      c,
      fx,
      fy,
      15 + Math.sin(time * 7) * 3,
      15,
      null,
      id === "storm" ? "#bcefff" : "#fba8df",
      2,
    );
    star(c, fx + 4, fy - 4, 7, id === "storm" ? "#fff" : "#ffd1f1", 4);
  }
  if (actor.weapon) {
    let type = actor.weapon.type;
    line(
      c,
      [
        [fx - 4, fy + 15],
        [fx + 58, fy - 48],
      ],
      type === "bat" ? "#d3ae84" : "#bac8db",
      type === "bat" ? 10 : 7,
    );
    if (type === "blaster")
      polygon(
        c,
        [
          [fx - 5, fy - 15],
          [fx + 45, fy - 15],
          [fx + 45, fy],
          [fx, fy + 8],
        ],
        "#80cfde",
        "#2c425b",
        3,
      );
  }
  c.restore();
}

function drawDrone(c, actor, time) {
  c.save();
  c.scale(actor.facing, 1);
  c.translate(0, -35 - Math.sin(time * 5) * 8);
  oval(c, 0, 25, 36, 9, "#e979cb33");
  polygon(
    c,
    [
      [-35, -49],
      [-24, -76],
      [23, -76],
      [36, -48],
      [24, -21],
      [-24, -21],
    ],
    "#9380a4",
    "#1f3049",
    3,
  );
  polygon(
    c,
    [
      [-21, -65],
      [21, -65],
      [24, -43],
      [-23, -43],
    ],
    "#3c3456",
    "#cfb2d1",
    3,
  );
  line(
    c,
    [
      [-14, -52],
      [15, -52],
    ],
    "#ff92a2",
    5,
  );
  for (let side of [-1, 1]) {
    limb(
      c,
      [
        [side * 28, -48],
        [side * 46, -26],
        [side * 48, -4],
      ],
      "#766692",
      15,
    );
    oval(c, side * 48, -3, 9, 7, "#f391c2", "#392740");
    polygon(
      c,
      [
        [side * 14, -22],
        [side * 26, -8],
        [side * 17, 10],
        [side * 5, -9],
      ],
      "#ba9bb8",
    );
  }
  star(c, 0, -5, 11 + Math.sin(time * 14) * 3, "#abd7ff", 5);
  c.restore();
}

function drawBoss(c, boss, time) {
  let d = boss.def,
    id = d.id,
    col = d.color,
    trim = d.trim,
    skin = d.skin;
  let step = boss.moving ? Math.sin(time * 8) * 10 : Math.sin(time * 2) * 2;
  let strike = boss.action === "charge" || boss.attackAnim > 0.15;

  c.save();
  c.scale(boss.facing * d.size, d.size);
  if (boss.stun > 0) c.rotate(-0.08);

  if (id === "magneto" || id === "sinister") {
    let points = [
      [-22, -135],
      [-48, -114],
      [-60 - Math.sin(time * 4) * 7, -16],
    ];
    for (let i = 0; i < 6; i++) points.push([-47 + i * 18, -9 - (i % 2) * 24]);
    points.push([43, -104], [23, -135]);
    polygon(c, points, id === "magneto" ? "#68458b" : "#283b51", "#142236", 3);
    for (let i = 0; i < 5; i++)
      line(
        c,
        [
          [-18 + i * 9, -124],
          [-45 + i * 21, -18],
        ],
        trim,
        2,
      );
  }

  if (["trask", "nimrod", "apocalypse"].includes(id)) {
    for (let side of [-1, 1]) {
      let x = side * 19,
        k = step * side;
      limb(
        c,
        [
          [x, -64],
          [x + side * 5, -36],
          [x + k, -10],
        ],
        col,
        25,
      );
      oval(c, x + side * 4, -36, 13, 12, trim, "#223550", 3);
      polygon(
        c,
        [
          [x + k - 15, -22],
          [x + k + 13, -22],
          [x + k + 24, -3],
          [x + k - 21, -3],
        ],
        trim,
        "#22344b",
        3,
      );
      polygon(
        c,
        [
          [side * 23, -139],
          [side * 46, -149],
          [side * 65, -128],
          [side * 52, -102],
          [side * 26, -112],
        ],
        trim,
        "#1c304b",
        3,
      );
      let fx = side * (strike ? 76 : 51),
        fy = strike ? -95 : -72;
      limb(
        c,
        [
          [side * 45, -119],
          [side * 57, -96],
          [fx, fy],
        ],
        col,
        27,
      );
      polygon(
        c,
        [
          [fx - 16, fy - 18],
          [fx + 16, fy - 18],
          [fx + 19, fy + 11],
          [fx - 17, fy + 13],
        ],
        trim,
        "#263a53",
        3,
      );
      oval(
        c,
        fx,
        fy,
        8,
        9,
        id === "nimrod" ? "#fa95d9" : "#95eaff",
        "#36445a",
        2,
      );
      for (let j = 0; j < 3; j++)
        line(
          c,
          [
            [fx - 12, fy + j * 5],
            [fx + 10, fy + j * 5],
          ],
          col,
          1.5,
        );
    }
    polygon(
      c,
      [
        [-31, -135],
        [31, -135],
        [39, -104],
        [25, -64],
        [-26, -64],
        [-39, -103],
      ],
      col,
      "#1c2f49",
      3,
    );
    polygon(
      c,
      [
        [-29, -126],
        [0, -111],
        [29, -126],
        [24, -91],
        [0, -82],
        [-24, -91],
      ],
      trim,
      "#2a405a",
      2,
    );
    oval(
      c,
      0,
      -107,
      13,
      15,
      id === "nimrod" ? "#f79dd9" : "#a3efff",
      "#36506a",
      4,
    );
    for (let j = 0; j < 3; j++)
      line(
        c,
        [
          [-21, -81 + j * 6],
          [21, -81 + j * 6],
        ],
        trim,
        3,
      );
    polygon(
      c,
      [
        [-24, -62],
        [24, -62],
        [19, -48],
        [-19, -48],
      ],
      trim,
      "#233750",
      3,
    );

    if (id === "trask") {
      polygon(
        c,
        [
          [-19, -138],
          [-23, -169],
          [-13, -183],
          [16, -182],
          [24, -165],
          [19, -137],
        ],
        "#b7a1c5",
        "#25334a",
        3,
      );
      polygon(
        c,
        [
          [-13, -169],
          [15, -169],
          [17, -145],
          [-13, -145],
        ],
        "#655479",
      );
      line(
        c,
        [
          [-11, -163],
          [13, -163],
        ],
        "#ffaa92",
        5,
      );
      line(
        c,
        [
          [-8, -148],
          [10, -148],
        ],
        "#f0d1e7",
        4,
      );
      oval(c, 0, -106, 8, 10, "#2b3b50");
      oval(c, 0, -109, 4, 5, "#e7bc9a");
      line(
        c,
        [
          [-5, -100],
          [5, -100],
        ],
        "#c1e3f5",
        3,
      );
    } else if (id === "nimrod") {
      polygon(
        c,
        [
          [-23, -139],
          [-28, -163],
          [-18, -180],
          [17, -180],
          [30, -162],
          [23, -138],
        ],
        "#f4dbeb",
        "#51415d",
        3,
      );
      polygon(
        c,
        [
          [-20, -164],
          [20, -164],
          [15, -146],
          [-14, -146],
        ],
        "#825578",
      );
      line(
        c,
        [
          [-14, -158],
          [14, -158],
        ],
        "#fff1fa",
        5,
      );
      polygon(
        c,
        [
          [-36, -137],
          [-8, -141],
          [0, -119],
          [8, -141],
          [36, -137],
          [19, -114],
          [-19, -114],
        ],
        "#ecc2df",
      );
    } else {
      oval(c, 0, -155, 23, 28, skin, "#263c57", 3);
      polygon(
        c,
        [
          [-22, -162],
          [-14, -180],
          [14, -180],
          [22, -162],
          [12, -168],
          [-12, -168],
        ],
        "#294360",
      );
      line(
        c,
        [
          [-14, -158],
          [-5, -158],
        ],
        "#f3b486",
        3,
      );
      line(
        c,
        [
          [6, -158],
          [15, -158],
        ],
        "#f3b486",
        3,
      );
      polygon(
        c,
        [
          [-15, -147],
          [-7, -145],
          [-5, -134],
          [7, -134],
          [9, -145],
          [16, -147],
          [12, -129],
          [-12, -129],
        ],
        "#304e73",
      );
      for (let side of [-1, 1])
        line(
          c,
          [
            [side * 17, -142],
            [side * 31, -121],
            [side * 51, -114],
            [side * 46, -86],
          ],
          "#b1d1df",
          9,
        );
      if (strike) {
        limb(
          c,
          [
            [45, -105],
            [83, -102],
            [114, -102],
          ],
          "#89b0c6",
          28,
        );
        polygon(
          c,
          [
            [103, -119],
            [140, -102],
            [103, -84],
          ],
          "#bed3df",
        );
      }
    }
  } else if (id === "juggernaut") {
    for (let side of [-1, 1]) {
      limb(
        c,
        [
          [side * 20, -57],
          [side * 28, -31],
          [side * 27 + side * step, -9],
        ],
        "#804939",
        28,
      );
      let x = side * 27 + side * step;
      polygon(
        c,
        [
          [x - 18, -24],
          [x + 16, -24],
          [x + 25, -3],
          [x - 21, -3],
        ],
        "#a96146",
        "#392939",
        3,
      );
      let fx = side * (strike ? 80 : 57),
        fy = strike ? -105 : -65;
      limb(
        c,
        [
          [side * 38, -119],
          [side * 59, -98],
          [fx, fy],
        ],
        skin,
        36,
      );
      line(
        c,
        [
          [side * 49, -106],
          [side * 60, -93],
        ],
        col,
        16,
      );
      oval(c, fx, fy, 22, 24, col, "#442c37", 3);
      for (let i = 0; i < 3; i++)
        line(
          c,
          [
            [fx - 12, fy - 4 + i * 6],
            [fx + 13, fy - 4 + i * 6],
          ],
          trim,
          2,
        );
    }
    polygon(
      c,
      [
        [-45, -126],
        [-22, -143],
        [26, -141],
        [47, -121],
        [41, -88],
        [25, -54],
        [-26, -54],
        [-43, -90],
      ],
      col,
      "#38283a",
      4,
    );
    line(
      c,
      [
        [-35, -116],
        [0, -109],
        [35, -116],
      ],
      trim,
      5,
    );
    line(
      c,
      [
        [-26, -66],
        [26, -66],
      ],
      trim,
      11,
    );
    oval(c, 0, -142, 36, 40, col, "#3c2836", 4);
    polygon(
      c,
      [
        [-24, -146],
        [-19, -154],
        [20, -154],
        [26, -142],
        [19, -123],
        [-19, -123],
      ],
      "#432b30",
      trim,
      3,
    );
    line(
      c,
      [
        [-15, -144],
        [-5, -144],
      ],
      "#fff2cb",
      3,
    );
    line(
      c,
      [
        [6, -144],
        [16, -144],
      ],
      "#fff2cb",
      3,
    );
    line(
      c,
      [
        [-10, -131],
        [12, -131],
      ],
      skin,
      5,
    );
    for (let i = 0; i < 8; i++)
      oval(
        c,
        Math.cos((i * Math.PI) / 7) * 30,
        -141 + Math.sin((i * Math.PI) / 7) * 31,
        2,
        2,
        "#efb88b",
      );
    if (boss.armour > 0) oval(c, 0, -92, 78, 97, null, "#ffc08b88", 4);
  } else {
    for (let side of [-1, 1]) {
      let x = side * 21 + side * step;
      limb(
        c,
        [
          [side * 15, -58],
          [side * 21, -31],
          [x, -9],
        ],
        col,
        21,
      );
      polygon(
        c,
        [
          [x - 13, -29],
          [x + 12, -28],
          [x + 23, -3],
          [x - 17, -3],
        ],
        trim,
      );
    }
    polygon(
      c,
      [
        [-30, -125],
        [-11, -136],
        [14, -135],
        [32, -120],
        [27, -89],
        [18, -58],
        [-19, -58],
        [-30, -91],
      ],
      col,
      "#233247",
      3,
    );
    for (let side of [-1, 1]) {
      let fx = side * (strike ? 70 : 40),
        fy = strike ? -105 : -78;
      limb(
        c,
        [
          [side * 28, -115],
          [side * 43, -91],
          [fx, fy],
        ],
        id === "sabretooth" ? skin : col,
        23,
      );
      oval(c, fx, fy, 13, 15, trim, "#263447", 2);
      if (id === "sabretooth")
        for (let j = 0; j < 4; j++)
          line(
            c,
            [
              [fx + side * 8, fy - 9 + j * 6],
              [fx + side * 29, fy - 18 + j * 6],
            ],
            "#f5e6c8",
            3,
          );
      if (id === "magneto")
        oval(c, fx, fy, 20 + Math.sin(time * 6) * 4, 20, null, "#e5b4ff", 2);
    }
    oval(c, 2, -149, 20, 27, skin, "#263346", 3);
    if (id === "sabretooth") {
      let fur = [];
      for (let i = 0; i < 14; i++) {
        let a = Math.PI + (i * Math.PI) / 13;
        fur.push([
          Math.cos(a) * (i % 2 ? 42 : 34),
          -119 + Math.sin(a) * (i % 2 ? 29 : 21),
        ]);
      }
      fur.push([22, -105], [5, -118], [-22, -105]);
      polygon(c, fur, "#e4d1a3");
      polygon(
        c,
        [
          [-17, -138],
          [-29, -158],
          [-20, -178],
          [-12, -171],
          [-6, -186],
          [5, -178],
          [15, -184],
          [22, -169],
          [30, -169],
          [26, -143],
          [13, -161],
          [-5, -158],
        ],
        "#d1b37b",
      );
      line(
        c,
        [
          [4, -148],
          [15, -149],
        ],
        "#804d32",
        3,
      );
      polygon(
        c,
        [
          [8, -134],
          [18, -135],
          [15, -124],
        ],
        "#fff2dc",
      );
    } else if (id === "magneto") {
      polygon(
        c,
        [
          [-20, -132],
          [-26, -158],
          [-17, -178],
          [5, -185],
          [24, -172],
          [28, -151],
          [21, -127],
          [13, -132],
          [16, -156],
          [5, -162],
          [-8, -155],
          [-6, -134],
        ],
        col,
        trim,
        4,
      );
      line(
        c,
        [
          [-8, -149],
          [-2, -149],
        ],
        "#fff2e4",
        2,
      );
      line(
        c,
        [
          [7, -149],
          [13, -149],
        ],
        "#fff2e4",
        2,
      );
      line(
        c,
        [
          [-3, -137],
          [9, -137],
        ],
        "#774858",
        2,
      );
      polygon(
        c,
        [
          [-33, -126],
          [-17, -137],
          [17, -136],
          [34, -126],
          [27, -111],
          [-25, -111],
        ],
        trim,
      );
      line(
        c,
        [
          [-16, -68],
          [17, -68],
        ],
        trim,
        9,
      );
      if (boss.shield > 0) {
        oval(c, 0, -90, 58, 101, "#c195ff11", "#dfb8ff", 3);
        oval(c, 0, -90, 65, 110, null, "#c895ff88", 2);
      }
    } else if (id === "sinister") {
      polygon(
        c,
        [
          [-20, -157],
          [-18, -174],
          [1, -181],
          [22, -172],
          [23, -157],
          [5, -168],
          [-6, -166],
        ],
        "#17283e",
      );
      polygon(
        c,
        [
          [2, -166],
          [8, -157],
          [2, -149],
          [-4, -157],
        ],
        "#fa6a7f",
      );
      polygon(
        c,
        [
          [0, -121],
          [12, -108],
          [0, -94],
          [-12, -108],
        ],
        "#ed6783",
        "#c3ddeb",
        2,
      );
      line(
        c,
        [
          [-14, -146],
          [-4, -147],
        ],
        "#fb8592",
        3,
      );
      line(
        c,
        [
          [8, -147],
          [18, -147],
        ],
        "#fb8592",
        3,
      );
      for (let j = 0; j < 3; j++)
        line(
          c,
          [
            [-18, -87 + j * 7],
            [18, -87 + j * 7],
          ],
          trim,
          4,
        );
    } else {
      polygon(
        c,
        [
          [-18, -142],
          [-23, -164],
          [-15, -178],
          [11, -177],
          [24, -163],
          [18, -141],
          [11, -158],
          [-9, -158],
        ],
        "#302d37",
      );
      polygon(
        c,
        [
          [-24, -125],
          [-5, -119],
          [0, -70],
          [-17, -88],
        ],
        "#eee0d6",
      );
      polygon(
        c,
        [
          [23, -125],
          [5, -119],
          [0, -70],
          [18, -88],
        ],
        "#eee0d6",
      );
      polygon(
        c,
        [
          [-7, -120],
          [0, -110],
          [7, -120],
          [2, -86],
          [-3, -86],
        ],
        "#a94452",
      );
      if (boss.absorb > 0) oval(c, 0, -88, 52, 78, null, "#edbc79", 4);
    }
  }
  if (boss.phase === 2)
    star(c, -3, -197, 10 + Math.sin(time * 8) * 3, "#ff9479", 4);
  c.restore();
}

class Actor {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });
    this.z = 0;
    this.vz = 0;
    this.kx = 0;
    this.ky = 0;
    this.radius = 27;
    this.facing = 1;
    this.hp = 100;
    this.maxHp = 100;
    this.dead = false;
    this.stun = 0;
    this.invuln = 0;
    this.flash = 0;
    this.attackAnim = 0;
    this.cooldown = 0;
    this.moving = false;
  }
  timers(dt) {
    for (let key of ["stun", "invuln", "flash", "attackAnim", "cooldown"])
      this[key] = Math.max(0, this[key] - dt);
    this.x += this.kx * dt;
    this.y += this.ky * dt;
    this.kx *= Math.exp(-8 * dt);
    this.ky *= Math.exp(-8 * dt);
    if (this.z > 0 || this.vz > 0) {
      this.z += this.vz * dt;
      this.vz -= 920 * dt;
      if (this.z <= 0) {
        this.z = 0;
        this.vz = 0;
      }
    }
    this.x = clamp(this.x, 40, 4160);
    this.y = clamp(this.y, TOP, BOTTOM);
  }
  hurt(amount, source, options = {}) {
    if (this.dead || this.invuln > 0) return false;
    amount = Math.max(1, Math.round(amount * (1 - (this.def?.defence || 0))));
    this.hp = Math.max(0, this.hp - amount);
    this.flash = 0.12;
    this.stun = options.heavy ? 0.45 : 0.19;
    this.kx =
      Math.sign(this.x - source.x || source.facing || 1) *
      (options.knock || 90);
    if (options.launch) {
      this.vz = 330;
      this.z = Math.max(2, this.z);
    }
    this.game.burst(
      this.x,
      this.y,
      this.z + 70,
      this.def?.trim || "#ffdfa1",
      options.heavy ? 16 : 9,
    );
    this.game.float(
      this.x,
      this.y - this.z - 110,
      String(amount),
      options.critical ? "#ffd474" : "#fff",
      options.critical ? 28 : 22,
    );
    this.game.shake = Math.max(this.game.shake, options.heavy ? 8 : 3);
    this.game.audio.play(this instanceof Boss ? "boss" : "hit");
    if (this.hp <= 0) this.die();
    return true;
  }
  die() {
    this.dead = true;
  }
  draw(c) {
    oval(
      c,
      this.x,
      this.y + 2,
      this.radius * (this instanceof Boss ? 1.8 : 1.25),
      this.radius * 0.3,
      "#0006",
    );
    if (this.invuln > 0 && Math.floor(this.game.time * 17) % 2 === 0)
      c.globalAlpha = 0.45;
    c.save();
    c.translate(this.x, this.y - this.z);
    if (this.flash > 0) {
      c.shadowColor = "#fff";
      c.shadowBlur = 20;
    }
    if (this instanceof Boss) drawBoss(c, this, this.game.time);
    else if (this.kind === "drone") drawDrone(c, this, this.game.time);
    else
      drawHumanoid(
        c,
        this,
        this.game.time,
        this === this.game.player ? 1.05 : this.kind === "heavy" ? 1.2 : 1,
      );
    c.restore();
    c.globalAlpha = 1;
    if (
      this !== this.game.player &&
      !(this instanceof Boss) &&
      this.hp < this.maxHp
    ) {
      c.fillStyle = "#17243c";
      c.fillRect(this.x - 25, this.y - this.z - 181, 50, 5);
      c.fillStyle = "#f19bab";
      c.fillRect(
        this.x - 25,
        this.y - this.z - 181,
        (50 * this.hp) / this.maxHp,
        5,
      );
    }
  }
}

class Player extends Actor {
  constructor(game, def) {
    super(game, 170, 555);
    this.def = def;
    this.hp = this.maxHp = def.hp;
    this.energy = 100;
    this.lives = 3;
    this.combo = 0;
    this.comboTime = 0;
    this.chain = [];
    this.chainTime = 0;
    this.specialTime = 0;
    this.specialTick = 0;
    this.weapon = null;
    this.hover = 0;
    this.buffer = null;
    this.bufferTime = 0;
    this.lifted = 0;
    this.lastAttack = "A";
  }

  update(dt) {
    this.timers(dt);
    if (this.dead) return;

    const input = this.game.input;

    this.comboTime = Math.max(0, this.comboTime - dt);
    this.chainTime = Math.max(0, this.chainTime - dt);
    this.bufferTime = Math.max(0, this.bufferTime - dt);

    if (!this.comboTime) this.combo = 0;
    if (!this.chainTime) this.chain = [];
    if (!this.bufferTime) this.buffer = null;

    this.energy = Math.min(
      100,
      this.energy + dt * (this.game.enemies.length ? 5.5 : 9),
    );

    if (this.def.id === "wolverine") {
      this.hp = Math.min(this.maxHp, this.hp + dt * 1.2);
    }

    if (this.specialTime > 0) {
      this.specialTime = Math.max(0, this.specialTime - dt);
      this.updateSpecial(dt);
    }

    for (const key of ["KeyD", "KeyS", "KeyA"]) {
      if (input.take(key)) {
        this.buffer = key;
        this.bufferTime = 0.22;
        break;
      }
    }

    this.moving = false;

    if (this.lifted > 0) {
      this.lifted -= dt;
      this.z = 105;
      this.vz = 0;
      return;
    }

    if (this.stun > 0) return;

    let dx = Number(input.down("ArrowRight")) - Number(input.down("ArrowLeft"));
    let dy = Number(input.down("ArrowDown")) - Number(input.down("ArrowUp"));

    if (dx && dy) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    let speed = this.def.speed;
    if (this.attackAnim > 0) speed *= 0.55;
    if (this.def.id === "wolverine" && this.specialTime > 0) {
      speed *= 1.25;
    }

    this.x += dx * speed * dt;
    this.y += dy * speed * 0.62 * dt;
    this.moving = !!(dx || dy);

    if (dx) this.facing = Math.sign(dx);

    const stage = this.game.stage;
    this.x = clamp(
      this.x,
      stage.arena ? this.game.camera + 50 : 45,
      stage.gate - 55,
    );
    this.y = clamp(this.y, TOP, BOTTOM);

    if (input.take("KeyW") && this.z === 0) {
      this.z = 1;
      this.vz = 490;
      this.hover = 0.85;
      this.game.audio.play("wind");
    }

    if (
      this.def.id === "storm" &&
      input.down("KeyW") &&
      this.z > 50 &&
      this.vz < 30 &&
      this.hover > 0
    ) {
      this.hover -= dt;
      this.vz = 20;
      this.game.trail(this, "#d6edff");
    }

    if (this.cooldown <= 0) {
      const action =
        this.buffer ||
        (input.down("KeyS") ? "KeyS" : input.down("KeyA") ? "KeyA" : null);

      if (action) {
        this.buffer = null;
        this.bufferTime = 0;
        if (action === "KeyD") this.special();
        else this.attack(action === "KeyS" ? "S" : "A");
      }
    }
  }

  attack(type) {
    const g = this.game;
    const heavy = type === "S";
    const id = this.def.id;

    this.lastAttack = type;
    this.attackAnim = heavy ? 0.4 : 0.28;
    this.cooldown = this.def.rate * (heavy ? 1.6 : 1);

    if (id === "wolverine" && this.specialTime > 0) {
      this.cooldown *= 0.62;
    }

    this.chain.push(type);
    this.chain = this.chain.slice(-3);
    this.chainTime = 0.95;

    const finisher = this.chain.length === 3;
    const launcher = this.chain.join("") === "AAS";
    const critical = Math.random() < 0.12;

    let damage =
      this.def.damage *
      (heavy ? 1.65 : 1) *
      (finisher ? 1.45 : 1) *
      (critical ? 1.5 : 1) *
      (this.z > 30 ? 1.3 : 1);

    // Amended: separate A and S attack ranges for Storm, Rogue and Colossus.
    let range;

    if (id === "storm") {
      // Storm: short attack / long lightning attack.
      range = heavy ? 520 : 100;
    } else if (id === "rogue") {
      // Rogue: S reaches 300 game units beyond normal range.
      range = this.def.range + (heavy ? 300 : 0);
    } else if (id === "colossus") {
      // Colossus: A keeps normal reach; S gains 250 extra game units.
      range = this.def.range + (heavy ? 250 : 0);
    } else {
      range = this.def.range + (heavy ? 30 : 0);
    }

    if (this.weapon) {
      damage += this.weapon.damage;
      range += this.weapon.range;
    }

    if (id === "rogue" && heavy) {
      this.kx = this.facing * 410;
      this.z = Math.max(this.z, 22);
      this.vz = Math.max(this.vz, 80);
      this.invuln = Math.max(this.invuln, 0.3);
      g.effect("beam", this.x, this.y - 70, "#ffd36f", 150, 0.3, -this.facing);
    }

    if (id === "nightcrawler" && heavy) {
      const target = g.enemies
        .filter((e) => !e.dead && dist(this, e) < 370)
        .sort((a, b) => dist(this, a) - dist(this, b))[0];

      g.effect("portal", this.x, this.y - 65, "#ae8bf2", 75, 0.5);

      if (target) {
        this.x = clamp(
          target.x - target.facing * 65,
          g.stage.arena ? g.camera + 50 : 45,
          g.stage.gate - 55,
        );
        this.y = target.y;
        this.facing = target.facing;
      } else {
        this.x = clamp(
          this.x + this.facing * 145,
          g.stage.arena ? g.camera + 50 : 45,
          g.stage.gate - 55,
        );
      }

      this.invuln = Math.max(this.invuln, 0.28);
      g.effect("portal", this.x, this.y - 65, "#ae8bf2", 75, 0.5);
      g.audio.play("teleport");
    }

    let shot = null;

    if (heavy && id === "cyclops") {
      shot = { type: "optic", color: "#ff5261", speed: 720 };
    } else if (id === "gambit" && !heavy) {
      shot = { type: "card", color: "#ff8bdc", speed: 530 };
    } else if (id === "jean") {
      // Amended: A fires a short-range orb; S keeps the long-range orb.
      // Travel distance: speed × lifetime.
      // A: 480 × 0.45 = approximately 216 game units.
      // S: 480 × 1.5  = approximately 720 game units.
      shot = {
        type: "orb",
        color: "#ffacdb",
        speed: 480,
        life: heavy ? 1.5 : 0.45,
      };
    }

    if (this.weapon?.type === "blaster") {
      shot = { type: "optic", color: "#90e7ff", speed: 660 };
    } else if (this.weapon?.type === "disc") {
      shot = { type: "disc", color: "#ffd87a", speed: 550 };
    }

    if (shot) {
      g.projectiles.push(
        new Projectile(
          g,
          this.x + this.facing * 40,
          this.y,
          this.z + 70,
          this.facing * shot.speed,
          0,
          damage,
          "player",
          shot.type,
          shot.color,
          {
            // Use Jean's chosen lifetime; other projectiles default to 1.5 seconds.
            life: shot.life ?? 1.5,
            pierce: finisher,
          },
        ),
      );
    }

    for (const enemy of g.enemies) {
      if (enemy.dead) continue;
      const dx = enemy.x - this.x;
      if (
        dx * this.facing > -25 &&
        Math.abs(dx) < range + enemy.radius &&
        Math.abs(enemy.y - this.y) < (heavy ? 64 : 48) &&
        Math.abs(enemy.z - this.z) < 115
      ) {
        if (shot && Math.abs(dx) > 95) continue;
        if (
          enemy.hurt(damage, this, {
            heavy,
            knock: launcher ? 300 : heavy ? 230 : 110,
            launch: launcher,
            critical,
          })
        )
          this.registerHit();
      }
    }

    for (const object of g.objects) {
      if (
        !object.dead &&
        (object.x - this.x) * this.facing > -25 &&
        Math.abs(object.x - this.x) < range &&
        Math.abs(object.y - this.y) < 60
      )
        object.hurt(damage);
    }

    if (id === "storm") {
      g.effect(
        "lightning",
        this.x + this.facing * range * 0.7,
        this.y - this.z - 40,
        "#d6edff",
        range,
        0.28,
      );
    } else {
      // Amended: allow Colossus's S slash to grow with his attack range.
      // Other attacks keep the existing visual size cap.
      let slashSize = id === "colossus" && heavy ? range : Math.min(range, 190);

      g.effect(
        "slash",
        this.x + this.facing * 35,
        this.y - this.z - 70,
        this.def.trim,
        slashSize,
        0.23,
        this.facing,
      );
    }

    if (id === "jean" && heavy) {
      for (const enemy of g.enemies) {
        if (!enemy.dead && dist(this, enemy) < 240) {
          enemy.kx = Math.sign(this.x - enemy.x) * 180;
        }
      }
    }

    g.audio.play(
      id === "wolverine"
        ? "claw"
        : id === "storm"
          ? "lightning"
          : shot
            ? "optic"
            : heavy
              ? "kick"
              : "punch",
    );

    if (critical) {
      g.float(this.x, this.y - this.z - 160, tr("critical"), "#ffd474", 20);
    }

    if (this.weapon && --this.weapon.uses <= 0) {
      this.weapon = null;
      g.float(this.x, this.y - 100, tr("broken"), "#f6b6a0", 18);
    }

    if (finisher) this.chain = [];
  }

  registerHit() {
    this.combo++;
    this.comboTime = 2.2;
    this.energy = Math.min(100, this.energy + 2.1);
    this.game.maxCombo = Math.max(this.game.maxCombo, this.combo);
    this.game.stageCombo = Math.max(this.game.stageCombo, this.combo);
    this.game.score += 10 + Math.min(this.combo, 30) * 2;
  }

  areaDamage(amount, radius, options = {}) {
    for (const enemy of this.game.enemies) {
      if (
        !enemy.dead &&
        dist(this, enemy) < radius &&
        enemy.hurt(amount, this, options)
      )
        this.registerHit();
    }
    for (const object of this.game.objects) {
      if (!object.dead && dist(this, object) < radius) object.hurt(amount);
    }
  }

  special() {
    const g = this.game;
    if (this.energy < 100) {
      g.float(this.x, this.y - 140, tr("recharge"), "#9cdfff", 18);
      this.cooldown = 0.25;
      return;
    }

    this.energy = 0;
    this.cooldown = 0.65;
    this.invuln = Math.max(this.invuln, 1);
    this.attackAnim = 0.6;
    this.specialTime = this.def.id === "wolverine" ? 7 : 2.2;
    this.specialTick = 0;
    g.shake = 11;
    g.float(this.x, this.y - 190, localPair(this.def.ability), "#ffe29b", 22);

    if (this.def.id === "cyclops") {
      g.effect("beam", this.x, this.y - 105, "#ff455c", 1200, 0.9, this.facing);
      for (const enemy of g.enemies) {
        if (
          !enemy.dead &&
          (enemy.x - this.x) * this.facing > -35 &&
          Math.abs(enemy.y - this.y) < 110
        ) {
          if (
            enemy.hurt(165, this, {
              heavy: true,
              ranged: true,
              knock: 350,
              breakShield: true,
            })
          )
            this.registerHit();
        }
      }
      for (const object of g.objects) {
        if (
          (object.x - this.x) * this.facing > -35 &&
          Math.abs(object.y - this.y) < 110
        )
          object.hurt(200);
      }
      g.audio.play("optic");
    } else if (this.def.id === "colossus") {
      this.areaDamage(155, 370, { heavy: true, launch: true, knock: 350 });
      for (const direction of [-1, 1]) {
        for (const offset of [-65, 0, 65]) {
          g.projectiles.push(
            new Projectile(
              g,
              this.x,
              this.y + offset,
              18,
              direction * 480,
              0,
              55,
              "player",
              "wave",
              "#e8d0a8",
              { pierce: true, life: 1.5 },
            ),
          );
        }
      }
      g.effect("burst", this.x, this.y - 15, "#fff0b4", 400, 1);
      g.audio.play("heavy");
    } else if (this.def.id === "rogue") {
      for (const enemy of g.enemies) {
        if (!enemy.dead && dist(this, enemy) < 360) {
          if (enemy.hurt(115, this, { heavy: true, knock: 280 })) {
            this.registerHit();
            this.hp = Math.min(this.maxHp, this.hp + 24);
            g.effect("burst", enemy.x, enemy.y - 75, "#ffe490", 90, 0.7);
          }
        }
      }
      g.effect("burst", this.x, this.y - 70, "#ffe490", 310, 1);
      g.audio.play("wind");
    } else {
      g.audio.play(
        this.def.id === "storm"
          ? "lightning"
          : this.def.id === "nightcrawler"
            ? "teleport"
            : "charge",
      );
    }
  }

  updateSpecial(dt) {
    const g = this.game;
    const id = this.def.id;

    if (id === "wolverine") {
      g.trail(this, "#ffb95b");
      return;
    }

    if (id === "jean") {
      for (const enemy of g.enemies) {
        if (
          !enemy.dead &&
          !(enemy instanceof Boss) &&
          dist(this, enemy) < 420
        ) {
          enemy.kx = Math.sign(this.x - enemy.x) * 100;
          enemy.z = Math.max(enemy.z, 60);
          enemy.vz = 20;
          enemy.stun = Math.max(enemy.stun, 0.15);
        }
      }
    }

    this.specialTick -= dt;
    if (this.specialTick > 0) return;
    this.specialTick = 0.38;

    if (id === "storm") {
      const targets = g.enemies.filter((e) => !e.dead && dist(this, e) < 720);
      for (const enemy of targets.slice(0, 5)) {
        g.effect(
          "lightning",
          enemy.x,
          enemy.y - enemy.z - 50,
          "#d6f3ff",
          100,
          0.4,
        );
        if (enemy.hurt(26, this, { heavy: true, ranged: true, knock: 30 })) {
          this.registerHit();
        }
      }
      g.audio.play("lightning");
    } else if (id === "gambit") {
      this.attackAnim = 0.25;
      g.effect("burst", this.x, this.y - 60, "#ff8ada", 220, 0.5);
      this.areaDamage(18, 240, { heavy: true, knock: 50 });
      for (let i = 0; i < 8; i++) {
        const angle = (i * TAU) / 8 + g.time;
        g.projectiles.push(
          new Projectile(
            g,
            this.x,
            this.y,
            75,
            Math.cos(angle) * 440,
            Math.sin(angle) * 140,
            20,
            "player",
            "card",
            "#ff8ada",
            { life: 1.2 },
          ),
        );
      }
    } else if (id === "nightcrawler") {
      // Amended: special attack targeting range increased from 720 to 1400.
      // Nightcrawler can now teleport to enemies farther away.
      const targets = g.enemies.filter((e) => !e.dead && dist(this, e) < 1400);

      if (targets.length) {
        const enemy = choose(targets);

        g.effect("portal", this.x, this.y - 60, "#a48af5", 85, 0.5);

        this.x = clamp(
          enemy.x - enemy.facing * 60,
          g.stage.arena ? g.camera + 50 : 45,
          g.stage.gate - 55,
        );

        this.y = enemy.y;
        this.facing = enemy.facing;
        this.invuln = Math.max(this.invuln, 0.5);
        this.attackAnim = 0.3;

        g.effect("portal", this.x, this.y - 60, "#a48af5", 85, 0.5);

        if (enemy.hurt(38, this, { heavy: true, knock: 35 })) {
          this.registerHit();
        }

        g.audio.play("teleport");
      }
    } else if (id === "jean") {
      const finish = this.specialTime < 0.4;
      g.effect("burst", this.x, this.y - 65, "#ffa5df", 380, 0.55);
      this.areaDamage(21, 420, {
        heavy: true,
        ranged: true,
        knock: finish ? 500 : 10,
        launch: finish,
      });
    }
  }

  hurt(amount, source, options = {}) {
    const hit = super.hurt(amount, source, options);
    if (hit) {
      this.invuln = Math.max(this.invuln, 1);
      this.combo = 0;
      this.chain = [];
      this.game.shake = Math.max(this.game.shake, 7);
    }
    return hit;
  }

  die() {
    this.lives--;
    this.specialTime = 0;
    this.weapon = null;
    this.lifted = 0;
    this.combo = 0;
    this.chain = [];

    if (this.lives > 0) {
      this.hp = this.maxHp;
      this.energy = Math.max(50, this.energy);
      this.invuln = 3;
      this.stun = 0.6;
      this.z = 80;
      this.vz = 0;
      this.kx = this.ky = 0;
      this.game.effect("burst", this.x, this.y - 60, "#b5ecff", 170, 0.8);
      this.game.float(this.x, this.y - 190, tr("rescue"), "#b5ecff", 24);
    } else {
      this.dead = true;
      this.game.gameOver();
    }
  }
}

class Enemy extends Actor {
  constructor(game, x, y, kind, level = 0) {
    super(game, x, y);
    this.kind = kind;
    this.def = ENEMY_TYPES[kind];
    this.hp = this.maxHp = this.def.hp * (1 + level * 0.055);
    this.ai = this.def.ai;
    this.think = rand(0.5, 1.5);
    this.windup = 0;
    this.aim = null;
    this.orbit = Math.random() < 0.5 ? -1 : 1;
    this.cooldown = rand(0.4, 1.6);
    this.retreat = 0;
    this.guard = false;
    this.lastAttack = "A";
    if (kind === "drone") this.radius = 32;
  }

  update(dt) {
    this.timers(dt);
    this.moving = false;
    if (this.dead || this.stun > 0) return;

    const p = this.game.player;
    if (p.dead) return;

    if (this.windup > 0) {
      this.windup -= dt;
      if (this.windup <= 0) this.executeAttack();
      return;
    }

    const dx = p.x - this.x;
    const dy = p.y - this.y;
    this.facing = Math.sign(dx) || this.facing;
    this.retreat = Math.max(0, this.retreat - dt);
    this.think -= dt;

    if (this.think <= 0) {
      this.think = rand(0.7, 1.7);
      this.orbit *= -1;
    }

    this.guard = this.ai === "shield" && this.cooldown > 0.7;
    let mx = 0;
    let my = 0;

    if (this.ai === "ranged") {
      if (Math.abs(dx) > 420) mx = Math.sign(dx);
      else if (Math.abs(dx) < 245) mx = -Math.sign(dx);
      if (Math.abs(dy) > 25) my = Math.sign(dy);
    } else if (this.retreat > 0) {
      mx = -Math.sign(dx);
      my = this.orbit;
    } else {
      if (Math.abs(dx) > 72) mx = Math.sign(dx);
      if (Math.abs(dy) > 30) my = Math.sign(dy);

      if (
        ["circle", "assassin"].includes(this.ai) &&
        Math.abs(dx) > 125 &&
        Math.abs(dx) < 280
      )
        my += this.orbit * 0.7;
    }

    for (const other of this.game.enemies) {
      if (other === this || other.dead) continue;
      const distance = dist(this, other);
      if (distance < 62 && distance > 0) {
        mx += Math.sign(this.x - other.x) * 0.7;
        my += Math.sign(this.y - other.y) * 0.7;
      }
    }

    const length = Math.hypot(mx, my);
    if (length > 1) {
      mx /= length;
      my /= length;
    }

    this.x += mx * this.def.speed * dt;
    this.y += my * this.def.speed * 0.62 * dt;
    this.moving = !!(mx || my);

    this.x = clamp(
      this.x,
      this.game.stage.arena
        ? this.game.camera + 55
        : Math.max(45, this.game.camera - 50),
      this.game.stage.gate - 50,
    );
    this.y = clamp(this.y, TOP + 8, BOTTOM - 8);

    const inRange =
      this.ai === "ranged"
        ? Math.abs(dx) < 550 && Math.abs(dy) < 65
        : Math.abs(dx) < 100 && Math.abs(dy) < 49;

    const attackers = this.game.enemies.filter(
      (e) => e !== this && e.windup > 0,
    ).length;

    if (this.cooldown <= 0 && inRange && attackers < 2) {
      this.windup =
        this.ai === "assassin" ? 0.36 : this.ai === "heavy" ? 0.8 : 0.58;
      this.aim = { x: p.x, y: p.y };
      this.game.effect("ring", this.x, this.y - 90, "#ffb57b", 30, this.windup);
    }
  }

  executeAttack() {
    const g = this.game;
    const p = g.player;
    this.attackAnim = 0.35;

    if (this.ai === "ranged") {
      const dx = this.aim.x - this.x;
      const dy = this.aim.y - this.y;
      const length = Math.hypot(dx, dy) || 1;
      g.projectiles.push(
        new Projectile(
          g,
          this.x,
          this.y,
          65,
          (dx / length) * 310,
          (dy / length) * 310,
          this.def.damage,
          "enemy",
          "orb",
          this.def.trim,
        ),
      );
      g.audio.play("optic");
    } else {
      if (
        Math.abs(p.x - this.x) < 115 &&
        Math.abs(p.y - this.y) < 52 &&
        p.z < 75
      )
        p.hurt(this.def.damage, this, {
          heavy: this.ai === "heavy",
          knock: 140,
        });

      g.effect(
        "slash",
        this.x,
        this.y - 70,
        this.def.trim,
        90,
        0.25,
        this.facing,
      );
    }

    this.cooldown = rand(1.1, 2.1);
    this.retreat = ["circle", "assassin"].includes(this.ai) ? 0.55 : 0.1;
  }

  hurt(amount, source, options = {}) {
    if (this.dead) return false;

    if (this.guard && !options.heavy && (source.x - this.x) * this.facing > 0) {
      amount *= 0.2;
      this.game.audio.play("shield");
      this.game.effect("ring", this.x, this.y - 75, "#bce5ff", 45, 0.25);
    }

    if (options.heavy) this.guard = false;
    const hit = super.hurt(amount, source, options);

    if (hit) {
      this.windup = 0;
      this.cooldown = Math.max(this.cooldown, 0.5);
    }
    return hit;
  }

  die() {
    this.dead = true;
    this.game.score += this.def.score;
    this.game.float(this.x, this.y - 90, `+${this.def.score}`, "#ffe19c", 18);
    this.game.burst(this.x, this.y, 70, this.def.trim, 18);

    if (Math.random() < 0.22) {
      this.game.pickups.push(
        new Pickup(
          this.game,
          this.x,
          this.y,
          choose(["health", "energy", "score"]),
        ),
      );
    }
  }
}

class Hazard {
  constructor(game, x, y, type, options = {}) {
    Object.assign(
      this,
      {
        game,
        x,
        y,
        type,
        delay: 1.2,
        radius: 80,
        damage: 20,
        aerial: false,
      },
      options,
    );

    this.total = this.delay;
    this.life = this.delay + 0.6;
    this.fired = false;
    this.dead = false;
  }

  update(dt) {
    this.delay -= dt;
    this.life -= dt;

    if (this.delay <= 0 && !this.fired) {
      this.fired = true;
      const p = this.game.player;

      const inRange =
        this.type === "traffic"
          ? Math.abs(p.y - this.y) < 38
          : Math.abs(p.x - this.x) < this.radius &&
            Math.abs(p.y - this.y) < this.radius * 0.5;

      if (inRange && (p.z < 55 || this.aerial)) {
        const hit = p.hurt(
          this.damage,
          {
            x: this.x - 1,
            y: this.y,
            facing: 1,
          },
          {
            heavy: true,
            knock: 200,
            launch: this.type === "magnet",
          },
        );

        if (hit && this.type === "magnet" && !p.dead) p.lifted = 0.8;
      }

      this.game.effect(
        ["laser", "rift"].includes(this.type) ? "lightning" : "burst",
        this.x,
        this.y,
        this.type === "acid" ? "#8fffad" : "#ffbe83",
        this.radius,
        0.6,
      );
      this.game.audio.play(this.type === "laser" ? "optic" : "heavy");
      this.game.shake = Math.max(this.game.shake, 8);

      for (const object of this.game.objects) {
        if (!object.dead && dist(this, object) < this.radius) object.hurt(100);
      }
    }

    if (this.life <= 0) this.dead = true;
  }

  draw(c) {
    const color =
      this.type === "acid"
        ? "#80f6a6"
        : this.type === "magnet"
          ? "#d4a3ff"
          : "#ff957b";

    if (!this.fired) {
      const pulse = 0.25 + Math.sin(this.game.time * 15) * 0.12;
      c.save();
      c.globalAlpha = pulse;

      if (this.type === "traffic") {
        c.fillStyle = color;
        c.fillRect(this.game.camera, this.y - 35, W, 70);
      } else {
        oval(c, this.x, this.y, this.radius, this.radius * 0.5, color);
      }

      c.globalAlpha = 1;
      oval(c, this.x, this.y, this.radius, this.radius * 0.5, null, color, 3);
      text(c, "!", this.x, this.y + 8, 33, "#fff1c4", "center");

      if (["rubble", "press", "magnet"].includes(this.type)) {
        const height = 100 + Math.max(0, this.delay / this.total) * 180;
        polygon(
          c,
          [
            [this.x - 32, this.y - height],
            [this.x + 25, this.y - height - 15],
            [this.x + 40, this.y - height + 28],
            [this.x - 23, this.y - height + 40],
          ],
          "#7c8192",
          "#222c40",
          3,
        );
      }

      c.restore();
    } else if (this.type === "traffic") {
      const progress = clamp((0.6 - this.life) / 0.6, 0, 1);
      drawCar(
        c,
        this.game.camera - 240 + progress * (W + 480),
        this.y,
        "#bca368",
        1.15,
      );
    } else if (["fire", "rift"].includes(this.type)) {
      for (let i = 0; i < 7; i++) {
        const x = this.x - this.radius + (i * this.radius) / 3;
        const height = 45 + noise(i + Math.floor(this.game.time * 9)) * 80;
        polygon(
          c,
          [
            [x - 15, this.y],
            [x + 9, this.y - height],
            [x + 27, this.y],
          ],
          i % 2 ? "#ffe8a0" : "#ff8c70",
          null,
        );
      }
    }
  }
}

class Boss extends Actor {
  constructor(game, x, y, def) {
    super(game, x, y);
    this.def = def;
    this.hp = this.maxHp = def.hp;
    this.radius = def.id === "juggernaut" ? 57 : 44;
    this.phase = 1;
    this.action = "idle";
    this.actionTime = 1.5;
    this.clock = 0;
    this.cycle = 0;
    this.shield = 0;
    this.shieldHp = 0;
    this.armour = 0;
    this.absorb = 0;
    this.stored = 0;
    this.vulnerable = 0;
    this.aim = { x, y };
    this.debris = [];
    this.pulse = 0;
    this.repairs = 0;
    this.lastAttack = "S";
  }

  update(dt) {
    this.timers(dt);
    this.moving = false;
    if (this.dead || this.game.player.dead) return;

    const g = this.game;
    const p = g.player;
    this.clock += dt;
    this.vulnerable = Math.max(0, this.vulnerable - dt);
    this.armour = Math.max(0, this.armour - dt);
    this.absorb = Math.max(0, this.absorb - dt);

    if (this.shield > 0) {
      this.shield -= dt;
      if (this.shield <= 0) this.dropShield();
    }

    if (this.phase === 1 && this.hp < this.maxHp * 0.45) {
      this.phase = 2;
      g.banner(tr("enraged"), nameOf(this.def), 2);
      g.effect("burst", this.x, this.y - 80, "#ff9b86", 240, 0.8);
      g.shake = 14;
    }

    this.actionTime -= dt;

    if (this.def.id === "magneto") {
      const height = this.action === "volley" || this.shield > 0 ? 135 : 14;
      this.z = approach(this.z, height, 190 * dt);
      this.vz = 920 * dt;
      if (this.action === "volley") {
        this.y = clamp(
          this.y + Math.sin(this.clock * 2) * 55 * dt,
          TOP,
          BOTTOM,
        );
      }
    }

    if (this.action === "charge") {
      const speed = this.phase === 2 ? 850 : 675;
      this.x += this.facing * speed * dt;
      this.attackAnim = 0.25;
      this.moving = true;
      g.trail(this, "#ffc18e");

      if (
        Math.abs(p.x - this.x) < this.radius + 40 &&
        Math.abs(p.y - this.y) < 53 &&
        p.z < 100
      )
        p.hurt(
          (this.def.id === "juggernaut" ? 34 : 24) *
            (this.phase === 2 ? 1.2 : 1),
          this,
          { heavy: true, knock: 530, launch: true },
        );

      for (const object of g.objects) {
        if (
          Math.abs(object.x - this.x) < 80 &&
          Math.abs(object.y - this.y) < 65
        )
          object.hurt(200);
      }

      if (
        this.x < g.camera + 85 ||
        this.x > g.stage.gate - 85 ||
        this.actionTime <= 0
      ) {
        this.x = clamp(this.x, g.camera + 85, g.stage.gate - 85);
        this.action = "recover";
        this.actionTime = 2.6;
        this.vulnerable = 2.6;
        this.armour = 0;
        g.shake = 19;
        g.effect("burst", this.x, this.y - 50, "#ffe0b0", 180, 0.7);
        g.float(this.x, this.y - 210, tr("vulnerable"), "#a8f4d0", 22);
      }
      return;
    }

    if (this.action === "warning") {
      if (this.actionTime <= 0) this.execute();
      return;
    }

    if (this.action === "volley") {
      this.facing = Math.sign(p.x - this.x) || this.facing;
      this.pulse -= dt;

      if (this.pulse <= 0) {
        this.pulse = this.phase === 2 ? 0.45 : 0.7;
        const count = this.phase === 2 ? 3 : 1;
        for (let i = 0; i < count; i++) {
          this.shoot(
            p.x,
            p.y + (i - (count - 1) / 2) * 45,
            this.def.id === "magneto" ? "metal" : "orb",
            this.phase === 2 ? 400 : 320,
            this.phase === 2 ? 17 : 14,
          );
        }
        this.debris.pop();
      }

      if (this.actionTime <= 0) {
        this.action = "recover";
        this.actionTime = 2.1;
        this.vulnerable = 2.1;
      }
      return;
    }

    if (this.action === "recover") {
      if (this.actionTime <= 0) {
        this.action = "idle";
        this.actionTime = 0.5;
      }
      return;
    }

    const ranged = ["magneto", "sinister", "nimrod", "trask"].includes(
      this.def.id,
    );
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    this.facing = Math.sign(dx) || this.facing;

    let speed =
      this.def.id === "sabretooth"
        ? 170
        : this.def.id === "juggernaut"
          ? 100
          : 120;
    if (this.phase === 2) speed *= 1.2;

    if (Math.abs(dx) > (ranged ? 300 : 110)) {
      this.x += Math.sign(dx) * speed * dt;
      this.moving = true;
    }
    if (Math.abs(dy) > 25) {
      this.y += Math.sign(dy) * speed * 0.55 * dt;
      this.moving = true;
    }

    this.x = clamp(this.x, g.camera + 85, g.stage.gate - 85);
    this.y = clamp(this.y, TOP + 10, BOTTOM - 10);

    if (this.actionTime <= 0) this.plan();
  }

  plan() {
    const g = this.game;
    const p = g.player;
    const patterns = {
      sabretooth: ["lunge", "claws", "pounce", "claws"],
      trask: ["lasers", "drones", "stomp", "volley"],
      sinister: ["clones", "rift", "volley", "teleport"],
      shaw: ["absorb", "slam", "charge", "claws"],
      magneto: ["shield", "debris", "lift", "blast"],
      juggernaut:
        this.phase === 2
          ? ["charge", "slam", "charge", "grab", "throw"]
          : ["charge", "slam", "grab", "throw", "charge", "armour"],
      nimrod: ["lasers", "teleport", "volley", "repair"],
      apocalypse: ["morph", "rift", "drones", "slam", "volley"],
    };

    const pattern = patterns[this.def.id];
    this.move = pattern[this.cycle++ % pattern.length];
    this.action = "warning";
    this.actionTime = this.move === "charge" ? 1.15 : 0.85;
    this.aim = { x: p.x, y: p.y };
    this.facing = Math.sign(p.x - this.x) || this.facing;

    if (["charge", "lunge"].includes(this.move)) {
      g.audio.play("warning");
      g.float(this.x, this.y - 210, tr("dodge"), "#ffd49c", 22);
    }

    if (["slam", "stomp", "blast"].includes(this.move)) {
      g.hazards.push(
        new Hazard(g, this.x, this.y, "rift", {
          delay: 1.1,
          radius: this.phase === 2 ? 240 : 170,
          damage: this.phase === 2 ? 30 : 25,
        }),
      );
    }

    if (["lasers", "rift", "pounce", "lift", "morph"].includes(this.move)) {
      const type =
        this.move === "lift"
          ? "magnet"
          : this.move === "pounce"
            ? "rubble"
            : "laser";

      g.hazards.push(
        new Hazard(g, p.x, p.y, type, {
          delay: 1.15,
          radius: this.move === "morph" ? 125 : 90,
          damage: 23,
          aerial: this.move === "lift",
        }),
      );

      if (this.phase === 2) {
        for (const offset of [-155, 155]) {
          g.hazards.push(
            new Hazard(g, p.x + offset, p.y, type, {
              delay: 1.5,
              radius: 70,
              damage: 19,
            }),
          );
        }
      }
    }

    if (this.move === "debris") {
      const count = this.phase === 2 ? 6 : 4;
      this.debris = Array.from({ length: count }, (_, i) => ({
        angle: (i * TAU) / count,
        type: i % 3,
      }));

      for (const object of g.objects) {
        if (!object.dead && dist(this, object) < 750) {
          object.dead = true;
          g.effect("burst", object.x, object.y - 30, "#c9acff", 65, 0.6);
        }
      }

      this.actionTime = 1.25;
      g.audio.play("charge");
    }
  }

  execute() {
    const g = this.game;
    const p = g.player;

    this.action = "recover";
    this.actionTime = this.phase === 2 ? 1 : 1.5;
    this.attackAnim = 0.5;

    switch (this.move) {
      case "charge":
      case "lunge":
        this.action = "charge";
        this.actionTime = this.move === "charge" ? 2.4 : 0.5;
        if (this.def.id === "juggernaut") this.armour = 3;
        g.audio.play("charge");
        break;

      case "claws":
      case "morph": {
        const reach = this.move === "morph" ? 320 : 170;
        if (
          Math.abs(p.x - this.x) < reach &&
          Math.abs(p.y - this.y) < 65 &&
          p.z < 100
        )
          p.hurt(this.phase === 2 ? 31 : 26, this, {
            heavy: true,
            knock: 250,
          });
        g.effect(
          "slash",
          this.x,
          this.y - 100,
          this.def.trim,
          reach,
          0.4,
          this.facing,
        );
        break;
      }

      case "slam":
      case "stomp":
      case "blast": {
        const count = this.phase === 2 ? 5 : 3;
        for (const direction of [-1, 1]) {
          for (let i = 0; i < count; i++) {
            g.projectiles.push(
              new Projectile(
                g,
                this.x,
                this.y,
                18,
                direction * 300,
                (i - (count - 1) / 2) * 42,
                this.phase === 2 ? 22 : 18,
                "enemy",
                "wave",
                this.def.trim,
                { pierce: true, life: 3 },
              ),
            );
          }
        }
        g.shake = 15;
        g.audio.play("heavy");
        break;
      }

      case "grab":
        if (
          Math.abs(p.x - this.x) < 145 &&
          Math.abs(p.y - this.y) < 60 &&
          p.z < 70 &&
          p.invuln <= 0
        ) {
          p.hurt(30, this, { heavy: true, knock: 650, launch: true });
        } else {
          this.vulnerable = 1.8;
          this.actionTime = 1.8;
        }
        break;

      case "throw":
        this.shoot(p.x, p.y, "rock", 380, 25);
        break;

      case "shield":
        this.shield = 2.7;
        this.shieldHp = 95;
        this.action = "volley";
        this.actionTime = 2.7;
        this.pulse = 0.6;
        g.audio.play("shield");
        break;

      case "debris":
      case "volley":
        this.action = "volley";
        this.actionTime = this.move === "debris" ? 2.6 : 2;
        this.pulse = 0.05;
        break;

      case "armour":
        this.armour = 4;
        this.actionTime = 0.5;
        g.effect("ring", this.x, this.y - 100, "#ffcf8b", 150, 0.7);
        break;

      case "absorb":
        this.absorb = 2.4;
        this.stored = 0;
        this.actionTime = 2.4;
        break;

      case "clones":
      case "drones": {
        const count = this.move === "clones" ? 2 : 3;
        if (
          g.enemies.filter((e) => !e.dead && !(e instanceof Boss)).length < 4
        ) {
          for (let i = 0; i < count; i++) {
            g.enemies.push(
              new Enemy(
                g,
                clamp(this.x + (i - 1) * 110, g.camera + 70, g.stage.gate - 70),
                clamp(this.y + (i - 1) * 55, TOP + 10, BOTTOM - 10),
                this.move === "clones" ? "assassin" : "drone",
                g.stage.index,
              ),
            );
          }
        }
        break;
      }

      case "teleport":
      case "pounce":
        g.effect("portal", this.x, this.y - 80, this.def.trim, 100, 0.5);
        this.x = clamp(
          this.aim.x - this.facing * 150,
          g.camera + 85,
          g.stage.gate - 85,
        );
        this.y = clamp(this.aim.y, TOP, BOTTOM);
        g.effect("portal", this.x, this.y - 80, this.def.trim, 100, 0.5);
        break;

      case "repair":
        if (this.repairs < 2) {
          this.hp = Math.min(this.maxHp, this.hp + 65);
          this.repairs++;
          g.float(this.x, this.y - 220, "+65", "#b3ffcf", 22);
        }
        this.vulnerable = 2;
        this.actionTime = 2;
        break;
    }
  }

  shoot(x, y, type, speed, damage) {
    const dx = x - this.x;
    const dy = y - this.y;
    const length = Math.hypot(dx, dy) || 1;

    this.game.projectiles.push(
      new Projectile(
        this.game,
        this.x,
        this.y,
        70,
        (dx / length) * speed,
        (dy / length) * speed,
        damage,
        "enemy",
        type,
        this.def.trim,
        { life: 4 },
      ),
    );
    this.game.audio.play(type === "rock" ? "heavy" : "optic");
  }

  dropShield() {
    this.shield = 0;
    this.shieldHp = 0;
    this.z = Math.min(this.z, 65);
    this.vulnerable = 1.5;
    this.game.effect("burst", this.x, this.y - 100, "#dbb9ff", 190, 0.6);
    this.game.float(this.x, this.y - 240, tr("shieldbreak"), "#dcbbff", 22);
  }

  hurt(amount, source, options = {}) {
    if (this.dead || this.invuln > 0) return false;

    if (this.shield > 0) {
      this.shieldHp -= amount * (options.heavy ? 1.3 : 1);

      if (options.breakShield || this.shieldHp <= 0) {
        this.dropShield();
      } else {
        this.game.audio.play("shield");
        this.game.effect(
          "ring",
          this.x,
          this.y - this.z - 100,
          "#d9b9ff",
          110,
          0.3,
        );
        return false;
      }
    }

    if (this.absorb > 0 && !options.heavy && !options.ranged) {
      this.stored += amount;
      this.game.effect("ring", this.x, this.y - 100, "#ff9d80", 120, 0.3);

      if (this.stored > 65) {
        this.stored = 0;
        this.game.hazards.push(
          new Hazard(this.game, this.x, this.y, "fire", {
            delay: 0.8,
            radius: 230,
            damage: 27,
          }),
        );
      }
      return false;
    }

    if (this.armour > 0) amount *= 0.35;
    else if (this.def.id === "juggernaut" && this.vulnerable <= 0)
      amount *= 0.72;

    if (this.vulnerable > 0) amount *= 1.4;

    const hit = super.hurt(amount, source, {
      ...options,
      knock: (options.knock || 90) * 0.12,
      launch: false,
    });

    this.stun = Math.min(this.stun, 0.08);
    return hit;
  }

  die() {
    this.dead = true;
    this.game.score += 2500 + this.game.stage.index * 500;
    this.game.burst(this.x, this.y, 100, this.def.trim, 55);
    this.game.effect("burst", this.x, this.y - 100, "#ffe6b2", 280, 1);
    this.game.audio.play("explosion");
  }

  draw(c) {
    if (this.action === "warning" && ["charge", "lunge"].includes(this.move)) {
      c.save();
      c.globalAlpha = 0.16 + Math.sin(this.game.time * 15) * 0.07;
      c.fillStyle = "#ff9c73";
      const edge = this.facing > 0 ? this.game.stage.gate : this.game.camera;
      c.fillRect(
        Math.min(this.x, edge),
        this.y - 43,
        Math.abs(edge - this.x),
        86,
      );
      c.restore();
    }

    super.draw(c);

    if (this.def.id === "magneto") {
      for (const item of this.debris) {
        const angle = item.angle + this.clock * 1.5;
        const x = this.x + Math.cos(angle) * 125;
        const y = this.y - this.z - 115 + Math.sin(angle) * 55;

        c.save();
        c.translate(x, y);
        c.rotate(angle * 0.35);

        if (item.type === 0) {
          drawCar(c, 0, 0, "#797c99", 0.34);
        } else if (item.type === 1) {
          line(
            c,
            [
              [-35, -5],
              [35, 5],
            ],
            "#bac9d7",
            12,
          );
        } else {
          polygon(
            c,
            [
              [-23, -20],
              [22, -16],
              [25, 21],
              [-20, 25],
            ],
            "#8b7b81",
            "#293047",
            3,
          );
        }

        c.restore();
      }
    }
  }
}

class StageManager {
  constructor(game) {
    this.game = game;
    this.index = 0;
    this.wave = 0;
    this.gate = 1300;
    this.arena = false;
    this.pending = 0;
    this.boss = null;
    this.hazardClock = 7;
  }

  load(index) {
    const g = this.game;
    this.index = index;
    this.wave = 0;
    this.gate = 1300;
    this.arena = false;
    this.pending = 1.2;
    this.boss = null;
    this.hazardClock = 7;

    for (const key of [
      "enemies",
      "projectiles",
      "pickups",
      "objects",
      "particles",
      "effects",
      "floating",
      "hazards",
    ])
      g[key] = [];

    g.camera = 0;
    g.stageCombo = 0;
    g.shake = 0;

    const p = g.player;
    p.x = 170;
    p.y = 555;
    p.z = p.vz = p.kx = p.ky = p.lifted = 0;
    p.stun = p.cooldown = p.specialTime = 0;
    p.combo = 0;
    p.chain = [];
    p.invuln = 2;
    p.hp = Math.min(p.maxHp, p.hp + 35);
    p.energy = Math.min(100, p.energy + 35);

    for (let i = 0; i < 13; i++) {
      g.objects.push(
        new BreakableObject(
          g,
          410 + i * 277,
          i % 2 ? 455 : 625,
          ["crate", "barrel", "machine", "sign"][i % 4],
        ),
      );
    }

    g.pickups.push(new Pickup(g, 330, 555, "pipe"));
    g.audio.theme = index;
    g.banner(`${tr("stage")} ${index + 1}`, nameOf(STAGES[index]), 2.8);
  }

  spawnWave() {
    const g = this.game;
    this.wave++;
    this.gate = [1300, 2350, 3300][this.wave - 1];
    const count = 3 + this.wave + (this.index >= 4 ? 1 : 0);
    const kinds = STAGES[this.index].enemies;

    for (let i = 0; i < count; i++) {
      g.enemies.push(
        new Enemy(
          g,
          clamp(this.gate - 570 + i * 90, 100, this.gate - 100),
          440 + (i % 4) * 65,
          kinds[(i + this.wave - 1) % kinds.length],
          this.index,
        ),
      );
    }

    if (this.wave === 2 && [0, 3, 6].includes(this.index)) {
      const kind = { 0: "sewer", 3: "ninja", 6: "wizard" }[this.index];
      g.enemies.push(new Enemy(g, this.gate - 180, 555, kind, this.index));
      g.float(this.gate - 350, 350, tr("surprise"), "#c9ffa5", 25);
    }

    g.banner(`${tr("wave")} ${this.wave} / 3`, nameOf(STAGES[this.index]), 1.6);
  }

  update(dt) {
    const g = this.game;

    if (this.boss?.dead) {
      g.clearStage();
      return;
    }

    if (this.pending > 0) {
      this.pending -= dt;
      if (this.pending <= 0) this.spawnWave();
      return;
    }

    const living = g.enemies.some((e) => !e.dead);

    if (!living && !this.arena) {
      if (this.wave < 3) {
        this.pending = 1.4;
      } else if (g.player.x > this.gate - 500) {
        this.arena = true;
        this.gate = 4200;
        g.camera = 2920;
        g.player.x = Math.max(g.player.x, 3020);
        g.player.invuln = Math.max(g.player.invuln, 2);

        this.boss = new Boss(g, 3930, 535, BOSSES[this.index]);
        g.enemies.push(this.boss);
        g.pickups.push(new Pickup(g, 3090, 600, "health"));
        g.pickups.push(new Pickup(g, 3120, 465, "energy"));

        g.banner(tr("warning"), nameOf(this.boss.def), 2.6);
        g.audio.play("warning");
      }
    }

    this.hazardClock -= dt;
    if (this.hazardClock <= 0) {
      this.hazardClock = this.arena ? 11 : 8;
      g.audio.play("ambience");

      if (living) {
        const type = STAGES[this.index].hazard;
        g.hazards.push(
          new Hazard(
            g,
            clamp(g.player.x + rand(-80, 80), g.camera + 70, this.gate - 70),
            clamp(g.player.y + rand(-25, 25), TOP + 15, BOTTOM - 15),
            type,
            { radius: type === "traffic" ? 85 : 70, damage: 14, delay: 1.5 },
          ),
        );
      }
    }
  }
}

function drawCar(c, x, y, color = "#9b6878", scale = 1) {
  c.save();
  c.translate(x, y);
  c.scale(scale, scale);

  oval(c, 0, 3, 108, 16, "#0005");

  polygon(
    c,
    [
      [-112, -20],
      [-102, -54],
      [-58, -61],
      [-30, -94],
      [43, -94],
      [78, -60],
      [107, -49],
      [117, -18],
    ],
    color,
    "#142035",
    3,
  );

  polygon(
    c,
    [
      [-49, -62],
      [-25, -85],
      [4, -85],
      [4, -62],
    ],
    "#a9d4e3",
    "#283b50",
    2,
  );

  polygon(
    c,
    [
      [12, -85],
      [39, -85],
      [65, -62],
      [12, -62],
    ],
    "#8cb7cc",
    "#283b50",
    2,
  );

  line(
    c,
    [
      [-96, -48],
      [98, -48],
    ],
    "#ffffff35",
    3,
  );
  line(
    c,
    [
      [8, -57],
      [8, -23],
    ],
    "#18253b",
    2,
  );

  c.fillStyle = "#dce6db";
  c.fillRect(96, -40, 14, 13);
  c.fillStyle = "#e48c83";
  c.fillRect(-108, -39, 12, 12);
  c.fillStyle = "#d4d1b9";
  c.fillRect(-115, -23, 25, 7);
  c.fillRect(90, -23, 30, 7);

  for (const wheelX of [-70, 72]) {
    oval(c, wheelX, -17, 23, 23, "#121c2c", "#445167", 3);
    oval(c, wheelX, -17, 11, 11, "#929db0", "#29364b", 3);
    oval(c, wheelX, -17, 4, 4, "#303d52");
  }

  c.restore();
}

function drawBuilding(c, x, base, width, height, color, glow, seed = 0) {
  c.fillStyle = color;
  c.fillRect(x, base - height, width, height);

  polygon(
    c,
    [
      [x, base - height],
      [x + 13, base - height - 12],
      [x + width + 13, base - height - 12],
      [x + width, base - height],
    ],
    "#ffffff0d",
    null,
  );

  c.fillStyle = "#0003";
  c.fillRect(x + width - 15, base - height, 15, height);

  for (let row = 0; row < Math.floor((height - 20) / 33); row++) {
    for (let col = 0; col < Math.floor((width - 15) / 26); col++) {
      c.fillStyle = noise(seed + row * 17 + col * 7) > 0.48 ? glow : "#101c30";
      c.globalAlpha = noise(seed + row * 11 + col * 13) > 0.7 ? 0.85 : 0.4;
      c.fillRect(x + 12 + col * 26, base - height + 15 + row * 33, 11, 17);
    }
  }
  c.globalAlpha = 1;

  line(
    c,
    [
      [x, base - height],
      [x + width, base - height],
    ],
    "#8793a333",
    3,
  );
}

class Scenery {
  constructor(game) {
    this.game = game;
  }

  draw(c) {
    const g = this.game;
    const stage = STAGES[g.stage.index];
    const camera = g.camera;

    if (g.stage.index === 0 && stage1Background.naturalWidth > 0) {
      const scale = H / 1024;
      const scaledW = 4128 * scale;

      const parallaxFactor = 0.6;
      let x = -camera * parallaxFactor;
      let offset = x % scaledW;
      if (offset > 0) offset -= scaledW;

      c.drawImage(stage1Background, offset, 0, scaledW, H);
      c.drawImage(stage1Background, offset + scaledW, 0, scaledW, H);
    } else if (g.stage.index === 1 && stage2Background.naturalWidth > 0) {
      const scale = H / 749;
      const scaledW = 2098 * scale;

      const parallaxFactor = 0.6;
      let x = -camera * parallaxFactor;
      let offset = x % scaledW;
      if (offset > 0) offset -= scaledW;

      c.drawImage(stage2Background, offset, 0, scaledW, H);
      c.drawImage(stage2Background, offset + scaledW, 0, scaledW, H);
    } else {
      const sky = c.createLinearGradient(0, 0, 0, TOP);
      sky.addColorStop(0, "#090f23");
      sky.addColorStop(1, stage.sky);
      c.fillStyle = sky;
      c.fillRect(0, 0, W, H);

      oval(c, 1050 - camera * 0.035, 126, 62, 62, "#d4d4cc25");
      oval(c, 1062 - camera * 0.035, 117, 53, 53, stage.sky);

      for (let i = 0; i < 45; i++) {
        const x = (((noise(i * 7) * 1700 - camera * 0.045) % W) + W) % W;
        const y = 35 + noise(i * 19) * 190;
        c.fillStyle = "#d5ddf1";
        c.globalAlpha = 0.2 + noise(i * 5) * 0.5;
        c.fillRect(x, y, 2, 2);
      }
      c.globalAlpha = 1;

      c.save();
      c.translate(-camera * 0.2, 0);
      for (let i = -1; i < 18; i++) {
        const height = 110 + noise(i + 40) * 175;
        drawBuilding(
          c,
          i * 150,
          360,
          135,
          height,
          "#172238",
          stage.glow,
          i * 31,
        );
      }
      c.restore();

      c.save();
      c.translate(-camera * 0.58, 0);
      const first = Math.floor((camera * 0.58) / 360) - 1;
      for (let i = first; i < first + 6; i++) {
        this.module(c, i * 360, stage, i);
      }
      c.restore();

      const floor = c.createLinearGradient(0, TOP - 18, 0, H);
      floor.addColorStop(0, stage.floor);
      floor.addColorStop(1, "#111b2b");
      c.fillStyle = floor;
      c.fillRect(0, TOP - 18, W, H - TOP + 18);

      c.fillStyle = "#080f1f";
      c.fillRect(0, TOP - 22, W, 12);
      c.fillStyle = "#9fa9b044";
      c.fillRect(0, TOP - 10, W, 4);

      for (let i = 0; i < 5; i++) {
        const y = TOP + 20 + i * i * 13;
        line(
          c,
          [
            [0, y],
            [W, y],
          ],
          "#bac8db15",
          1,
        );
      }

      const offset2 = ((camera % 150) + 150) % 150;
      for (let x = -150; x < W + 150; x += 150) {
        line(
          c,
          [
            [x - offset2, TOP],
            [x - offset2 - 85, H],
          ],
          "#a8b8cd12",
          1,
        );
      }

      for (let i = 0; i < 28; i++) {
        const worldX = i * 165 + noise(i * 9) * 90;
        const x = worldX - camera;
        if (x < -100 || x > W + 100) continue;
        const y = TOP + 35 + noise(i * 12) * 190;

        if (stage.weather === "rain") {
          oval(c, x, y, 20 + noise(i) * 45, 4 + noise(i * 2) * 5, "#99bad419");
          line(
            c,
            [
              [x - 20, y],
              [x + 25, y],
            ],
            stage.glow + "22",
            2,
          );
        }
      }

      c.fillStyle = "#080f1f";
      for (let i = 0; i < 10; i++) {
        polygon(
          c,
          [
            [i * 150 - offset2 - 14, H],
            [i * 150 - offset2, TOP - 18],
            [i * 150 - offset2 + 8, TOP - 18],
            [i * 150 - offset2 - 6, H],
          ],
          "#080f1f",
          null,
        );
      }
      c.fillRect(0, H - 28, W, 28);
    }
  }

  module(c, x, stage, seed) {
    const theme = stage.theme;
    const glow = stage.glow;

    c.save();
    c.translate(x, 0);

    if (["city", "rampage", "hellfire"].includes(theme)) {
      const wall =
        theme === "hellfire"
          ? "#443144"
          : theme === "rampage"
            ? "#493b43"
            : "#303b50";

      c.fillStyle = wall;
      c.fillRect(0, 138, 355, 270);
      c.fillStyle = "#111b2b";
      c.fillRect(0, 135, 360, 13);

      for (let row = 0; row < 13; row++) {
        const y = 153 + row * 20;
        line(
          c,
          [
            [0, y],
            [355, y],
          ],
          "#090f201f",
          2,
        );
        for (let col = 0; col < 6; col++) {
          const bx = col * 68 + (row % 2 ? 34 : 0);
          line(
            c,
            [
              [bx, y],
              [bx, y + 19],
            ],
            "#0a142326",
            2,
          );
        }
      }

      for (let i = 0; i < 3; i++) {
        const wx = 25 + i * 110;
        c.fillStyle = "#111c2d";
        c.fillRect(wx, 170, 74, 96);
        c.fillStyle = glow + "48";
        c.fillRect(wx + 5, 175, 64, 86);
        line(
          c,
          [
            [wx + 37, 174],
            [wx + 37, 263],
          ],
          "#19243a",
          5,
        );
        line(
          c,
          [
            [wx + 3, 218],
            [wx + 71, 218],
          ],
          "#19243a",
          5,
        );
        c.fillStyle = "#7c7b883e";
        c.fillRect(wx - 5, 266, 84, 8);
      }

      c.fillStyle = "#10192b";
      c.fillRect(30, 305, 113, 103);
      c.fillRect(178, 305, 143, 103);

      if (theme === "hellfire") {
        for (const cx of [18, 160, 336]) {
          c.fillStyle = "#907b7e";
          c.fillRect(cx, 287, 15, 121);
          c.fillStyle = "#c1a598";
          c.fillRect(cx - 6, 281, 27, 10);
          c.fillRect(cx - 6, 399, 27, 9);
        }
        c.fillStyle = "#743848";
        c.fillRect(190, 310, 119, 98);
        for (const cx of [215, 278]) {
          line(
            c,
            [
              [cx, 312],
              [cx, 404],
            ],
            "#e4ba774d",
            3,
          );
        }
        text(c, "HELLFIRE", 180, 298, 19, "#e8bd87", "center");
      } else {
        c.fillStyle = theme === "city" ? "#456c80" : "#79544f";
        c.fillRect(22, 284, 305, 27);
        text(
          c,
          seed % 2 ? "MUTANT DISTRICT" : "WESTCHESTER AVE",
          174,
          303,
          16,
          "#eadbc1",
          "center",
        );

        for (let y = 323; y < 399; y += 10) {
          line(
            c,
            [
              [181, y],
              [316, y],
            ],
            "#74809155",
            2,
          );
        }
        line(
          c,
          [
            [86, 310],
            [86, 405],
          ],
          "#7a859144",
          3,
        );
      }

      if (theme === "rampage") {
        polygon(
          c,
          [
            [230, 140],
            [268, 173],
            [238, 212],
            [286, 246],
            [257, 295],
            [302, 335],
            [283, 408],
            [352, 408],
            [352, 140],
          ],
          "#101727",
          null,
        );

        for (let i = 0; i < 6; i++) {
          polygon(
            c,
            [
              [240 + i * 17, 407],
              [251 + i * 17, 379 - noise(i + seed) * 18],
              [275 + i * 17, 407],
            ],
            "#756470",
            "#283043",
            2,
          );
        }
      }

      line(
        c,
        [
          [346, 142],
          [346, 400],
        ],
        "#9193a15c",
        7,
      );
    } else if (theme === "factory") {
      c.fillStyle = "#303045";
      c.fillRect(0, 145, 360, 264);

      for (const bx of [15, 170, 335]) {
        c.fillStyle = "#536071";
        c.fillRect(bx, 150, 13, 258);
        line(
          c,
          [
            [bx, 176],
            [bx + 140, 366],
          ],
          "#67717e",
          8,
        );
      }

      c.fillStyle = "#111a2c";
      c.fillRect(42, 200, 265, 120);
      c.fillStyle = "#ba6c4555";
      c.fillRect(51, 210, 247, 100);

      c.save();
      c.translate(171, 324);
      c.scale(0.55, 0.55);
      drawBoss(
        c,
        {
          def: BOSSES[1],
          facing: 1,
          z: 0,
          phase: 1,
          attackAnim: 0,
          moving: false,
          stun: 0,
          action: "idle",
          armour: 0,
          absorb: 0,
          shield: 0,
        },
        0,
      );
      c.restore();

      c.fillStyle = "#202a3a";
      c.fillRect(20, 350, 318, 42);
      for (let i = 0; i < 13; i++) {
        oval(c, 32 + i * 25, 373, 10, 10, "#677382", "#121d30", 2);
      }

      line(
        c,
        [
          [45, 142],
          [45, 177],
          [294, 177],
          [294, 226],
        ],
        "#878e99",
        12,
      );
      c.fillStyle = "#b88a55";
      c.fillRect(20, 397, 318, 11);
      for (let i = 0; i < 15; i++) {
        polygon(
          c,
          [
            [20 + i * 23, 397],
            [30 + i * 23, 397],
            [22 + i * 23, 408],
            [12 + i * 23, 408],
          ],
          "#263146",
          null,
        );
      }
    } else if (theme === "lab") {
      c.fillStyle = "#1e3c46";
      c.fillRect(0, 155, 360, 253);

      for (const tx of [38, 218]) {
        c.fillStyle = "#172d3a";
        c.fillRect(tx, 196, 101, 194);
        oval(c, tx + 50, 198, 51, 15, "#689b9b", "#172b38", 3);
        c.fillStyle = "#75e3b82b";
        c.fillRect(tx + 9, 203, 83, 169);

        oval(c, tx + 51, 246, 17, 23, "#a1d2bc77");
        polygon(
          c,
          [
            [tx + 34, 270],
            [tx + 68, 270],
            [tx + 75, 324],
            [tx + 59, 327],
            [tx + 54, 362],
            [tx + 42, 362],
            [tx + 38, 327],
            [tx + 27, 324],
          ],
          "#8cc8b566",
          null,
        );

        for (let i = 0; i < 6; i++) {
          const by = 360 - ((this.game.time * 25 + i * 27 + seed * 11) % 150);
          oval(
            c,
            tx + 23 + noise(i + seed) * 55,
            by,
            3,
            3,
            null,
            "#b2ffe97d",
            1,
          );
        }

        oval(c, tx + 50, 377, 51, 15, "#426c72", "#132b36", 3);
        line(
          c,
          [
            [tx + 17, 211],
            [tx + 17, 360],
          ],
          "#d3fff742",
          4,
        );
      }

      c.fillStyle = "#111e30";
      c.fillRect(149, 278, 58, 70);
      c.fillStyle = "#78e6cd";
      c.fillRect(156, 286, 44, 23);
      for (let i = 0; i < 4; i++) {
        line(
          c,
          [
            [158, 290 + i * 5],
            [190 - i * 3, 290 + i * 5],
          ],
          "#244f58",
          1,
        );
      }
      line(
        c,
        [
          [0, 179],
          [360, 179],
        ],
        "#618988",
        7,
      );
    } else if (theme === "fortress") {
      c.fillStyle = "#34304d";
      c.fillRect(0, 145, 360, 263);

      for (let i = 0; i < 4; i++) {
        const bx = 12 + i * 90;
        polygon(
          c,
          [
            [bx, 407],
            [bx + 10, 197],
            [bx + 35, 158],
            [bx + 61, 197],
            [bx + 73, 407],
          ],
          "#55516c",
          "#24243b",
          3,
        );
        line(
          c,
          [
            [bx + 35, 187],
            [bx + 35, 394],
          ],
          "#b597db55",
          4,
        );
      }

      oval(c, 180, 272, 73, 73, "#211d39", "#9b7bb9", 9);
      oval(c, 180, 272, 49, 49, "#b69bd426", "#cab4e766", 3);
      text(c, "M", 180, 290, 53, "#d3b6ef", "center");

      for (let i = 0; i < 4; i++) {
        const y = 240 + Math.sin(this.game.time * 1.5 + i) * 47;
        c.save();
        c.translate(40 + i * 90, y);
        c.rotate(Math.sin(this.game.time + i) * 0.4);
        c.fillStyle = "#a8a9bc";
        c.fillRect(-15, -6, 30, 12);
        c.restore();
      }
    } else if (theme === "future") {
      c.fillStyle = "#272e4b";
      c.fillRect(0, 124, 360, 284);

      polygon(
        c,
        [
          [35, 405],
          [35, 177],
          [77, 133],
          [133, 133],
          [167, 176],
          [167, 405],
        ],
        "#454562",
        "#171e35",
        3,
      );

      c.fillStyle = "#252b45";
      c.fillRect(60, 185, 82, 48);
      line(
        c,
        [
          [67, 205],
          [134, 205],
        ],
        "#ee9dcb",
        8,
      );
      line(
        c,
        [
          [90, 238],
          [90, 277],
          [121, 277],
        ],
        "#8a85a2",
        7,
      );

      c.fillStyle = "#101c32";
      c.fillRect(192, 197, 139, 93);
      c.fillStyle = "#7fddf51f";
      c.fillRect(198, 203, 127, 81);
      text(c, "SENTINEL", 261, 236, 18, "#97e3ff", "center");
      text(c, "CONTROL", 261, 264, 16, "#dbafd7", "center");

      for (let i = 0; i < 4; i++) {
        const y = 316 + i * 19;
        line(
          c,
          [
            [194, y],
            [327, y],
          ],
          "#7589ba",
          4,
        );
      }
      line(
        c,
        [
          [12, 141],
          [12, 402],
        ],
        "#9edfff",
        3,
      );
      line(
        c,
        [
          [348, 141],
          [348, 402],
        ],
        "#c593ee",
        3,
      );
    } else {
      c.fillStyle = "#392e47";
      c.fillRect(0, 139, 360, 269);

      for (let i = 0; i < 3; i++) {
        const bx = 20 + i * 120;
        polygon(
          c,
          [
            [bx, 408],
            [bx + 13, 223],
            [bx + 42, 166],
            [bx + 73, 223],
            [bx + 87, 408],
          ],
          "#625064",
          "#281f36",
          3,
        );

        line(
          c,
          [
            [bx + 42, 207],
            [bx + 42, 374],
          ],
          "#e2a77d55",
          4,
        );
        for (let j = 0; j < 4; j++) {
          polygon(
            c,
            [
              [bx + 28, 248 + j * 29],
              [bx + 42, 237 + j * 29],
              [bx + 55, 248 + j * 29],
              [bx + 42, 259 + j * 29],
            ],
            "#d49b7755",
            null,
          );
        }
      }

      oval(c, 180, 276, 50, 76, "#e9908a24", "#d7a0b966", 4);
      line(
        c,
        [
          [180, 218],
          [165, 258],
          [190, 281],
          [172, 330],
        ],
        "#ffb7a9",
        5,
      );
    }

    c.restore();
  }

  weather(c) {
    const g = this.game;
    const stage = STAGES[g.stage.index];
    const weather = stage.weather;

    c.save();

    for (let i = 0; i < 65; i++) {
      const baseX = noise(i * 13 + 5) * (W + 200);
      const baseY = noise(i * 23 + 7) * H;

      if (weather === "rain") {
        const x =
          ((((baseX - g.time * 145 - g.camera * 0.2) % (W + 200)) + W + 200) %
            (W + 200)) -
          100;
        const y = (baseY + g.time * 590) % H;
        line(
          c,
          [
            [x, y],
            [x - 8, y + 23],
          ],
          "#b6d5ec33",
          1,
        );
      } else if (weather === "bubbles") {
        const x = (baseX + Math.sin(g.time + i) * 12) % W;
        const y = (((baseY - g.time * 28) % H) + H) % H;
        oval(c, x, y, 2 + noise(i) * 3, 2 + noise(i) * 3, null, "#b1f9df35", 1);
      } else if (weather === "metal") {
        const x = (baseX + Math.sin(g.time * 0.8 + i) * 40) % W;
        const y = baseY + Math.sin(g.time + i * 2) * 18;
        c.save();
        c.translate(x, y);
        c.rotate(g.time + i);
        c.fillStyle = "#c0bfd84d";
        c.fillRect(-3, -1, 6, 3);
        c.restore();
      } else {
        const x = (baseX + g.time * 27 + Math.sin(i + g.time) * 15) % W;
        const y =
          (((baseY - g.time * (weather === "dust" ? 12 : 42)) % H) + H) % H;
        c.globalAlpha = 0.2 + noise(i * 3) * 0.4;
        c.fillStyle = weather === "dust" ? "#c1ad9e" : "#ffc589";
        c.fillRect(
          x,
          y,
          weather === "sparks" ? 2 : 3,
          weather === "sparks" ? 6 : 3,
        );
      }
    }

    c.restore();
  }

  foreground(c) {
    const g = this.game;
    c.save();
    c.translate(-g.camera, 0);

    for (let x = 650; x < 4400; x += 1100) {
      if (x < g.camera - 100 || x > g.camera + W + 100) continue;
      c.fillStyle = "#111a2be8";
      c.fillRect(x, 566, 16, 154);
      line(
        c,
        [
          [x + 8, 570],
          [x + 8, 548],
          [x + 50, 548],
        ],
        "#142033",
        13,
      );
      oval(c, x + 54, 548, 24, 9, "#172237");
      oval(c, x + 54, 553, 17, 4, "#e5c58b66");
    }

    c.restore();

    const shade = c.createLinearGradient(0, 650, 0, H);
    shade.addColorStop(0, "transparent");
    shade.addColorStop(1, "#080e1c99");
    c.fillStyle = shade;
    c.fillRect(0, 650, W, 70);
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext("2d");
    this.overlay = document.getElementById("overlay");

    this.state = "title";
    this.selected = 0;
    this.time = 0;
    this.stateTime = 0;
    this.camera = 0;
    this.score = 0;
    this.maxCombo = 0;
    this.stageCombo = 0;
    this.shake = 0;

    this.particles = [];
    this.effects = [];
    this.floating = [];
    this.enemies = [];
    this.objects = [];
    this.pickups = [];
    this.projectiles = [];
    this.hazards = [];

    this.bannerData = null;
    this.trailClock = 0;
    this.player = null;
    this.clearData = null;

    this.audio = new AudioManager();
    this.input = new InputManager(this);
    this.stage = new StageManager(this);
    this.scenery = new Scenery(this);
    this.lastFrame = 0;

    const bind = (id, action) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", () => {
          this.audio.unlock();
          action();
        });
      }
    };

    bind("languageButton", () => this.toggleLanguage());

    bind("musicButton", () => {
      this.audio.musicOn = !this.audio.musicOn;
      this.audio.syncMusic();
      this.updateLabels();
    });

    bind("soundButton", () => {
      this.audio.soundOn = !this.audio.soundOn;
      this.updateLabels();
    });

    bind("touchButton", () => {
      document.body.classList.toggle("showTouch");
      this.updateLabels();
    });

    bind("pauseButton", () => this.pause());

    this.updateLabels();
    this.showUI();

    this.boundFrame = (timestamp) => this.frame(timestamp);
    requestAnimationFrame(this.boundFrame);
  }

  updateLabels() {
    const set = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    set("languageButton", language === "en" ? "简体中文" : "ENGLISH");
    set(
      "musicButton",
      `${tr("music")} ${tr(this.audio.musicOn ? "on" : "off")}`,
    );
    set(
      "soundButton",
      `${tr("sound")} ${tr(this.audio.soundOn ? "on" : "off")}`,
    );
    set("touchButton", tr("touch"));
    set("pauseButton", tr(this.state === "paused" ? "resume" : "pause"));
    set("helpText", tr("help"));

    const labels = {
      KeyA: "attack",
      KeyS: "heavy",
      KeyD: "special",
      KeyW: "jump",
      KeyE: "pickup",
    };

    document.querySelectorAll("[data-key]").forEach((button) => {
      const key = labels[button.dataset.key];
      if (!key) return;
      const label = button.querySelector("small");
      if (label) label.textContent = tr(key);
    });
  }

  toggleLanguage() {
    language = language === "en" ? "zh" : "en";
    try {
      localStorage.setItem("mutant-wars-language", language);
    } catch (_) {}

    this.updateLabels();
    this.showUI();
  }

  setState(state) {
    this.state = state;
    this.stateTime = 0;
    this.input.clear();
    this.updateLabels();
    this.showUI();
  }

  makeButton(label, action, primary = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    if (primary) button.className = "primary";

    button.addEventListener("click", () => {
      this.audio.unlock();
      action();
      button.blur();
    });

    return button;
  }

  showUI() {
    this.overlay.replaceChildren();

    if (this.state === "playing") return;

    if (this.state === "title") {
      const actions = document.createElement("div");
      actions.className = "titleActions";

      actions.appendChild(
        this.makeButton(
          tr("start"),
          () => {
            this.setState("select");
          },
          true,
        ),
      );

      const note = document.createElement("div");
      note.className = "note";
      note.textContent = tr("titleNote");
      actions.appendChild(note);
      this.overlay.appendChild(actions);
      return;
    }

    if (this.state === "select") {
      const selection = document.createElement("div");
      selection.className = "selection";

      const heading = document.createElement("h1");
      heading.textContent = tr("select");
      selection.appendChild(heading);

      const roster = document.createElement("div");
      roster.className = "roster";

      HEROES.forEach((hero, index) => {
        const button = this.makeButton("", () => this.selectCharacter(index));
        button.setAttribute("aria-label", nameOf(hero));
        if (index === this.selected) button.classList.add("selected");

        const label = document.createElement("span");
        label.textContent = nameOf(hero);
        button.appendChild(label);
        roster.appendChild(button);
      });

      selection.appendChild(roster);

      const bottom = document.createElement("div");
      bottom.className = "selectionBottom";

      const note = document.createElement("div");
      note.className = "note";
      note.textContent = tr("selectHelp");
      bottom.appendChild(note);
      bottom.appendChild(
        this.makeButton(tr("deploy"), () => this.start(), true),
      );
      selection.appendChild(bottom);

      this.overlay.appendChild(selection);
      return;
    }

    if (this.state === "victory") {
      const actions = document.createElement("div");
      actions.className = "titleActions";
      actions.style.top = "88%";
      actions.appendChild(
        this.makeButton(tr("menu"), () => this.setState("title")),
      );
      this.overlay.appendChild(actions);
      return;
    }

    const panel = document.createElement("div");
    panel.className = "panel";
    const heading = document.createElement("h1");
    const info = document.createElement("p");
    const buttons = document.createElement("div");
    buttons.className = "buttons";

    if (this.state === "paused") {
      heading.textContent = tr("paused");
      info.textContent = tr("help");
      buttons.appendChild(
        this.makeButton(tr("resume"), () => this.pause(), true),
      );
      buttons.appendChild(this.makeButton(tr("restart"), () => this.start()));
      buttons.appendChild(
        this.makeButton(tr("menu"), () => this.setState("title")),
      );
    } else if (this.state === "gameover") {
      heading.textContent = tr("gameover");
      info.textContent = `${tr("score")}: ${this.score.toLocaleString()} · ${tr("continueNote")}`;
      buttons.appendChild(
        this.makeButton(tr("continue"), () => this.continueGame(), true),
      );
      buttons.appendChild(this.makeButton(tr("restart"), () => this.start()));
      buttons.appendChild(
        this.makeButton(tr("menu"), () => this.setState("title")),
      );
    } else if (this.state === "clear") {
      heading.textContent = tr("clear");
      const data = this.clearData;
      info.textContent =
        `${nameOf(STAGES[this.stage.index])} · ` +
        `${tr("healthBonus")}: ${data.health} · ` +
        `${tr("comboBonus")}: ${data.combo} · ` +
        `${tr("total")}: ${this.score.toLocaleString()}`;

      buttons.appendChild(
        this.makeButton(
          this.stage.index === STAGES.length - 1 ? tr("victory") : tr("next"),
          () => {
            if (this.stage.index === STAGES.length - 1) {
              this.setState("victory");
            } else {
              this.stage.load(this.stage.index + 1);
              this.setState("playing");
            }
          },
          true,
        ),
      );
    }

    panel.append(heading, info, buttons);
    this.overlay.appendChild(panel);
  }

  selectCharacter(index) {
    this.selected = (index + HEROES.length) % HEROES.length;
    this.audio.play("pickup");
    this.showUI();
  }

  start() {
    this.score = 0;
    this.maxCombo = 0;
    this.stageCombo = 0;
    this.clearData = null;
    this.player = new Player(this, HEROES[this.selected]);
    this.stage.load(0);
    this.setState("playing");
  }

  pause() {
    if (this.state === "playing") this.setState("paused");
    else if (this.state === "paused") this.setState("playing");
  }

  gameOver() {
    if (this.state !== "playing") return;
    this.audio.play("gameover");
    this.setState("gameover");
  }

  continueGame() {
    const p = this.player;
    p.dead = false;
    p.lives = 3;
    p.hp = p.maxHp;
    p.energy = 100;
    p.invuln = 3;
    p.stun = 0;
    p.z = p.vz = p.kx = p.ky = p.lifted = 0;
    p.combo = 0;
    p.chain = [];
    p.specialTime = 0;
    this.projectiles = [];
    this.hazards = [];
    this.setState("playing");
  }

  clearStage() {
    if (this.state !== "playing") return;

    const health = Math.round(this.player.hp) * 10;
    const combo = this.stageCombo * 100;
    this.clearData = { health, combo };
    this.score += health + combo;

    this.projectiles = [];
    this.hazards = [];
    this.enemies = [];
    this.player.specialTime = 0;
    this.bannerData = null;

    this.audio.play("clear");
    this.setState("clear");
  }

  banner(title, subtitle = "", duration = 2) {
    this.bannerData = { title, subtitle, life: duration, total: duration };
  }

  float(x, y, value, color = "#ffe19c", size = 22) {
    this.floating.push(new FloatingText(x, y, value, color, size));
    if (this.floating.length > 100)
      this.floating.splice(0, this.floating.length - 100);
  }

  burst(x, y, z, color, count = 12) {
    for (let i = 0; i < count; i++) {
      this.particles.push(
        new Particle(x, y, z, color, rand(2, 6), rand(0.25, 0.7)),
      );
    }
    if (this.particles.length > 500) {
      this.particles.splice(0, this.particles.length - 500);
    }
  }

  effect(type, x, y, color, radius = 100, life = 0.5, facing = 1) {
    this.effects.push(new Effect(type, x, y, color, radius, life, facing));
    if (this.effects.length > 160)
      this.effects.splice(0, this.effects.length - 160);
  }

  trail(actor, color) {
    if (this.time - (actor.lastTrail || 0) < 0.06) return;
    actor.lastTrail = this.time;

    this.effect(
      "ring",
      actor.x,
      actor.y - actor.z - 65,
      color,
      actor instanceof Boss ? 95 : 55,
      0.28,
    );
  }

  frame(timestamp) {
    const dt = this.lastFrame
      ? Math.min((timestamp - this.lastFrame) / 1000, 0.033)
      : 1 / 60;

    this.lastFrame = timestamp;
    this.time += dt;
    this.stateTime += dt;

    this.update(dt);
    this.draw();
    this.input.endFrame();

    requestAnimationFrame(this.boundFrame);
  }

  update(dt) {
    const input = this.input;

    if (input.take("Escape")) {
      if (this.state === "playing" || this.state === "paused") {
        this.pause();
        return;
      }
      if (this.state === "select") {
        this.setState("title");
        return;
      }
    }

    if (this.state === "title") {
      if (input.take("Enter") || input.take("Space")) this.setState("select");
      return;
    }

    if (this.state === "select") {
      if (input.take("ArrowLeft")) this.selectCharacter(this.selected - 1);
      if (input.take("ArrowRight")) this.selectCharacter(this.selected + 1);
      if (input.take("ArrowUp")) this.selectCharacter(this.selected - 4);
      if (input.take("ArrowDown")) this.selectCharacter(this.selected + 4);
      if (input.take("Enter") || input.take("Space")) this.start();
      return;
    }

    if (this.state === "paused") {
      if (input.take("Enter")) this.pause();
      return;
    }

    if (this.state === "gameover") {
      if (input.take("Enter")) this.continueGame();
      return;
    }

    if (this.state === "clear") {
      if (input.take("Enter") || input.take("Space")) {
        if (this.stage.index === STAGES.length - 1) {
          this.setState("victory");
        } else {
          this.stage.load(this.stage.index + 1);
          this.setState("playing");
        }
      }
      return;
    }

    if (this.state === "victory") {
      if (input.take("Enter") && this.stateTime > 2) this.setState("title");
      return;
    }

    if (this.state !== "playing") return;

    this.player.update(dt);
    if (this.state !== "playing") return;

    for (const enemy of [...this.enemies]) {
      if (!enemy.dead) enemy.update(dt);
      if (this.state !== "playing") return;
    }

    for (const key of [
      "projectiles",
      "hazards",
      "pickups",
      "particles",
      "effects",
      "floating",
    ]) {
      for (const item of [...this[key]]) {
        if (!item.dead && !(typeof item.life === "number" && item.life <= 0)) {
          item.update(dt);
        }
        if (this.state !== "playing") return;
      }

      this[key] = this[key].filter(
        (item) =>
          !item.dead && !(typeof item.life === "number" && item.life <= 0),
      );
    }

    this.enemies = this.enemies.filter((enemy) => !enemy.dead);
    this.objects = this.objects.filter((object) => !object.dead);

    this.stage.update(dt);
    if (this.state !== "playing") return;

    if (this.stage.arena) {
      this.camera = 2920;
    } else {
      const target = clamp(
        this.player.x - 380,
        0,
        Math.max(0, this.stage.gate - W),
      );
      this.camera = approach(this.camera, target, dt * 700);
    }

    this.shake = Math.max(0, this.shake - dt * 23);

    if (this.bannerData) {
      this.bannerData.life -= dt;
      if (this.bannerData.life <= 0) this.bannerData = null;
    }
  }

  draw() {
    const c = this.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.clearRect(0, 0, W, H);

    if (this.state === "title") {
      this.drawTitle(c);
      return;
    }

    if (this.state === "select") {
      this.drawSelection(c);
      return;
    }

    if (this.state === "victory") {
      this.drawVictory(c);
      return;
    }

    c.save();

    if (this.shake > 0 && this.state === "playing") {
      c.translate(
        rand(-this.shake, this.shake),
        rand(-this.shake * 0.5, this.shake * 0.5),
      );
    }

    this.scenery.draw(c);

    c.save();
    c.translate(-this.camera, 0);

    for (const hazard of this.hazards) hazard.draw(c);
    for (const pickup of this.pickups) pickup.draw(c);

    const actors = [
      ...this.objects.filter((o) => !o.dead),
      ...this.enemies.filter((e) => !e.dead),
      ...(this.player && !this.player.dead ? [this.player] : []),
    ].sort((a, b) => a.y - b.y);

    for (const actor of actors) {
      c.save();
      actor.draw(c);
      c.restore();
    }

    for (const projectile of this.projectiles) projectile.draw(c);
    for (const effect of this.effects) effect.draw(c);
    for (const particle of this.particles) particle.draw(c);
    for (const floating of this.floating) floating.draw(c);

    c.restore();
    this.scenery.weather(c);
    this.scenery.foreground(c);
    c.restore();

    this.drawHUD(c);

    if (this.bannerData && this.state === "playing") {
      const banner = this.bannerData;
      const alpha = clamp(
        Math.min(banner.life, banner.total - banner.life) * 4,
        0,
        1,
      );
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = "#091126ce";
      c.fillRect(0, 205, W, 100);
      line(
        c,
        [
          [0, 205],
          [W, 205],
        ],
        "#f6ce7944",
        2,
      );
      line(
        c,
        [
          [0, 305],
          [W, 305],
        ],
        "#f6ce7944",
        2,
      );
      text(c, banner.title, W / 2, 245, 31, "#ffe29b", "center");
      text(c, banner.subtitle, W / 2, 278, 20, "#d4e3f5", "center");
      c.restore();
    }

    if (["paused", "gameover", "clear"].includes(this.state)) {
      c.fillStyle = "#040a1899";
      c.fillRect(0, 0, W, H);
    }
  }

  bar(c, x, y, width, height, value, color) {
    value = clamp(value, 0, 1);

    c.fillStyle = "#071021";
    c.fillRect(x, y, width, height);
    c.fillStyle = color;
    c.fillRect(x + 2, y + 2, Math.max(0, (width - 4) * value), height - 4);
    c.fillStyle = "#ffffff25";
    c.fillRect(
      x + 2,
      y + 2,
      Math.max(0, (width - 4) * value),
      Math.max(1, height * 0.23),
    );
    c.strokeStyle = "#aebbd155";
    c.lineWidth = 1;
    c.strokeRect(x, y, width, height);
  }

  drawHUD(c) {
    const p = this.player;
    if (!p) return;

    c.fillStyle = "#071123e8";
    c.fillRect(18, 16, 415, 118);

    badge(c, 63, 57, 28);
    text(c, nameOf(p.def), 108, 43, 25, "#ffe19a");
    text(c, `${tr("lives")} × ${p.lives}`, 108, 65, 16, "#dae9f8");

    this.bar(c, 108, 76, 302, 19, p.hp / p.maxHp, "#80d5a1");
    this.bar(
      c,
      108,
      102,
      302,
      14,
      p.energy / 100,
      p.energy >= 100 ? "#f3d47a" : "#85c7ee",
    );

    text(c, "HP", 73, 91, 14, "#b7d9c8");
    text(c, "SP", 73, 114, 13, "#b6d9f5");

    text(
      c,
      `${tr("score")} ${this.score.toLocaleString()}`,
      W - 28,
      43,
      24,
      "#ffe19a",
      "right",
    );
    text(
      c,
      `${tr("stage")} ${this.stage.index + 1} / ${STAGES.length}`,
      W - 28,
      72,
      18,
      "#d0dfef",
      "right",
    );
    text(
      c,
      nameOf(STAGES[this.stage.index]),
      W - 28,
      96,
      15,
      "#a8bdd6",
      "right",
    );

    const weapon = p.weapon
      ? `${tr(p.weapon.type)} · ${p.weapon.uses}`
      : tr("unarmed");

    text(c, weapon, 27, 158, 16, "#c9d8e8");

    if (p.energy >= 100) {
      const alpha = 0.7 + Math.sin(this.time * 6) * 0.3;
      c.save();
      c.globalAlpha = alpha;
      text(c, `D · ${tr("ready")}`, 429, 113, 17, "#ffe49b");
      c.restore();
    }

    if (p.combo > 1) {
      text(c, `${p.combo}`, 78, 228, 53, "#ffe09b", "center");
      text(c, tr("combo"), 78, 250, 17, "#f6b68f", "center");
    }

    if (p.specialTime > 0) {
      text(c, localPair(p.def.ability), W / 2, 158, 18, "#ffe29c", "center");
    }

    const boss = this.stage.boss;

    if (boss && !boss.dead) {
      const x = 360;
      const width = 560;

      c.fillStyle = "#081024df";
      c.fillRect(x - 16, 641, width + 32, 69);
      text(c, nameOf(boss.def), W / 2, 663, 21, "#f5cee0", "center");
      this.bar(
        c,
        x,
        674,
        width,
        20,
        boss.hp / boss.maxHp,
        boss.phase === 2 ? "#ee987d" : "#c686b7",
      );

      const state =
        boss.shield > 0
          ? tr("shield")
          : boss.vulnerable > 0
            ? tr("vulnerable")
            : boss.phase === 2
              ? tr("enraged")
              : "";

      if (state) text(c, state, W / 2, 628, 19, "#ffe0a0", "center");
    } else if (
      this.state === "playing" &&
      !this.stage.arena &&
      this.stage.wave >= 3 &&
      !this.enemies.length
    ) {
      text(c, `${tr("go")}  ➜`, W - 85, 345, 30, "#ffe19b", "center");
    }

    if (this.audio.missing && this.audio.musicOn) {
      text(c, tr("musicMissing"), 25, 699, 12, "#9baec5");
    }
  }

  displayActor(def, extra = {}) {
    return {
      def,
      kind: def.id,
      facing: 1,
      moving: false,
      attackAnim: 0,
      lastAttack: "A",
      stun: 0,
      z: 0,
      weapon: null,
      flash: 0,
      ...extra,
    };
  }

  drawTitle(c) {
    // Draw custom title-screen background image
    if (gameMenuBackground.complete) {
      c.drawImage(gameMenuBackground, 0, 0, W, H);
    } else {
      // Fallback background while image is loading
      const gradient = c.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, "#111c35");
      gradient.addColorStop(0.5, "#26304a");
      gradient.addColorStop(1, "#1c1830");
      c.fillStyle = gradient;
      c.fillRect(0, 0, W, H);
    }

    c.save();
    c.globalAlpha = 0.1;
    badge(c, W / 2, 250, 210);
    c.restore();

    let titleTopText = tr("titleTop");
    let titleTopSize =
      titleTopText === "AN ARCADE BATTLE FOR THE FUTURE" ? 58 : 105;

    // Dark shadow
    text(c, titleTopText, W / 2 + 5, 153, titleTopSize, "#070e1c", "center");

    // Gold title
    text(c, titleTopText, W / 2, 146, titleTopSize, "#f4cf73", "center");

    text(c, tr("titleBottom"), W / 2, 202, 40, "#d3e8ff", "center");

    line(
      c,
      [
        [390, 221],
        [890, 221],
      ],
      "#e6b66d",
      3,
    );

    text(c, tr("titleNote"), W / 2, 251, 17, "#9eb5d0", "center");

    const positions = [340, 445, 550, 650, 755, 860, 955, 240];

    for (let i = 0; i < HEROES.length; i++) {
      const hero = HEROES[i];
      const x = positions[i];
      const y = 478 + (i % 2) * 11;

      oval(c, x, y, 34, 10, "#0006");

      c.save();
      c.translate(x, y);

      drawHumanoid(c, this.displayActor(hero), this.time, i === 0 ? 1.1 : 0.96);

      c.restore();
    }

    const shade = c.createLinearGradient(0, 460, 0, H);
    shade.addColorStop(0, "transparent");
    shade.addColorStop(1, "#070e1d");

    c.fillStyle = shade;
    c.fillRect(0, 460, W, H - 460);

    text(c, tr("fan"), W / 2, 680, 13, "#8096b0", "center");
  }

  drawSelection(c) {
    if (charSelectionBackground.complete) {
      c.drawImage(charSelectionBackground, 0, 0, W, H);
    } else {
      const gradient = c.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, "#101b31");
      gradient.addColorStop(1, "#26334d");
      c.fillStyle = gradient;
      c.fillRect(0, 0, W, H);
    }

    const left = W * 0.05;
    const top = H * 0.17;
    const rosterWidth = W * 0.44;
    const rosterHeight = H * 0.59;
    const gap = 8;
    const cellWidth = (rosterWidth - gap * 3) / 4;
    const cellHeight = (rosterHeight - gap) / 2;

    for (let i = 0; i < HEROES.length; i++) {
      const x = left + (i % 4) * (cellWidth + gap);
      const y = top + Math.floor(i / 4) * (cellHeight + gap);

      c.fillStyle = i === this.selected ? "#4b4b53" : "#19283e";
      c.fillRect(x, y, cellWidth, cellHeight);

      c.save();
      c.beginPath();
      c.rect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
      c.clip();
      c.translate(x + cellWidth / 2, y + cellHeight - 17);
      drawHumanoid(c, this.displayActor(HEROES[i]), this.time, 1.02);
      c.restore();
    }

    const hero = HEROES[this.selected];

    c.save();
    c.globalAlpha = 0.09;
    badge(c, 880, 292, 170);
    c.restore();

    oval(c, 902, 410, 100, 21, "#0005");

    c.save();
    c.translate(902, 410);
    drawHumanoid(c, this.displayActor(hero), this.time, 1.7);
    c.restore();

    text(c, nameOf(hero), 899, 466, 35, "#ffe19b", "center");
    text(c, localPair(hero.power), 899, 495, 19, "#cbdcf1", "center");
    text(c, localPair(hero.ability), 899, 524, 17, "#accfe8", "center");

    const labels = [tr("attack"), tr("speed"), tr("defence")];

    for (let i = 0; i < 3; i++) {
      const x = 700 + i * 138;
      text(c, labels[i], x, 563, 15, "#aabfd8");
      this.bar(c, x, 575, 110, 12, hero.stats[i] / 10, hero.trim);
    }
  }

  drawVictory(c) {
    const t = this.stateTime;
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#3d5474");
    sky.addColorStop(0.55, "#d6a68c");
    sky.addColorStop(1, "#3c594d");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);

    oval(c, 1007, 166, 56, 56, "#ffe0ad");

    for (let i = 0; i < 16; i++) {
      const x = i * 90;
      oval(c, x, 357, 65, 115 + noise(i) * 55, "#243e42");
      c.fillStyle = "#304145";
      c.fillRect(x - 6, 343, 12, 119);
    }

    c.fillStyle = "#6b6666";
    c.fillRect(350, 249, 580, 221);
    c.fillStyle = "#867978";
    c.fillRect(460, 202, 360, 269);

    polygon(
      c,
      [
        [323, 255],
        [414, 188],
        [515, 255],
      ],
      "#3e4557",
      "#293349",
      3,
    );
    polygon(
      c,
      [
        [758, 255],
        [867, 188],
        [957, 255],
      ],
      "#3e4557",
      "#293349",
      3,
    );
    polygon(
      c,
      [
        [430, 210],
        [640, 116],
        [850, 210],
      ],
      "#454959",
      "#293349",
      4,
    );

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 7; col++) {
        const x = 384 + col * 73;
        const y = 276 + row * 71;
        c.fillStyle = "#2c3e50";
        c.fillRect(x, y, 36, 46);
        c.fillStyle = "#e9c591a0";
        c.fillRect(x + 5, y + 5, 26, 36);
        line(
          c,
          [
            [x + 18, y + 4],
            [x + 18, y + 42],
          ],
          "#51515f",
          3,
        );
      }
    }

    c.fillStyle = "#303242";
    c.fillRect(603, 364, 74, 107);
    for (const x of [578, 687]) {
      c.fillStyle = "#b6aaa0";
      c.fillRect(x, 325, 15, 146);
    }
    polygon(
      c,
      [
        [558, 331],
        [641, 282],
        [724, 331],
      ],
      "#b5a89c",
      "#615965",
      3,
    );
    badge(c, 641, 308, 15);

    c.fillStyle = "#435e4c";
    c.fillRect(0, 472, W, H - 472);
    polygon(
      c,
      [
        [599, 472],
        [681, 472],
        [969, 720],
        [313, 720],
      ],
      "#918783",
      null,
    );

    for (let i = 0; i < HEROES.length; i++) {
      const targetX = 230 + i * 116;
      const progress = clamp((t - i * 0.12) / 2.5, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const x = -180 + i * 22 + (targetX + 180 - i * 22) * eased;
      const y = 592 + (i % 2) * 16;

      oval(c, x, y, 33, 9, "#0004");

      c.save();
      c.translate(x, y);
      drawHumanoid(
        c,
        this.displayActor(HEROES[i], {
          moving: progress < 1,
          attackAnim: i === this.selected && progress >= 1 ? 0.15 : 0,
        }),
        this.time,
        0.97,
      );
      c.restore();
    }

    c.fillStyle = "#081427c9";
    c.fillRect(0, 0, W, 111);
    text(c, tr("victory"), W / 2, 48, 38, "#ffe09a", "center");
    text(c, tr("ending"), W / 2, 82, 18, "#d4e4f2", "center");

    const tally = Math.round(this.score * clamp((t - 1) / 3, 0, 1));
    text(
      c,
      `${tr("total")} ${tally.toLocaleString()}`,
      W / 2,
      651,
      29,
      "#ffe2a1",
      "center",
    );

    if (t > 4) {
      text(c, tr("credits"), W / 2, 678, 15, "#c9d9e5", "center");
    }
  }
}

let game = new Game();
window.mutantWars = game;
