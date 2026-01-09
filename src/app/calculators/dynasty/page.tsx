"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  player: string;
  team: string;
  set: string;
  code: string;
  v99: number;
  v50: number;
  v25: number;
  v10: number;
  v5: number;
  v1: number;
  total: number;
};

type Data = {
  rows: Row[];
  players: string[];
  teams: string[];
};

function pct(x: number) {
  if (!Number.isFinite(x) || x <= 0) return "0.00%";
  const dp = x < 0.001 ? 4 : 2;
  return `${(x * 100).toFixed(dp)}%`;
}

function oneIn(x: number) {
  if (!Number.isFinite(x) || x <= 0) return "—";
  const v = 1 / x;
  if (!Number.isFinite(v) || v <= 0) return "—";
  return `1 in ${Math.round(v).toLocaleString()}`;
}

function oddsAtLeastOne(p: number, n: number) {
  if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(n) || n <= 0) return 0;
  return 1 - Math.pow(1 - p, n);
}

function num(x: any) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export default function Page() {
  const [data, setData] = useState<Data | null>(null);

  const [player, setPlayer] = useState("");
  const [team, setTeam] = useState("");

  const [cardsPerBox, setCardsPerBox] = useState(1);
  const [boxesOpened, setBoxesOpened] = useState(1);
  const [boxesPerCase, setBoxesPerCase] = useState(3);

  useEffect(() => {
    fetch("/checklist.json")
      .then((r) => r.json())
      .then((j: Data) => {
        setData(j);
        if (j.players?.length) setPlayer(j.players[0]);
      })
      .catch(console.error);
  }, []);

  const teamsForPlayer = useMemo(() => {
    if (!data || !player) return [];
    const s = new Set(
      data.rows.filter((r) => r.player === player && r.team).map((r) => r.team)
    );
    return Array.from(s).sort();
  }, [data, player]);

  useEffect(() => {
    if (team && !teamsForPlayer.includes(team)) setTeam("");
  }, [teamsForPlayer, team]);

  const filtered = useMemo(() => {
    if (!data || !player) return [];
    return data.rows.filter(
      (r) => r.player === player && (team ? r.team === team : true)
    );
  }, [data, player, team]);

  const productTotal = useMemo(() => {
    if (!data) return 0;
    return data.rows.reduce((s, r) => s + num(r.total), 0);
  }, [data]);

  const playerTotal = useMemo(() => {
    return filtered.reduce((s, r) => s + num(r.total), 0);
  }, [filtered]);

  const pHit = productTotal ? playerTotal / productTotal : 0;

  const pBox = oddsAtLeastOne(pHit, cardsPerBox);
  const pOpened = oddsAtLeastOne(pHit, cardsPerBox * boxesOpened);
  const pCase = oddsAtLeastOne(pHit, cardsPerBox * boxesPerCase);

  const variationRows = useMemo(() => {
    const sum = (k: keyof Row) =>
      filtered.reduce((s, r) => s + num(r[k]), 0);

    const v = [
      { label: "/99", key: "v99" as const },
      { label: "/50", key: "v50" as const },
      { label: "/25", key: "v25" as const },
      { label: "/10", key: "v10" as const },
      { label: "/5", key: "v5" as const },
      { label: "1/1", key: "v1" as const },
    ].map((x) => {
      const pr = sum(x.key);
      const p = productTotal ? pr / productTotal : 0;
      return {
        variation: x.label,
        print: pr,
        pHit: p,
        pBox: oddsAtLeastOne(p, cardsPerBox),
        pOpened: oddsAtLeastOne(p, cardsPerBox * boxesOpened),
      };
    });

    return v;
  }, [filtered, productTotal, cardsPerBox, boxesOpened]);

  if (!data) {
    return (
      <div style={{ padding: 28, fontFamily: "system-ui, Arial" }}>
        Loading…
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, Arial",
      }}
    >
  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  }}
>
  <div>
    <div style={{ fontSize: 12, opacity: 0.75 }}>NEK_VAULT</div>
    <h1 style={{ margin: "4px 0 0 0" }}>Break Calculator</h1>
    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
      Checklist-based odds • Updates instantly
    </div>
  </div>

  <a
    href="https://www.instagram.com/nek_vault"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      padding: "10px 14px",
      borderRadius: 12,
      background: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af)",
      color: "white",
      fontWeight: 900,
      textDecoration: "none",
      fontSize: 14,
      whiteSpace: "nowrap",
    }}
  >
    Follow NEK_VAULT
  </a>
