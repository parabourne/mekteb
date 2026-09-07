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

interface ExamItem {
  id: number;
  teacher_name: string;
  title: string;
  subject: string;
  code: string;
  questions: Question[];
  created_at?: string;
}

interface StudentResult {
  id: number;
  exam_title: string;
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

export default function TeacherView() {
  const [activeTab, setActiveTab] = useState<"create" | "exams" | "results">("create");

  // Test yaratmaq üçün state-lər
  const [teacherName, setTeacherName] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Riyaziyyat");
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "", optA: "", optB: "", optC: "", optD: "", correct: "A" }
  ]);
  const [loading, setLoading] = useState(false);

  // İmtahanlar siyahısı üçün state-lər
  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [examsLoading, setExamsLoading] = useState(false);

  // Nəticələr üçün state-lər
  const [results, setResults] = useState<StudentResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, text: "", optA: "", optB: "", optC: "", optD: "", correct: "A" }
    ]);
  };

  const handleQuestionChange = (id: number, field: keyof Question, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim() || !title.trim() || !code.trim()) {
      alert("Zəhmət olmasa müəllim adını, başlığı və kodu doldurun!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("exams").insert([
        {
          teacher_name: teacherName,
          title: title,
          subject: subject,
          code: code,
          questions: questions,
        },
      ]);

      if (error) throw error;

      alert("İmtahan uğurla bulud bazasına yadda saxlanıldı!");
      setTitle("");
      setCode("");
      setQuestions([{ id: 1, text: "", optA: "", optB: "", optC: "", optD: "", correct: "A" }]);
      
      fetchExamsList();
    } catch (err: any) {
      console.error(err);
      alert("Xəta baş verdi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamsList = async () => {
    setExamsLoading(true);
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("İmtahanlar çəkilərkən xəta:", error.message);
    } else if (data) {
      setExamsList(data);
    }
    setExamsLoading(false);
  };

  const fetchResults = async () => {
    setResultsLoading(true);
    const { data, error } = await supabase
      .from("student_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Nəticələr çəkilərkən xəta:", error.message);
    } else if (data) {
      setResults(data);
    }
    setResultsLoading(false);
  };

  useEffect(() => {
    if (activeTab === "exams") {
      fetchExamsList();
    } else if (activeTab === "results") {
      fetchResults();
    }
  }, [activeTab]);

  const filteredResults = results.filter((res) => {
    const q = searchQuery.toLowerCase();
    return (
      res.student_name.toLowerCase().includes(q) ||
      res.exam_title.toLowerCase().includes(q)
    );
  });

  // Checkbox seçimlərini idarə etmək
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

  // Çap funksiyaları
  const handlePrint = (singleId?: number) => {
    if (singleId) {
      setSelectedIds([singleId]);
      setTimeout(() => window.print(), 100);
    } else {
      window.print();
    }
  };

  // Kopyalama funksiyaları
  const copySingleResult = (res: StudentResult) => {
    const text = `Şagird: ${res.student_name} | Test: ${res.exam_title} | Bal: ${res.score}/${res.total_questions} (${res.percentage}%)`;
    navigator.clipboard.writeText(text);
    alert(`${res.student_name} üçün nəticə kopyalandı!`);
  };

  const handleCopyResults = () => {
    const targetResults = selectedIds.length > 0
      ? filteredResults.filter((r) => selectedIds.includes(r.id))
      : filteredResults;

    if (targetResults.length === 0) {
      alert("Kopyalamaq üçün heç bir nəticə yoxdur!");
      return;
    }

    let text = "📊 Şagird İmtahan Nəticələri:\n\n";
    targetResults.forEach((res, index) => {
      text += `${index + 1}. ${res.student_name} - Test: ${res.exam_title} - Bal: ${res.score}/${res.total_questions} (${res.percentage}%)\n`;
    });

    navigator.clipboard.writeText(text);
    alert(`${targetResults.length} şagirdin nəticəsi kopyalandı!`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 50 }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }} className="no-print">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.ink, margin: 0 }}>
            Müəllim İmtahan Paneli
          </h1>
          <p style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 4 }}>
            Testlər yaradın, paylaşılan imtahanları və şagird nəticələrini izləyin.
          </p>
        </div>

        {/* Tab Keçid Düymələri */}
        <div style={{ display: "flex", background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 10, padding: 4, gap: 4 }}>
          <button
            onClick={() => setActiveTab("create")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: activeTab === "create" ? COLORS.ink : "transparent",
              color: activeTab === "create" ? "#fff" : COLORS.ink,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✏️ Test Yarat
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: activeTab === "exams" ? COLORS.ink : "transparent",
              color: activeTab === "exams" ? "#fff" : COLORS.ink,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📚 İmtahanlar
          </button>
          <button
            onClick={() => setActiveTab("results")}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: activeTab === "results" ? COLORS.ink : "transparent",
              color: activeTab === "results" ? "#fff" : COLORS.ink,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📊 Nəticələr
          </button>
        </div>
      </div>

      {activeTab === "create" ? (
        <form onSubmit={handleSaveExam} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
                Müəllim Adı və Soyadı
              </label>
              <input
                type="text"
                placeholder="Məsələn: Elçin Məmmədov"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
                Fənn
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              >
                <option value="Riyaziyyat">Riyaziyyat</option>
                <option value="Fizika">Fizika</option>
                <option value="Kimya">Kimya</option>
                <option value="İngilis dili">İngilis dili</option>
                <option value="Azərbaycan dili">Azərbaycan dili</option>
                <option value="Tarix">Tarix</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
                Testin Başlığı (Məs: KSQ-1)
              </label>
              <input
                type="text"
                placeholder="Məsələn: Riyaziyyat KSQ #1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
                Unikal Kod
              </label>
              <input
                type="text"
                placeholder="Məsələn: KSQ-RIY-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Suallar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {questions.map((q, idx) => (
              <div key={q.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "20px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink, marginBottom: 12 }}>
                  Sual #{idx + 1}
                </div>

                <input
                  type="text"
                  placeholder="Sualın mətnini daxil edin..."
                  value={q.text}
                  onChange={(e) => handleQuestionChange(q.id, "text", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <input type="text" placeholder="A variantı" value={q.optA} onChange={(e) => handleQuestionChange(q.id, "optA", e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none" }} />
                  <input type="text" placeholder="B variantı" value={q.optB} onChange={(e) => handleQuestionChange(q.id, "optB", e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none" }} />
                  <input type="text" placeholder="C variantı" value={q.optC} onChange={(e) => handleQuestionChange(q.id, "optC", e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none" }} />
                  <input type="text" placeholder="D variantı" value={q.optD} onChange={(e) => handleQuestionChange(q.id, "optD", e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none" }} />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.ink, marginRight: 8 }}>Doğru variant:</label>
                  <select
                    value={q.correct}
                    onChange={(e) => handleQuestionChange(q.id, "correct", e.target.value)}
                    style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none" }}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              style={{ background: COLORS.paper, color: COLORS.ink, border: `1px solid ${COLORS.paperLine}`, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              + Yeni Sual Əlavə Et
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Yüklənir..." : "Testi Buluda Yadda Saxla"}
          </button>
        </form>
      ) : activeTab === "exams" ? (
        /* Mövcud İmtahanlar Siyahısı */
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
      ) : (
        /* Şagird Nəticələri Bölməsi (Seçim Sistemi Və Fərdi Düymələrlə) */
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }} className="no-print">
            <input
              type="text"
              placeholder="🔍 Şagird adı və ya test başlığı ilə axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: "200px", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.card, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
            
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => handlePrint()}
                style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.card, color: COLORS.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                🖨️ {selectedIds.length > 0 ? "Seçilənləri Çap Et" : "PDF Çap Et"}
              </button>
              <button
                onClick={handleCopyResults}
                style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.card, color: COLORS.ink, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                📋 {selectedIds.length > 0 ? "Seçilənləri Kopyala" : "Nəticələri Kopyala"}
              </button>
            </div>
          </div>

          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "20px" }}>
            {/* Hamısını Seç Control Header-ı */}
            {filteredResults.length > 0 && (
              <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${COLORS.paperLine}`, display: "flex", alignItems: "center", gap: 8 }} className="no-print">
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
              <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Nəticələr yüklənir...</p>
            ) : filteredResults.length === 0 ? (
              <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Hələ ki heç bir şagird nəticəsi tapılmadı.</p>
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
                        justifyContent: "space-between",
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
                            Test: <strong>{res.exam_title}</strong> • Tarix: {new Date(res.created_at).toLocaleDateString("az-AZ")}
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

                        {/* Hər şagirdə özəl Çap və Kopyala düymələri */}
                        <div style={{ display: "flex", gap: 6 }} className="no-print">
                          <button
                            type="button"
                            onClick={() => copySingleResult(res)}
                            title="Bu nəticəni kopyala"
                            style={{ padding: "6px 10px", background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                          >
                            📋
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePrint(res.id)}
                            title="Yalnız bu şagirdi çap et"
                            style={{ padding: "6px 10px", background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 6, cursor: "pointer", fontSize: 13 }}
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
        </div>
      )}

      {/* Çap Zamanı Lazımsız İnterfeys Elementlərini Gizlədən CSS Stili */}
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