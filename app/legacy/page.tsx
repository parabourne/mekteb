"use client";

import { useState } from "react";

const FIRST_TERM = [
  { n: "01", title: "Tax Cuts and Jobs Act", text: "Signed the largest overhaul of the U.S. tax code since 1986, lowering rates for individuals and businesses." },
  { n: "02", title: "USMCA", text: "Replaced NAFTA with the U.S.-Mexico-Canada Agreement, adding new protections for American manufacturers and farmers." },
  { n: "03", title: "Operation Warp Speed", text: "Accelerated development of COVID-19 vaccines to under a year, far faster than any prior vaccine program." },
  { n: "04", title: "The Abraham Accords", text: "Brokered historic normalization agreements between Israel and the UAE, Bahrain, and other Arab nations." },
  { n: "05", title: "Supreme Court Appointments", text: "Appointed three Supreme Court justices — Gorsuch, Kavanaugh, and Barrett — along with a record number of federal judges." },
  { n: "06", title: "First Step Act", text: "Signed bipartisan criminal justice reform reducing certain mandatory minimums and expanding rehabilitation programs." },
  { n: "07", title: "U.S. Space Force", text: "Established the Space Force as the newest branch of the U.S. military." },
  { n: "08", title: "Deregulation Drive", text: "Rolled back federal regulations the administration said would save consumers and businesses over $220 billion a year once fully in effect." },
];

const SECOND_TERM = [
  { n: "01", title: "Border Security", text: "The administration reports a sharp drop in illegal crossings, describing it as the first negative net migration in decades." },
  { n: "02", title: "Working Families Tax Cut", text: "Signed a new middle-class tax relief package the White House calls the largest of its kind in modern history." },
  { n: "03", title: "Energy Production", text: "Pushed to expand domestic oil, gas, and energy output under an \"energy dominance\" agenda." },
  { n: "04", title: "Record Markets", text: "The administration highlights repeated record highs across major stock indices during the first year back in office." },
  { n: "05", title: "Diplomatic Ceasefires", text: "Credited with helping broker ceasefires and de-escalation in several ongoing international conflicts." },
  { n: "06", title: "Government Efficiency", text: "Launched an initiative aimed at cutting federal bureaucracy and reducing wasteful spending." },
  { n: "07", title: "Reshored Investment", text: "Points to trillions of dollars in new domestic manufacturing and infrastructure investment commitments." },
  { n: "08", title: "Public Safety", text: "The administration reports a significant year-over-year drop in homicide rates in major U.S. cities." },
];

const PILLARS = [
  { title: "Economic Growth", text: "Tax relief, deregulation, and a focus on domestic manufacturing and job creation." },
  { title: "Border & National Security", text: "Stricter immigration enforcement and expanded border infrastructure." },
  { title: "Peace Through Strength", text: "A foreign policy built around direct dealmaking, deterrence, and new diplomatic breakthroughs." },
  { title: "Energy Independence", text: "Expanding domestic energy production to lower costs and reduce reliance on foreign supply." },
  { title: "Judicial Philosophy", text: "Appointing judges described as committed to interpreting the Constitution as written." },
  { title: "Smaller Government", text: "Cutting regulations and federal spending in the name of efficiency and accountability." },
];

