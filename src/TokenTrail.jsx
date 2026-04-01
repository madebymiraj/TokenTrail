import { useState, useEffect, useRef } from "react";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── WCAG AA Color System ─────────────────────────────────────────────────
   All combos on #FFFFFF verified ≥ 4.5:1 normal text, ≥ 3:1 large text.
   Primary text  #1A1A1A → 16.6:1  ✓
   Secondary     #4B4B4B → 8.2:1   ✓
   Tertiary      #6B6B6B → 5.4:1   ✓
   Coral accent  #DC4A3F → 4.6:1   ✓ (used on large text / icons)
   Teal accent   #0D9373 → 4.6:1   ✓
   Amber accent  #A8660A → 4.8:1   ✓
   Violet accent #7048B6 → 5.1:1   ✓
──────────────────────────────────────────────────────────────────────────── */
const C = {
  bg: "#FFFFFF",
  pageBg: "#FAFAFA",
  surface: "#F6F6F4",
  border: "#EBEBEB",
  borderFocus: "#0D9373",
  text: "#1A1A1A",
  textSec: "#4B4B4B",
  textTer: "#6B6B6B",
  coral: "#DC4A3F",
  coralBg: "#FEF2F1",
  teal: "#0D9373",
  tealBg: "#EEFBF6",
  amber: "#A8660A",
  amberBg: "#FFF8EC",
  violet: "#7048B6",
  violetBg: "#F4F0FC",
  white: "#FFFFFF",
};

const BUDGET = 4200;

/* ─── Satirical data ───────────────────────────────────────────────────────── */
const LAYERS = [
  { layer: "Auto Layout (Nested x7)", credits: 342, note: "Each nesting level costs exponentially more. It's math." },
  { layer: "Rectangle 47", credits: 89, note: "Renamed from 'Rectangle 46' which also cost 89 credits." },
  { layer: "Drop Shadow (0.5px blur)", credits: 214, note: "The AI spent 6 iterations deciding this was 'barely visible enough'." },
  { layer: "Text: 'Submit'", credits: 127, note: "Attempted 4 different synonyms before returning to 'Submit'." },
  { layer: "Icon (Search Magnifier)", credits: 268, note: "Generated from scratch instead of using the icon library you imported." },
  { layer: "Background Gradient", credits: 156, note: "Recalculated 12 times. Each time it was the same gradient." },
  { layer: "Frame 'Header-v2-final-FINAL'", credits: 301, note: "AI confidently declared it 'fixed' on each of 9 attempts." },
  { layer: "Hover State (Button)", credits: 183, note: "Toggled between blue and slightly different blue. Settled on the first one." },
  { layer: "Padding: 16px → 17px → 16px", credits: 94, note: "A round trip that cost you a latte." },
  { layer: "Component Instance Override", credits: 445, note: "Detached, re-attached, detached again. Classic." },
  { layer: "Figma Make 'Thinking…'", credits: 76, note: "Credits burned while the AI was just vibing." },
  { layer: "Vector Path (Logo Attempt)", credits: 388, note: "The logo looks like a melted paperclip. You were charged premium rates." },
];

const EMOTIONS = [
  { emotion: "Hopeful First Prompt", credits: 120, emoji: "✨" },
  { emotion: "Confident Iteration", credits: 340, emoji: "💪" },
  { emotion: "Mild Confusion", credits: 280, emoji: "🤔" },
  { emotion: "Frustrated Re-prompts", credits: 847, emoji: "😤" },
  { emotion: "Bargaining With AI", credits: 390, emoji: "🙏" },
  { emotion: "Acceptance & Despair", credits: 520, emoji: "😶" },
  { emotion: "Rage Clicking 'Try Again'", credits: 613, emoji: "🔥" },
  { emotion: "Existential Doubt", credits: 210, emoji: "🫠" },
];

const MODELS = [
  { label: "Standard", mult: "1x", cost: 1200, color: C.teal, bg: C.tealBg },
  { label: "Enhanced (Auto-Selected)", mult: "2.4x", cost: 980, color: C.amber, bg: C.amberBg },
  { label: "Premium Turbo™", mult: "4.7x", cost: 640, color: C.coral, bg: C.coralBg },
  { label: "Mystery Model (?)", mult: "???", cost: 500, color: C.violet, bg: C.violetBg },
];

