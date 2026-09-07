"use client";

import { useState } from "react";
import { COLORS } from "@/lib/ksq/constants";
import { StudentResult } from "@/types/teacher";

interface StudentResultsProps {
  results: StudentResult[];
  resultsLoading: boolean;
}

export default function StudentResults({ results, resultsLoading }: StudentResultsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredResults = results.filter((res) => {
    const q = searchQuery.toLowerCase();
    return (
      res.student_name.toLowerCase().includes(q) ||
      res.exam_title.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredResults.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResults.map((r) => r.id));
    }
  };

  const handlePrint = (singleId?: number) => {
    if (singleId !== undefined) {
      setSelectedIds([singleId]);
      requestAnimationFrame(() => {
        window.print();
      });
    } else {
      window.print();
    }
  };

  const copySingleResult = (res: StudentResult) => {
    const text = `Şagird: ${res.student_name} | Test: ${res.exam_title} | Bal: ${res.score}/${res.total_questions} (%${res.percentage})`;
    navigator.clipboard.writeText(text);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyResults = () => {
    const targetResults =
      selectedIds.length > 0
        ? filteredResults.filter((r) => selectedIds.includes(r.id))
        : filteredResults;

    if (targetResults.length === 0) {
      alert("Kopyalamaq üçün heç bir nəticə yoxdur!");
      return;
    }

    let text = "📊 Şagird İmtahan Nəticələri:\n\n";
    targetResults.forEach((res, index) => {
      text += `${index + 1}. ${res.student_name} - Test: ${res.exam_title} - Bal: ${res.score}/${res.total_questions} (%${res.percentage})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("az-AZ");
    } catch {
      return "";
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
          justify: "space-between",
        }}
        className="no-print"
      >
        <input
          type="text"
          placeholder="🔍 Şagird adı və ya test başlığı ilə axtar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px 14px",
            borderRadius: 8,
            border: `1px solid ${COLORS.paperLine}`,
            background: COLORS.card,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => handlePrint()}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.card,
              color: COLORS.ink,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🖨️ {selectedIds.length > 0 ? "Seçilənləri Çap Et" : "PDF Çap Et"}
          </button>
          <button
            type="button"
            onClick={handleCopyResults}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.card,
              color: copiedAll ? COLORS.green : COLORS.ink,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📋 {copiedAll ? "Kopyalandı!" : selectedIds.length > 0 ? "Seçilənləri Kopyala" : "Nəticələri Kopyala"}
          </button>
        </div>
      </div>

      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.paperLine}`,
          borderRadius: 16,
          padding: "20px",
        }}
      >
        {filteredResults.length > 0 && (
          <div
            style={{
              paddingBottom: 12,
              marginBottom: 12,
              borderBottom: `1px solid ${COLORS.paperLine}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            className="no-print"
          >
            <input
              type="checkbox"
              checked={selectedIds.length === filteredResults.length && filteredResults.length > 0}
              onChange={toggleSelectAll}
              style={{ cursor: "pointer", width: 16, height: 16 }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>
              Hamısını Seç ({selectedIds.length} seçilib)
            </span>
          </div>
        )}

        {resultsLoading ? (
          <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>Nəticələr yüklənir...</p>
        ) : filteredResults.length === 0 ? (
          <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>Hələ ki heç bir şagird nəticəsi tapılmadı.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredResults.map((res) => {
              const isSelected = selectedIds.includes(res.id);
              const isHiddenInPrint = selectedIds.length > 0 && !isSelected;

              return (
                <div
                  key={res.id}
                  className={isHiddenInPrint ? "no-print" : ""}
                  style={{
                    display: "flex",
                    justify: "space-between",
                    alignItems: "center",
                    padding: "14px 16px",
                    background: COLORS.paper,
                    borderRadius: 10,
                    border: `1px solid ${isSelected ? COLORS.green : COLORS.paperLine}`,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(res.id)}
                      className="no-print"
                      style={{ cursor: "pointer", width: 16, height: 16 }}
                    />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>
                        {res.student_name}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>
                        Test: <strong>{res.exam_title}</strong>
                        {res.created_at && ` • Tarix: ${formatDate(res.created_at)}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
                        {res.score} / {res.total_questions} bal
                      </div>
                      <div style={{ fontSize: 11, color: COLORS.inkSoft }}>
                        (%{res.percentage})
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }} className="no-print">
                      <button
                        type="button"
                        onClick={() => copySingleResult(res)}
                        title="Bu nəticəni kopyala"
                        style={{
                          padding: "6px 10px",
                          background: COLORS.card,
                          border: `1px solid ${COLORS.paperLine}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                          color: copiedId === res.id ? COLORS.green : COLORS.ink,
                        }}
                      >
                        {copiedId === res.id ? "✓" : "📋"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrint(res.id)}
                        title="Yalnız bu şagirdi çap et"
                        style={{
                          padding: "6px 10px",
                          background: COLORS.card,
                          border: `1px solid ${COLORS.paperLine}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        🖨️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}