export default function Page() {
  const [term, setTerm] = useState<"first" | "second">("first");
  const cards = term === "first" ? FIRST_TERM : SECOND_TERM;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F4EC", color: "#17212E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div style={{ height: 6, background: "linear-gradient(90deg, #B7202E 0 20%, #F7F4EC 20% 40%, #0B2545 40% 60%, #F7F4EC 60% 80%, #B7202E 80% 100%)" }} />

      <header style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <svg width="26" height="26" viewBox="0 0 26 26">
            <polygon points="13,1 15.7,9 24.5,9 17.4,14.3 20,22.5 13,17.5 6,22.5 8.6,14.3 1.5,9 10.3,9" fill="#C9A227" />
          </svg>
          An American Legacy
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 14, fontWeight: 600, color: "#0B2545" }}>
          <a href="/">Home</a>
          <a href="#timeline">Timeline</a>
          <a href="#pillars">Priorities</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section
        style={{
          position: "relative",
          background: "radial-gradient(1200px 500px at 50% -10%, #123061 0%, #0B2545 55%, #061731 100%)",
          color: "#fff",
          borderRadius: "0 0 32px 32px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage: "radial-gradient(circle, #fff 1.4px, transparent 1.6px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div style={{ position: "relative", padding: "96px 24px 80px", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#C9A227",
              border: "1px solid rgba(201,162,39,0.5)",
              padding: "6px 16px",
              borderRadius: 999,
              marginBottom: 28,
            }}
          >
            45TH &amp; 47TH PRESIDENT OF THE UNITED STATES
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 820,
              margin: "0 auto",
            }}
          >
            Two terms. One relentless commitment to America.
          </h1>
          <p style={{ maxWidth: 620, margin: "24px auto 0", fontSize: "1.1rem", color: "rgba(255,255,255,0.82)" }}>
            From the Tax Cuts and Jobs Act to a historic return to the Oval Office,
            a look back at the policies, deals, and decisions that defined
            Donald J. Trump&apos;s leadership.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#timeline"
              style={{ padding: "14px 30px", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none", background: "#B7202E", color: "#fff", boxShadow: "0 10px 26px -10px rgba(183,32,46,0.7)" }}
            >
              See the record
            </a>
            <a
              href="#pillars"
              style={{ padding: "14px 30px", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
            >
              Core priorities
            </a>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
        <section id="timeline" style={{ padding: "88px 0" }}>
          <div style={{ maxWidth: 620, marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#B7202E", textTransform: "uppercase" }}>
              The Record
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginTop: 10, color: "#0B2545" }}>
              Achievements across two administrations
            </h2>
            <p style={{ color: "#5A6472", marginTop: 12, fontSize: "1.02rem" }}>
              A look at major initiatives from the first term (2017–2021) and the
              second term (2025–present), drawn from official White House summaries
              and contemporaneous reporting.
            </p>
          </div>

          <div style={{ display: "inline-flex", background: "#fff", border: "1px solid #DCD5C4", borderRadius: 999, padding: 4, marginBottom: 40 }}>
            <button
              onClick={() => setTerm("first")}
              style={{
                border: "none",
                padding: "10px 22px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                background: term === "first" ? "#0B2545" : "transparent",
                color: term === "first" ? "#fff" : "#5A6472",
              }}
            >
              First Term · 2017–2021
            </button>
            <button
              onClick={() => setTerm("second")}
              style={{
                border: "none",
                padding: "10px 22px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                background: term === "second" ? "#0B2545" : "transparent",
                color: term === "second" ? "#fff" : "#5A6472",
              }}
            >
              Second Term · 2025–Present
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {cards.map((c) => (
              <div key={c.n} style={{ background: "#fff", border: "1px solid #DCD5C4", borderRadius: 18, padding: 26 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#C9A227" }}>{c.n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", marginTop: 10, color: "#0B2545" }}>{c.title}</h3>
                <p style={{ marginTop: 8, fontSize: "0.94rem", color: "#5A6472" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pillars" style={{ background: "#0B2545", color: "#fff", borderRadius: 28, padding: "64px 40px", marginBottom: 40 }}>
          <div style={{ maxWidth: 620, marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#C9A227", textTransform: "uppercase" }}>
              Core Priorities
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginTop: 10, color: "#fff" }}>
              What &quot;America First&quot; has meant in practice
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", marginTop: 12, fontSize: "1.02rem" }}>
              The recurring themes that supporters point to across both terms in office.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {PILLARS.map((p) => (
              <div key={p.title} style={{ borderTop: "3px solid #C9A227", paddingTop: 16 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}>{p.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.94rem", marginTop: 8 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" style={{ padding: "0 0 88px" }}>
          <div style={{ background: "#B7202E", color: "#fff", borderRadius: 24, padding: "56px 40px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.1rem)" }}>Make America Great Again</h2>
            <p style={{ maxWidth: 520, margin: "14px auto 0", color: "rgba(255,255,255,0.88)" }}>
              A slogan that became a movement — and, supporters argue, a governing philosophy carried across two terms in the White House.
            </p>
          </div>
        </section>

        <footer style={{ padding: "48px 0 32px", borderTop: "1px solid #DCD5C4" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#5A6472" }}>
            <span>An American Legacy — an independent, unofficial tribute page</span>
            <span>Not affiliated with any campaign or government office</span>
          </div>
          <p style={{ fontSize: 12, color: "#5A6472", marginTop: 18, maxWidth: 720 }}>
            This page summarizes publicly reported policy actions and administration
            talking points in a favorable light. Many of the initiatives described
            here — including their effects and framing — have been the subject of
            debate among economists, historians, and policymakers; readers are
            encouraged to consult multiple sources for a fuller picture.
          </p>
        </footer>
      </div>
    </div>
  );
}