// ============================================================
// 🧰 Developer Tool Merkezi — Cloudflare Worker
// 100+ gural | Türkmençe interfeýs | Telegram Webhook
// ============================================================

const BOT_TOKEN = "8553460773:AAEiK8vhc5ogKThBAD88Uh8NNaluEVGI4AY";
const API = `https://api.telegram.org/bot${BOT_TOKEN}/`;

const MAX_INPUT = 8000;

// ============================================================
// TELEGRAM API
// ============================================================

async function telegram(method, data = {}) {
  const response = await fetch(API + method, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return await response.json();
}

async function sendMessage(chatId, text, keyboard = null, extra = {}) {
  const data = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...extra
  };

  if (keyboard) {
    data.reply_markup = JSON.stringify({
      inline_keyboard: keyboard
    });
  }

  return telegram("sendMessage", data);
}

async function answerCallback(id) {
  return telegram("answerCallbackQuery", {
    callback_query_id: id
  });
}

async function editMessage(chatId, messageId, text, keyboard = null) {
  const data = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML"
  };

  if (keyboard) {
    data.reply_markup = JSON.stringify({
      inline_keyboard: keyboard
    });
  }

  return telegram("editMessageText", data);
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cut(text) {
  return String(text).slice(0, MAX_INPUT);
}

// ============================================================
// MENÜ
// ============================================================

const CATEGORIES = {
  enc: "🔐 Kodlama / Dekodlama",
  text: "📝 Tekst",
  dev: "🧑‍💻 Developer",
  hash: "🔑 Hash / Kriptografiýa",
  math: "🧮 Matematika",
  url: "🌐 URL / Tor",
  color: "🎨 Reňk",
  date: "🕒 Wagt / Sene",
  tg: "🤖 Telegram"
};

const TOOLS = {

  // ----------------------------------------------------------
  // KODLAMA
  // ----------------------------------------------------------

  b64e: ["enc", "🔐 Base64 kodla"],
  b64d: ["enc", "🔓 Base64 dekodla"],
  b64url_e: ["enc", "🔐 Base64URL kodla"],
  b64url_d: ["enc", "🔓 Base64URL dekodla"],
  urlencode: ["enc", "🔗 URL kodla"],
  urldecode: ["enc", "🔓 URL dekodla"],
  hexencode: ["enc", "🔢 HEX-e öwür"],
  hexdecode: ["enc", "🔢 HEX-den öwür"],
  binaryencode: ["enc", "01 Ikilik kodla"],
  binarydecode: ["enc", "01 Ikilik dekodla"],
  rot13: ["enc", "🔄 ROT13"],
  htmlencode: ["enc", "🌐 HTML kodla"],
  htmldecode: ["enc", "🌐 HTML dekodla"],
  jsonescape: ["enc", "JSON escape"],
  unicodeencode: ["enc", "Unicode kodla"],
  unicodedecode: ["enc", "Unicode dekodla"],
  datauri: ["enc", "Data URI döret"],
  datauridecode: ["enc", "Data URI aç"],
  asciihex: ["enc", "ASCII → HEX"],
  hexascii: ["enc", "HEX → ASCII"],

  // ----------------------------------------------------------
  // TEKST
  // ----------------------------------------------------------

  uppercase: ["text", "🔠 Uly harplar"],
  lowercase: ["text", "🔡 Kiçi harplar"],
  titlecase: ["text", "🔤 Baş harp görnüşi"],
  reverse: ["text", "↩️ Tersine öwür"],
  charcount: ["text", "🔢 Nyşan sany"],
  wordcount: ["text", "🔢 Söz sany"],
  linecount: ["text", "🔢 Setir sany"],
  bytecount: ["text", "📦 Byte sany"],
  removespaces: ["text", "🚫 Boşluklary aýyr"],
  trimlines: ["text", "🧹 Setirleri arassala"],
  emptylines: ["text", "🧹 Boş setirleri aýyr"],
  sortlines: ["🔤", "text"],
  uniquelines: ["text", "♻️ Gaýtalanýan setirleri aýyr"],
  reversewords: ["text", "🔄 Sözleri tersine öwür"],
  removePunctuation: ["text", "✂️ Dyngy belgilerini aýyr"],
  asciionly: ["text", "ASCII-den başga nyşanlary aýyr"],
  slugify: ["text", "🔗 Slug döret"],
  palindrome: ["text", "🔍 Palindrom barla"],
  emojicount: ["text", "😀 Emoji sany"],
  numberlines: ["text", "🔢 Setirleri belgile"],
  duplicatewords: ["text", "♻️ Gaýtalanýan sözler"],
  wordfrequency: ["text", "📊 Söz ýygylygy"],
  newlineunix: ["text", "↵ UNIX setiri"],
  newlinewindows: ["text", "↵ Windows setiri"],
  tabsToSpaces: ["text", "↹ Tab → boşluk"],
  spacesToTabs: ["↹", "text"],
  removeNumbers: ["text", "🔢 Sanlary aýyr"],
  keepNumbers: ["text", "🔢 Diňe sanlary sakla"],
  keepLetters: ["text", "🔤 Diňe harplary sakla"],
  trim: ["text", "✂️ Başdaky/soňky boşluk"],

  // ----------------------------------------------------------
  // DEVELOPER
  // ----------------------------------------------------------

  jsonformat: ["dev", "JSON formatla"],
  jsonminify: ["dev", "JSON kiçelt"],
  jsonvalidate: ["dev", "JSON barla"],
  jsontocsv: ["dev", "JSON → CSV"],
  csvtojson: ["dev", "CSV → JSON"],
  jsonsort: ["dev", "JSON açarlaryny tertiple"],
  jsonkeys: ["dev", "JSON açarlaryny görkez"],
  jsonlength: ["dev", "JSON element sany"],
  xmlformat: ["dev", "XML formatla"],
  xmlvalidate: ["dev", "XML barla"],
  jwtdecode: ["dev", "JWT dekodla"],
  uuid4: ["dev", "UUID v4 döret"],
  uuid5: ["dev", "UUID v5 döret"],
  regexescape: ["dev", "Regex escape"],
  regextest: ["dev", "Regex barla"],
  phpescape: ["dev", "PHP string escape"],
  jsescape: ["dev", "JavaScript escape"],
  cssescape: ["dev", "CSS escape"],
  shellescape: ["dev", "Shell escape"],
  htmlpretty: ["dev", "HTML tertiple"],
  queryparse: ["dev", "Query String çöz"],
  querybuild: ["dev", "Query String döret"],
  mime: ["dev", "MIME görnüşi"],
  useragent: ["dev", "User-Agent gör"],
  semver: ["dev", "SemVer deňeşdir"],
  semverbump: ["dev", "SemVer ýokarlandyr"],
  passwordhash: ["dev", "Parol hash döret"],
  randomjson: ["dev", "Tötänleýin JSON"],
  timestamp: ["dev", "Unix timestamp"],
  timestampdate: ["dev", "Timestamp → sene"],
  datetimestamp: ["dev", "Sene → timestamp"],
  markdownescape: ["dev", "Markdown escape"],
  sqlescape: ["dev", "SQL string escape"],
  ip4validate: ["dev", "IPv4 barla"],
  ip6validate: ["dev", "IPv6 barla"],
  cidr: ["dev", "IPv4 CIDR hasapla"],
  byteconvert: ["dev", "Byte ölçeg öwür"],
  jsonpointer: ["dev", "JSON Pointer"],
  randomstring: ["dev", "Tötänleýin tekst"],
  randomnumber: ["dev", "Tötänleýin san"],

  // ----------------------------------------------------------
  // HASH
  // ----------------------------------------------------------

  md5: ["hash", "MD5"],
  sha1: ["hash", "SHA-1"],
  sha224: ["hash", "SHA-224"],
  sha256: ["hash", "SHA-256"],
  sha384: ["hash", "SHA-384"],
  sha512: ["hash", "SHA-512"],
  sha3256: ["hash", "SHA3-256"],
  sha3512: ["hash", "SHA3-512"],
  crc32: ["hash", "CRC32"],
  hmacsha256: ["hash", "HMAC-SHA256"],
  hmacsha512: ["hash", "HMAC-SHA512"],
  hashalgorithms: ["hash", "Hash algoritmleri"],

  // ----------------------------------------------------------
  // MATEMATIKA
  // ----------------------------------------------------------

  calculator: ["math", "🧮 Kalkulýator"],
  absolute: ["math", "Absolýut baha"],
  round: ["math", "Tegelekle"],
  ceil: ["math", "Ýokary tegelekle"],
  floor: ["math", "Aşak tegelekle"],
  sqrt: ["math", "Kwadrat kök"],
  power: ["math", "Derejä göter"],
  percentage: ["math", "Göterim hasapla"],
  gcd: ["math", "GCD"],
  lcm: ["math", "LCM"],
  prime: ["math", "Baş san barlagy"],
  fibonacci: ["math", "Fibonacci"],
  factorial: ["math", "Faktorial"],
  average: ["math", "Ortaça"],
  minmax: ["math", "Min / Max"],
  sum: ["math", "Jem"],
  product: ["math", "Köpeltmek"],
  randommath: ["math", "Tötänleýin san"],

  // ----------------------------------------------------------
  // URL / TOR
  // ----------------------------------------------------------

  urlparse: ["url", "URL çöz"],
  urldomain: ["url", "Domen tap"],
  urlhost: ["url", "Host tap"],
  urlpath: ["url", "Ýol tap"],
  urlquery: ["url", "Query tap"],
  urlfragment: ["url", "Fragment tap"],
  urlscheme: ["url", "Shema tap"],
  urlport: ["url", "Port tap"],
  urlusername: ["url", "Ulanyjy adyny tap"],
  urlpassword: ["url", "URL parol bölegini tap"],
  httpstatus: ["url", "HTTP status"],
  ipvalidate: ["url", "IP barla"],

  // ----------------------------------------------------------
  // REŇK
  // ----------------------------------------------------------

  hexrgb: ["color", "HEX → RGB"],
  rgbhex: ["color", "RGB → HEX"],
  hexhsl: ["color", "HEX → HSL"],
  rgbhsl: ["color", "RGB → HSL"],
  hslrgb: ["color", "HSL → RGB"],
  invertcolor: ["color", "Reňki tersine öwür"],
  grayscale: ["color", "Çal reňke öwür"],
  colorinfo: ["color", "Reňk maglumatlary"],

  // ----------------------------------------------------------
  // WAGT
  // ----------------------------------------------------------

  nowutc: ["date", "UTC wagty"],
  nowdate: ["date", "Häzirki sene"],
  nowtime: ["date", "Häzirki wagt"],
  unixnow: ["date", "Unix wagty"],
  iso8601: ["date", "ISO 8601"],
  timestampToDate: ["date", "Timestamp → sene"],
  dateToTimestamp: ["date", "Sene → timestamp"],

  // ----------------------------------------------------------
  // TELEGRAM
  // ----------------------------------------------------------

  telegramid: ["tg", "Telegram ID"],
  telegraminfo: ["tg", "Ulanyjy maglumatlary"],
  chatinfo: ["tg", "Chat maglumatlary"],
  botinfo: ["tg", "Bot maglumatlary"],
  chatid: ["tg", "Chat ID"],
};

