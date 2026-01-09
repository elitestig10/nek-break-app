import Link from "next/link";
import styles from "./calculators.module.css";

export default function CalculatorsPage() {
  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
        <div className={styles.headerContent}>
          <span className={styles.badge}>NEK_VAULT</span>
          <h1 className={styles.title}>Calculators</h1>
          <p className={styles.subtitle}>
            Choose a product calculator below. Each calculator uses real checklist data
            for accurate odds calculations.
          </p>
        </div>
      </header>

      {/* Accent Bar */}
      <div className={styles.accentBar} />

      {/* Calculator Grid */}
      <section className={styles.calculatorList}>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardBadge}>Active</div>
            <h2 className={styles.cardTitle}>Topps Dynasty UEFA</h2>
            <p className={styles.cardDescription}>
              Checklist-based odds with player/team filtering and variation breakdown.
              Calculate odds per box, case, and custom quantities.
            </p>
            <div className={styles.cardMeta}>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Full checklist
              </span>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                All variations
              </span>
            </div>
            <Link href="/calculators/dynasty" className={styles.cardButton}>
              Open Calculator
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className={`${styles.card} ${styles.cardPlaceholder}`}>
            <h2 className={styles.cardTitle}>More Coming Soon</h2>
            <p className={styles.cardDescription}>
              Additional products and calculators will be added here as new releases
              become available.
            </p>
            <a
              href="https://www.instagram.com/nek_vault"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followLink}
            >
              Follow for updates
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
