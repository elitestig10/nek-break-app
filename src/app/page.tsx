import Image from "next/image";

import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, Arial",
      }}
    >
      {/* Hero */}
      <div style={{ padding: "36px 0" }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>NEK_VAULT</div>
        <div
  style={{
    position: "relative",
    width: 200,
    height: 200,
    borderRadius: "50%",
    overflow: "hidden",
      marginBottom: 16,
  }}
>
  <Image
    src="/logo.png"
    alt="NEK VAULT logo"
    fill
    priority
    style={{ objectFit: "cover"
 }}
  />
</div>


        <h1 style={{ margin: "6px 0 0 0", fontSize: 40 }}>
          Break Calculators for Soccer Cards
        </h1>
        <p style={{ marginTop: 10, maxWidth: 720, opacity: 0.85 }}>
          Checklist-based odds calculators for box, case, and product breaks.
          Built for transparency, speed, and accuracy.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 18,
          }}
        >
          <Link
            href="/calculators"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #ddd",
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
            }}
          >
            View calculators
          </Link>

          <a
            href="https://www.instagram.com/nek_vault"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              textDecoration: "none",
              color: "white",
              fontWeight: 900,
              background:
                "linear-gradient(135deg,#f58529,#dd2a7b,#8134af)",
            }}
          >
            Follow NEK_VAULT
          </a>
        </div>
      </div>

      {/* Featured calculators */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 900 }}>
            Topps Dynasty UEFA (Current)
          </div>
          <div
            style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}
          >
            Player & team odds with variation breakdowns.
          </div>
          <Link
            href="/calculators/dynasty"
            style={{
              display: "inline-block",
              marginTop: 12,
              textDecoration: "underline",
            }}
          >
            Open calculator →
          </Link>
        </div>

        <div
          style={{
            border: "1px dashed #ddd",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 900 }}>
            More calculators coming
          </div>
          <div
            style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}
          >
            Additional products will be added here.
          </div>
          <Link
            href="/calculators"
            style={{
              display: "inline-block",
              marginTop: 12,
              textDecoration: "underline",
            }}
          >
            See all calculators →
          </Link>
        </div>
      </div>
    </main>
  );
}