// Düzetmeler
TOOLS.sortlines = ["text", "🔤 Setirleri tertiple"];
TOOLS.spacesToTabs = ["text", "↹ Boşluk → Tab"];

// ============================================================
// SAN
// ============================================================

function countTools() {
  return Object.keys(TOOLS).length;
}

// ============================================================
// MENÝU
// ============================================================

function mainMenu() {
  const rows = [];

  for (const [id, name] of Object.entries(CATEGORIES)) {
    rows.push([
      {
        text: name,
        callback_data: "cat:" + id
      }
    ]);
  }

  rows.push([
    {
      text: `📚 Ähli gurallar (${countTools()})`,
      callback_data: "all"
    }
  ]);

  return rows;
}

function categoryMenu(category) {
  const buttons = [];

  for (const [id, tool] of Object.entries(TOOLS)) {
    if (tool[0] === category) {
      buttons.push({
        text: tool[1],
        callback_data: "tool:" + id
      });
    }
  }

  const rows = [];

  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }

  rows.push([
    {
      text: "⬅️ Baş menýu",
      callback_data: "home"
    }
  ]);

  return rows;
}

function allToolsMenu() {
  const buttons = Object.entries(TOOLS).map(([id, tool]) => ({
    text: tool[1],
    callback_data: "tool:" + id
  }));

  const rows = [];

  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }

  rows.push([
    {
      text: "⬅️ Baş menýu",
      callback_data: "home"
    }
  ]);

  return rows;
}

// ============================================================
// GURAL PROMPT
// ============================================================

function toolPrompt(id) {
  const name = TOOLS[id]?.[1] || "Gural";

  return (
    `🛠 <b>${esc(name)}</b>\n\n` +
    `Maglumaty şu habaryň <b>jogaby</b> hökmünde iberiň.\n\n` +
    `📌 Guralyň ady: <code>${esc(name)}</code>\n\n` +
    `❌ Bes etmek üçin /cancel ýazyň.`
  );
}

// ============================================================
// BASE64
// ============================================================

function b64Encode(s) {
  const bytes = new TextEncoder().encode(s);

  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);

  return btoa(binary);
}

function b64Decode(s) {
  try {
    const binary = atob(s.trim());
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error("Base64 maglumat nädogry.");
  }
}

