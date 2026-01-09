"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./dynasty.module.css";

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
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading calculator...</span>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/calculators" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Calculators
          </Link>
          <a
            href="https://www.instagram.com/nek_vault"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramBtn}
          >
            Follow NEK_VAULT
          </a>
        </div>
        <div className={styles.headerContent}>
          <span className={styles.badge}>NEK_VAULT</span>
          <h1 className={styles.title}>Break Calculator</h1>
          <p className={styles.subtitle}>
            Checklist-based odds • Updates instantly
          </p>
        </div>
      </header>

      {/* Accent Bar */}
      <div className={styles.accentBar} />

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Inputs Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Inputs</h2>

          <div className={styles.field}>
            <label className={styles.label}>Player</label>
            <select
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              className={styles.select}
            >
              {data.players.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Team (optional)</label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className={styles.select}
            >
              <option value="">All teams</option>
              {teamsForPlayer.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.numberGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Cards per box</label>
              <input
                type="number"
                min={1}
                value={cardsPerBox}
                onChange={(e) => setCardsPerBox(Math.max(1, Number(e.target.value) || 1))}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Boxes opened</label>
              <input
                type="number"
                min={1}
                value={boxesOpened}
                onChange={(e) => setBoxesOpened(Math.max(1, Number(e.target.value) || 1))}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Boxes per case</label>
              <input
                type="number"
                min={1}
                value={boxesPerCase}
                onChange={(e) => setBoxesPerCase(Math.max(1, Number(e.target.value) || 1))}
                className={styles.input}
              />
            </div>
          </div>

          <p className={styles.hint}>
            Leave Team as "All teams" to calculate player odds across every team.
          </p>
        </div>

        {/* Outputs Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Results</h2>

          <div className={styles.outputList}>
            <OutputRow
              label="Matching checklist lines"
              value={`${filtered.length}`}
              desc="How many checklist rows match your selection."
            />
            <OutputRow
              label="Total cards printed"
              value={playerTotal.toLocaleString()}
              desc="Estimated print-run for your selection across all variations."
            />
            <OutputRow
              label="Product total print-run"
              value={productTotal.toLocaleString()}
              desc="Estimated total print-run of the full product."
            />
            <OutputRow
              label="Odds per hit"
              value={pct(pHit)}
              subvalue={oneIn(pHit)}
              desc="Chance a single pulled card is your player/team."
              highlight
            />
            <OutputRow
              label="Odds per box"
              value={pct(pBox)}
              subvalue={oneIn(pBox)}
              desc="Chance you hit at least one across cards per box."
            />
            <OutputRow
              label="Odds in opened boxes"
              value={pct(pOpened)}
              subvalue={oneIn(pOpened)}
              desc="Chance you hit at least one across boxes opened."
            />
            <OutputRow
              label="Odds per case"
              value={pct(pCase)}
              subvalue={oneIn(pCase)}
              desc="Chance you hit at least one in one full case."
            />
          </div>
        </div>
      </div>

      {/* Variations Table */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Variation Breakdown</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variation</th>
                <th>Est. Print Run</th>
                <th>Odds per Hit</th>
                <th>Odds per Box</th>
                <th>Odds Opened</th>
              </tr>
            </thead>
            <tbody>
              {variationRows.map((v) => (
                <tr key={v.variation}>
                  <td className={styles.variationCell}>{v.variation}</td>
                  <td>{v.print.toLocaleString()}</td>
                  <td>
                    <span className={styles.primaryValue}>{pct(v.pHit)}</span>
                    <span className={styles.secondaryValue}>{oneIn(v.pHit)}</span>
                  </td>
                  <td>{pct(v.pBox)}</td>
                  <td>{pct(v.pOpened)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OutputRow(props: {
  label: string;
  value: string;
  subvalue?: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${styles.outputRow} ${props.highlight ? styles.outputHighlight : ''}`}>
      <div className={styles.outputMain}>
        <span className={styles.outputLabel}>{props.label}</span>
        <div className={styles.outputValues}>
          <span className={styles.outputValue}>{props.value}</span>
          {props.subvalue && <span className={styles.outputSubvalue}>{props.subvalue}</span>}
        </div>
      </div>
      <p className={styles.outputDesc}>{props.desc}</p>
    </div>
  );
}
