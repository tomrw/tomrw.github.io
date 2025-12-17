"use client";

import { useState } from "react";

export default function PickleballClient() {
  const [courts, setCourts] = useState<number>(6);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Pickleball</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Config</h2>
        <label style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
          <label htmlFor="number-of-courts" style={{ fontWeight: 600 }}>Number of courts</label>
          <select
            value={courts}
            onChange={(e) => setCourts(Number(e.target.value))}
            id="number-of-courts"
            style={{ padding: "8px 10px", borderRadius: 8 }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </section>
    </main>
  );
}
