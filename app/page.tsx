"use client";

import { useState, useEffect, useCallback } from "react";

const FONT_IMPORT_ID = "ksq-fonts";
function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const COLORS = {
  paper: "#F0EAD6",
  paperLine: "#C9BFA0",
  ink: "#2B2A25",
  inkSoft: "#5C5646",
  green: "#2F4F3E",
  greenDeep: "#1F3A2C",
  red: "#B33A2E",
  gold: "#A98B3D",
  card: "#FFFDF7",
};

const SUBJECTS = [
  "Azərbaycan dili",
  "Riyaziyyat",
  "Həyat bilgisi",
  "Fənn bilgisi",
  "Xarici dil",
  "Tarix",
  "Coğrafiya",
  "Fizika",
  "Kimya",
  "Biologiya",
  "İnformatika",
  "Digər",
];

const GRADES = Array.from({ length: 11 }, (_, i) => String(i + 1));

const DEFAULT_LEVELS = [
  { name: "I səviyyə", min: 0, max: 20 },
  { name: "II səviyyə", min: 21, max: 45 },
  { name: "III səviyyə", min: 46, max: 70 },
  { name: "IV səviyyə", min: 71, max: 100 },
];

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

async function storeGet(key, shared) {
  try {
    const res = await window.storage.get(key, shared);
    return res ? JSON.parse(res.value) : null;
  } catch (e) {
    return null;
  }
}
async function storeSet(key, value, shared) {
  try {
    await window.storage.set(key, JSON.stringify(value), shared);
    return true;
  } catch (e) {
    return false;
  }
}

function levelFor(percent, levels) {
  const found = levels.find((l) => percent >= l.min && percent <= l.max);
  return found ? found.name : "—";
}

function Badge({ children, tone }) {
  const bg = tone === "bsq" ? COLORS.red : COLORS.gold;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        background: bg,
        padding: "3px 10px",
        borderRadius: 3,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

function TextField({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      {label && (
        <span style={{ display: "block", fontSize: 13, color: COLORS.inkSoft, marginBottom: 5, fontWeight: 500 }}>
          {label}
        </span>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "9px 11px",
          fontSize: 14,
          fontFamily: "'IBM Plex Sans', sans-serif",
          border: `1px solid ${COLORS.paperLine}`,
          borderRadius: 4,
          background: "#fff",
          color: COLORS.ink,
          ...props.style,
        }}
      />
    </label>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      {label && (
        <span style={{ display: "block", fontSize: 13, color: COLORS.inkSoft, marginBottom: 5, fontWeight: 500 }}>
          {label}
        </span>
      )}
      <select
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "9px 11px",
          fontSize: 14,
          fontFamily: "'IBM Plex Sans', sans-serif",
          border: `1px solid ${COLORS.paperLine}`,
          borderRadius: 4,
          background: "#fff",
          color: COLORS.ink,
        }}
      >
        {children}
      </select>
    </label>
  );
}