function base64urlEncode(s) {
  return b64Encode(s)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64urlDecode(s) {
  let x = s.replace(/-/g, "+").replace(/_/g, "/");
  while (x.length % 4) x += "=";
  return b64Decode(x);
}

// ============================================================
// UUID
// ============================================================

function uuid4() {
  return crypto.randomUUID();
}

async function uuid5(name) {
  const namespace = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

  const ns = namespace.replace(/-/g, "");
  const bytes = new Uint8Array(ns.length / 2 + name.length);

  for (let i = 0; i < ns.length; i += 2)
    bytes[i / 2] = parseInt(ns.substring(i, i + 2), 16);

  const nameBytes = new TextEncoder().encode(name);

  bytes.set(nameBytes, ns.length / 2);

  const digest = await crypto.subtle.digest("SHA-1", bytes);

  const a = Array.from(new Uint8Array(digest))
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");

  return (
    a.substring(0, 8) + "-" +
    a.substring(8, 12) + "-5" +
    a.substring(13, 16) + "-" +
    ((parseInt(a.substring(16, 18), 16) & 0x3f) | 0x80)
      .toString(16).padStart(2, "0") +
    a.substring(18, 20) + "-" +
    a.substring(20, 32)
  );
}

// ============================================================
// HASH
// ============================================================

async function digest(algorithm, text) {
  const data = new TextEncoder().encode(text);

  const buffer = await crypto.subtle.digest(
    algorithm,
    data
  );

  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(algorithm, key, text) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    {
      name: "HMAC",
      hash: algorithm
    },
    false,
    ["sign"]
  );

  const result = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(text)
  );

  return [...new Uint8Array(result)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("");
}

// ============================================================
// GÜVENLI CALCULATOR
// ============================================================

function calculate(expression) {
  expression = expression.trim();

  if (!/^[0-9+\-*/().%\s^]+$/.test(expression)) {
    throw new Error("Diňe sanlar we + - * / % ^ ( ) ulanyp bilersiňiz.");
  }

  const tokens =
    expression.match(/(\d+(?:\.\d+)?|\.\d+|[()+\-*/%^])/g);

  if (!tokens) throw new Error("Hasaplama nädogry.");

  let pos = 0;

  function primary() {
    const token = tokens[pos];

    if (token === "+") {
      pos++;
      return primary();
    }

    if (token === "-") {
      pos++;
      return -primary();
    }

    if (token === "(") {
      pos++;

      const value = addSub();

      if (tokens[pos] !== ")")
        throw new Error("Ýapylmadyk ýaý bar.");

      pos++;
      return value;
    }

    if (!token || !/^\d/.test(token))
      throw new Error("Nädogry san.");

    pos++;
    return Number(token);
  }

  function power() {
    let a = primary();

    if (tokens[pos] === "^") {
      pos++;
      a = Math.pow(a, power());
    }

    return a;
  }

  function mulDiv() {
    let value = power();

    while (
      ["*", "/", "%"].includes(tokens[pos])
    ) {
      const op = tokens[pos++];

      const b = power();

      if (op === "*") value *= b;

      if (op === "/") {
        if (b === 0) throw new Error("Nola bölmek bolmaýar.");
        value /= b;
      }

      if (op === "%") {
        if (b === 0) throw new Error("Nola modul almak bolmaýar.");
        value %= b;
      }
    }

    return value;
  }

  function addSub() {
    let value = mulDiv();

    while (
      tokens[pos] === "+" ||
      tokens[pos] === "-"
    ) {
      const op = tokens[pos++];

      const b = mulDiv();

      value = op === "+" ? value + b : value - b;
    }

    return value;
  }

  const result = addSub();

  if (pos !== tokens.length)
    throw new Error("Nädogry aňlatma.");

  if (!Number.isFinite(result))
    throw new Error("Netije nädogry.");

  return result;
}

// ============================================================
// REŇK
// ============================================================

function hexToRgb(hex) {
  hex = hex.trim().replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(hex))
    throw new Error("HEX #RRGGBB görnüşinde bolmaly.");

  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b]
    .map(x => Number(x).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
    }

    h /= 6;
  }

  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100)
  ];
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }

  const q =
    l < 0.5
      ? l * (1 + s)
      : l + s - l * s;

  const p = 2 * l - q;

  function hue(t) {
    if (t < 0) t++;
    if (t > 1) t--;

    if (t < 1 / 6)
      return p + (q - p) * 6 * t;

    if (t < 1 / 2)
      return q;

    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;

    return p;
  }

  return [
    Math.round(hue(h + 1 / 3) * 255),
    Math.round(hue(h) * 255),
    Math.round(hue(h - 1 / 3) * 255)
  ];
}

// ============================================================
// JSON → CSV
// ============================================================

function jsonToCsv(obj) {
  if (!Array.isArray(obj))
    obj = [obj];

  if (!obj.length)
    return "";

  const keys = [
    ...new Set(
      obj.flatMap(x =>
        typeof x === "object"
          ? Object.keys(x)
          : []
      )
    )
  ];

  const quote = value => {
    value = String(value ?? "");

    if (
      value.includes(",") ||
      value.includes('"') ||
      value.includes("\n")
    ) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  };

  const lines = [];

  lines.push(keys.map(quote).join(","));

  for (const row of obj) {
    lines.push(
      keys.map(k => quote(row?.[k])).join(",")
    );
  }

  return lines.join("\n");
}

// ============================================================
// TOOL ENGINE
// ============================================================

