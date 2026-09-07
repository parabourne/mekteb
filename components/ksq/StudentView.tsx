"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/lib/ksq/constants";

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
  teacherName: string;
  title: string;
  subject: string;
  code: string;
  questions: Question[];
}

export default function StudentView() {
  const [studentName, setStudentName] = useState("");
  const [isNameSaved, setIsNameSaved] = useState(false);

  const [savedForms, setSavedForms] = useState<FormItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentExam, setCurrentExam] = useState<FormItem | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const local = localStorage.getItem("my_ksq_forms");
    if (local) {
      try {
        setSavedForms(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert("Zəhmət olmasa ad və soyadınızı daxil edin!");
      return;
    }
    setIsNameSaved(true);
  };

  const handleStartExam = (form: FormItem) => {
    setCurrentExam(form);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOptionSelect = (questionId: number, optionKey: string) => {
    if (submitted) return;
    setAnswers({
      ...answers,
      [questionId]: optionKey,
    });
  };

  const handleSubmitExam = () => {
    if (!currentExam) return;

    let correctCount = 0;
    currentExam.questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  // Axtarış və kod filtrli siyahı
  const filteredForms = savedForms.filter((frm) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      frm.code.toLowerCase().includes(query) ||
      frm.title.toLowerCase().includes(query) ||
      frm.subject.toLowerCase().includes(query) ||
      frm.teacherName.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 50 }}>
      {/* Başlıq */}
      <div style={{ marginBottom: 28 }} className="no-print">
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
          Şagird İmtahan Portalı
        </h1>
        <p style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 6 }}>
          Müəllimlərin hazırladığı KSQ və BSQ testlərini siyahıdan seçin və ya kodla axtarıb həll edin.
        </p>
      </div>

      {/* 1. AD-SOYAD DAXİL ETMƏK (Əgər hələ daxil olmayıbsa) */}
      {!isNameSaved && (
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.paperLine}`,
            borderRadius: 16,
            padding: "32px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: "0 0 14px 0" }}>
            Zəhmət olmasa imtahana başlamazdan əvvəl ad və soyadınızı yazın:
          </h3>
          <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <input
                type="text"
                placeholder="Məsələn: Leyla Məmmədova"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
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
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Davam Et →
            </button>
          </form>
        </div>
      )}

      {/* 2. SİYAHI VƏ AXTARIŞ (Ad daxil edildikdən sonra və heç bir test açıq deyilsə) */}
      {isNameSaved && !currentExam && (
        <div>
          {/* Şagird məlumatı və axtarış paneli */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Daxil olan şagird:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{studentName}</div>
            </div>

            <button
              onClick={() => setIsNameSaved(false)}
              style={{ background: "transparent", border: "none", color: COLORS.inkSoft, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
            >
              Adı dəyiş
            </button>
          </div>

          {/* Kod və ya Fənn Axtarış Sətri */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="🔍 Fənn adı, başlıq və ya müəllim kodunu yazın (məsələn: KSQ-542, Riyaziyyat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: `1px solid ${COLORS.paperLine}`,
                background: COLORS.card,
                fontSize: 14,
                color: COLORS.ink,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Aktiv Testlərin Siyahısı */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, margin: "0 0 16px 0" }}>
              Mövcud KSQ və BSQ Siyahısı ({filteredForms.length})
            </h3>

            {filteredForms.length === 0 ? (
              <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>
                Axtarışınıza uyğun və ya hələ ki sistemdə aktiv imtahan tapılmadı. Müəllimin testi əlavə etdiyindən əmin olun.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredForms.map((frm) => (
                  <div
                    key={frm.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: COLORS.paper,
                      borderRadius: 12,
                      border: `1px solid ${COLORS.paperLine}`,
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, background: "rgba(5, 150, 105, 0.1)", padding: "2px 8px", borderRadius: 12 }}>
                          {frm.subject}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.inkSoft }}>
                          Kod: <strong style={{ color: COLORS.ink }}>{frm.code}</strong>
                        </span>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>{frm.title}</div>
                      <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 2 }}>
                        Müəllim: <strong>{frm.teacherName}</strong> • Sual sayı: {frm.questions.length} ədəd
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartExam(frm)}
                      style={{
                        background: COLORS.ink,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 18px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Testə Başla →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. İMTAHANIN İÇİNDƏ OLARKƏN (TESTİ HƏLL ETMƏK) */}
      {isNameSaved && currentExam && (
        <div>
          {/* Geri qayıt düyməsi və başlıq */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }} className="no-print">
            <button
              onClick={() => setCurrentExam(null)}
              style={{ background: "transparent", border: "none", color: COLORS.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              ← Siyahıya Qayıt
            </button>

            <button
              onClick={handlePrint}
              style={{
                background: COLORS.paper,
                color: COLORS.ink,
                border: `1px solid ${COLORS.paperLine}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🖨️ Çap Et
            </button>
          </div>

          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 16,
              padding: "24px",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, background: "rgba(5, 150, 105, 0.1)", padding: "4px 10px", borderRadius: 20 }}>
              {currentExam.subject} ({currentExam.code})
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, margin: "8px 0 4px 0" }}>
              {currentExam.title}
            </h2>
            <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: 0 }}>
              Şagird: <strong>{studentName}</strong> • Müəllim: <strong>{currentExam.teacherName}</strong>
            </p>
          </div>

          {/* Nəticə Bloku */}
          {submitted && (
            <div
              style={{
                background: "rgba(5, 150, 105, 0.08)",
                border: `1px solid ${COLORS.green}`,
                borderRadius: 16,
                padding: "24px",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: 20, color: COLORS.green, margin: "0 0 6px 0" }}>İmtahan Tamamlandı!</h3>
              <p style={{ fontSize: 15, color: COLORS.ink, margin: 0 }}>
                Nəticəniz: <strong>{score}</strong> / {currentExam.questions.length} düzgün cavab 
                ({Math.round((score / currentExam.questions.length) * 100)}%)
              </p>
            </div>
          )}

          {/* Suallar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {currentExam.questions.map((q, index) => {
              const userSelected = answers[q.id];
              const isCorrect = submitted && userSelected === q.correct;
              const isWrong = submitted && userSelected && userSelected !== q.correct;

              return (
                <div
                  key={q.id}
                  style={{
                    background: COLORS.card,
                    border: `1px solid ${submitted && isCorrect ? COLORS.green : submitted && isWrong ? "#DC2626" : COLORS.paperLine}`,
                    borderRadius: 16,
                    padding: "20px",
                  }}
                >
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
                style={{
                  width: "100%",
                  background: COLORS.green,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cavabları Təqdim Et və Nəticəni Gör
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}