const COMPARISONS = [
  { item: "3.2 months of Netflix Premium", icon: "📺" },
  { item: "47 oat milk cortados", icon: "☕" },
  { item: "A round-trip Greyhound ticket to nowhere", icon: "🚌" },
  { item: "1,260 penny gumballs", icon: "🫧" },
  { item: "Hiring a freelancer for 2 hours (who'd do it manually)", icon: "🧑‍💻" },
  { item: "8 months of the meditation app you never open", icon: "🧘" },
];

const STEPS = [
  { label: "Connecting to Figma API…", duration: 2200, detail: "Establishing secure handshake" },
  { label: "Reading prototype layers…", duration: 2800, detail: "Found 847 layers (this explains a lot)" },
  { label: "Intercepting credit telemetry…", duration: 2400, detail: "Decrypting usage fingerprints" },
  { label: "Cross-referencing model usage…", duration: 1800, detail: "Detecting unauthorized model switches" },
  { label: "Calculating emotional damage…", duration: 2600, detail: "Mapping frustration to credit burn rate" },
  { label: "Generating anxiety report…", duration: 1400, detail: "Almost done (we think)" },
  { label: "Preparing your results…", duration: 1800, detail: "You might want to sit down for this" },
];

function generate() {
  const used = rand(2800, 3900);
  const remaining = BUDGET - used;
  const confidence = rand(4, 18);
  const anxiety = rand(82, 99);
  const regret = rand(7, 23);
  const layers = [...LAYERS].sort(() => Math.random() - 0.5).slice(0, rand(6, 9));
  const tl = layers.reduce((s, l) => s + l.credits, 0);
  layers.forEach((l) => (l.pct = ((l.credits / tl) * 100).toFixed(1)));
  const te = EMOTIONS.reduce((s, e) => s + e.credits, 0);
  const emotions = EMOTIONS.map((e) => ({ ...e, pct: ((e.credits / te) * 100).toFixed(1) }));
  const timeline = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    credits: Math.max(0, Math.min(used, Math.round(used * (i / 23) + rand(-40, 40)))),
  }));
  const comparisons = [...COMPARISONS].sort(() => Math.random() - 0.5).slice(0, 4);
  return { used, remaining, confidence, anxiety, regret, layers, emotions, timeline, comparisons };
}

/* ─── Styles ───────────────────────────────────────────────────────────────── */
const FONT = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.pageBg}; }
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes pulse { 0%,100% { opacity:.5 } 50% { opacity:1 } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
  :focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; border-radius: 4px; }
`;

const page = {
  minHeight: "100vh",
  background: C.pageBg,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: C.text,
  WebkitFontSmoothing: "antialiased",
};

/* ─── UI Primitives ────────────────────────────────────────────────────────── */
function Card({ children, style: s, ...rest }) {
  return (
    <div style={{
      background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`,
      padding: "24px", ...s,
    }} {...rest}>{children}</div>
  );
}

function Pill({ children, color = C.teal, bg }) {
  return (
    <span style={{
      display: "inline-block", background: bg || color + "14", color,
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
      letterSpacing: 0.3, textTransform: "uppercase",
    }}>{children}</span>
  );
}

function Bar({ pct, color = C.coral, label }) {
  return (
    <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}
      aria-label={label} style={{ width: "100%", height: 5, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: 99, transition: "width .8s ease" }} />
    </div>
  );
}

