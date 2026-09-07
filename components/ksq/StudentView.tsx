"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/lib/ksq/constants";
import { supabase } from "@/lib/ksq/supabase";

interface Question {
  id: number;
  text: string;
  optA: string;
  optB: string;
  optC: string;
  optD: string;
  correct: string;
}

interface FormItem {
  id: number;
  teacher_name: string;
  title: string;
  subject: string;
  code: string;
  access_pin?: string | null;
  is_private?: boolean;
  is_active?: boolean;
  questions: Question[];
  created_at?: string;
}

export default function StudentView() {
  const [studentName, setStudentName] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [savedForms, setSavedForms] = useState<FormItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedExam, setSelectedExam] = useState<FormItem | null>(null);
  const [currentExam, setCurrentExam] = useState<FormItem | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchExams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Xəta:", error.message);
    } else if (data) {
      const activeExams = data.filter((item: FormItem) => item.is_active !== false);
      setSavedForms(activeExams);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("Zəhmət olmasa ad və soyadınızı daxil edin!");
      return;
    }

    if (!selectedExam) return;

    const isPrivateExam = selectedExam.is_private === true || (selectedExam.access_pin && selectedExam.access_pin.trim() !== "");

    if (isPrivateExam) {
      if (enteredPin.trim() !== (selectedExam.access_pin || "").trim()) {
        alert("Yanlış İmtahan PIN şifrəsi! Müəllimdən doğru şifrəni alın.");
        return;
      }
    }

    setCurrentExam(selectedExam);
    setSelectedExam(null);
    setEnteredPin("");
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOptionSelect = (questionId: number, optionKey: string) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmitExam = async () => {
    if (!currentExam || isSubmitting) return;

    const questionsList = currentExam.questions || [];
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < questionsList.length) {
      const confirmSubmit = window.confirm(
        `Siz ${questionsList.length} sualdan yalnız ${answeredCount}-ni cavablandırmısınız. Yenə də təqdim etmək istəyirsiniz?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    let correctCount = 0;
    questionsList.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const finalScore = correctCount;
    const totalQuestions = questionsList.length;
    const percentage = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;

    setScore(finalScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const { error } = await supabase.from("student_results").insert([
      {
        exam_id: currentExam.id,
        exam_title: currentExam.title,
        student_name: studentName.trim(),
        score: finalScore,
        total_questions: totalQuestions,
        percentage: percentage,
        student_answers: answers,
      },
    ]);

    if (error) {
      console.error("Nəticə buluda yazılmadı:", error.message);
    }
    setIsSubmitting(false);
  };

  const filteredForms = savedForms.filter((frm) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      frm.code?.toLowerCase().includes(query) ||
      frm.title?.toLowerCase().includes(query) ||
      frm.subject?.toLowerCase().includes(query) ||
      frm.teacher_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 50 }}>
      <div style={{ marginBottom: 24 }} className="no-print">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.ink, margin: 0 }}>
          Şagird İmtahan Portalı
        </h1>
        <p style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 6 }}>
          Müəllimlər tərəfindən yerləşdirilən imtahanları axtarın və həll edin.
        </p>
      </div>

      {!currentExam && !selectedExam && (
        <div>
          {/* Axtarış Qutusu */}
          <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="🔍 Fənn adı, imtahan başlığı, müəllim və ya kod ilə axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: 12,
                border: `1px solid ${COLORS.paperLine}`,
                background: COLORS.card,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            <button 
              onClick={fetchExams} 
              style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 12, padding: "0 16px", cursor: "pointer", fontSize: 14 }}
              title="Siyahını Yenilə"
            >
              🔄
            </button>
          </div>

          {/* Testlər Siyahısı */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: "0 0 16px 0" }}>
              📚 Mövcud İmtahanlar ({filteredForms.length})
            </h3>

            {loading ? (
              <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Məlumatlar yüklənir...</p>
            ) : filteredForms.length === 0 ? (
              <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Axtarışa uyğun imtahan tapılmadı.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredForms.map((frm) => {
                  const isPrivateExam = frm.is_private === true || (frm.access_pin && frm.access_pin.trim() !== "");
                  
                  return (
                    <div key={frm.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: COLORS.paper, borderRadius: 12, border: `1px solid ${COLORS.paperLine}`, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, background: "rgba(5, 150, 105, 0.1)", padding: "2px 8px", borderRadius: 12 }}>
                            {frm.subject}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.inkSoft }}>
                            Kod: <strong style={{ color: COLORS.ink }}>{frm.code}</strong>
                          </span>
                          <span style={{ 
                            fontSize: 11, 
                            fontWeight: 600, 
                            color: isPrivateExam ? "#DC2626" : COLORS.green,
                            background: isPrivateExam ? "rgba(220, 38, 38, 0.1)" : "rgba(5, 150, 105, 0.1)",
                            padding: "2px 8px",
                            borderRadius: 12
                          }}>
                            {isPrivateExam ? "🔒 Şifrəli" : "🔓 Açıq"}
                          </span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>{frm.title}</div>
                        <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 4 }}>
                          👨‍🏫 Müəllim: <strong>{frm.teacher_name}</strong> • 📝 Sual: <strong>{frm.questions ? frm.questions.length : 0}</strong>
                          {frm.created_at && ` • 📅 ${new Date(frm.created_at).toLocaleDateString("az-AZ")}`}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedExam(frm);
                          setEnteredPin("");
                        }} 
                        style={{ background: COLORS.ink, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                      >
                        İmtahana Başla →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seçilən İmtahan üçün Ad-Soyad və Şifrə Daxil Etmə Pəncərəsi */}
      {selectedExam && !currentExam && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "32px" }}>
          <button onClick={() => setSelectedExam(null)} style={{ background: "transparent", border: "none", color: COLORS.ink, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>
            ← Geri qayıt
          </button>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, margin: "0 0 8px 0" }}>
            {selectedExam.title} ({selectedExam.subject})
          </h3>
          <p style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 20 }}>
            İmtahana başlamaq üçün ad və soyadınızı {(selectedExam.is_private === true || (selectedExam.access_pin && selectedExam.access_pin.trim() !== "")) ? "və müəllimin verdiyi PIN şifrəni" : ""} daxil edin.
          </p>

          <form onSubmit={handleStartExam} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="text"
              placeholder="Ad və Soyadınız"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              autoFocus
            />

            {(selectedExam.is_private === true || (selectedExam.access_pin && selectedExam.access_pin.trim() !== "")) && (
              <input
                type="text"
                placeholder="İmtahan PIN Şifrəsi (Məs: 1234)"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            )}

            <button type="submit" style={{ background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Testi Başlat →
            </button>
          </form>
        </div>
      )}

      {/* İmtahan Ekranı */}
      {currentExam && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }} className="no-print">
            <button onClick={() => setCurrentExam(null)} style={{ background: "transparent", border: "none", color: COLORS.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ← Siyahıya Qayıt
            </button>
            <button onClick={() => window.print()} style={{ background: COLORS.paper, color: COLORS.ink, border: `1px solid ${COLORS.paperLine}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              🖨️ Çap Et
            </button>
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, background: "rgba(5, 150, 105, 0.1)", padding: "4px 10px", borderRadius: 20 }}>
              {currentExam.subject} ({currentExam.code})
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, margin: "8px 0 4px 0" }}>
              {currentExam.title}
            </h2>
            <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>
              Şagird: <strong>{studentName}</strong> • Müəllim: <strong>{currentExam.teacher_name}</strong>
            </p>
          </div>

          {submitted && (
            <div style={{ background: "rgba(5, 150, 105, 0.08)", border: `1px solid ${COLORS.green}`, borderRadius: 16, padding: "24px", marginBottom: 20, textAlign: "center" }}>
              <h3 style={{ fontSize: 20, color: COLORS.green, margin: "0 0 6px 0" }}>İmtahan Tamamlandı!</h3>
              <p style={{ fontSize: 15, color: COLORS.ink, margin: 0 }}>
                Nəticəniz: <strong>{score}</strong> / {currentExam.questions?.length || 0} düzgün cavab 
                ({currentExam.questions?.length ? Math.round((score / currentExam.questions.length) * 100) : 0}%)
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(currentExam.questions || []).map((q, index) => {
              const userSelected = answers[q.id];
              const isCorrect = submitted && userSelected === q.correct;
              const isWrong = submitted && userSelected && userSelected !== q.correct;

              return (
                <div key={q.id} style={{ background: COLORS.card, border: `1px solid ${submitted && isCorrect ? COLORS.green : submitted && isWrong ? "#DC2626" : COLORS.paperLine}`, borderRadius: 16, padding: "20px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink, marginBottom: 12 }}>
                    {index + 1}. {q.text}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { key: "A", text: q.optA },
                      { key: "B", text: q.optB },
                      { key: "C", text: q.optC },
                      { key: "D", text: q.optD },
                    ].map((opt) => {
                      const isSelected = userSelected === opt.key;
                      let bg = COLORS.paper;
                      let borderColor = COLORS.paperLine;

                      if (isSelected) {
                        bg = "rgba(15, 23, 42, 0.06)";
                        borderColor = COLORS.ink;
                      }

                      if (submitted) {
                        if (opt.key === q.correct) {
                          bg = "rgba(5, 150, 105, 0.15)";
                          borderColor = COLORS.green;
                        } else if (isSelected && opt.key !== q.correct) {
                          bg = "rgba(220, 38, 38, 0.1)";
                          borderColor = "#DC2626";
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, opt.key)}
                          style={{
                            textAlign: "left",
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: `1px solid ${borderColor}`,
                            background: bg,
                            fontSize: 13,
                            color: COLORS.ink,
                            cursor: submitted ? "default" : "pointer",
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          <strong>{opt.key})</strong> {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!submitted && (
            <div className="no-print" style={{ marginTop: 24 }}>
              <button 
                type="button" 
                onClick={handleSubmitExam} 
                disabled={isSubmitting}
                style={{ 
                  width: "100%", 
                  background: isSubmitting ? COLORS.inkSoft : COLORS.green, 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: 10, 
                  padding: "14px", 
                  fontSize: 15, 
                  fontWeight: 700, 
                  cursor: isSubmitting ? "not-allowed" : "pointer" 
                }}
              >
                {isSubmitting ? "Göndərilir..." : "Cavabları Təqdim Et"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}