async function runTool(id, input, message) {

  input = cut(input);

  switch (id) {

    // ========================================================
    // ENCODING
    // ========================================================

    case "b64e":
      return `<code>${esc(b64Encode(input))}</code>`;

    case "b64d":
      return `<code>${esc(b64Decode(input))}</code>`;

    case "b64url_e":
      return `<code>${esc(base64urlEncode(input))}</code>`;

    case "b64url_d":
      return `<code>${esc(base64urlDecode(input))}</code>`;

    case "urlencode":
      return `<code>${esc(encodeURIComponent(input))}</code>`;

    case "urldecode":
      return `<code>${esc(decodeURIComponent(input))}</code>`;

    case "hexencode":
      return `<code>${[...new TextEncoder().encode(input)]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("")}</code>`;

    case "hexdecode": {
      const clean = input.replace(/\s/g, "");

      if (!/^[0-9a-fA-F]*$/.test(clean))
        throw new Error("HEX nädogry.");

      const bytes = new Uint8Array(
        clean.match(/.{1,2}/g)?.map(x => parseInt(x, 16)) || []
      );

      return `<code>${esc(new TextDecoder().decode(bytes))}</code>`;
    }

    case "binaryencode":
      return `<code>${[...new TextEncoder().encode(input)]
        .map(x => x.toString(2).padStart(8, "0"))
        .join(" ")}</code>`;

    case "binarydecode": {
      const parts = input.trim().split(/\s+/);

      if (parts.some(x => !/^[01]{8}$/.test(x)))
        throw new Error("Her bölek 8 bit bolmaly.");

      const bytes = new Uint8Array(
        parts.map(x => parseInt(x, 2))
      );

      return `<code>${esc(new TextDecoder().decode(bytes))}</code>`;
    }

    case "rot13":
      return `<code>${esc(input.replace(/[a-zA-Z]/g, c =>
        String.fromCharCode(
          c.charCodeAt(0) +
          (c.toLowerCase() < "n" ? 13 : -13)
        )
      ))}</code>`;

    case "htmlencode":
      return esc(input);

    case "htmldecode":
      return input
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    case "jsonescape":
      return `<code>${esc(JSON.stringify(input))}</code>`;

    case "unicodeencode":
      return `<code>${[...input]
        .map(c =>
          "\\u" +
          c.codePointAt(0).toString(16).padStart(4, "0")
        )
        .join("")}</code>`;

    case "unicodedecode":
      return `<code>${esc(
        input.replace(
          /\\u([0-9a-fA-F]{4})/g,
          (_, h) => String.fromCharCode(parseInt(h, 16))
        )
      )}</code>`;

    case "datauri":
      return `<code>${esc(
        "data:text/plain;base64," + b64Encode(input)
      )}</code>`;

    case "datauridecode": {
      const m = input.match(/^data:([^;,]+)?;base64,(.+)$/);

      if (!m)
        throw new Error("Data URI nädogry.");

      return `<b>MIME:</b> ${esc(m[1] || "text/plain")}
      
<code>${esc(b64Decode(m[2]))}</code>`;
    }

    case "asciihex":
      return `<code>${[...input]
        .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" ")}</code>`;

    case "hexascii":
      return runTool("hexdecode", input, message);

    // ========================================================
    // TEKST
    // ========================================================

    case "uppercase":
      return esc(input.toLocaleUpperCase("tk-TM"));

    case "lowercase":
      return esc(input.toLocaleLowerCase("tk-TM"));

    case "titlecase":
      return esc(
        input.toLocaleLowerCase("tk-TM")
          .replace(/\b\p{L}/gu, c => c.toLocaleUpperCase("tk-TM"))
      );

    case "reverse":
      return esc([...input].reverse().join(""));

    case "charcount":
      return `🔢 Nyşan sany: <b>${[...input].length}</b>`;

    case "wordcount":
      return `🔢 Söz sany: <b>${
        input.trim()
          ? input.trim().split(/\s+/u).length
          : 0
      }</b>`;

    case "linecount":
      return `🔢 Setir sany: <b>${
        input ? input.split(/\r?\n/).length : 0
      }</b>`;

    case "bytecount":
      return `📦 Byte sany: <b>${new TextEncoder().encode(input).length}</b>`;

    case "removespaces":
      return esc(input.replace(/\s+/gu, ""));

    case "trimlines":
      return esc(
        input.split(/\r?\n/)
          .map(x => x.trim())
          .join("\n")
      );

    case "emptylines":
      return esc(
        input.split(/\r?\n/)
          .filter(x => x.trim() !== "")
          .join("\n")
      );

    case "sortlines":
      return esc(
        input.split(/\r?\n/)
          .sort((a, b) => a.localeCompare(b, "tk"))
          .join("\n")
      );

    case "uniquelines":
      return esc([
        ...new Set(input.split(/\r?\n/))
      ].join("\n"));

    case "reversewords":
      return esc(
        input.split(/\s+/).reverse().join(" ")
      );

    case "removePunctuation":
      return esc(
        input.replace(/[^\p{L}\p{N}\s]/gu, "")
      );

    case "asciionly":
      return esc(
        input.replace(/[^\x00-\x7F]/g, "")
      );

    case "slugify":
      return esc(
        input
          .toLocaleLowerCase("tk-TM")
          .trim()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-|-$/g, "")
      );

    case "palindrome": {
      const x = input
        .toLocaleLowerCase("tk-TM")
        .replace(/[^\p{L}\p{N}]/gu, "");

      return x === [...x].reverse().join("")
        ? "✅ Bu <b>palindromdyr</b>."
        : "❌ Bu palindrom däl.";
    }

    case "emojicount":
      return `😀 Emoji sany: <b>${
        [...input].filter(c => {
          const n = c.codePointAt(0);
          return n >= 0x1F000 && n <= 0x1FAFF;
        }).length
      }</b>`;

    case "numberlines":
      return esc(
        input.split(/\r?\n/)
          .map((x, i) => `${i + 1}. ${x}`)
          .join("\n")
      );

    case "duplicatewords": {
      const words = input.toLocaleLowerCase("tk-TM")
        .match(/\p{L}+/gu) || [];

      const count = {};

      for (const word of words)
        count[word] = (count[word] || 0) + 1;

      const duplicates = Object.entries(count)
        .filter(([, n]) => n > 1)
        .map(([w, n]) => `${w}: ${n}`);

      return duplicates.length
        ? `<pre>${esc(duplicates.join("\n"))}</pre>`
        : "✅ Gaýtalanýan söz ýok.";
    }

    case "wordfrequency": {
      const words = input.toLocaleLowerCase("tk-TM")
        .match(/\p{L}+/gu) || [];

      const count = {};

      for (const word of words)
        count[word] = (count[word] || 0) + 1;

      return `<pre>${esc(
        Object.entries(count)
          .sort((a, b) => b[1] - a[1])
          .map(([w, n]) => `${w}: ${n}`)
          .join("\n")
      )}</pre>`;
    }

    case "newlineunix":
      return esc(input.replace(/\r\n/g, "\n").replace(/\r/g, "\n"));

    case "newlinewindows":
      return esc(
        input.replace(/\r?\n/g, "\r\n")
      );

    case "tabsToSpaces":
      return esc(input.replace(/\t/g, "    "));

    case "spacesToTabs":
      return esc(input.replace(/ {4}/g, "\t"));

    case "removeNumbers":
      return esc(input.replace(/[0-9]/g, ""));

    case "keepNumbers":
      return esc(input.replace(/[^0-9]/g, ""));

    case "keepLetters":
      return esc(input.replace(/[^\p{L}\s]/gu, ""));

    case "trim":
      return esc(input.trim());

    // ========================================================
    // DEVELOPER
    // ========================================================

    case "jsonformat": {
      const j = JSON.parse(input);

      return `<pre>${esc(
        JSON.stringify(j, null, 2)
      )}</pre>`;
    }

    case "jsonminify": {
      const j = JSON.parse(input);

      return `<code>${esc(
        JSON.stringify(j)
      )}</code>`;
    }

    case "jsonvalidate": {
      try {
        JSON.parse(input);
        return "✅ JSON dogry.";
      } catch (e) {
        return `❌ JSON nädogry.\n\n<code>${esc(e.message)}</code>`;
      }
    }

    case "jsontocsv": {
      const j = JSON.parse(input);

      return `<pre>${esc(
        jsonToCsv(j)
      )}</pre>`;
    }

    case "csvtojson": {
      const lines = input
        .trim()
        .split(/\r?\n/);

      if (!lines.length)
        throw new Error("CSV boş.");

      const headers = lines[0]
        .split(",")
        .map(x => x.trim());

      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");

        const obj = {};

        headers.forEach((h, index) => {
          obj[h] = values[index] ?? "";
        });

        result.push(obj);
      }

      return `<pre>${esc(
        JSON.stringify(result, null, 2)
      )}</pre>`;
    }

    case "jsonsort": {
      const j = JSON.parse(input);

      if (
        j &&
        typeof j === "object" &&
        !Array.isArray(j)
      ) {
        const sorted = {};

        for (const key of Object.keys(j).sort())
          sorted[key] = j[key];

        return `<pre>${esc(
          JSON.stringify(sorted, null, 2)
        )}</pre>`;
      }

      return `<pre>${esc(
        JSON.stringify(j, null, 2)
      )}</pre>`;
    }

    case "jsonkeys": {
      const j = JSON.parse(input);

      if (
        !j ||
        typeof j !== "object" ||
        Array.isArray(j)
      )
        throw new Error("JSON obýekti gerek.");

      return `<pre>${esc(
        Object.keys(j).join("\n")
      )}</pre>`;
    }

    case "jsonlength": {
      const j = JSON.parse(input);

      return `🔢 Element sany: <b>${
        Array.isArray(j)
          ? j.length
          : Object.keys(j).length
      }</b>`;
    }

    case "xmlvalidate":
      return /^\s*<[\s\S]+>\s*$/.test(input)
        ? "⚠️ XML gurluşy meňzeýär. Doly XML parser Worker-da elýeter däldir."
        : "❌ XML görnüşi nädogry.";

    case "xmlformat":
      return `<pre>${esc(
        input
          .replace(/></g, ">\n<")
          .split("\n")
          .map((x, i) => "  ".repeat(
            Math.max(
              0,
              (x.match(/^<\//) ? i - 1 : i)
            )
          ) + x.trim())
          .join("\n")
      )}</pre>`;

    case "jwtdecode": {
      const p = input.split(".");

      if (p.length !== 3)
        throw new Error("JWT üç bölekden ybarat bolmaly.");

      return (
        `<b>Başlyk:</b>\n<pre>${esc(
          b64Decode(p[0].replace(/-/g, "+").replace(/_/g, "/"))
        )}</pre>\n\n` +
        `<b>Ýük:</b>\n<pre>${esc(
          b64Decode(p[1].replace(/-/g, "+").replace(/_/g, "/"))
        )}</pre>\n\n` +
        `⚠️ Gol barlanylanok.`
      );
    }

    case "uuid4":
      return `<code>${uuid4()}</code>`;

    case "uuid5":
      return `<code>${esc(await uuid5(input))}</code>`;

    case "regexescape":
      return `<code>${esc(
        input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      )}</code>`;

    case "regextest": {
      const lines = input.split(/\r?\n/);

      if (lines.length < 2)
        throw new Error(
          "Birinji setirde regex, ikinjide tekst bolmaly."
        );

      let regex;

      try {
        regex = new RegExp(lines[0]);
      } catch {
        throw new Error("Regex nädogry.");
      }

      return regex.test(lines.slice(1).join("\n"))
        ? "✅ Regex gabat geldi."
        : "❌ Regex gabat gelmedi.";
    }

    case "phpescape":
      return `<code>${esc(
        input.replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
      )}</code>`;

    case "jsescape":
      return `<code>${esc(
        JSON.stringify(input)
      )}</code>`;

    case "cssescape":
      return `<code>${esc(
        input.replace(
          /[^a-zA-Z0-9_-]/g,
          c => "\\" + c.codePointAt(0).toString(16) + " "
        )
      )}</code>`;

    case "shellescape":
      return `<code>${esc(
        "'" + input.replace(/'/g, "'\\''") + "'"
      )}</code>`;

    case "htmlpretty":
      return `<pre>${esc(
        input.replace(/></g, ">\n<")
      )}</pre>`;

    case "queryparse": {
      const params = new URLSearchParams(
        input.replace(/^\?/, "")
      );

      const obj = {};

      for (const [k, v] of params)
        obj[k] = v;

      return `<pre>${esc(
        JSON.stringify(obj, null, 2)
      )}</pre>`;
    }

    case "querybuild": {
      const j = JSON.parse(input);

      return `<code>${esc(
        new URLSearchParams(j).toString()
      )}</code>`;
    }

    case "mime": {
      const ext = input
        .trim()
        .toLowerCase()
        .replace(/^\./, "");

      const map = {
        html: "text/html",
        htm: "text/html",
        css: "text/css",
        js: "application/javascript",
        json: "application/json",
        xml: "application/xml",
        txt: "text/plain",
        php: "text/x-php",
        csv: "text/csv",
        pdf: "application/pdf",
        zip: "application/zip",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        webp: "image/webp",
        mp3: "audio/mpeg",
        mp4: "video/mp4"
      };

      return `<code>${map[ext] || "application/octet-stream"}</code>`;
    }

    case "useragent":
      return `<pre>${esc(input)}</pre>\n\nℹ️ User-Agent ýokarda görkezildi.`;

    case "semver": {
      const [a, b] = input.trim().split(/\s+/);

      if (!a || !b)
        throw new Error("Meselem: 1.2.0 2.0.0");

      const pa = a.replace(/^v/, "").split(".").map(Number);
      const pb = b.replace(/^v/, "").split(".").map(Number);

      for (let i = 0; i < 3; i++) {
        if ((pa[i] || 0) < (pb[i] || 0))
          return "⬇️ Birinji wersiýa köne.";

        if ((pa[i] || 0) > (pb[i] || 0))
          return "⬆️ Birinji wersiýa täze.";
      }

      return "⚖️ Wersiýalar deň.";
    }

    case "semverbump": {
      const p = input.replace(/^v/, "")
        .split(".").map(Number);

      if (p.length !== 3)
        throw new Error("Meselem: 1.2.3");

      p[2]++;

      return `<code>${p.join(".")}</code>`;
    }

    case "passwordhash":
      return `<code>${esc(
        await digest("SHA-256", input)
      )}</code>`;

    case "randomjson":
      return `<pre>${esc(
        JSON.stringify({
          id: crypto.randomUUID(),
          san: Math.floor(Math.random() * 1000000),
          wagt: Date.now()
        }, null, 2)
      )}</pre>`;

    case "timestamp":
      return `<code>${Math.floor(Date.now() / 1000)}</code>`;

    case "timestampdate": {
      const d = new Date(Number(input) * 1000);

      if (isNaN(d))
        throw new Error("Timestamp nädogry.");

      return `<code>${d.toISOString()}</code>`;
    }

    case "datetimestamp": {
      const d = new Date(input);

      if (isNaN(d))
        throw new Error("Sene nädogry.");

      return `<code>${Math.floor(
        d.getTime() / 1000
      )}</code>`;
    }

    case "markdownescape":
      return `<code>${esc(
        input.replace(/([\\`*_[\]{}()#+\-.!>])/g, "\\$1")
      )}</code>`;

    case "sqlescape":
      return `<code>'${esc(
        input.replace(/'/g, "''")
      )}'</code>`;

    case "ip4validate":
      return isIPv4(input)
        ? "✅ Dogry IPv4."
        : "❌ IPv4 nädogry.";

    case "ip6validate":
      return isIPv6(input)
        ? "✅ Dogry IPv6."
        : "❌ IPv6 nädogry.";

    case "cidr": {
      const [ip, bitsText] = input.trim().split("/");

      const bits = Number(bitsText);

      if (!isIPv4(ip) || !Number.isInteger(bits) || bits < 0 || bits > 32)
        throw new Error("Meselem: 192.168.1.0/24");

      const nums = ip.split(".").map(Number);

      const ipNum =
        (((nums[0] * 256 + nums[1]) * 256 + nums[2]) * 256 + nums[3]) >>> 0;

      const mask =
        bits === 0
          ? 0
          : (0xFFFFFFFF << (32 - bits)) >>> 0;

      const network = (ipNum & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;

      const toIp = n => [
        n >>> 24,
        (n >>> 16) & 255,
        (n >>> 8) & 255,
        n & 255
      ].join(".");

      return (
        `🌐 Network: <code>${toIp(network)}</code>\n` +
        `📡 Broadcast: <code>${toIp(broadcast)}</code>\n` +
        `🔢 Prefiks: <code>/${bits}</code>`
      );
    }

    case "byteconvert": {
      const n = Number(input);

      if (!Number.isFinite(n))
        throw new Error("San ýazmaly.");

      return (
        `Byte: <b>${n}</b>\n` +
        `KB: <b>${n / 1024}</b>\n` +
        `MB: <b>${n / 1048576}</b>\n` +
        `GB: <b>${n / 1073741824}</b>`
      );
    }

    case "jsonpointer":
      return (
        "ℹ️ JSON Pointer guraly JSON-yň dogrudygyny barlamak üçin taýýar.\n\n" +
        `<pre>${esc(JSON.stringify(JSON.parse(input), null, 2))}</pre>`
      );

    case "randomstring": {
      const length = Math.min(
        Math.max(Number(input) || 24, 1),
        128
      );

      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      const bytes = crypto.getRandomValues(
        new Uint8Array(length)
      );

      return `<code>${[...bytes]
        .map(x => chars[x % chars.length])
        .join("")}</code>`;
    }

    case "randomnumber": {
      const [a, b] = input.trim()
        .split(/\s+/)
        .map(Number);

      if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error("Meselem: 1 100");

      return `<b>${Math.floor(
        Math.random() * (b - a + 1) + a
      )}</b>`;
    }

    // ========================================================
    // HASH
    // ========================================================

    case "md5":
      throw new Error(
        "Cloudflare Web Crypto API MD5-ni goldamaýar. MD5 üçin daşarky hyzmat ulanmak gerek."
      );

    case "sha1":
      return `<code>${await digest("SHA-1", input)}</code>`;

    case "sha224":
      throw new Error(
        "SHA-224 Worker Web Crypto API-de standart däl."
      );

    case "sha256":
      return `<code>${await digest("SHA-256", input)}</code>`;

    case "sha384":
      return `<code>${await digest("SHA-384", input)}</code>`;

    case "sha512":
      return `<code>${await digest("SHA-512", input)}</code>`;

    case "sha3256":
      return `<code>${await digest("SHA-256", input)}</code>\nℹ️ Worker Web Crypto-da SHA3-256 ýok; SHA-256 ulanyldy.`;

    case "sha3512":
      return `<code>${await digest("SHA-512", input)}</code>\nℹ️ Worker Web Crypto-da SHA3-512 ýok; SHA-512 ulanyldy.`;

    case "crc32":
      return `<code>${crc32(input)}</code>`;

    case "hmacsha256": {
      const [key, ...rest] = input.split(/\r?\n/);

      if (!rest.length)
        throw new Error(
          "Birinji setirde açar, ikinjide tekst bolmaly."
        );

      return `<code>${await hmac(
        "SHA-256",
        key,
        rest.join("\n")
      )}</code>`;
    }

    case "hmacsha512": {
      const [key, ...rest] = input.split(/\r?\n/);

      if (!rest.length)
        throw new Error(
          "Birinji setirde açar, ikinjide tekst bolmaly."
        );

      return `<code>${await hmac(
        "SHA-512",
        key,
        rest.join("\n")
      )}</code>`;
    }

    case "hashalgorithms":
      return `<pre>${esc(
        "SHA-1\nSHA-256\nSHA-384\nSHA-512\nHMAC-SHA256\nHMAC-SHA512"
      )}</pre>`;

    // ========================================================
    // MATEMATIKA
    // ========================================================

    case "calculator":
      return `🧮 Netije: <b>${calculate(input)}</b>`;

    case "absolute":
      return `<b>${Math.abs(Number(input))}</b>`;

    case "round":
      return `<b>${Math.round(Number(input))}</b>`;

    case "ceil":
      return `<b>${Math.ceil(Number(input))}</b>`;

    case "floor":
      return `<b>${Math.floor(Number(input))}</b>`;

    case "sqrt": {
      const n = Number(input);

      if (n < 0)
        throw new Error("Negatiw sanyň hakyky köki ýok.");

      return `<b>${Math.sqrt(n)}</b>`;
    }

    case "power": {
      const [a, b] = input.split(/\s+/).map(Number);

      return `<b>${Math.pow(a, b)}</b>`;
    }

    case "percentage": {
      const [p, n] = input.split(/\s+/).map(Number);

      return `<b>${p}% × ${n} = ${p / 100 * n}</b>`;
    }

    case "gcd": {
      const nums = input.split(/\s+/).map(Number);

      function gcd(a, b) {
        while (b) [a, b] = [b, a % b];
        return Math.abs(a);
      }

      return `<b>${nums.reduce(gcd)}</b>`;
    }

    case "lcm": {
      const nums = input.split(/\s+/).map(Number);

      function gcd(a, b) {
        while (b) [a, b] = [b, a % b];
        return Math.abs(a);
      }

      function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
      }

      return `<b>${nums.reduce(lcm)}</b>`;
    }

    case "prime": {
      const n = Number(input);

      if (!Number.isInteger(n) || n < 2)
        return "❌ Baş san däl.";

      for (let i = 2; i * i <= n; i++) {
        if (n % i === 0)
          return "❌ Baş san däl.";
      }

      return "✅ Baş sandyr.";
    }

    case "fibonacci": {
      const n = Number(input);

      if (n < 0 || n > 10000)
        throw new Error("0–10000 aralygynda san ýazyň.");

      let a = 0;
      let b = 1;

      for (let i = 0; i < n; i++)
        [a, b] = [b, a + b];

      return `<b>F(${n}) = ${a}</b>`;
    }

    case "factorial": {
      const n = Number(input);

      if (n < 0 || n > 170)
        throw new Error("0–170 aralygynda san ýazyň.");

      let result = 1;

      for (let i = 2; i <= n; i++)
        result *= i;

      return `<b>${n}! = ${result}</b>`;
    }

    case "average": {
      const nums = input
        .split(/[\s,]+/)
        .map(Number)
        .filter(Number.isFinite);

      if (!nums.length)
        throw new Error("Sanlar gerek.");

      return `<b>${nums.reduce((a, b) => a + b, 0) / nums.length}</b>`;
    }

    case "minmax": {
      const nums = input
        .split(/[\s,]+/)
        .map(Number)
        .filter(Number.isFinite);

      return (
        `⬇️ Min: <b>${Math.min(...nums)}</b>\n` +
        `⬆️ Max: <b>${Math.max(...nums)}</b>`
      );
    }

    case "sum": {
      const nums = input
        .split(/[\s,]+/)
        .map(Number)
        .filter(Number.isFinite);

      return `<b>${nums.reduce((a, b) => a + b, 0)}</b>`;
    }

    case "product": {
      const nums = input
        .split(/[\s,]+/)
        .map(Number)
        .filter(Number.isFinite);

      return `<b>${nums.reduce((a, b) => a * b, 1)}</b>`;
    }

    case "randommath":
      return `<b>${Math.random()}</b>`;

    // ========================================================
    // URL
    // ========================================================

    case "urlparse": {
      const u = new URL(input);

      return `<pre>${esc(
        JSON.stringify({
          protocol: u.protocol,
          username: u.username,
          hostname: u.hostname,
          port: u.port,
          pathname: u.pathname,
          search: u.search,
          hash: u.hash
        }, null, 2)
      )}</pre>`;
    }

    case "urldomain":
      return `<code>${esc(new URL(input).hostname)}</code>`;

    case "urlhost":
      return `<code>${esc(new URL(input).host)}</code>`;

    case "urlpath":
      return `<code>${esc(new URL(input).pathname)}</code>`;

    case "urlquery":
      return `<code>${esc(new URL(input).search)}</code>`;

    case "urlfragment":
      return `<code>${esc(new URL(input).hash)}</code>`;

    case "urlscheme":
      return `<code>${esc(new URL(input).protocol)}</code>`;

    case "urlport":
      return `<code>${esc(
        new URL(input).port || "Standart port"
      )}</code>`;

    case "urlusername":
      return `<code>${esc(
        new URL(input).username || "Ýok"
      )}</code>`;

    case "urlpassword":
      return `<code>${esc(
        new URL(input).password ? "Bar" : "Ýok"
      )}</code>`;

    case "httpstatus": {
      const codes = {
        200: "OK — üstünlikli",
        201: "Created — döredildi",
        204: "No Content — mazmun ýok",
        301: "Moved Permanently — hemişelik ugradyldy",
        302: "Found — wagtlaýyn ugradyldy",
        400: "Bad Request — nädogry haýyş",
        401: "Unauthorized — rugsat gerek",
        403: "Forbidden — gadagan",
        404: "Not Found — tapylmady",
        405: "Method Not Allowed — usul rugsat berlen däl",
        408: "Request Timeout — wagt gutardy",
        409: "Conflict — gapma-garşylyk",
        429: "Too Many Requests — haýyş örän köp",
        500: "Internal Server Error — serwer ýalňyşy",
        502: "Bad Gateway — şlýuz ýalňyşy",
        503: "Service Unavailable — hyzmat elýeter däl",
        504: "Gateway Timeout — şlýuz wagty gutardy"
      };

      return codes[input.trim()]
        ? `<b>${input}</b> — ${codes[input.trim()]}`
        : "ℹ️ Bu HTTP status üçin maglumat tapylmady.";
    }

    case "ipvalidate":
      return isIPv4(input) || isIPv6(input)
        ? "✅ IP salgysy dogry."
        : "❌ IP salgysy nädogry.";

    // ========================================================
    // COLOR
    // ========================================================

    case "hexrgb": {
      const [r, g, b] = hexToRgb(input);

      return `<code>${r}, ${g}, ${b}</code>`;
    }

    case "rgbhex": {
      const [r, g, b] = input
        .split(/[\s,]+/)
        .map(Number);

      return `<code>${rgbToHex(r, g, b)}</code>`;
    }

    case "hexhsl": {
      const [r, g, b] = hexToRgb(input);

      return `<code>${rgbToHsl(r, g, b).join(", ")}</code>`;
    }

    case "rgbhsl": {
      const [r, g, b] = input
        .split(/[\s,]+/)
        .map(Number);

      return `<code>${rgbToHsl(r, g, b).join(", ")}</code>`;
    }

    case "hslrgb": {
      const [h, s, l] = input
        .split(/[\s,]+/)
        .map(Number);

      return `<code>${hslToRgb(h, s, l).join(", ")}</code>`;
    }

    case "invertcolor": {
      const [r, g, b] = hexToRgb(input);

      return `<code>${rgbToHex(
        255 - r,
        255 - g,
        255 - b
      )}</code>`;
    }

    case "grayscale": {
      const [r, g, b] = hexToRgb(input);

      const x = Math.round(
        0.299 * r +
        0.587 * g +
        0.114 * b
      );

      return `<code>${rgbToHex(x, x, x)}</code>`;
    }

    case "colorinfo": {
      const [r, g, b] = hexToRgb(input);

      return (
        `HEX: <code>${rgbToHex(r, g, b)}</code>\n` +
        `RGB: <code>${r}, ${g}, ${b}</code>\n` +
        `HSL: <code>${rgbToHsl(r, g, b).join(", ")}</code>`
      );
    }

    // ========================================================
    // WAGT
    // ========================================================

    case "nowutc":
      return `<code>${new Date().toISOString()}</code>`;

    case "nowdate":
      return `<code>${new Date().toISOString().slice(0, 10)}</code>`;

    case "nowtime":
      return `<code>${new Date().toISOString().slice(11, 19)} UTC</code>`;

    case "unixnow":
      return `<code>${Math.floor(Date.now() / 1000)}</code>`;

    case "iso8601":
      return `<code>${new Date().toISOString()}</code>`;

    case "timestampToDate":
      return runTool("timestampdate", input, message);

    case "dateToTimestamp":
      return runTool("datetimestamp", input, message);

    // ========================================================
    // TELEGRAM
    // ========================================================

    case "telegramid":
      return `<code>${esc(message.from?.id || "")}</code>`;

    case "telegraminfo":
      return `<pre>${esc(
        JSON.stringify(
          message.from || {},
          null,
          2
        )
      )}</pre>`;

    case "chatinfo":
      return `<pre>${esc(
        JSON.stringify(
          message.chat || {},
          null,
          2
        )
      )}</pre>`;

    case "botinfo": {
      const r = await telegram("getMe");

      return `<pre>${esc(
        JSON.stringify(r.result || r, null, 2)
      )}</pre>`;
    }

    case "chatid":
      return (
        `🆔 Chat ID: <code>${esc(message.chat?.id)}</code>\n` +
        `Görnüşi: <code>${esc(message.chat?.type)}</code>`
      );
  }

  throw new Error("Bu gural tapylmady.");
}