function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: COLORS.green, color: "#fff", border: `1px solid ${COLORS.green}` },
    danger: { background: "transparent", color: COLORS.red, border: `1px solid ${COLORS.red}` },
    ghost: { background: "transparent", color: COLORS.ink, border: `1px solid ${COLORS.paperLine}` },
    gold: { background: COLORS.gold, color: "#fff", border: `1px solid ${COLORS.gold}` },
  };
  return (
    <button
      {...props}
      style={{
        padding: "9px 16px",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'IBM Plex Sans', sans-serif",
        borderRadius: 4,
        cursor: "pointer",
        ...styles[variant],
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

function BackLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        color: "rgba(243,238,223,0.85)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      ← Ana səhifə
    </button>
  );
}

function Cover({ children, onBack }) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${COLORS.green} 0%, ${COLORS.greenDeep} 100%)`,
        borderRadius: "6px 6px 0 0",
        padding: "22px 28px 22px",
        color: "#fff",
      }}
    >
      {onBack && (
        <div style={{ marginBottom: 14 }}>
          <BackLink onClick={onBack} />
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- Landing page ---------- */

function EntryCard({ eyebrow, title, text, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        background: COLORS.card,
        border: `1px solid ${COLORS.paperLine}`,
        borderRadius: 6,
        padding: "20px 20px 18px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flex: "1 1 220px",
        minWidth: 200,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.4,
          color: accent,
        }}
      >
        {eyebrow}
      </span>
      <span style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: 19, fontWeight: 600, color: COLORS.ink }}>
        {title}
      </span>
      <span style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>{text}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent, marginTop: 4 }}>Giriş →</span>
    </button>
  );
}

function Landing({ goTo }) {
  return (
    <div>
      <Cover>
        <h1
          style={{
            fontFamily: "'IBM Plex Serif', serif",
            fontWeight: 700,
            fontSize: 24,
            margin: 0,
            color: "#F3EEDF",
          }}
        >
          Qiymətləndirmə dəftəri
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(243,238,223,0.78)", maxWidth: 460 }}>
          KSQ və BSQ formalarının hazırlanması, keçirilməsi və nəticələrin izlənməsi üçün ortaq məkan.
        </p>
      </Cover>
      <div
        style={{
          background: COLORS.paper,
          borderRadius: "0 0 6px 6px",
          padding: "26px 28px 32px",
          borderLeft: `1px solid ${COLORS.paperLine}`,
          borderRight: `1px solid ${COLORS.paperLine}`,
          borderBottom: `1px solid ${COLORS.paperLine}`,
        }}
      >
        <span style={{ display: "block", fontSize: 13, color: COLORS.inkSoft, marginBottom: 14, fontWeight: 500 }}>
          Kim olaraq daxil olursunuz?
        </span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <EntryCard
            eyebrow="MÜƏLLİM"
            title="Müəllim girişi"
            text="Yeni KSQ/BSQ forması hazırlayın, tapşırıqları qurun və şagird nəticələrini qeyd edin."
            onClick={() => goTo("teacher")}
            accent={COLORS.green}
          />
          <EntryCard
            eyebrow="ŞAGİRD"
            title="Şagird girişi"
            text="Müəlliminizin verdiyi kodu daxil edin, tapşırıqlara baxın və öz nəticənizi görün."
            onClick={() => goTo("student")}
            accent={COLORS.gold}
          />
          <EntryCard
            eyebrow="VALİDEYN"
            title="Valideyn girişi"
            text="Forma kodu və övladınızın adı ilə onun KSQ/BSQ nəticəsini izləyin."
            onClick={() => goTo("parent")}
            accent={COLORS.red}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Task editor (teacher) ---------- */

function TaskEditor({ tasks, setTasks }) {
  const addTask = () => setTasks([...tasks, { id: uid(), text: "", max: 5 }]);
  const removeTask = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const updateTask = (id, patch) => setTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  return (
    <div>
      <span style={{ display: "block", fontSize: 13, color: COLORS.inkSoft, marginBottom: 8, fontWeight: 500 }}>
        Tapşırıqlar
      </span>
      {tasks.map((t, idx) => (
        <div key={t.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
          <div
            style={{
              width: 24,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: COLORS.inkSoft,
              fontWeight: 600,
            }}
          >
            {idx + 1}
          </div>
          <input
            value={t.text}
            onChange={(e) => updateTask(t.id, { text: e.target.value })}
            placeholder="Tapşırığın qısa təsviri"
            style={{
              flex: 1,
              padding: "8px 10px",
              fontSize: 13,
              fontFamily: "'IBM Plex Sans', sans-serif",
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 4,
              background: "#fff",
            }}
          />
          <input
            type="number"
            min={1}
            value={t.max}
            onChange={(e) => updateTask(t.id, { max: Math.max(1, Number(e.target.value) || 1) })}
            style={{
              width: 62,
              padding: "8px 8px",
              fontSize: 13,
              fontFamily: "'IBM Plex Sans', sans-serif",
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 4,
              background: "#fff",
              textAlign: "center",
            }}
            title="Maksimum bal"
          />
          <button
            onClick={() => removeTask(t.id)}
            title="Sil"
            style={{
              width: 34,
              height: 34,
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 4,
              background: "#fff",
              color: COLORS.red,
              cursor: "pointer",
              fontSize: 15,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addTask}
        style={{
          marginTop: 4,
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 600,
          border: `1px dashed ${COLORS.paperLine}`,
          borderRadius: 4,
          background: "transparent",
          color: COLORS.inkSoft,
          cursor: "pointer",
        }}
      >
        + Tapşırıq əlavə et
      </button>
    </div>
  );
}

function TeacherCreate({ onCreated }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState("5");
  const [type, setType] = useState("KSQ");
  const [tasks, setTasks] = useState([{ id: uid(), text: "", max: 5 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalMax = tasks.reduce((s, t) => s + (Number(t.max) || 0), 0);

  const handleSave = async () => {
    setError("");
    if (!title.trim()) return setError("Formanın adını daxil edin.");
    const validTasks = tasks.filter((t) => t.text.trim());
    if (validTasks.length === 0) return setError("Ən azı bir tapşırıq əlavə edin.");
    setSaving(true);
    const code = genCode();
    const form = {
      code,
      title: title.trim(),
      subject,
      grade,
      type,
      tasks: validTasks,
      levels: DEFAULT_LEVELS,
      createdAt: new Date().toISOString(),
    };
    const ok = await storeSet(`ksqform:${code}`, form, true);
    if (ok) {
      const mine = (await storeGet("ksq-my-forms", false)) || [];
      await storeSet("ksq-my-forms", [{ code, title: form.title, type, subject, grade }, ...mine], false);
      setTitle("");
      setTasks([{ id: uid(), text: "", max: 5 }]);
      onCreated(code);
    } else {
      setError("Yadda saxlanılarkən xəta baş verdi. Yenidən cəhd edin.");
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 4 }}>
        <div style={{ flex: 1 }}>
          <TextField label="Formanın adı" placeholder="Məs: 3-cü bölmə üzrə qiymətləndirmə" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div style={{ width: 130 }}>
          <SelectField label="Növ" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="KSQ">KSQ</option>
            <option value="BSQ">BSQ</option>
          </SelectField>
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 2 }}>
          <SelectField label="Fənn" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectField>
        </div>
        <div style={{ width: 100 }}>
          <SelectField label="Sinif" value={grade} onChange={(e) => setGrade(e.target.value)}>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.paperLine}`, margin: "6px 0 16px" }} />

      <TaskEditor tasks={tasks} setTasks={setTasks} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
        <span style={{ fontSize: 13, color: COLORS.inkSoft }}>Ümumi bal: <strong style={{ color: COLORS.ink }}>{totalMax}</strong></span>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saxlanılır…" : "Formanı yarat"}
        </Button>
      </div>
      {error && <p style={{ color: COLORS.red, fontSize: 13, marginTop: 10 }}>{error}</p>}
    </div>
  );
}

