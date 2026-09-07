"use client";

import { useState } from "react";
import { COLORS } from "@/lib/ksq/constants";
import { supabase } from "@/lib/ksq/supabase";
import { Question } from "@/types/teacher";

interface CreateExamFormProps {
  onSuccess: () => void;
}

export default function CreateExamForm({ onSuccess }: CreateExamFormProps) {
  const [teacherName, setTeacherName] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Riyaziyyat");
  const [code, setCode] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [examPin, setExamPin] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "", optA: "", optB: "", optC: "", optD: "", correct: "A" },
  ]);
  const [loading, setLoading] = useState(false);

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setExamPin(pin);
  };

  const handlePrivateToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === "private";
    setIsPrivate(val);
    if (val && !examPin) {
      generatePin();
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: prev.length + 1, text: "", optA: "", optB: "", optC: "", optD: "", correct: "A" },
    ]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length === 1) {
      alert("Testdə ən azı bir sual olmalıdır!");
      return;
    }
    const updated = questions
      .filter((q) => q.id !== id)
      .map((q, idx) => ({ ...q, id: idx + 1 }));
    setQuestions(updated);
  };

  const handleQuestionChange = (id: number, field: keyof Question, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTeacher = teacherName.trim();
    const cleanTitle = title.trim();
    const cleanCode = code.trim().toUpperCase();
    const cleanPin = examPin.trim();

    if (!cleanTeacher || !cleanTitle || !cleanCode) {
      alert("Zəhmət olmasa müəllim adını, başlığı və unikal kodu doldurun!");
      return;
    }

    if (isPrivate && (!cleanPin || cleanPin.length < 4)) {
      alert("Özəl imtahan üçün ən azı 4 rəqəmli PIN daxil edin və ya generasiya edin!");
      return;
    }

    const hasEmptyQuestion = questions.some(
      (q) => !q.text.trim() || !q.optA.trim() || !q.optB.trim() || !q.optC.trim() || !q.optD.trim()
    );

    if (hasEmptyQuestion) {
      alert("Zəhmət olmasa bütün sualların mətnini və variantlarını tam doldurun!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("exams").insert([
        {
          teacher_name: cleanTeacher,
          title: cleanTitle,
          subject: subject,
          code: cleanCode,
          questions: questions,
          is_private: isPrivate,
          exam_pin: isPrivate ? cleanPin : null,
          is_active: true,
        },
      ]);

      if (error) throw error;

      alert("İmtahan uğurla yadda saxlanıldı!");
      setTitle("");
      setCode("");
      setIsPrivate(false);
      setExamPin("");
      setQuestions([{ id: 1, text: "", optA: "", optB: "", optC: "", optD: "", correct: "A" }]);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert("Xəta baş verdi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveExam} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.paperLine}`,
          borderRadius: 16,
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
            Müəllim Adı və Soyadı
          </label>
          <input
            type="text"
            placeholder="Məsələn: Elçin Məmmədov"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.paper,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
            Fənn
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.paper,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="Riyaziyyat">Riyaziyyat</option>
            <option value="Fizika">Fizika</option>
            <option value="Kimya">Kimya</option>
            <option value="İngilis dili">İngilis dili</option>
            <option value="Azərbaycan dili">Azərbaycan dili</option>
            <option value="Tarix">Tarix</option>
            <option value="İnformatika">İnformatika</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
            Testin Başlığı
          </label>
          <input
            type="text"
            placeholder="Məsələn: KSQ-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.paper,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
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
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.paper,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
            İmtahan Rejimi
          </label>
          <select
            value={isPrivate ? "private" : "open"}
            onChange={handlePrivateToggle}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.paperLine}`,
              background: COLORS.paper,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="open">🔓 Açıq İmtahan (Hamı daxil ola bilər)</option>
            <option value="private">🔒 Özəl İmtahan (Kod + PIN tələb olunur)</option>
          </select>
        </div>

        {isPrivate && (
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 8 }}>
              Giriş PIN Kodu
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="4 rəqəmli PIN"
                value={examPin}
                onChange={(e) => setExamPin(e.target.value)}
                maxLength={6}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              />
              <button
                type="button"
                onClick={generatePin}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  color: COLORS.ink,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🎲 Yenilə
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suallar Siyahısı */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((q, idx) => (
          <div
            key={q.id}
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 16,
              padding: "20px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink }}>
                Sual #{idx + 1}
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#e53e3e",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sualı Sil
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Sualın mətnini daxil edin..."
              value={q.text}
              onChange={(e) => handleQuestionChange(q.id, "text", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${COLORS.paperLine}`,
                background: COLORS.paper,
                fontSize: 14,
                marginBottom: 12,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="A variantı"
                value={q.optA}
                onChange={(e) => handleQuestionChange(q.id, "optA", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <input
                type="text"
                placeholder="B variantı"
                value={q.optB}
                onChange={(e) => handleQuestionChange(q.id, "optB", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <input
                type="text"
                placeholder="C variantı"
                value={q.optC}
                onChange={(e) => handleQuestionChange(q.id, "optC", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <input
                type="text"
                placeholder="D variantı"
                value={q.optD}
                onChange={(e) => handleQuestionChange(q.id, "optD", e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.ink, marginRight: 8 }}>
                Doğru variant:
              </label>
              <select
                value={q.correct}
                onChange={(e) => handleQuestionChange(q.id, "correct", e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${COLORS.paperLine}`,
                  background: COLORS.paper,
                  fontSize: 13,
                  outline: "none",
                }}
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
          style={{
            background: COLORS.paper,
            color: COLORS.ink,
            border: `1px solid ${COLORS.paperLine}`,
            borderRadius: 10,
            padding: "12px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Yeni Sual Əlavə Et
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          background: COLORS.green,
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "14px",
          fontSize: 15,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Yüklənir..." : "Testi Buluda Yadda Saxla"}
      </button>
    </form>
  );
}