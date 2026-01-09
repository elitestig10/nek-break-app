import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.png"
            alt="NEK VAULT logo"
            width={160}
            height={160}
            priority
            className={styles.logo}
          />
        </div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>NEK_VAULT</span>
          <h1 className={styles.title}>
            Break Calculators for Soccer Cards
          </h1>
          <p className={styles.subtitle}>
            Checklist-based odds calculators for box, case, and product breaks.
            Built for transparency, speed, and accuracy.
          </p>

          <div className={styles.cta}>
            <Link href="/calculators" className={styles.btnPrimary}>
              View Calculators
            </Link>
            <a
              href="https://www.instagram.com/nek_vault"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnInstagram}
            >
              Follow NEK_VAULT
            </a>
          </div>
        </div>
      </section>

      {/* Accent Bar */}
      <div className={styles.accentBar} />

      {/* Featured Calculators */}
      <section className={styles.featured}>
        <h2 className={styles.sectionTitle}>Featured Calculators</h2>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardBadge}>Active</div>
            <h3 className={styles.cardTitle}>Topps Dynasty UEFA</h3>
            <p className={styles.cardDescription}>
              Player & team odds with variation breakdowns. Full checklist-based calculations.
            </p>
            <Link href="/calculators/dynasty" className={styles.cardLink}>
              Open Calculator
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className={`${styles.card} ${styles.cardDashed}`}>
            <h3 className={styles.cardTitle}>More Coming Soon</h3>
            <p className={styles.cardDescription}>
              Additional products and calculators will be added here as they become available.
            </p>
            <Link href="/calculators" className={styles.cardLinkMuted}>
              View All Calculators
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
