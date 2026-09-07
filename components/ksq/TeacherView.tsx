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

export default function TeacherView() {
  const [teacherName, setTeacherName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [subject, setSubject] = useState("");

  const [qText, setQText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correct, setCorrect] = useState("A");

  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [savedForms, setSavedForms] = useState<FormItem[]>([]);

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

  const handleAddSingleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) {
      alert("Zəhmət olmasa sual mətnini yazın!");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      text: qText,
      optA: optA || "A variantı",
      optB: optB || "B variantı",
      optC: optC || "C variantı",
      optD: optD || "D variantı",
      correct: correct,
    };

    setQuestionsList([...questionsList, newQuestion]);

    setQText("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrect("A");
  };

  const handleSaveCompleteForm = () => {
    if (!teacherName.trim()) {
      alert("Zəhmət olmasa müəllimin Ad və Soyadını daxil edin!");
      return;
    }
    if (!formTitle.trim() || !subject.trim()) {
      alert("Formanın adını və fənnini qeyd edin!");
      return;
    }
    if (questionsList.length === 0) {
      alert("Formaya ən azı 1 sual əlavə etməlisiniz!");
      return;
    }

    const newForm: FormItem = {
      id: Date.now(),
      teacherName: teacherName,
      title: formTitle,
      subject: subject,
      code: `KSQ-${Math.floor(100 + Math.random() * 900)}`,
      questions: questionsList,
    };

    const updated = [newForm, ...savedForms];
    setSavedForms(updated);
    localStorage.setItem("my_ksq_forms", JSON.stringify(updated));

    setFormTitle("");
    setSubject("");
    setQuestionsList([]);
    alert("KSQ/BSQ forması müəllim adı ilə birlikdə uğurla yaradıldı!");
  };

  const handleDeleteForm = (id: number) => {
    const filtered = savedForms.filter((f) => f.id !== id);
    setSavedForms(filtered);
    localStorage.setItem("my_ksq_forms", JSON.stringify(filtered));
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 50 }}>
      {/* Başlıq */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.ink, margin: 0 }}>
          Müəllim İdarəetmə Paneli
        </h1>
        <p style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 6 }}>
          Adınızı qeyd edin, KSQ/BSQ suallarını tək-tək daxil edərək şagirdlər üçün test hazırlayın.
        </p>
      </div>

      {/* MÜƏLLİM VƏ FORM MƏLUMATLARI */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: "0 0 14px 0" }}>1. Müəllim və Forma Məlumatları</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.ink, marginBottom: 6 }}>Müəllimin Adı və Soyadı</label>
            <input
              type="text"
              placeholder="Məsələn: Nigar Məmmədova"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", color: COLORS.ink }}
            />
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.ink, marginBottom: 6 }}>Formanın Adı</label>
              <input
                type="text"
                placeholder="Məsələn: KSQ - Riyaziyyat #1"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", color: COLORS.ink }}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.ink, marginBottom: 6 }}>Fənn</label>
              <input
                type="text"
                placeholder="Məsələn: Riyaziyyat"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", color: COLORS.ink }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TƏK-TƏK SUAL ƏLAVƏ ETMƏ */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: "0 0 14px 0" }}>
          2. Sualları Tək-Tək Əlavə Et (Hazırda əlavə olunub: <span style={{ color: COLORS.green }}>{questionsList.length} sual</span>)
        </h3>

        <form onSubmit={handleAddSingleQuestion} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.ink, marginBottom: 6 }}>Sualın Mətni</label>
            <textarea
              rows={2}
              placeholder="Məsələn: 5 * 5 neçə edir?"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 14, outline: "none", resize: "vertical", color: COLORS.ink }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.inkSoft, marginBottom: 4 }}>A variantı</label>
              <input type="text" placeholder="A variantı" value={optA} onChange={(e) => setOptA(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none", color: COLORS.ink }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.inkSoft, marginBottom: 4 }}>B variantı</label>
              <input type="text" placeholder="B variantı" value={optB} onChange={(e) => setOptB(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none", color: COLORS.ink }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.inkSoft, marginBottom: 4 }}>C variantı</label>
              <input type="text" placeholder="C variantı" value={optC} onChange={(e) => setOptC(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none", color: COLORS.ink }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.inkSoft, marginBottom: 4 }}>D variantı</label>
              <input type="text" placeholder="D variantı" value={optD} onChange={(e) => setOptD(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, outline: "none", color: COLORS.ink }} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>Düzgün Cavab:</label>
              <select value={correct} onChange={(e) => setCorrect(e.target.value)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, background: COLORS.paper, fontSize: 13, fontWeight: 600, color: COLORS.ink }}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: COLORS.ink,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Bu Sualı Əlavə Et
            </button>
          </div>
        </form>

        {questionsList.length > 0 && (
          <div style={{ marginTop: 20, borderTop: `1px solid ${COLORS.paperLine}`, paddingTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Əlavə Olunan Suallar:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {questionsList.map((item, index) => (
                <div key={item.id} style={{ fontSize: 13, background: COLORS.paper, padding: "8px 12px", borderRadius: 6, border: `1px solid ${COLORS.paperLine}`, color: COLORS.ink }}>
                  <strong>{index + 1}.</strong> {item.text} <span style={{ color: COLORS.green, fontWeight: 600 }}>(Düzgün: {item.correct})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {questionsList.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={handleSaveCompleteForm}
              style={{
                width: "100%",
                background: COLORS.green,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Testi Hazırla və Yadda Saxla
            </button>
          </div>
        )}
      </div>

      {/* YARADILMIŞ FORMALARIN SİYAHISI */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 16, padding: "24px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink, margin: "0 0 14px 0" }}>
          Hazırlanmış İmtahanlar ({savedForms.length})
        </h3>

        {savedForms.length === 0 ? (
          <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Hələ ki yaradılmış imtahan yoxdur.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {savedForms.map((frm) => (
              <div key={frm.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: COLORS.paper, borderRadius: 10, border: `1px solid ${COLORS.paperLine}`, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink }}>{frm.title}</div>
                  <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 3 }}>
                    Müəllim: <strong>{frm.teacherName}</strong> • Fənn: <strong>{frm.subject}</strong> • Sual: {frm.questions.length} ədəd • Kod: <strong style={{ color: COLORS.green }}>{frm.code}</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteForm(frm.id)}
                  style={{ background: "transparent", border: "none", color: "#DC2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}