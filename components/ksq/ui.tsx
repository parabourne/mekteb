"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { COLORS } from "@/lib/ksq/constants";

export function PageShell({ children }: { children: React.ReactNode }) {
  const [dateTime, setDateTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const day = String(now.getDate()).padStart(2, "0");
      const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
      ];
      const month = months[now.getMonth()];
      const year = now.getFullYear();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      setDateTime(`${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: COLORS.paper,
        minHeight: "100vh",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        {/* Yuxarı Naviqasiya və Saat Paneli */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            background: COLORS.card,
            padding: "12px 20px",
            borderRadius: 12,
            border: `1px solid ${COLORS.paperLine}`,
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.01)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.green,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ← Ana Səhifə
            </Link>

            {/* Tarix və Saat Göstəricisi */}
            {dateTime && (
              <span
                style={{
                  fontSize: 12.5,
                  color: COLORS.inkSoft,
                  borderLeft: `1px solid ${COLORS.paperLine}`,
                  paddingLeft: 16,
                  fontWeight: 500,
                }}
              >
                📅 {dateTime}
              </span>
            )}
          </div>

          {/* Sürətli Keçid Düymələri */}
          <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 500 }}>
            <Link href="/muellim" style={{ textDecoration: "none", color: COLORS.inkSoft }}>
              Müəllim
            </Link>
            <Link href="/sagird" style={{ textDecoration: "none", color: COLORS.inkSoft }}>
              Şagird
            </Link>
            <Link href="/valideyn" style={{ textDecoration: "none", color: COLORS.inkSoft }}>
              Valideyn
            </Link>
          </div>
        </div>

        {/* Səhifənin Əsas Məzmunu */}
        {children}
      </div>
    </div>
  );
}