function TeacherManage({ initialCode }) {
  const [myForms, setMyForms] = useState([]);
  const [selectedCode, setSelectedCode] = useState(initialCode || "");
  const [form, setForm] = useState(null);
  const [results, setResults] = useState({});
  const [newStudent, setNewStudent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const mine = (await storeGet("ksq-my-forms", false)) || [];
      setMyForms(mine);
      if (!selectedCode && mine.length > 0) setSelectedCode(mine[0].code);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadForm = useCallback(async (code) => {
    if (!code) return;
    setLoading(true);
    const f = await storeGet(`ksqform:${code}`, true);
    const r = (await storeGet(`ksqresults:${code}`, true)) || {};
    setForm(f);
    setResults(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCode) loadForm(selectedCode);
  }, [selectedCode, loadForm]);

  const saveResults = async (updated) => {
    setResults(updated);
    await storeSet(`ksqresults:${selectedCode}`, updated, true);
  };

  const addStudent = async () => {
    const name = newStudent.trim();
    if (!name || !form) return;
    if (results[name]) {
      setNewStudent("");
      return;
    }
    const scores = {};
    form.tasks.forEach((t) => (scores[t.id] = 0));
    const updated = { ...results, [name]: { scores, updatedAt: new Date().toISOString() } };
    setNewStudent("");
    await saveResults(updated);
  };

  const updateScore = async (studentName, taskId, value, max) => {
    const clamped = Math.max(0, Math.min(max, Number(value) || 0));
    const student = results[studentName];
    if (!student) return;
    const updated = {
      ...results,
      [studentName]: { ...student, scores: { ...student.scores, [taskId]: clamped }, updatedAt: new Date().toISOString() },
    };
    await saveResults(updated);
  };

  const removeStudent = async (studentName) => {
    const updated = { ...results };
    delete updated[studentName];
    await saveResults(updated);
  };

  if (myForms.length === 0) {
    return (
      <p style={{ fontSize: 14, color: COLORS.inkSoft }}>
        Hələ heç bir form yaratmamısınız. "Yeni forma" bölməsindən başlayın.
      </p>
    );
  }

  const totalMax = form ? form.tasks.reduce((s, t) => s + t.max, 0) : 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ minWidth: 220 }}>
          <SelectField label="Forma seçin" value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)}>
            {myForms.map((f) => (
              <option key={f.code} value={f.code}>
                {f.title} ({f.type})
              </option>
            ))}
          </SelectField>
        </div>
        {form && (
          <div style={{ paddingBottom: 14 }}>
            <span style={{ fontSize: 12, color: COLORS.inkSoft }}>Kod: </span>
            <span
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 2,
                color: COLORS.green,
                background: "#fff",
                border: `1px solid ${COLORS.paperLine}`,
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              {form.code}
            </span>
          </div>
        )}
      </div>

      {loading && <p style={{ fontSize: 13, color: COLORS.inkSoft }}>Yüklənir…</p>}

      {form && !loading && (
        <>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
            <Badge tone={form.type === "BSQ" ? "bsq" : "ksq"}>{form.type}</Badge>
            <span style={{ fontSize: 13, color: COLORS.inkSoft }}>
              {form.subject} · {form.grade}-ci sinif · {form.tasks.length} tapşırıq · maks. {totalMax} bal
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
            <input
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStudent()}
              placeholder="Şagirdin adı və soyadı"
              style={{
                flex: 1,
                padding: "9px 11px",
                fontSize: 13,
                fontFamily: "'IBM Plex Sans', sans-serif",
                border: `1px solid ${COLORS.paperLine}`,
                borderRadius: 4,
                background: "#fff",
              }}
            />
            <Button variant="gold" onClick={addStudent}>
              Əlavə et
            </Button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Şagird</th>
                  {form.tasks.map((t, i) => (
                    <th key={t.id} style={{ ...thStyle, textAlign: "center", minWidth: 56 }}>
                      T{i + 1}
                      <div style={{ fontWeight: 400, fontSize: 11, color: COLORS.inkSoft }}>/{t.max}</div>
                    </th>
                  ))}
                  <th style={{ ...thStyle, textAlign: "center" }}>Cəm</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>%</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Səviyyə</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(results).length === 0 && (
                  <tr>
                    <td colSpan={form.tasks.length + 5} style={{ padding: "16px 8px", color: COLORS.inkSoft, fontSize: 13 }}>
                      Hələ şagird əlavə edilməyib.
                    </td>
                  </tr>
                )}
                {Object.entries(results).map(([name, data]) => {
                  const total = form.tasks.reduce((s, t) => s + (data.scores[t.id] || 0), 0);
                  const percent = totalMax > 0 ? Math.round((total / totalMax) * 100) : 0;
                  return (
                    <tr key={name} style={{ borderTop: `1px solid ${COLORS.paperLine}` }}>
                      <td style={tdStyle}>{name}</td>
                      {form.tasks.map((t) => (
                        <td key={t.id} style={{ ...tdStyle, textAlign: "center" }}>
                          <input
                            type="number"
                            min={0}
                            max={t.max}
                            value={data.scores[t.id] ?? 0}
                            onChange={(e) => updateScore(name, t.id, e.target.value, t.max)}
                            style={{
                              width: 44,
                              padding: "5px 4px",
                              textAlign: "center",
                              fontSize: 13,
                              border: `1px solid ${COLORS.paperLine}`,
                              borderRadius: 4,
                            }}
                          />
                        </td>
                      ))}
                      <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600 }}>{total}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{percent}%</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{levelFor(percent, form.levels)}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          onClick={() => removeStudent(name)}
                          title="Sil"
                          style={{ border: "none", background: "transparent", color: COLORS.red, cursor: "pointer", fontSize: 14 }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 14 }}>
            Səviyyə hədləri standart olaraq təyin olunub (I: 0–20%, II: 21–45%, III: 46–70%, IV: 71–100%). Zəhmət olmasa öz meyarlarınıza uyğun qiymətləndirin.
          </p>
        </>
      )}
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "8px 8px", fontWeight: 600, color: COLORS.inkSoft, fontSize: 12, borderBottom: `1px solid ${COLORS.paperLine}` };
const tdStyle = { padding: "7px 8px", color: COLORS.ink };

