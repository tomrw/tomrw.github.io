import Link from "next/link";
import styles from "./nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/recipes" className={styles.link}>
            Recipes
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/pickleball" className={styles.link}>
            Pickleball
          </Link>
        </li>
      </ul>
    </nav>
  );
}
