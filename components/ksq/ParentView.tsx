"use client";

import { useState } from "react";
import { COLORS } from "@/lib/ksq/constants";
import { supabase } from "@/lib/ksq/supabase";

interface StudentResult {
  id: number;
  exam_id: number;
  exam_title: string;
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

interface QuestionItem {
  id: number;
  question?: string;
  correct_answer?: string;
  [key: string]: any;
}

export default function ParentView() {
  const [childName, setChildName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<StudentResult | null>(null);
  const [examQuestions, setExamQuestions] = useState<QuestionItem[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = childName.trim();
    const cleanPin = pinCode.trim();

    if (!cleanName || !cleanPin) {
      alert("Zəhmət olmasa şagirdin adını və imtahan PIN kodunu daxil edin.");
      return;
    }

    setLoading(true);
    setSearched(false);
    setErrorMessage(null);
    setResultData(null);
    setExamQuestions([]);

    try {
      const { data: examData, error: examErr } = await supabase
        .from("exams")
        .select("id, is_private, access_pin, code, title, questions")
        .or(`access_pin.ilike.${cleanPin},exam_pin.ilike.${cleanPin}`)
        .maybeSingle();

      if (examErr) console.warn("İmtahan statusu yoxlanılarkən xəbərdarlıq:", examErr.message);

      if (!examData) {
        setErrorMessage("Daxil etdiyiniz PIN koda uyğun imtahan tapılmadı.");
        setSearched(true);
        setLoading(false);
        return;
      }

      // İmtahana aid sualları yadda saxlayaq ki, çapda istifadə edə bilək
      if (examData.questions && Array.isArray(examData.questions)) {
        setExamQuestions(examData.questions);
      }

      const { data, error } = await supabase
        .from("student_results")
        .select("*")
        .eq("exam_id", examData.id)
        .ilike("student_name", `%${cleanName}%`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setResultData(data[0]);
      } else {
        setResultData(null);
      }
    } catch (err: any) {
      console.error("Axtarış xətası:", err.message);
      setErrorMessage("Məlumat çəkilərkən xəta baş verdi.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // Yalnız çap pəncərəsi üçün təmiz, səliqəli və bütün sualları əhatə edən rəsmi arayış dizaynı
  const handlePrintPDF = () => {
    if (!resultData) return;

    const questionsHtml = examQuestions.length > 0
      ? examQuestions.map((q, idx) => `
          <div style="padding: 10px 12px; margin-bottom: 8px; border: 1px solid #e5e7eb; border-radius: 6px; background: #fff;">
            <div style="font-weight: 600; font-size: 13px; color: #111827; margin-bottom: 4px;">
              Sual ${idx + 1}: ${q.question || "Sual mətni qeyd olunmayıb"}
            </div>
            <div style="font-size: 12px; color: #059669; font-weight: 500;">
              Düzgün Cavab: ${q.correct_answer || q.opta || "Təyin olunmayıb"}
            </div>
          </div>
        `).join("")
      : `<p style="font-size: 13px; color: #6b7280; text-align: center;">Bu imtahan üçün sual siyahısı tapılmadı.</p>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Zəhmət olmasa brauzerdə pop-up pəncərələrə icazə verin.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="az">
      <head>
        <meta charset="UTF-8">
        <title>Rəsmi İmtahan Arayışı - ${resultData.student_name}</title>
        <style>
          body {
            font-family: 'Inter', Arial, sans-serif;
            background: #ffffff;
            color: #111827;
            padding: 30px;
            max-width: 750px;
            margin: 0 auto;
          }
          .card {
            border: 1px solid #d1d5db;
            border-radius: 12px;
            padding: 24px;
            background: #f9fafb;
          }
          .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
            text-align: center;
          }
          .badge {
            font-size: 11px;
            font-weight: 700;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          h2 {
            margin: 6px 0 2px 0;
            font-size: 20px;
          }
          p {
            margin: 0;
            font-size: 12px;
            color: #4b5563;
          }
          .grid {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
          }
          .box {
            flex: 1;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
          }
          .box-title {
            font-size: 11px;
            color: #4b5563;
          }
          .box-value {
            font-size: 18px;
            font-weight: 800;
            color: #111827;
            margin-top: 2px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            margin: 16px 0 8px 0;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 4px;
          }
          .footer-text {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #4b5563;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">📋 Rəsmi Qiymətləndirmə Arayışı</span>
            <h2>${resultData.student_name}</h2>
            <p>Test: <strong>${resultData.exam_title}</strong> • Tarix: ${new Date(resultData.created_at).toLocaleDateString("az-AZ")}</p>
          </div>
          
          <div class="grid">
            <div class="box">
              <div class="box-title">Topladığı Bal</div>
              <div class="box-value">${resultData.score} / ${resultData.total_questions}</div>
            </div>
            <div class="box">
              <div class="box-title">Müvəffəqiyyət Faizi</div>
              <div class="box-value" style="color: #059669;">%${resultData.percentage}</div>
            </div>
          </div>

          <div class="section-title">İmtahan Sualları və Düzgün Cavablar</div>
          <div>${questionsHtml}</div>

          <div class="footer-text">
            ${
              resultData.percentage >= 80
                ? "Əla nəticədir! Övladınız mövzunu tam mənimsəyib."
                : resultData.percentage >= 50
                ? "Yaxşı nəticədir, lakin daha da diqqətli olmaq olar."
                : "İnkişaf etdirilməli mövzular var, birgə daha çox çalışmalıyıq."
            }
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 40, fontFamily: "'Inter', sans-serif" }}>
      {/* Səhifə Başlığı */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
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
          Övladınızın nəticəsini görmək üçün şagirdin adını və müəllimin verdiyi PIN kodu daxil edin.
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
        <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
              İmtahan PIN Kodu
            </label>
            <input
              type="text"
              placeholder="Məsələn: 1234"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
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
            disabled={loading}
            style={{
              background: COLORS.green,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              paddingTop: 12,
              paddingBottom: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Axtarılır..." : "Nəticəni Axtar"}
          </button>
        </form>
      </div>

      {/* Nəticə Bloku */}
      {searched && (
        <div
          style={{
            marginTop: 28,
            padding: "24px",
            background: COLORS.paper,
            borderRadius: 12,
            border: `1px solid ${COLORS.paperLine}`,
          }}
        >
          {errorMessage ? (
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e53e3e", textTransform: "uppercase" }}>
                🔒 Tapılmadı
              </span>
              <h3 style={{ margin: "6px 0 4px", fontSize: 16, color: COLORS.ink }}>
                Məlumat Tapılmadı
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: COLORS.inkSoft }}>{errorMessage}</p>
            </div>
          ) : resultData ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.green, textTransform: "uppercase" }}>
                    ✅ Nəticə Tapıldı
                  </span>
                  <h3 style={{ margin: "6px 0 4px", fontSize: 18, color: COLORS.ink }}>
                    {resultData.student_name}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: COLORS.inkSoft }}>
                    Test: <strong>{resultData.exam_title}</strong> • Tarix: {new Date(resultData.created_at).toLocaleDateString("az-AZ")}
                  </p>
                </div>

                <button
                  onClick={handlePrintPDF}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: `1px solid ${COLORS.paperLine}`,
                    background: COLORS.card,
                    color: COLORS.ink,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  🖨️ PDF Yüklə / Çap Et
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  background: COLORS.card,
                  padding: "16px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.paperLine}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Topladığı Bal</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, marginTop: 4 }}>
                    {resultData.score} / {resultData.total_questions}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Müvəffəqiyyət Faizi</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.green, marginTop: 4 }}>
                    %{resultData.percentage}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 13, color: COLORS.inkSoft, textAlign: "center" }}>
                {resultData.percentage >= 80
                  ? "Əla nəticədir! Övladınız mövzunu tam mənimsəyib."
                  : resultData.percentage >= 50
                  ? "Yaxşı nəticədir, lakin daha da diqqətli olmaq olar."
                  : "İnkişaf etdirilməli mövzular var, birgə daha çox çalışmalıyıq."}
              </div>
            </div>
          ) : (
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#e53e3e", textTransform: "uppercase" }}>
                ⚠️ Tapılmadı
              </span>
              <h3 style={{ margin: "6px 0 4px", fontSize: 16, color: COLORS.ink }}>
                "{childName}" üçün nəticə tapılmadı
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: COLORS.inkSoft }}>
                Zəhmət olmasa şagirdin adını və PIN kodu düzgün yazdığınızdan əmin olun.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}