// ============================================================
// IPv4 / IPv6
// ============================================================

function isIPv4(ip) {
  const p = ip.trim().split(".");

  return p.length === 4 &&
    p.every(x =>
      /^\d+$/.test(x) &&
      Number(x) >= 0 &&
      Number(x) <= 255
    );
}

function isIPv6(ip) {
  return /^[0-9a-fA-F:]+$/.test(ip) &&
    ip.includes(":") &&
    ip.split(":").length <= 8;
}

// ============================================================
// CRC32
// ============================================================

function crc32(str) {
  let crc = 0 ^ (-1);

  const bytes = new TextEncoder().encode(str);

  for (const byte of bytes) {
    crc ^= byte;

    for (let j = 0; j < 8; j++) {
      crc =
        (crc >>> 1) ^
        (crc & 1 ? 0xEDB88320 : 0);
    }
  }

  return ((crc ^ (-1)) >>> 0)
    .toString(16)
    .padStart(8, "0");
}

// ============================================================
// UPDATE HANDLER
// ============================================================

async function handleUpdate(update) {

  // ----------------------------------------------------------
  // CALLBACK
  // ----------------------------------------------------------

  if (update.callback_query) {

    const cb = update.callback_query;

    await answerCallback(cb.id);

    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data || "";

    if (data === "home") {

      await editMessage(
        chatId,
        messageId,
        `🧰 <b>Developer Tool Merkezi</b>\n\n` +
        `Bu botda <b>${countTools()}+</b> developer we peýdaly gural bar.\n\n` +
        `Kategoriýany saýlaň:`,
        mainMenu()
      );

      return;
    }

    if (data === "all") {

      await editMessage(
        chatId,
        messageId,
        `📚 <b>Ähli gurallar</b>\n\n` +
        `Jemi: <b>${countTools()}</b> gural\n\n` +
        `Gerekli guraly saýlaň:`,
        allToolsMenu()
      );

      return;
    }

    if (data.startsWith("cat:")) {

      const cat = data.substring(4);

      await editMessage(
        chatId,
        messageId,
        `📂 <b>${esc(
          CATEGORIES[cat] || "Gurallar"
        )}</b>\n\n` +
        `Gural saýlaň:`,
        categoryMenu(cat)
      );

      return;
    }

    if (data.startsWith("tool:")) {

      const id = data.substring(5);

      await sendMessage(
        chatId,
        toolPrompt(id)
      );

      return;
    }
  }

  // ----------------------------------------------------------
  // MESSAGE
  // ----------------------------------------------------------

  const message = update.message;

  if (!message)
    return;

  const chatId = message.chat.id;
  const text = String(message.text || "").trim();

  // /start
  if (text === "/start") {

    await sendMessage(
      chatId,
      `👋 <b>Salam!</b>\n\n` +
      `🧰 <b>Developer Tool Merkezi</b>-ne hoş geldiňiz!\n\n` +
      `Bu botda <b>${countTools()}+</b> gural bar.\n\n` +
      `🔐 Kodlama\n` +
      `📝 Tekst\n` +
      `🧑‍💻 Developer\n` +
      `🔑 Hash\n` +
      `🧮 Matematika\n` +
      `🌐 URL / Tor\n` +
      `🎨 Reňk\n` +
      `🕒 Wagt / Sene\n` +
      `🤖 Telegram\n\n` +
      `Aşakdaky menýudan gural saýlaň:`,
      mainMenu()
    );

    return;
  }

  // /tools
  if (text === "/tools") {

    await sendMessage(
      chatId,
      `📚 <b>Ähli gurallar</b>\n\n` +
      `Jemi: <b>${countTools()}</b> gural.`,
      allToolsMenu()
    );

    return;
  }

  // /help
  if (text === "/help") {

    await sendMessage(
      chatId,
      `ℹ️ <b>Kömek</b>\n\n` +
      `/start — Baş menýu\n` +
      `/tools — Ähli gurallar\n` +
      `/help — Kömek\n` +
      `/cancel — Amaly bes etmek\n\n` +
      `🛠 Gural saýlaň, soňra botuň görkezme habaryna ` +
      `<b>Reply/Jogap</b> edip maglumat iberiň.\n\n` +
      `Meselem, Kalkulýator saýlap:\n` +
      `<code>25 * 16 + 40</code>\n` +
      `ýazyp bilersiňiz.`
    );

    return;
  }

  if (text === "/cancel") {

    await sendMessage(
      chatId,
      "✅ Häzirki amal bes edildi."
    );

    return;
  }

  // ----------------------------------------------------------
  // Reply arkaly guralyň işlemegi
  // ----------------------------------------------------------

  const reply = message.reply_to_message;

  if (
    reply &&
    reply.from &&
    reply.from.is_bot &&
    reply.text
  ) {

    const prompt = reply.text;

    let toolId = null;

    for (const [id, tool] of Object.entries(TOOLS)) {

      const escapedName = tool[1]
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (
        prompt.includes(
          `<b>${tool[1]}</b>`
        )
      ) {
        toolId = id;
        break;
      }
    }

    if (toolId) {

      try {

        const result = await runTool(
          toolId,
          text,
          message
        );

        await sendMessage(
          chatId,
          `🛠 <b>${esc(TOOLS[toolId][1])}</b>\n\n` +
          result
        );

      } catch (error) {

        await sendMessage(
          chatId,
          `❌ <b>Ýalňyşlyk</b>\n\n` +
          `<code>${esc(
            error.message || "Näbelli ýalňyşlyk"
          )}</code>`
        );
      }

      return;
    }
  }

  await sendMessage(
    chatId,
    `ℹ️ Gural saýlamak üçin /tools buýrugyny ulanyň.`
  );
}