function TeacherView({ onBack }) {
  const [tab, setTab] = useState("create");
  const [lastCode, setLastCode] = useState("");

  return (
    <div>
      <Cover onBack={onBack}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <Badge tone="ksq">MÜƏLLİM</Badge>
        </div>
        <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 21, margin: "6px 0 0", color: "#F3EEDF" }}>
          Formalarınız və nəticələr
        </h1>
      </Cover>
      <div
        style={{
          background: COLORS.paper,
          borderRadius: "0 0 6px 6px",
          padding: "22px 28px 32px",
          borderLeft: `1px solid ${COLORS.paperLine}`,
          borderRight: `1px solid ${COLORS.paperLine}`,
          borderBottom: `1px solid ${COLORS.paperLine}`,
        }}
      >
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[
            { key: "create", label: "Yeni forma" },
            { key: "manage", label: "Formalarım və nəticələr" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                border: `1px solid ${COLORS.paperLine}`,
                borderBottom: tab === t.key ? `2px solid ${COLORS.green}` : `1px solid ${COLORS.paperLine}`,
                borderRadius: "4px 4px 0 0",
                background: tab === t.key ? COLORS.card : "transparent",
                color: tab === t.key ? COLORS.green : COLORS.inkSoft,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {lastCode && tab === "create" && (
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.gold}`,
              borderRadius: 6,
              padding: "12px 16px",
              marginBottom: 18,
              fontSize: 13,
              color: COLORS.ink,
            }}
          >
            Forma yaradıldı. Şagird və valideynlərə bu kodu bildirin: {" "}
            <strong style={{ letterSpacing: 2, color: COLORS.green }}>{lastCode}</strong>
          </div>
        )}
        {tab === "create" ? (
          <TeacherCreate onCreated={(code) => setLastCode(code)} />
        ) : (
          <TeacherManage initialCode={lastCode} />
        )}
      </div>
    </div>
  );
}

/* ---------- Shared lookup used by student & parent ---------- */

function useFormLookup() {
  const [code, setCode] = useState("");
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const join = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return setError("Kodu daxil edin.");
    setLoading(true);
    setError("");
    setForm(null);
    const f = await storeGet(`ksqform:${trimmed}`, true);
    if (!f) {
      setError("Bu kodla forma tapılmadı. Kodu yoxlayın.");
    } else {
      setForm(f);
    }
    setLoading(false);
  };

  return { code, setCode, form, error, loading, join };
}

function ResultBlock({ form, name, result }) {
  const totalMax = form.tasks.reduce((s, t) => s + t.max, 0);
  if (!result) {
    return <p style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 14 }}>Nəticə hələ daxil edilməyib. Müəllimlə əlaqə saxlayın.</p>;
  }
  const total = form.tasks.reduce((s, t) => s + (result.scores[t.id] || 0), 0);
  const percent = totalMax > 0 ? Math.round((total / totalMax) * 100) : 0;
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 16 }}>
      <div>
        <span style={{ display: "block", fontSize: 11, color: COLORS.inkSoft }}>Toplanan bal</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, fontFamily: "'IBM Plex Serif', serif" }}>
          {total} / {totalMax}
        </span>
      </div>
      <div>
        <span style={{ display: "block", fontSize: 11, color: COLORS.inkSoft }}>Faiz</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, fontFamily: "'IBM Plex Serif', serif" }}>{percent}%</span>
      </div>
      <div>
        <span style={{ display: "block", fontSize: 11, color: COLORS.inkSoft }}>Səviyyə</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.red, fontFamily: "'IBM Plex Serif', serif" }}>
          {levelFor(percent, form.levels)}
        </span>
      </div>
    </div>
  );
}

function StudentView({ onBack }) {
  const { code, setCode, form, error, loading, join } = useFormLookup();
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);

  const checkResult = async () => {
    if (!name.trim() || !form) return;
    const r = (await storeGet(`ksqresults:${form.code}`, true)) || {};
    setResult(r[name.trim()] || null);
    setChecked(true);
  };

  const totalMax = form ? form.tasks.reduce((s, t) => s + t.max, 0) : 0;

  return (
    <div>
      <Cover onBack={onBack}>
        <Badge tone="ksq">ŞAGİRD</Badge>
        <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 21, margin: "6px 0 0", color: "#F3EEDF" }}>
          Tapşırıqlar və nəticəniz
        </h1>
      </Cover>
      <div
        style={{
          background: COLORS.paper,
          borderRadius: "0 0 6px 6px",
          padding: "22px 28px 32px",
          borderLeft: `1px solid ${COLORS.paperLine}`,
          borderRight: `1px solid ${COLORS.paperLine}`,
          borderBottom: `1px solid ${COLORS.paperLine}`,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && join()}
            placeholder="Forma kodunu daxil edin"
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 15,
              letterSpacing: 2,
              fontFamily: "'IBM Plex Sans', sans-serif",
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 4,
              background: "#fff",
              textTransform: "uppercase",
            }}
          />
          <Button variant="primary" onClick={join} disabled={loading}>
            {loading ? "Axtarılır…" : "Bax"}
          </Button>
        </div>
        {error && <p style={{ color: COLORS.red, fontSize: 13, marginBottom: 14 }}>{error}</p>}

        {form && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 6, padding: 20 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <Badge tone={form.type === "BSQ" ? "bsq" : "ksq"}>{form.type}</Badge>
              <h3 style={{ margin: 0, fontFamily: "'IBM Plex Serif', serif", fontSize: 17, color: COLORS.ink }}>{form.title}</h3>
            </div>
            <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: "0 0 16px" }}>
              {form.subject} · {form.grade}-ci sinif · maksimum {totalMax} bal
            </p>

            <ol style={{ margin: "0 0 20px", paddingLeft: 20 }}>
              {form.tasks.map((t) => (
                <li key={t.id} style={{ fontSize: 14, color: COLORS.ink, marginBottom: 8, lineHeight: 1.5 }}>
                  {t.text} <span style={{ color: COLORS.inkSoft, fontSize: 12 }}>({t.max} bal)</span>
                </li>
              ))}
            </ol>

            <div style={{ borderTop: `1px solid ${COLORS.paperLine}`, paddingTop: 16 }}>
              <p style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 8, fontWeight: 500 }}>
                Nəticənizi görmək üçün adınızı daxil edin:
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkResult()}
                  placeholder="Ad və soyad"
                  style={{
                    flex: 1,
                    padding: "9px 11px",
                    fontSize: 13,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    border: `1px solid ${COLORS.paperLine}`,
                    borderRadius: 4,
                    background: "#fff",
                  }}
                />
                <Button variant="gold" onClick={checkResult}>
                  Nəticəyə bax
                </Button>
              </div>
              {checked && <ResultBlock form={form} name={name} result={result} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ParentView({ onBack }) {
  const { code, setCode, form, error, loading, join } = useFormLookup();
  const [childName, setChildName] = useState("");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);

  const checkResult = async () => {
    if (!childName.trim() || !form) return;
    const r = (await storeGet(`ksqresults:${form.code}`, true)) || {};
    setResult(r[childName.trim()] || null);
    setChecked(true);
  };

  const totalMax = form ? form.tasks.reduce((s, t) => s + t.max, 0) : 0;

  return (
    <div>
      <Cover onBack={onBack}>
        <Badge tone="bsq">VALİDEYN</Badge>
        <h1 style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700, fontSize: 21, margin: "6px 0 0", color: "#F3EEDF" }}>
          Övladınızın nəticəsi
        </h1>
      </Cover>
      <div
        style={{
          background: COLORS.paper,
          borderRadius: "0 0 6px 6px",
          padding: "22px 28px 32px",
          borderLeft: `1px solid ${COLORS.paperLine}`,
          borderRight: `1px solid ${COLORS.paperLine}`,
          borderBottom: `1px solid ${COLORS.paperLine}`,
        }}
      >
        <p style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 14 }}>
          Müəllimin verdiyi forma kodunu və övladınızın adını daxil edin.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && join()}
            placeholder="Forma kodu"
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 15,
              letterSpacing: 2,
              fontFamily: "'IBM Plex Sans', sans-serif",
              border: `1px solid ${COLORS.paperLine}`,
              borderRadius: 4,
              background: "#fff",
              textTransform: "uppercase",
            }}
          />
          <Button variant="primary" onClick={join} disabled={loading}>
            {loading ? "Axtarılır…" : "Bax"}
          </Button>
        </div>
        {error && <p style={{ color: COLORS.red, fontSize: 13, marginBottom: 14 }}>{error}</p>}

        {form && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.paperLine}`, borderRadius: 6, padding: 20 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <Badge tone={form.type === "BSQ" ? "bsq" : "ksq"}>{form.type}</Badge>
              <h3 style={{ margin: 0, fontFamily: "'IBM Plex Serif', serif", fontSize: 17, color: COLORS.ink }}>{form.title}</h3>
            </div>
            <p style={{ fontSize: 13, color: COLORS.inkSoft, margin: "0 0 16px" }}>
              {form.subject} · {form.grade}-ci sinif · maksimum {totalMax} bal
            </p>

            <div style={{ borderTop: `1px solid ${COLORS.paperLine}`, paddingTop: 16 }}>
              <p style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 8, fontWeight: 500 }}>Övladınızın adı və soyadı:</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkResult()}
                  placeholder="Ad və soyad"
                  style={{
                    flex: 1,
                    padding: "9px 11px",
                    fontSize: 13,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    border: `1px solid ${COLORS.paperLine}`,
                    borderRadius: 4,
                    background: "#fff",
                  }}
                />
                <Button variant="gold" onClick={checkResult}>
                  Nəticəyə bax
                </Button>
              </div>
              {checked && <ResultBlock form={form} name={childName} result={result} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  useEffect(() => {
    ensureFonts();
  }, []);

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        background: COLORS.paper,
        minHeight: 480,
        borderRadius: 6,
        maxWidth: 840,
        margin: "0 auto",
      }}
    >
      {screen === "landing" && <Landing goTo={setScreen} />}
      {screen === "teacher" && <TeacherView onBack={() => setScreen("landing")} />}
      {screen === "student" && <StudentView onBack={() => setScreen("landing")} />}
      {screen === "parent" && <ParentView onBack={() => setScreen("landing")} />}
    </div>
  );
}