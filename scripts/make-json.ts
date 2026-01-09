import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const INPUT_XLSX =
  "NEK_VAULT (2024-2025 TOPPS UCC DYNASTY BREAK CALCULATOR).xlsx";

const CARD_SHEET = "Card-Level";
const SETINFO_SHEET = "Set Info";

function normSetName(s: string) {
  return String(s || "").replace(/\s*\(.*?\)\s*$/, "").trim();
}

function parseSerials(base: string, parallels: string): number[] {
  const serials: number[] = [];

  const scan = (txt: string) => {
    const t = String(txt || "").trim();
    if (!t) return;
    if (t.toLowerCase().startsWith("(not stated")) return;

    const matches = t.match(/\/\s*(\d+)/g);
    if (matches) {
      for (const m of matches) {
        const n = parseInt(m.replace("/", "").trim(), 10);
        if (!Number.isNaN(n)) serials.push(n);
      }
    }
    if (/\b1\s*\/\s*1\b/.test(t)) serials.push(1);
  };

  scan(base);
  scan(parallels);

  return Array.from(new Set(serials));
}

function main() {
  if (!fs.existsSync(INPUT_XLSX)) {
    throw new Error(`Excel file not found: ${INPUT_XLSX}`);
  }

  const wb = XLSX.readFile(INPUT_XLSX);

  const cardWS = wb.Sheets[CARD_SHEET];
  const setWS = wb.Sheets[SETINFO_SHEET];

  if (!cardWS || !setWS) {
    throw new Error("One or more required sheets are missing");
  }

  const cardLevel = XLSX.utils.sheet_to_json<any>(cardWS, { defval: "" });
  const setInfo = XLSX.utils.sheet_to_json<any>(setWS, { defval: "" });

  const setMap = new Map<string, { base: string; parallels: string }>();
  for (const r of setInfo) {
    setMap.set(normSetName(r.Set), {
      base: String(r["Base serial"] || ""),
      parallels: String(r["Parallels"] || "")
    });
  }

  const rows = cardLevel.map((r) => {
    const set = String(r.Set || "").trim();
    const info = setMap.get(set) || { base: "", parallels: "" };
    const serials = parseSerials(info.base, info.parallels);

    const has = (n: number) => (serials.includes(n) ? n : 0);

    return {
      player: String(r.Players || "").trim(),
      team: String(r["Team(s)"] || "").trim(),
      set,
      code: String(r.Code || "").trim(),
      v99: has(99),
      v50: has(50),
      v25: has(25),
      v10: has(10),
      v5: has(5),
      v1: has(1),
      total: [99, 50, 25, 10, 5, 1]
        .filter((n) => serials.includes(n))
        .reduce((a, b) => a + b, 0)
    };
  });

  const out = {
    rows,
    players: Array.from(new Set(rows.map((r) => r.player))).sort(),
    teams: Array.from(new Set(rows.map((r) => r.team).filter(Boolean))).sort()
  };

  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync("public/checklist.json", JSON.stringify(out, null, 2), "utf8");

  console.log("✅ checklist.json created");
}

main();
