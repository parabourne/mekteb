"use client";

import { useState } from "react";
import { COLORS } from "@/lib/ksq/constants";
import { supabase } from "@/lib/ksq/supabase";
import { ExamItem } from "@/types/teacher";

interface ExamsListProps {
  examsList: ExamItem[];
  examsLoading: boolean;
  onRefresh?: () => void;
}

export default function ExamsList({ examsList, examsLoading, onRefresh }: ExamsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (exam: ExamItem) => {
    setUpdatingId(exam.id);
    try {
      const { error } = await supabase
        .from("exams")
        .update({ is_active: !exam.is_active })
        .eq("id", exam.id);

      if (error) throw error;
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("Status yenilənərkən xəta baş verdi: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteExam = async (id: number) => {
    if (!confirm("Bu imtahanı silmək istədiyinizə əminsiniz?")) return;

    setUpdatingId(id);
    try {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("İmtahan silinərkən xəta baş verdi: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredExams = examsList.filter((exam) => {
    const term = searchTerm.toLowerCase();
    return (
      exam.title.toLowerCase().includes(term) ||
      exam.subject.toLowerCase().includes(term) ||
      exam.teacher_name.toLowerCase().includes(term) ||
      exam.code.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("az-AZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.paperLine}`,
        borderRadius: 16,
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
          📚 Yaradılmış Bütün İmtahanlar ({examsList.length})
        </h2>

        {examsList.length > 0 && (
          <input
            type="text"
            placeholder="İmtahan, fənn və ya müəllim axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.paper,
              fontSize: 13,
              color: COLORS.ink,
              outline: "none",
              minWidth: 220,
            }}
          />
        )}
      </div>

      {examsLoading ? (
        <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>İmtahanlar yüklənir...</p>
      ) : examsList.length === 0 ? (
        <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>Hələ ki heç bir imtahan yaradılmayıb.</p>
      ) : filteredExams.length === 0 ? (
        <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>Axtarışa uyğun imtahan tapılmadı.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: COLORS.paper,
                borderRadius: 10,
                border: `1px solid ${COLORS.paperLine}`,
                flexWrap: "wrap",
                gap: 10,
                opacity: updatingId === exam.id ? 0.6 : 1,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                    {exam.title}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.inkSoft }}>
                    ({exam.subject})
                  </span>

                  {/* Status Badges */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: exam.is_active ? "#e6fffa" : "#fff5f5",
                      color: exam.is_active ? COLORS.green : "#e53e3e",
                      border: `1px solid ${exam.is_active ? COLORS.green : "#feb2b2"}`,
                    }}
                  >
                    {exam.is_active ? "🟢 Aktiv" : "🔴 Qapalı"}
                  </span>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: COLORS.card,
                      color: COLORS.ink,
                      border: `1px solid ${COLORS.paperLine}`,
                    }}
                  >
                    {exam.is_private ? "🔒 Özəl (PIN)" : "🔓 Açıq"}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span>👨‍🏫 Müəllim: <strong>{exam.teacher_name}</strong></span>
                  <span>•</span>
                  <span
                    onClick={() => handleCopyCode(exam.code)}
                    title="Kodu kopyalamaq üçün klikləyin"
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    🔑 Kod:{" "}
                    <code
                      style={{
                        background: COLORS.card,
                        padding: "2px 8px",
                        borderRadius: 4,
                        border: `1px solid ${COLORS.paperLine}`,
                        fontWeight: 600,
                        color: copiedCode === exam.code ? COLORS.green : COLORS.ink,
                      }}
                    >
                      {exam.code} {copiedCode === exam.code ? "✓" : ""}
                    </code>
                  </span>

                  {exam.is_private && exam.exam_pin && (
                    <>
                      <span>•</span>
                      <span
                        onClick={() => handleCopyCode(exam.exam_pin!)}
                        title="PIN kodu kopyalamaq üçün klikləyin"
                        style={{ cursor: "pointer", userSelect: "none" }}
                      >
                        📌 PIN:{" "}
                        <code
                          style={{
                            background: COLORS.card,
                            padding: "2px 8px",
                            borderRadius: 4,
                            border: `1px solid ${COLORS.paperLine}`,
                            fontWeight: 600,
                            color: copiedCode === exam.exam_pin ? COLORS.green : COLORS.ink,
                          }}
                        >
                          {exam.exam_pin} {copiedCode === exam.exam_pin ? "✓" : ""}
                        </code>
                      </span>
                    </>
                  )}

                  {exam.created_at && (
                    <>
                      <span>•</span>
                      <span>📅 {formatDate(exam.created_at)}</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.green,
                    background: COLORS.card,
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: `1px solid ${COLORS.paperLine}`,
                  }}
                >
                  📝 {exam.questions ? exam.questions.length : 0} Sual
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(exam)}
                  disabled={updatingId === exam.id}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.paperLine}`,
                    background: COLORS.card,
                    color: exam.is_active ? "#e53e3e" : COLORS.green,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {exam.is_active ? "Qapat" : "Aç"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteExam(exam.id)}
                  disabled={updatingId === exam.id}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: "#fff5f5",
                    color: "#e53e3e",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  title="İmtahanı sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}