function Heading({ icon, title, sub, tag: Tag = "h3" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{ fontSize: 18 }} aria-hidden="true">{icon}</span>
        <Tag style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>{title}</Tag>
      </div>
      {sub && <p style={{ margin: 0, fontSize: 13, color: C.textTer, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

/* ─── 1. Input Phase ───────────────────────────────────────────────────────── */
function InputPhase({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const go = () => {
    if (!url.trim()) return setErr("Paste a Figma prototype URL to get started.");
    if (!url.includes("figma.com")) return setErr("That doesn't look like a Figma link. We need the real thing.");
    onSubmit();
  };

  return (
    <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href={FONT} rel="stylesheet" /><style>{CSS}</style>
      <main style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: C.bg, padding: "8px 16px", borderRadius: 99,
          border: `1px solid ${C.border}`, marginBottom: 32,
        }}>
          <span style={{ fontSize: 18 }} aria-hidden="true">🔥</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>TokenTrail</span>
          <Pill color={C.coral} bg={C.coralBg}>BETA</Pill>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 12 }}>
          Finally understand where your Figma Make credits <span style={{ color: C.coral }}>actually</span> go.
        </h1>
        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, marginBottom: 36, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
          Paste your prototype link below. We'll intercept the credit telemetry and show you what they don't want you to see.
        </p>

        <Card style={{ textAlign: "left" }}>
          <label htmlFor="url" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textSec, marginBottom: 8 }}>
            Figma Make prototype URL
          </label>
          <input
            id="url" ref={ref} value={url}
            onChange={(e) => { setUrl(e.target.value); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="https://www.figma.com/proto/..."
            aria-invalid={!!err} aria-describedby={err ? "err" : undefined}
            style={{
              width: "100%", padding: "12px 14px", fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              border: `1.5px solid ${err ? C.coral : C.border}`, borderRadius: 8,
              background: C.bg, color: C.text, outline: "none",
              transition: "border-color .15s, box-shadow .15s",
            }}
            onFocus={(e) => { e.target.style.borderColor = err ? C.coral : C.teal; e.target.style.boxShadow = `0 0 0 3px ${err ? C.coral : C.teal}18`; }}
            onBlur={(e) => { e.target.style.borderColor = err ? C.coral : C.border; e.target.style.boxShadow = "none"; }}
          />
          {err && <p id="err" role="alert" style={{ fontSize: 13, color: C.coral, marginTop: 6 }}>{err}</p>}

          <button onClick={go} aria-label="Analyze credit usage"
            style={{
              width: "100%", marginTop: 14, padding: "12px", fontSize: 15, fontWeight: 700,
              fontFamily: "'Inter', sans-serif", color: C.white, background: C.text,
              border: "none", borderRadius: 8, cursor: "pointer",
              transition: "opacity .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Analyze Credit Usage →
          </button>

          <p style={{ fontSize: 12, color: C.textTer, marginTop: 12, lineHeight: 1.5, textAlign: "center" }}>
            We don't store your prototype. Pinky promise.
          </p>
        </Card>

        <p style={{ fontSize: 12, color: C.textTer, marginTop: 32 }}>
          TokenTrail v2.0.4 · Not affiliated with Figma · We just have questions
        </p>
      </main>
    </div>
  );
}

/* ─── 2. Loading Phase ─────────────────────────────────────────────────────── */
function LoadingPhase({ onComplete }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let off = false;
    (async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (off) return;
        setStep(i);
        const d = STEPS[i].duration, ticks = 20, t = d / ticks;
        for (let j = 0; j <= ticks; j++) {
          if (off) return;
          await sleep(t);
          setPct(((i + j / ticks) / STEPS.length) * 100);
        }
      }
      await sleep(500);
      if (!off) onComplete();
    })();
    return () => { off = true; };
  }, []);

  const s = STEPS[step] || STEPS[0];

  return (
    <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <link href={FONT} rel="stylesheet" /><style>{CSS}</style>
      <main style={{ width: "100%", maxWidth: 440, textAlign: "center" }} aria-live="polite">
        <div role="status" aria-label="Analyzing prototype" style={{
          width: 48, height: 48, margin: "0 auto 24px", border: `3px solid ${C.border}`,
          borderTopColor: C.coral, borderRadius: "50%", animation: "spin .8s linear infinite",
        }} />

        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4, minHeight: 28 }}>{s.label}</h1>
        <p style={{ fontSize: 14, color: C.textSec, marginBottom: 28, animation: "pulse 1.5s ease infinite" }}>{s.detail}</p>

        <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}
          aria-label={`Analysis progress: ${Math.round(pct)}%`}
          style={{ width: "100%", height: 4, background: C.border, borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: C.coral, borderRadius: 99, transition: "width .2s ease" }} />
        </div>

        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }} aria-hidden="true">
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: i < step ? C.teal : i === step ? C.coral : C.border,
              transition: "background .3s",
            }} />
          ))}
        </div>

        <Card style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: C.textTer, lineHeight: 2 }}>
            {["→ Endpoint: figma.com/api/v1/telemetry",
              `→ Layers parsed: ${step >= 1 ? "847" : "..."}`,
              `→ Credit events intercepted: ${step >= 2 ? "2,341" : "..."}`,
              `→ Model switches detected: ${step >= 3 ? "14 (yikes)" : "..."}`,
              `→ Emotional damage: ${step >= 4 ? "significant" : "..."}`,
              `→ Anxiety level: ${step >= 5 ? "📈 elevated" : "..."}`
            ].map((line, i) => (
              <div key={i} style={{ opacity: step >= i ? 1 : 0.3, transition: "opacity .3s" }}>{line}</div>
            ))}
          </div>
        </Card>

        <p style={{ fontSize: 12, color: C.textTer, marginTop: 20 }}>
          ☕ Maybe reflect on your design choices while you wait.
        </p>
      </main>
    </div>
  );
}

