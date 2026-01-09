const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const INPUT_XLSX =
  "NEK_VAULT (2024-2025 TOPPS UCC DYNASTY BREAK CALCULATOR).xlsx";

const CHECKLIST_SHEET = "Checklist";

// --- helpers ---
function pickKey(obj, candidates) {
  const keys = Object.keys(obj || {});
  const lowerMap = new Map(keys.map(k => [k.toLowerCase(), k]));
  for (const c of candidates) {
    const hit = lowerMap.get(c.toLowerCase());
    if (hit) return hit;
  }
  return null;
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function main() {
  if (!fs.existsSync(INPUT_XLSX)) {
    throw new Error(`Excel file not found in project root: ${INPUT_XLSX}`);
  }

  const wb = XLSX.readFile(INPUT_XLSX);
  const ws = wb.Sheets[CHECKLIST_SHEET];
  if (!ws) {
    throw new Error(`Missing sheet "${CHECKLIST_SHEET}". Sheets: ${wb.SheetNames.join(", ")}`);
  }

  const rowsRaw = XLSX.utils.sheet_to_json(ws, { defval: "" });
  if (!rowsRaw.length) throw new Error("Checklist sheet is empty.");

  // Detect columns (supports multiple naming styles)
  const sample = rowsRaw[0];

  const playerKey = pickKey(sample, ["Player", "Players", "Name"]);
  const teamKey   = pickKey(sample, ["Team", "Team(s)", "Club"]);
  const setKey    = pickKey(sample, ["Set", "Insert", "Card Set"]);
  const codeKey   = pickKey(sample, ["Code", "Card Code", "Checklist Code"]);

  // Variation columns (try common patterns)
  const v99Key = pickKey(sample, ["Print /99", "/99", "99"]);
  const v50Key = pickKey(sample, ["Print /50", "/50", "50"]);
  const v25Key = pickKey(sample, ["Print /25", "/25", "25"]);
  const v10Key = pickKey(sample, ["Print /10", "/10", "10"]);
  const v5Key  = pickKey(sample, ["Print /5", "/5", "5"]);
  const v1Key  = pickKey(sample, ["Print 1/1", "1/1", "Gold 1/1", "1"]);

  const totalKey = pickKey(sample, [
    "Total print for this checklist line",
    "Total print",
    "Total",
    "Print Run"
  ]);

  if (!playerKey || !teamKey) {
    console.log("Detected columns:", Object.keys(sample));
    throw new Error(`Could not detect required columns. Need at least Player + Team columns.`);
  }

  const rows = rowsRaw.map(r => {
    const v99 = v99Key ? num(r[v99Key]) : 0;
    const v50 = v50Key ? num(r[v50Key]) : 0;
    const v25 = v25Key ? num(r[v25Key]) : 0;
    const v10 = v10Key ? num(r[v10Key]) : 0;
    const v5  = v5Key  ? num(r[v5Key])  : 0;
    const v1  = v1Key  ? num(r[v1Key])  : 0;

    // Prefer explicit total column if present; else sum known variation columns.
    const total =
      totalKey ? num(r[totalKey]) : (v99 + v50 + v25 + v10 + v5 + v1);

    return {
      player: String(r[playerKey]).trim(),
      team: String(r[teamKey]).trim(),
      set: setKey ? String(r[setKey]).trim() : "",
      code: codeKey ? String(r[codeKey]).trim() : "",
      v99, v50, v25, v10, v5, v1,
      total
    };
  }).filter(r => r.player);

  const out = {
    rows,
    players: Array.from(new Set(rows.map(r => r.player))).sort(),
    teams: Array.from(new Set(rows.map(r => r.team).filter(Boolean))).sort()
  };

  const outPath = path.join(process.cwd(), "public", "checklist.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");

  console.log("✅ Created:", outPath);
  console.log("Players:", out.players.length, "Rows:", out.rows.length);
}

main();
