"use client";

import { COLORS } from "@/lib/ksq/constants";
import { ExamItem } from "@/types/teacher";

interface ExamsListProps {
  examsList: ExamItem[];
  examsLoading: boolean;
}

export default function ExamsList({ examsList, examsLoading }: ExamsListProps) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "20px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>
        📚 Yaradılmış Bütün İmtahanlar (Lent)
      </h2>
      {examsLoading ? (
        <p style={{ fontSize: 13, color: COLORS.inkSoft }}>İmtahanlar yüklənir...</p>
      ) : examsList.length === 0 ? (
        <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Hələ ki heç bir imtahan yaradılmayıb.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {examsList.map((exam) => (
            <div key={exam.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: COLORS.paper, borderRadius: 10, border: `1px solid ${COLORS.paperLine}`, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                  {exam.title} <span style={{ fontSize: 13, fontWeight: 400, color: COLORS.inkSoft }}>({exam.subject})</span>
                </div>
                <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>
                  👨‍🏫 Müəllim: <strong>{exam.teacher_name}</strong> • 🔑 Kod: <code style={{ background: COLORS.card, padding: "2px 6px", borderRadius: 4 }}>{exam.code}</code>
                  {exam.created_at && ` • 📅 ${new Date(exam.created_at).toLocaleDateString("az-AZ")}`}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
                  📝 {exam.questions ? exam.questions.length : 0} Sual
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}