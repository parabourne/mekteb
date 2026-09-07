"use client";

import { useState, useEffect } from "react";
import { PageShell } from "@/components/ksq/ui";
import { COLORS } from "@/lib/ksq/constants";
import { supabase } from "@/lib/ksq/supabase";
import { ExamItem, StudentResult } from "@/types/teacher";
import CreateExamForm from "@/components/teacher/CreateExamForm";
import ExamsList from "@/components/teacher/ExamsList";
import StudentResults from "@/components/teacher/StudentResults";

export default function MuellimPage() {
  const [activeTab, setActiveTab] = useState<"create" | "exams" | "results">("create");

  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [examsLoading, setExamsLoading] = useState(false);

  const [results, setResults] = useState<StudentResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

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

  return (
    <PageShell>
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

        {activeTab === "create" && <CreateExamForm onSuccess={fetchExamsList} />}
        {activeTab === "exams" && <ExamsList examsList={examsList} examsLoading={examsLoading} />}
        {activeTab === "results" && <StudentResults results={results} resultsLoading={resultsLoading} />}
      </div>
    </PageShell>
  );
}