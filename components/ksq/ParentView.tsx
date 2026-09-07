"use client";

import { useState } from "react";
import { COLORS } from "@/lib/ksq/constants";

export default function ParentView() {
  const [formCode, setFormCode] = useState("");
  const [childName, setChildName] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formCode.trim() && childName.trim()) {
      setSearched(true);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 40 }}>
      {/* Səhifə Başlığı */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Valideyn İzləmə Paneli
        </h1>
        <p style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 6 }}>
          Övladınızın KSQ və BSQ qiymətləndirmə nəticələrini izləmək üçün məlumatları daxil edin.
        </p>
      </div>

      {/* Axtarış Formu Kartı */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.paperLine}`,
          borderRadius: 16,
          padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02)",
        }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.ink,
                marginBottom: 8,
              }}
            >
              Forma Kodu
            </label>
            <input
              type="text"
              placeholder="Məsələn: KSQ-5-01"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `1px solid ${COLORS.paperLine}`,
                background: COLORS.paper,
                fontSize: 14,
                color: COLORS.ink,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.ink,
                marginBottom: 8,
              }}
            >
              Şagirdin Adı və Soyadı
            </label>
            <input
              type="text"
              placeholder="Məsələn: Əli Abbasov"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `1px solid ${COLORS.paperLine}`,
                background: COLORS.paper,
                fontSize: 14,
                color: COLORS.ink,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: COLORS.green,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12: 20px",
              paddingTop: 12,
              paddingBottom: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
              marginTop: 4,
            }}
          >
            Nəticəni Axtar
          </button>
        </form>

        {/* Nəticə Bloku (Axtarılandan sonra çıxır) */}
        {searched && (
          <div
            style={{
              marginTop: 28,
              padding: "20px",
              background: COLORS.paper,
              borderRadius: 10,
              border: `1px solid ${COLORS.paperLine}`,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.green, textTransform: "uppercase" }}>
              Nəticə Tapıldı
            </span>
            <h3 style={{ margin: "6px 0 4px", fontSize: 16, color: COLORS.ink }}>
              {childName} — {formCode}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.inkSoft }}>
              Hələ ki qiymətləndirmə nəticəsi daxil edilməyib və ya yoxlanılır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}