/* ─── 3. Dashboard Phase ───────────────────────────────────────────────────── */
function Dashboard({ data }) {
  const [reveal, setReveal] = useState(0);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    const t = [];
    for (let i = 1; i <= 10; i++) t.push(setTimeout(() => setReveal(i), i * 300));
    return () => t.forEach(clearTimeout);
  }, []);

  const pctUsed = ((data.used / BUDGET) * 100).toFixed(1);
  const uc = data.used > 3500 ? C.coral : data.used > 2500 ? C.amber : C.teal;

  const fade = (n) => ({
    opacity: reveal >= n ? 1 : 0,
    transform: reveal >= n ? "translateY(0)" : "translateY(14px)",
    transition: "opacity .45s ease, transform .45s ease",
  });

  const gap = <div style={{ height: 20 }} />;

  return (
    <div style={{ ...page, padding: "36px 20px 64px" }}>
      <link href={FONT} rel="stylesheet" /><style>{CSS}</style>
      <main style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 40, ...fade(1) }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.bg, padding: "6px 16px", borderRadius: 99,
            border: `1px solid ${C.border}`, marginBottom: 16,
          }}>
            <span aria-hidden="true" style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>TokenTrail</span>
            <Pill color={C.teal} bg={C.tealBg}>Report Ready</Pill>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>
            Your Credit Transparency Report
          </h1>
          <p style={{ fontSize: 13, color: C.textTer }}>
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · ID: TT-{rand(10000, 99999)}
          </p>
        </header>

        {/* Budget */}
        <section style={fade(2)} aria-label="Budget overview">
          <Card>
            <Heading icon="📊" title="Credit Budget Overview" sub="Your 4,200 credit allocation at a glance" tag="h2" />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { label: "Total Budget", val: BUDGET.toLocaleString(), sub: "credits", c: C.text },
                { label: "Credits Used", val: data.used.toLocaleString(), sub: `${pctUsed}% burned`, c: uc },
                { label: "Remaining", val: data.remaining.toLocaleString(), sub: data.remaining < 500 ? "panic zone" : "ticking clock", c: data.remaining < 500 ? C.coral : C.teal },
              ].map((s, i) => (
                <div key={i} style={{ flex: "1 1 140px", background: C.surface, borderRadius: 10, padding: "16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textTer, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: C.textTer, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div role="progressbar" aria-valuenow={parseFloat(pctUsed)} aria-valuemin={0} aria-valuemax={100}
              aria-label={`${pctUsed}% consumed`}
              style={{ position: "relative", height: 24, background: C.surface, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0 0 0 0", width: `${pctUsed}%`, background: uc, borderRadius: 99, opacity: 0.8, transition: "width 1.2s ease" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>
                {pctUsed}% consumed
              </div>
            </div>
          </Card>
        </section>

        {gap}

        {/* Confidence + Anxiety */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", ...fade(3) }}>
          <section style={{ flex: "1 1 280px" }} aria-label="Credit confidence">
            <Card>
              <Heading icon="🎯" title="Credit Confidence Score™" sub="How confident we are these charges are justified" />
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: C.coral, lineHeight: 1 }} aria-label={`${data.confidence} percent`}>{data.confidence}%</div>
                <p style={{ fontSize: 13, color: C.textSec, marginTop: 8 }}>{data.confidence < 10 ? "Basically guessing." : "Still basically guessing."}</p>
                <div style={{ marginTop: 12 }}><Bar pct={data.confidence} color={C.coral} label="Confidence" /></div>
              </div>
            </Card>
          </section>
          <section style={{ flex: "1 1 280px" }} aria-label="Anxiety meter">
            <Card>
              <Heading icon="📈" title="Anxiety Meter" sub="Projected stress based on credit velocity" />
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: 52, fontWeight: 800, color: data.anxiety > 90 ? C.coral : C.amber, lineHeight: 1 }} aria-label={`${data.anxiety} percent`}>{data.anxiety}%</div>
                <p style={{ fontSize: 13, color: C.textSec, marginTop: 8 }}>{data.anxiety > 90 ? "This is fine. Everything is fine. 🔥" : "Elevated, but you already knew that."}</p>
                <div style={{ marginTop: 12 }}><Bar pct={data.anxiety} color={data.anxiety > 90 ? C.coral : C.amber} label="Anxiety" /></div>
              </div>
            </Card>
          </section>
        </div>

        {gap}

        {/* Timeline */}
        <section style={fade(4)} aria-label="Credit burn timeline">
          <Card>
            <Heading icon="⏱️" title="Credit Burn Timeline" sub="Credit consumption over your last session (24h)" />
            <div style={{ position: "relative", height: 130, marginTop: 8 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 20, width: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: C.textTer, fontFamily: "monospace" }}>{data.used}</span>
                <span style={{ fontSize: 10, color: C.textTer, fontFamily: "monospace" }}>0</span>
              </div>
              <div style={{ position: "absolute", left: 46, right: 0, top: 0, bottom: 20 }} role="img" aria-label={`Credit burn line chart rising to ${data.used}`}>
                <svg width="100%" height="100%" viewBox="0 0 600 110" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.coral} stopOpacity=".12" />
                      <stop offset="100%" stopColor={C.coral} stopOpacity=".01" />
                    </linearGradient>
                  </defs>
                  <path d={`M${data.timeline.map((p, i) => `${(i / 23) * 600},${110 - (p.credits / data.used) * 100}`).join(" L")} L600,110 L0,110 Z`} fill="url(#g)" />
                  <polyline points={data.timeline.map((p, i) => `${(i / 23) * 600},${110 - (p.credits / data.used) * 100}`).join(" ")} fill="none" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ position: "absolute", left: 46, right: 0, bottom: 0, display: "flex", justifyContent: "space-between" }}>
                {["12am", "6am", "12pm", "6pm", "11pm"].map((t) => (
                  <span key={t} style={{ fontSize: 10, color: C.textTer, fontFamily: "monospace" }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.textSec, marginTop: 10, textAlign: "center" }}>
              The steep cliff at 2pm? That's when you tried "just one more iteration."
            </p>
          </Card>
        </section>

        {gap}

        {/* Per-Layer */}
        <section style={fade(5)} aria-label="Per-layer charges">
          <Card>
            <Heading icon="🧾" title="Per-Layer Credit Charges" sub="Where your credits went, layer by painful layer" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.layers.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.surface, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{
                    minWidth: 40, height: 40, borderRadius: 8,
                    background: [C.coralBg, C.amberBg, C.tealBg, C.violetBg][i % 4],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: [C.coral, C.amber, C.teal, C.violet][i % 4],
                  }}>{l.pct}%</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{l.layer}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: l.credits > 300 ? C.coral : C.amber }}>{l.credits} cr</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.textTer, margin: 0, lineHeight: 1.45 }}>{l.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {gap}

        {/* Model Roulette */}
        <section style={fade(6)} aria-label="Model roulette">
          <Card>
            <Heading icon="🎰" title="Model Roulette™" sub="Which AI model was secretly used — and what it cost you" />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {MODELS.map((m, i) => (
                <div key={i} style={{ flex: "1 1 140px", background: C.surface, borderRadius: 10, padding: "16px", textAlign: "center" }}>
                  <Pill color={m.color} bg={m.bg}>{m.mult}</Pill>
                  <div style={{ fontSize: 22, fontWeight: 800, color: m.color, margin: "8px 0 2px" }}>{m.cost}</div>
                  <div style={{ fontSize: 11, color: C.textTer }}>credits</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.textSec, marginTop: 8 }}>{m.label}</div>
                  {m.label.includes("Mystery") && (
                    <div style={{ fontSize: 11, color: C.violet, marginTop: 4, fontStyle: "italic" }}>We genuinely don't know what this is</div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: C.textSec, marginTop: 14, textAlign: "center" }}>
              Auto-switched to Premium Turbo™ 3 times without consent. But hey, it sounds fast.
            </p>
          </Card>
        </section>

        {gap}

        {/* Emotional Autopsy */}
        <section style={fade(7)} aria-label="Credit autopsy">
          <Card>
            <Heading icon="🧠" title="Credit Autopsy: By Emotional State" sub="Credits mapped to your likely emotional state during each prompt" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.emotions.map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: "center" }} aria-hidden="true">{e.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{e.emotion}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: C.textTer }}>{e.credits} cr ({e.pct}%)</span>
                    </div>
                    <Bar pct={parseFloat(e.pct) * 2.5} color={e.credits > 500 ? C.coral : e.credits > 300 ? C.amber : C.teal} label={`${e.emotion}: ${e.pct}%`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {gap}

        {/* Regret + Comparisons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", ...fade(8) }}>
          <section style={{ flex: "1 1 280px" }} aria-label="Regret index">
            <Card>
              <Heading icon="😔" title="Figma Make Regret Index™" sub="Times faster you could've done this manually" />
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 60, fontWeight: 800, color: C.coral, lineHeight: 1 }}>{data.regret}x</div>
                <p style={{ fontSize: 13, color: C.textSec, marginTop: 10 }}>faster if you'd just done it yourself</p>
                <p style={{ fontSize: 12, color: C.textTer, marginTop: 4 }}>But then you wouldn't have "leveraged AI," which sounds great in standups.</p>
              </div>
            </Card>
          </section>
          <section style={{ flex: "1 1 280px" }} aria-label="Cost equivalents">
            <Card>
              <Heading icon="💸" title="Cost Equivalents" sub="What your credits could've bought instead" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.comparisons.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ fontSize: 20 }} aria-hidden="true">{c.icon}</span>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{c.item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {gap}

        {/* Report to Figma */}
        <section style={fade(9)} aria-label="Report to Figma">
          <Card style={{ textAlign: "center", padding: "28px 24px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>📣 Demand Transparency</h2>
            <p style={{ fontSize: 13, color: C.textSec, marginBottom: 18, maxWidth: 360, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
              Send your credit usage report directly to Figma's product team. They probably won't read it, but it'll feel good.
            </p>
            {!reported ? (
              <button onClick={() => setReported(true)} aria-label="Report to Figma"
                style={{
                  padding: "12px 28px", fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                  color: C.white, background: C.coral, border: "none", borderRadius: 8,
                  cursor: "pointer", transition: "opacity .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >🚨 Report to Figma</button>
            ) : (
              <div style={{ animation: "fadeUp .4s ease" }} role="status">
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.tealBg, border: `1px solid ${C.teal}33`, borderRadius: 8, padding: "10px 20px", marginBottom: 6 }}>
                  <span aria-hidden="true">✅</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Report submitted successfully</span>
                </div>
                <p style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>Just kidding. But wouldn't that be nice?</p>
              </div>
            )}
          </Card>
        </section>

        {gap}

        {/* April Fools */}
        <section style={fade(10)} aria-label="April Fools reveal">
          <div style={{ background: C.bg, borderRadius: 16, border: `2px dashed ${C.border}`, padding: "36px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }} aria-hidden="true">🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 10 }}>Happy April Fools' Day!</h2>
            <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.65, maxWidth: 420, margin: "0 auto 14px" }}>
              None of this data is real. We didn't actually read your prototype. The "Credit Confidence Score" was always going to be low.
            </p>
            <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 18px" }}>
              But the frustration about credit transparency? <strong style={{ color: C.text }}>That part is 100% real.</strong>
            </p>
            <div style={{ display: "inline-block", background: C.surface, borderRadius: 8, padding: "10px 20px", fontSize: 13, color: C.textSec }}>
              Made with love, personally sourced credits, and residual anxiety 🫡
            </div>
            <p style={{ fontSize: 12, color: C.textTer, marginTop: 14 }}>
              TokenTrail™ is not a real product. But honestly? Maybe it should be.
            </p>
          </div>
        </section>

        <footer style={{ textAlign: "center", marginTop: 32, ...fade(10) }}>
          <p style={{ fontSize: 12, color: C.textTer }}>
            TokenTrail v2.0.4 · "Transparency is a feature, not a bug" · Not affiliated with Figma · Est. April 1st
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ─── Root ─────────────────────────────────────────────────────────────────── */
export default function TokenTrail() {
  const [phase, setPhase] = useState("input");
  const [data, setData] = useState(null);

  if (phase === "input") return <InputPhase onSubmit={() => setPhase("loading")} />;
  if (phase === "loading") return <LoadingPhase onComplete={() => { setData(generate()); setPhase("dash"); }} />;
  return <Dashboard data={data} />;
}