// ============================================================
// CLOUDFLARE WORKER
// ============================================================

export default {

  async fetch(request, env, ctx) {

    const url = new URL(request.url);

    // Webhook
    if (
      request.method === "POST" &&
      url.pathname === "/webhook"
    ) {

      try {

        const update = await request.json();

        ctx.waitUntil(
          handleUpdate(update)
        );

        return new Response("OK", {
          status: 200
        });

      } catch (error) {

        return new Response(
          "Ýalňyşlyk: " + error.message,
          { status: 500 }
        );
      }
    }

    // Ana sahypa
    if (request.method === "GET") {

      return new Response(
        `<!DOCTYPE html>
<html lang="tk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Developer Tool Merkezi</title>
<style>
body{
  margin:0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#111;
  color:#eee;
  font-family:Arial,sans-serif;
}
.box{
  max-width:650px;
  margin:20px;
  padding:35px;
  border:1px solid #333;
  border-radius:20px;
  background:#181818;
  text-align:center;
}
h1{font-size:30px}
.num{
  font-size:45px;
  font-weight:bold;
}
p{color:#aaa;line-height:1.7}
</style>
</head>
<body>
<div class="box">
<h1>🧰 Developer Tool Merkezi</h1>
<div class="num">${countTools()}+</div>
<p>
Developer, tekst, kodlama, hash, matematika,
URL, reňk, wagt we Telegram gurallary.
</p>
<p>
Boty Telegram-da açyň we <b>/start</b> buýrugyny iberiň.
</p>
</div>
</body>
</html>`,
        {
          headers: {
            "Content-Type": "text/html; charset=UTF-8"
          }
        }
      );
    }

    return new Response("Tapylmady.", {
      status: 404
    });
  }
};