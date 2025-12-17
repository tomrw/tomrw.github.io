"use client";

import { useState } from "react";

 type Player = { name: string; id: number };

 const initialPlayers = [
   { id: 1, name: "Alice" },
   { id: 2, name: "Bob" },
 ];

 export default function PickleballClient() {
   const [courts, setCourts] = useState<number>(6);
   const [players, setPlayers] = useState<Player[]>(initialPlayers);
   const [newName, setNewName] = useState<string>("");

   function removePlayer(id: number) {
     setPlayers((p) => p.filter((x) => x.id !== id));
   }

   return (
     <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
       <h1>Pickleball</h1>

       <section style={{ marginTop: 24 }}>
         <h2>Config</h2>
         <label
           style={{
             display: "flex",
             flexDirection: "column",
             gap: 8,
             maxWidth: 320,
           }}
         >
           <label htmlFor="number-of-courts" style={{ fontWeight: 600 }}>
             Number of courts
           </label>
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

       <section style={{ marginTop: 24 }}>
         <h2>Players</h2>
         <p>List players here. You can add names, teams, or scores.</p>

         <form
           onSubmit={(e) => {
             e.preventDefault();
             const name = newName.trim();
             if (!name) return;
             const nextId = players.length
               ? Math.max(...players.map((p) => p.id)) + 1
               : 1;
             setPlayers((p) => [...p, { id: nextId, name }]);
             setNewName("");
           }}
           style={{ display: "flex", gap: 8, marginBottom: 12, maxWidth: 420 }}
         >
           <input
             value={newName}
             onChange={(e) => setNewName(e.target.value)}
             placeholder="Add player name"
             aria-label="Player name"
             style={{ flex: 1, padding: "8px 10px", borderRadius: 8 }}
           />
           <button
             type="submit"
             style={{ padding: "8px 12px", borderRadius: 8 }}
           >
             Add
           </button>
         </form>

         <ul>
           {players.length === 0 && <li>No players yet</li>}
           {players.map((pl) => (
             <li
               key={pl.id}
               style={{ display: "flex", gap: 8, alignItems: "center" }}
             >
               <span>{pl.name}</span>
               <button
                 onClick={() => removePlayer(pl.id)}
                 style={{
                   marginLeft: "auto",
                   padding: "6px 8px",
                   borderRadius: 6,
                 }}
                 aria-label={`Delete ${pl.name}`}
               >
                 Delete
               </button>
             </li>
           ))}
         </ul>
       </section>
     </main>
   );
 }
