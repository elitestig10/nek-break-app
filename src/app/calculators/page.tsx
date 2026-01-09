import Link from "next/link";

export default function CalculatorsPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ margin: 0 }}>Calculators</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>Choose a product calculator below.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 900 }}>Topps Dynasty UEFA</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
            Checklist-based odds with player/team filtering and variation breakdown.
          </div>
          <Link
            href="/calculators/dynasty"
            style={{ display: "inline-block", marginTop: 12, textDecoration: "underline" }}
          >
            Open →
          </Link>
        </div>
      </div>
    </main>
  );
}
