import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pickleball",
  description: "Pickleball notes, places, and drills",
};

export default function PickleballPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Pickleball</h1>
      <p>Welcome to the Pickleball hub. Add courts, drills, and notes here.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Drills</h2>
        <ul>
          <li>Warm-up dinks</li>
          <li>Third-shot drives</li>
          <li>Volley-to-volley exchanges</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Places</h2>
        <p>Add nearby courts and directions.</p>
      </section>
    </main>
  );
}
