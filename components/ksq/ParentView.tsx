"use client";

import { useState } from "react";
import { COLORS } from "@/lib/ksq/constants";
import { supabase } from "@/lib/ksq/supabase";

interface StudentResult {
  id: number;
  exam_title: string;
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

export default function ParentView() {
  const [formCode, setFormCode] = useState("");
  const [childName, setChildName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<StudentResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim();
    const cleanName = childName.trim();
    const cleanPin = pinCode.trim();

    if (!cleanCode || !cleanName) {
      alert("Zəhmət olmasa imtahan kodunu/başlığını və şagirdin adını daxil edin.");
      return;
    }

    setLoading(true);
    setSearched(false);
    setErrorMessage(null);
    setResultData(null);

    try {
      // 1. İmtahanın özəl (is_private) və PIN tələb edib-etmədiyini check edirik
      const { data: examData, error: examErr } = await supabase
        .from("exams")
        .select("is_private, exam_pin, code, title")
        .or(`code.ilike.%${cleanCode}%,title.ilike.%${cleanCode}%`)
        .maybeSingle();

      if (examErr) console.warn("İmtahan statusu yoxlanılarkən xəbərdarlıq:", examErr.message);

      // Əgər imtahan tapılıbsa və özəldirsə PIN yoxlanılır
      if (examData && examData.is_private) {
        if (!cleanPin) {
          setErrorMessage("Bu özəl imtahandır. Zəhmət olmasa təyin edilmiş PIN kodu daxil edin.");
          setSearched(true);
          setLoading(false);
          return;
        }
        if (examData.exam_pin && examData.exam_pin !== cleanPin) {
          setErrorMessage("Daxil etdiyiniz PIN kod yanlışdır.");
          setSearched(true);
          setLoading(false);
          return;
        }
      }

      // 2. Şagird nəticəsini bazadan çəkirik
      const { data, error } = await supabase
        .from("student_results")
        .select("*")
        .ilike("student_name", `%${cleanName}%`)
        .or(`exam_title.ilike.%${cleanCode}%,exam_code.ilike.%${cleanCode}%`)
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

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 40 }}>
      {/* Səhifə Başlığı */}
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
          Valideyn İzləmə Paneli
        </h1>
        <p style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 6 }}>
          Övladınızın KSQ və BSQ qiymətləndirmə nəticələrini izləmək üçün məlumatları daxil edin.
        </p>
      </div>

      {/* Axtarış Formu Kartı */}
      <div
        className="no-print"
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
              Forma Kodu / İmtahan Başlığı
            </label>
            <input
              type="text"
              placeholder="Məsələn: KSQ-1 və ya Riyaziyyat"
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
              İmtahan PIN Kodu{" "}
              <span style={{ fontSize: 11, color: COLORS.inkSoft, fontWeight: 400 }}>
                (İmtahan özəldirsə daxil edin)
              </span>
            </label>
            <input
              type="password"
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
                🔒 Giriş Məhdudlaşdırıldı
              </span>
              <h3 style={{ margin: "6px 0 4px", fontSize: 16, color: COLORS.ink }}>
                PIN Kod Xətası
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
                  className="no-print"
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
                Zəhmət olmasa şagirdin adını və forma kodunu düzgün yazdığınızdan əmin olun və ya müəllimlə əlaqə saxlayın.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}