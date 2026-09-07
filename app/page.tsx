import Link from "next/link";
import { COLORS } from "@/lib/ksq/constants";

function EntryCard({
  eyebrow,
  title,
  text,
  href,
  accent,
  badgeBg,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  accent: string;
  badgeBg: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textAlign: "left",
        background: COLORS.card,
        border: `1px solid ${COLORS.paperLine}`,
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: "1 1 240px",
        minWidth: 220,
        textDecoration: "none",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.8,
            color: accent,
            background: badgeBg,
            padding: "4px 8px",
            borderRadius: 6,
          }}
        >
          {eyebrow}
        </span>
        <span style={{ color: COLORS.inkSoft, fontSize: 16, transition: "transform 0.2s" }}>→</span>
      </div>

      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.ink,
          letterSpacing: "-0.01em",
          marginTop: 4,
        }}
      >
        {title}
      </span>

      <span style={{ fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.6 }}>
        {text}
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: COLORS.paper,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.paperLine}`,
          borderRadius: 16,
          maxWidth: 880,
          width: "100%",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDeep} 100%)`,
            padding: "36px 40px",
            color: "#fff",
            position: "relative",
          }}
        >
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, marginBottom: 12, backdropFilter: "blur(4px)" }}>
            Təhsil Platforması
          </div>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              margin: 0,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Qiymətləndirmə Dəftəri
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14.5,
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: 520,
              lineHeight: 1.5,
            }}
          >
            KSQ və BSQ formalarının hazırlanması, idarə edilməsi və nəticələrin peşəkar səviyyədə izlənməsi üçün mərkəzi sistem.
          </p>
        </div>

        {/* Content Section */}
        <div style={{ padding: "36px 40px" }}>
          <span
            style={{
              display: "block",
              fontSize: 13,
              color: COLORS.inkSoft,
              marginBottom: 20,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Davam etmək üçün rolunuzu seçin
          </span>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <EntryCard
              eyebrow="MÜƏLLİM"
              title="Müəllim Paneli"
              text="Yeni KSQ/BSQ formaları yaradın, tapşırıqları təyin edin və şagirdlərin qiymətlərini qeyd edin."
              href="/muellim"
              accent={COLORS.green}
              badgeBg="rgba(5, 150, 105, 0.1)"
            />
            <EntryCard
              eyebrow="ŞAGİRD"
              title="Şagird Portalı"
              text="Kod vasitəsilə imtahana qoşulun, tapşırıqları cavablandırın və nəticələrinizə baxın."
              href="/sagird"
              accent={COLORS.gold}
              badgeBg="rgba(217, 119, 6, 0.1)"
            />
            <EntryCard
              eyebrow="VALİDEYN"
              title="Valideyn İzləmə"
              text="Övladınızın tədris irəliləyişini, KSQ və BSQ qiymətləndirmə nəticələrini operativ izləyin."
              href="/valideyn"
              accent={COLORS.red}
              badgeBg="rgba(220, 38, 38, 0.1)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}