</div>


      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Inputs */}
        <Card title="Inputs">
          <Field label="Player">
            <select
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              style={inputStyle}
            >
              {data.players.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Team (optional)">
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              style={inputStyle}
            >
              <option value="">All teams</option>
              {teamsForPlayer.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Cards per box">
              <input
                type="number"
                min={1}
                value={cardsPerBox}
                onChange={(e) => setCardsPerBox(Math.max(1, Number(e.target.value) || 1))}
                style={inputStyle}
              />
            </Field>

            <Field label="Boxes opened">
              <input
                type="number"
                min={1}
                value={boxesOpened}
                onChange={(e) => setBoxesOpened(Math.max(1, Number(e.target.value) || 1))}
                style={inputStyle}
              />
            </Field>

            <Field label="Boxes per case">
              <input
                type="number"
                min={1}
                value={boxesPerCase}
                onChange={(e) => setBoxesPerCase(Math.max(1, Number(e.target.value) || 1))}
                style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            Leave Team as “All teams” to calculate player odds across every team.
          </div>
        </Card>

        {/* Outputs */}
        <Card title="Outputs">
          <Out
            label="Matching checklist lines"
            value={`${filtered.length}`}
            desc="How many checklist rows match your selection."
          />
          <Out
            label="Total cards printed (player/team)"
            value={playerTotal.toLocaleString()}
            desc="Estimated print-run for your selection across all variations."
          />
          <Out
            label="Product total print-run"
            value={productTotal.toLocaleString()}
            desc="Estimated total print-run of the full product (denominator)."
          />
          <Out
            label="Odds per hit"
            value={`${pct(pHit)} • ${oneIn(pHit)}`}
            desc="Chance a single pulled card is your player/team."
          />
          <Out
            label="Odds per box"
            value={`${pct(pBox)} • ${oneIn(pBox)}`}
            desc="Chance you hit at least one across Cards per box."
          />
          <Out
            label="Odds in opened boxes"
            value={`${pct(pOpened)} • ${oneIn(pOpened)}`}
            desc="Chance you hit at least one across Boxes opened."
          />
          <Out
            label="Odds per case"
            value={`${pct(pCase)} • ${oneIn(pCase)}`}
            desc="Chance you hit at least one in one full case."
          />
        </Card>
      </div>

      {/* Variations */}
      <div style={{ marginTop: 16 }}>
        <Card title="Variation breakdown">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Variation", "Estimated print-run", "Odds per hit", "Odds per box", "Odds in opened boxes", "Meaning"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          fontSize: 12,
                          padding: 10,
                          borderBottom: "1px solid #eee",
                          opacity: 0.85,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {variationRows.map((v) => (
                  <tr key={v.variation}>
                    <td style={tdStrong}>{v.variation}</td>
                    <td style={td}>{v.print.toLocaleString()}</td>
                    <td style={td}>{`${pct(v.pHit)} • ${oneIn(v.pHit)}`}</td>
                    <td style={td}>{pct(v.pBox)}</td>
                    <td style={td}>{pct(v.pOpened)}</td>
                    <td style={{ ...td, fontSize: 12, opacity: 0.8 }}>
                      Chance of pulling the {v.variation} version of the selected
                      player/team.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card(props: { title: string; children: any }) {
  return (
    <div
      style={{
        border: "1px solid #e6e6e6",
        borderRadius: 14,
        padding: 16,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 12 }}>{props.title}</div>
      {props.children}
    </div>
  );
}

function Field(props: { label: string; children: any }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, opacity: 0.85 }}>
        {props.label}
      </div>
      {props.children}
    </div>
  );
}

function Out(props: { label: string; value: string; desc: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 220px 1fr",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid #f1f1f1",
      }}
    >
      <div style={{ fontWeight: 800 }}>{props.label}</div>
      <div style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
        {props.value}
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{props.desc}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #dcdcdc",
  outline: "none",
};

const td: React.CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #f4f4f4",
  fontVariantNumeric: "tabular-nums",
};

const tdStrong: React.CSSProperties = {
  ...td,
  fontWeight: 900,
};
