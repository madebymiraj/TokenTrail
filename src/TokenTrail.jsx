import { useState, useEffect, useRef } from "react";

// ─── Utility helpers ────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Data generators ────────────────────────────────────────────────────────
const TOTAL_BUDGET = 4200;

const layerCharges = [
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

const emotionalBreakdown = [
{ emotion: "Hopeful First Prompt", credits: 120, emoji: "✨" },
{ emotion: "Confident Iteration", credits: 340, emoji: "💪" },
{ emotion: "Mild Confusion", credits: 280, emoji: "🤔" },
{ emotion: "Frustrated Re-prompts", credits: 847, emoji: "😤" },
{ emotion: "Bargaining With AI", credits: 390, emoji: "🙏" },
{ emotion: "Acceptance & Despair", credits: 520, emoji: "😶" },
{ emotion: "Rage Clicking 'Try Again'", credits: 613, emoji: "🔥" },
{ emotion: "Existential Doubt", credits: 210, emoji: "🫠" },
];

const modelRoulette = [
{ model: "figma-make-standard-v3", label: "Standard", multiplier: "1x", cost: 1200, color: "#7CB9A8" },
{ model: "figma-make-enhanced-v2", label: "Enhanced (Auto-Selected)", multiplier: "2.4x", cost: 980, color: "#E8A87C" },
{ model: "figma-make-premium-turbo", label: "Premium Turbo™", multiplier: "4.7x", cost: 640, color: "#D4726A" },
{ model: "figma-make-mystery-v1", label: "Mystery Model (?)", multiplier: "???", cost: 500, color: "#C3B1E1" },
];

const costComparisons = [
{ item: "3.2 months of Netflix Premium", icon: "📺" },
{ item: "47 cups of oat milk cortados", icon: "☕" },
{ item: "A round-trip Greyhound ticket to nowhere", icon: "🚌" },
{ item: "1,260 penny gumballs", icon: "🫧" },
{ item: "Hiring a freelancer for 2 hours (who'd do it manually)", icon: "🧑‍💻" },
{ item: "8 months of the meditation app you never open", icon: "🧘" },
];

const loadingSteps = [
{ label: "Connecting to Figma API…", duration: 2200, detail: "Establishing secure handshake" },
{ label: "Reading prototype layers…", duration: 2800, detail: "Found 847 layers (this explains a lot)" },
{ label: "Intercepting credit telemetry…", duration: 2400, detail: "Decrypting usage fingerprints" },
{ label: "Cross-referencing model usage…", duration: 1800, detail: "Detecting unauthorized model switches" },
{ label: "Calculating emotional damage…", duration: 2600, detail: "Mapping frustration to credit burn rate" },
{ label: "Generating anxiety report…", duration: 1400, detail: "Almost done (we think)" },
{ label: "Preparing your results…", duration: 1800, detail: "You might want to sit down for this" },
];

function generateData(url) {
const used = rand(2800, 3900);
const remaining = TOTAL_BUDGET - used;
const confidence = rand(4, 18);
const anxiety = rand(82, 99);
const regretIndex = rand(7, 23);
const layers = [...layerCharges].sort(() => Math.random() - 0.5).slice(0, rand(6, 9));
const totalLayerCredits = layers.reduce((s, l) => s + l.credits, 0);
layers.forEach((l) => (l.pct = ((l.credits / totalLayerCredits) * 100).toFixed(1)));

const totalEmotional = emotionalBreakdown.reduce((s, e) => s + e.credits, 0);
const emotions = emotionalBreakdown.map((e) => ({ ...e, pct: ((e.credits / totalEmotional) * 100).toFixed(1) }));

const burnTimeline = Array.from({ length: 24 }, (_, i) => {
const base = used * (i / 23);
const jitter = rand(-40, 40);
return { hour: i, credits: Math.max(0, Math.min(used, Math.round(base + jitter))) };
});

const comparisons = [...costComparisons].sort(() => Math.random() - 0.5).slice(0, 4);

return { used, remaining, confidence, anxiety, regretIndex, layers, emotions, burnTimeline, comparisons };
}

// ─── Shared styles ──────────────────────────────────────────────────────────
const FONTS_LINK = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=JetBrains+Mono:wght@400;500&display=swap";

const PAGE_BG = {
minHeight: "100vh",
background: "linear-gradient(170deg, #FFF9F0 0%, #F5F0E8 50%, #EDE6DA 100%)",
fontFamily: "'DM Sans', -apple-system, sans-serif",
padding: 24,
};

// ─── Reusable UI components ─────────────────────────────────────────────────
function Card({ children }) {
return (
<div style={{
background: "#FFFDF9",
borderRadius: 16,
border: "1px solid #E8E2D9",
padding: "24px 28px",
boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
}}>
{children}
</div>
);
}

function Badge({ children, color = "#7CB9A8" }) {
return (
<span style={{
display: "inline-block",
background: color + "18",
color,
fontSize: 11,
fontWeight: 700,
padding: "3px 10px",
borderRadius: 100,
letterSpacing: 0.5,
textTransform: "uppercase",
}}>{children}</span>
);
}

function MiniBar({ pct, color = "#E8A87C" }) {
return (
<div style={{ width: "100%", height: 6, background: "#F0EBE3", borderRadius: 100, overflow: "hidden" }}>
<div style={{
width: ${Math.min(100, pct)}%,
height: "100%",
background: color,
borderRadius: 100,
transition: "width 1s ease",
}} />
</div>
);
}

function SectionTitle({ icon, title, subtitle }) {
return (
<div style={{ marginBottom: 18 }}>
<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
<span style={{ fontSize: 18 }}>{icon}</span>
<h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#3D3529", fontFamily: "'Fraunces', serif" }}>{title}</h3>
</div>
{subtitle && <p style={{ margin: 0, fontSize: 12.5, color: "#9E9585", lineHeight: 1.4 }}>{subtitle}</p>}
</div>
);
}

// ─── Phase: URL Input ───────────────────────────────────────────────────────
function InputPhase({ onSubmit }) {
const [url, setUrl] = useState("");
const [error, setError] = useState("");
const inputRef = useRef(null);

useEffect(() => { inputRef.current?.focus(); }, []);

const handleSubmit = () => {
if (!url.trim()) { setError("Paste a Figma prototype URL to get started."); return; }
if (!url.includes("figma.com")) { setError("That doesn't look like a Figma link. We need the real thing."); return; }
onSubmit(url.trim());
};

return (
<div style={{ ...PAGE_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
<link href={FONTS_LINK} rel="stylesheet" />
<div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
{/* Logo */}
<div style={{ marginBottom: 32 }}>
<div style={{
display: "inline-flex", alignItems: "center", gap: 10,
background: "#FFFDF9", padding: "10px 20px", borderRadius: 100,
border: "1px solid #E8E2D9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 24,
}}>
<span style={{ fontSize: 20 }}>🔥</span>
<span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18, color: "#3D3529" }}>TokenTrail</span>
<span style={{
fontSize: 9, fontWeight: 700, background: "#E8A87C", color: "white",
padding: "2px 7px", borderRadius: 100, letterSpacing: 0.5,
}}>BETA</span>
</div>
<h1 style={{
fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 800,
color: "#3D3529", lineHeight: 1.2, margin: "0 0 12px 0",
}}>
Finally understand where your<br />Figma Make credits <em style={{ fontStyle: "italic", color: "#D4726A" }}>actually</em> go.
</h1>
<p style={{
fontSize: 15, color: "#9E9585", lineHeight: 1.5, margin: 0,
maxWidth: 400, marginLeft: "auto", marginRight: "auto",
}}>
Paste your prototype link below. We'll intercept the credit telemetry and show you the truth they don't want you to see.
</p>
</div>

{/* Input */}    
    <Card>    
      <div style={{ textAlign: "left", marginBottom: 14 }}>    
        <label style={{    
          display: "block", fontSize: 12, fontWeight: 600, color: "#6B6358",    
          marginBottom: 8, letterSpacing: 0.3,    
        }}>FIGMA MAKE PROTOTYPE URL</label>    
        <input    
          ref={inputRef}    
          value={url}    
          onChange={(e) => { setUrl(e.target.value); setError(""); }}    
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}    
          placeholder="https://www.figma.com/proto/..."    
          style={{    
            width: "100%", padding: "14px 16px", fontSize: 14,    
            fontFamily: "'JetBrains Mono', monospace",    
            border: `1.5px solid ${error ? "#D4726A" : "#E8E2D9"}`,    
            borderRadius: 10, background: "#FAF7F2", color: "#3D3529",    
            outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",    
          }}    
          onFocus={(e) => (e.target.style.borderColor = error ? "#D4726A" : "#C3B1E1")}    
          onBlur={(e) => (e.target.style.borderColor = error ? "#D4726A" : "#E8E2D9")}    
        />    
        {error && <p style={{ fontSize: 12, color: "#D4726A", margin: "8px 0 0 0" }}>{error}</p>}    
      </div>    
      <button    
        onClick={handleSubmit}    
        style={{    
          width: "100%", padding: "14px 24px", fontSize: 15, fontWeight: 700,    
          fontFamily: "'DM Sans', sans-serif", color: "white",    
          background: "linear-gradient(135deg, #3D3529 0%, #5C5244 100%)",    
          border: "none", borderRadius: 10, cursor: "pointer",    
          transition: "transform 0.15s, box-shadow 0.15s",    
          boxShadow: "0 2px 8px rgba(61,53,41,0.2)",    
        }}    
        onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(61,53,41,0.25)"; }}    
        onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 2px 8px rgba(61,53,41,0.2)"; }}    
      >    
        🔍 Analyze Credit Usage    
      </button>    
      <p style={{ fontSize: 11.5, color: "#B8AFA3", margin: "14px 0 0 0", lineHeight: 1.4 }}>    
        Your link is processed securely. We don't store prototypes. Pinky promise.    
      </p>    
    </Card>    

    <p style={{ fontSize: 11, color: "#C8C0B4", marginTop: 28 }}>    
      TokenTrail v2.0.4 · Not affiliated with Figma · We just have questions    
    </p>    
  </div>    
</div>

);
}

// ─── Phase: Loading Theater ─────────────────────────────────────────────────
function LoadingPhase({ onComplete }) {
const [currentStep, setCurrentStep] = useState(0);
const [progress, setProgress] = useState(0);

useEffect(() => {
let cancelled = false;
async function run() {
for (let i = 0; i < loadingSteps.length; i++) {
if (cancelled) return;
setCurrentStep(i);
const step = loadingSteps[i];
const ticks = 20;
const tickDuration = step.duration / ticks;
for (let t = 0; t <= ticks; t++) {
if (cancelled) return;
await sleep(tickDuration);
setProgress(((i + t / ticks) / loadingSteps.length) * 100);
}
}
await sleep(600);
if (!cancelled) onComplete();
}
run();
return () => { cancelled = true; };
}, []);

const step = loadingSteps[currentStep] || loadingSteps[0];

return (
<div style={{ ...PAGE_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
<link href={FONTS_LINK} rel="stylesheet" />
<style>{@keyframes spin { to { transform: rotate(360deg) } } @keyframes pulse { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }}</style>
<div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
{/* Spinner */}
<div style={{
width: 64, height: 64, margin: "0 auto 20px",
border: "3px solid #E8E2D9", borderTopColor: "#E8A87C",
borderRadius: "50%", animation: "spin 0.9s linear infinite",
}} />

<h2 style={{    
      fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700,    
      color: "#3D3529", margin: "0 0 6px 0", minHeight: 30,    
    }}>{step.label}</h2>    
    <p style={{    
      fontSize: 13, color: "#9E9585", margin: "0 0 28px 0",    
      animation: "pulse 1.5s ease infinite",    
    }}>{step.detail}</p>    

    {/* Overall progress */}    
    <div style={{    
      width: "100%", height: 8, background: "#E8E2D9",    
      borderRadius: 100, overflow: "hidden", marginBottom: 12,    
    }}>    
      <div style={{    
        height: "100%", width: `${progress}%`,    
        background: "linear-gradient(90deg, #7CB9A8, #E8A87C)",    
        borderRadius: 100, transition: "width 0.3s ease",    
      }} />    
    </div>    

    {/* Step dots */}    
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>    
      {loadingSteps.map((_, i) => (    
        <div key={i} style={{    
          width: 8, height: 8, borderRadius: "50%",    
          background: i < currentStep ? "#7CB9A8" : i === currentStep ? "#E8A87C" : "#E8E2D9",    
          transition: "background 0.3s",    
        }} />    
      ))}    
    </div>    

    {/* Fake telemetry */}    
    <Card>    
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9E9585", textAlign: "left", lineHeight: 1.8 }}>    
        <div style={{ opacity: currentStep >= 0 ? 1 : 0.3 }}>→ Endpoint: figma.com/api/v1/telemetry</div>    
        <div style={{ opacity: currentStep >= 1 ? 1 : 0.3 }}>→ Layers parsed: {currentStep >= 1 ? "847" : "..."}</div>    
        <div style={{ opacity: currentStep >= 2 ? 1 : 0.3 }}>→ Credit events intercepted: {currentStep >= 2 ? "2,341" : "..."}</div>    
        <div style={{ opacity: currentStep >= 3 ? 1 : 0.3 }}>→ Model switches detected: {currentStep >= 3 ? "14 (yikes)" : "..."}</div>    
        <div style={{ opacity: currentStep >= 4 ? 1 : 0.3 }}>→ Emotional damage: {currentStep >= 4 ? "significant" : "..."}</div>    
        <div style={{ opacity: currentStep >= 5 ? 1 : 0.3 }}>→ Anxiety level: {currentStep >= 5 ? "📈 elevated" : "..."}</div>    
      </div>    
    </Card>    

    <p style={{ fontSize: 11, color: "#C8C0B4", marginTop: 20 }}>    
      ☕ This usually takes a moment. Maybe reflect on your design choices.    
    </p>    
  </div>    
</div>

);
}

// ─── Phase: Dashboard ───────────────────────────────────────────────────────
function Dashboard({ data }) {
const [revealStep, setRevealStep] = useState(0);
const [reportSent, setReportSent] = useState(false);

useEffect(() => {
const timers = [];
for (let i = 1; i <= 10; i++) {
timers.push(setTimeout(() => setRevealStep(i), i * 350));
}
return () => timers.forEach(clearTimeout);
}, []);

const pctUsed = ((data.used / TOTAL_BUDGET) * 100).toFixed(1);
const usedColor = data.used > 3500 ? "#D4726A" : data.used > 2500 ? "#E8A87C" : "#7CB9A8";

const sectionStyle = (step) => ({
opacity: revealStep >= step ? 1 : 0,
transform: revealStep >= step ? "translateY(0)" : "translateY(20px)",
transition: "opacity 0.5s ease, transform 0.5s ease",
});

return (
<div style={{ ...PAGE_BG, padding: "32px 20px 60px" }}>
<link href={FONTS_LINK} rel="stylesheet" />
<style>{@keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }}</style>
<div style={{ maxWidth: 720, margin: "0 auto" }}>

{/* Header */}    
    <div style={{ textAlign: "center", marginBottom: 36, ...sectionStyle(1) }}>    
      <div style={{    
        display: "inline-flex", alignItems: "center", gap: 10,    
        background: "#FFFDF9", padding: "8px 18px", borderRadius: 100,    
        border: "1px solid #E8E2D9", marginBottom: 16,    
      }}>    
        <span style={{ fontSize: 16 }}>🔥</span>    
        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 15, color: "#3D3529" }}>TokenTrail</span>    
        <Badge color="#7CB9A8">Report Ready</Badge>    
      </div>    
      <h1 style={{    
        fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 800,    
        color: "#3D3529", margin: "0 0 6px 0", lineHeight: 1.25,    
      }}>Your Credit Transparency Report</h1>    
      <p style={{ fontSize: 13, color: "#9E9585", margin: 0 }}>    
        Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · Analysis ID: TT-{rand(10000, 99999)}    
      </p>    
    </div>    

    {/* ── Budget Overview ── */}    
    <div style={sectionStyle(2)}>    
      <Card>    
        <SectionTitle icon="📊" title="Credit Budget Overview" subtitle="Your 4,200 credit allocation at a glance" />    
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>    
          {[    
            { label: "Total Budget", value: TOTAL_BUDGET.toLocaleString(), sub: "credits", color: "#3D3529" },    
            { label: "Credits Used", value: data.used.toLocaleString(), sub: `${pctUsed}% burned`, color: usedColor },    
            { label: "Remaining", value: data.remaining.toLocaleString(), sub: data.remaining < 500 ? "panic zone" : "ticking clock", color: data.remaining < 500 ? "#D4726A" : "#7CB9A8" },    
          ].map((stat, i) => (    
            <div key={i} style={{    
              flex: "1 1 140px", background: "#FAF7F2", borderRadius: 12,    
              padding: "16px 18px", border: "1px solid #E8E2D9",    
            }}>    
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9E9585", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{stat.label}</div>    
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>    
              <div style={{ fontSize: 11.5, color: "#B8AFA3", marginTop: 4 }}>{stat.sub}</div>    
            </div>    
          ))}    
        </div>    
        {/* Budget bar */}    
        <div style={{ position: "relative", height: 28, background: "#F0EBE3", borderRadius: 100, overflow: "hidden" }}>    
          <div style={{    
            position: "absolute", left: 0, top: 0, bottom: 0,    
            width: `${pctUsed}%`,    
            background: `linear-gradient(90deg, ${usedColor}CC, ${usedColor})`,    
            borderRadius: 100, transition: "width 1.5s ease",    
          }} />    
          <div style={{    
            position: "absolute", inset: 0,    
            display: "flex", alignItems: "center", justifyContent: "center",    
            fontSize: 11, fontWeight: 700, color: "#3D3529",    
            fontFamily: "'JetBrains Mono', monospace",    
          }}>{pctUsed}% of budget consumed</div>    
        </div>    
      </Card>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Confidence & Anxiety Row ── */}    
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", ...sectionStyle(3) }}>    
      <div style={{ flex: "1 1 300px" }}>    
        <Card>    
          <SectionTitle icon="🎯" title="Credit Confidence Score™" subtitle="How confident we are these charges are justified" />    
          <div style={{ textAlign: "center", padding: "8px 0" }}>    
            <div style={{    
              fontFamily: "'Fraunces', serif", fontSize: 56, fontWeight: 800,    
              color: "#D4726A", lineHeight: 1,    
            }}>{data.confidence}%</div>    
            <p style={{ fontSize: 12.5, color: "#9E9585", margin: "8px 0 0 0" }}>    
              {data.confidence < 10 ? "Basically guessing." : "Still basically guessing."}    
            </p>    
            <div style={{ marginTop: 12 }}><MiniBar pct={data.confidence} color="#D4726A" /></div>    
          </div>    
        </Card>    
      </div>    
      <div style={{ flex: "1 1 300px" }}>    
        <Card>    
          <SectionTitle icon="📈" title="Anxiety Meter" subtitle="Your projected stress level based on credit velocity" />    
          <div style={{ textAlign: "center", padding: "8px 0" }}>    
            <div style={{    
              fontFamily: "'Fraunces', serif", fontSize: 56, fontWeight: 800,    
              color: data.anxiety > 90 ? "#D4726A" : "#E8A87C", lineHeight: 1,    
            }}>{data.anxiety}%</div>    
            <p style={{ fontSize: 12.5, color: "#9E9585", margin: "8px 0 0 0" }}>    
              {data.anxiety > 90 ? "This is fine. Everything is fine. 🔥" : "Elevated, but you already knew that."}    
            </p>    
            <div style={{ marginTop: 12 }}><MiniBar pct={data.anxiety} color={data.anxiety > 90 ? "#D4726A" : "#E8A87C"} /></div>    
          </div>    
        </Card>    
      </div>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Credit Burn Timeline ── */}    
    <div style={sectionStyle(4)}>    
      <Card>    
        <SectionTitle icon="⏱️" title="Credit Burn Timeline" subtitle="Real-time credit consumption over your last session (24h)" />    
        <div style={{ position: "relative", height: 140, marginTop: 8 }}>    
          {/* Y axis labels */}    
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 20, width: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>    
            <span style={{ fontSize: 10, color: "#B8AFA3", fontFamily: "'JetBrains Mono', monospace" }}>{data.used}</span>    
            <span style={{ fontSize: 10, color: "#B8AFA3", fontFamily: "'JetBrains Mono', monospace" }}>0</span>    
          </div>    
          {/* Chart area */}    
          <div style={{ position: "absolute", left: 44, right: 0, top: 0, bottom: 20 }}>    
            <svg width="100%" height="100%" viewBox="0 0 600 120" preserveAspectRatio="none">    
              <defs>    
                <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">    
                  <stop offset="0%" stopColor="#E8A87C" stopOpacity="0.3" />    
                  <stop offset="100%" stopColor="#E8A87C" stopOpacity="0.02" />    
                </linearGradient>    
              </defs>    
              <path    
                d={`M${data.burnTimeline.map((p, i) => `${(i / 23) * 600},${120 - (p.credits / data.used) * 110}`).join(" L")} L600,120 L0,120 Z`}    
                fill="url(#burnGrad)"    
              />    
              <polyline    
                points={data.burnTimeline.map((p, i) => `${(i / 23) * 600},${120 - (p.credits / data.used) * 110}`).join(" ")}    
                fill="none" stroke="#E8A87C" strokeWidth="2.5"    
                strokeLinecap="round" strokeLinejoin="round"    
              />    
            </svg>    
          </div>    
          <div style={{ position: "absolute", left: 44, right: 0, bottom: 0, display: "flex", justifyContent: "space-between" }}>    
            {["12am", "6am", "12pm", "6pm", "11pm"].map((t) => (    
              <span key={t} style={{ fontSize: 10, color: "#B8AFA3", fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>    
            ))}    
          </div>    
        </div>    
        <p style={{ fontSize: 11.5, color: "#9E9585", margin: "12px 0 0 0", textAlign: "center" }}>    
          Notice the steep cliff at 2pm? That's when you tried "just one more iteration."    
        </p>    
      </Card>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Per-Layer Charges ── */}    
    <div style={sectionStyle(5)}>    
      <Card>    
        <SectionTitle icon="🧾" title="Per-Layer Credit Charges" subtitle="Where your credits went, layer by painful layer" />    
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>    
          {data.layers.map((l, i) => (    
            <div key={i} style={{    
              display: "flex", gap: 12, alignItems: "flex-start",    
              background: "#FAF7F2", borderRadius: 10, padding: "14px 16px",    
              border: "1px solid #F0EBE3",    
            }}>    
              <div style={{    
                minWidth: 44, height: 44, borderRadius: 10,    
                background: `hsl(${(i * 40) % 360}, 35%, 88%)`,    
                display: "flex", alignItems: "center", justifyContent: "center",    
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#6B6358",    
              }}>{l.pct}%</div>    
              <div style={{ flex: 1, minWidth: 0 }}>    
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>    
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#3D3529" }}>{l.layer}</span>    
                  <span style={{    
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,    
                    color: l.credits > 300 ? "#D4726A" : "#E8A87C", whiteSpace: "nowrap",    
                  }}>{l.credits} cr</span>    
                </div>    
                <p style={{ fontSize: 11.5, color: "#9E9585", margin: 0, lineHeight: 1.4 }}>{l.note}</p>    
              </div>    
            </div>    
          ))}    
        </div>    
      </Card>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Model Roulette ── */}    
    <div style={sectionStyle(6)}>    
      <Card>    
        <SectionTitle icon="🎰" title="Model Roulette™" subtitle="Which AI model was secretly used — and what it cost you" />    
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>    
          {modelRoulette.map((m, i) => (    
            <div key={i} style={{    
              flex: "1 1 140px", background: "#FAF7F2",    
              border: `1.5px solid ${m.color}44`, borderRadius: 12,    
              padding: "14px 16px", textAlign: "center",    
            }}>    
              <Badge color={m.color}>{m.multiplier}</Badge>    
              <div style={{    
                fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 800,    
                color: m.color, margin: "8px 0 4px",    
              }}>{m.cost}</div>    
              <div style={{ fontSize: 11, color: "#9E9585" }}>credits</div>    
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "#6B6358", marginTop: 8 }}>{m.label}</div>    
              {m.label.includes("Mystery") && (    
                <div style={{ fontSize: 10, color: "#C3B1E1", marginTop: 4, fontStyle: "italic" }}>    
                  We genuinely don't know what this is    
                </div>    
              )}    
            </div>    
          ))}    
        </div>    
        <p style={{ fontSize: 11.5, color: "#9E9585", margin: "14px 0 0 0", textAlign: "center" }}>    
          You were auto-switched to Premium Turbo™ 3 times without consent. But hey, it sounds fast.    
        </p>    
      </Card>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Credit Autopsy ── */}    
    <div style={sectionStyle(7)}>    
      <Card>    
        <SectionTitle icon="🧠" title="Credit Autopsy: By Emotional State" subtitle="Credits mapped to your likely emotional state during each prompt" />    
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>    
          {data.emotions.map((e, i) => (    
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>    
              <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{e.emoji}</span>    
              <div style={{ flex: 1 }}>    
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>    
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#3D3529" }}>{e.emotion}</span>    
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#9E9585" }}>{e.credits} cr ({e.pct}%)</span>    
                </div>    
                <MiniBar pct={parseFloat(e.pct) * 2.5} color={e.credits > 500 ? "#D4726A" : e.credits > 300 ? "#E8A87C" : "#7CB9A8"} />    
              </div>    
            </div>    
          ))}    
        </div>    
      </Card>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Regret Index + Cost Comparisons ── */}    
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", ...sectionStyle(8) }}>    
      <div style={{ flex: "1 1 280px" }}>    
        <Card>    
          <SectionTitle icon="😔" title="Figma Make Regret Index™" subtitle="How many times faster you could've done this manually" />    
          <div style={{ textAlign: "center", padding: "12px 0" }}>    
            <div style={{    
              fontFamily: "'Fraunces', serif", fontSize: 64, fontWeight: 800,    
              color: "#D4726A", lineHeight: 1,    
            }}>{data.regretIndex}x</div>    
            <p style={{ fontSize: 13, color: "#6B6358", margin: "10px 0 0 0", fontWeight: 500 }}>    
              faster if you'd just opened Figma and done it yourself    
            </p>    
            <p style={{ fontSize: 11.5, color: "#9E9585", margin: "6px 0 0 0" }}>    
              But then you wouldn't have "leveraged AI," which sounds great in standups.    
            </p>    
          </div>    
        </Card>    
      </div>    
      <div style={{ flex: "1 1 280px" }}>    
        <Card>    
          <SectionTitle icon="💸" title="Cost Equivalents" subtitle="What your credits could've bought instead" />    
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 0" }}>    
            {data.comparisons.map((c, i) => (    
              <div key={i} style={{    
                display: "flex", alignItems: "center", gap: 10,    
                background: "#FAF7F2", borderRadius: 8, padding: "10px 14px",    
              }}>    
                <span style={{ fontSize: 22 }}>{c.icon}</span>    
                <span style={{ fontSize: 13, color: "#3D3529", fontWeight: 500 }}>{c.item}</span>    
              </div>    
            ))}    
          </div>    
        </Card>    
      </div>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── Report to Figma ── */}    
    <div style={sectionStyle(9)}>    
      <Card>    
        <div style={{ textAlign: "center", padding: "8px 0" }}>    
          <h3 style={{    
            fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700,    
            color: "#3D3529", margin: "0 0 6px 0",    
          }}>📣 Demand Transparency</h3>    
          <p style={{ fontSize: 12.5, color: "#9E9585", margin: "0 0 16px 0", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>    
            Send your credit usage report directly to Figma's product team. They probably won't read it, but it'll feel good.    
          </p>    
          {!reportSent ? (    
            <button    
              onClick={() => setReportSent(true)}    
              style={{    
                padding: "14px 32px", fontSize: 14, fontWeight: 700,    
                fontFamily: "'DM Sans', sans-serif", color: "white",    
                background: "linear-gradient(135deg, #D4726A, #C25B54)",    
                border: "none", borderRadius: 10, cursor: "pointer",    
                boxShadow: "0 2px 12px rgba(212,114,106,0.3)",    
                transition: "transform 0.15s, box-shadow 0.15s",    
              }}    
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 20px rgba(212,114,106,0.35)"; }}    
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 2px 12px rgba(212,114,106,0.3)"; }}    
            >    
              🚨 Report to Figma    
            </button>    
          ) : (    
            <div style={{ animation: "fadeIn 0.5s ease" }}>    
              <div style={{    
                display: "inline-flex", alignItems: "center", gap: 8,    
                background: "#F0FAF5", border: "1px solid #7CB9A8", borderRadius: 10,    
                padding: "12px 24px", marginBottom: 8,    
              }}>    
                <span style={{ fontSize: 18 }}>✅</span>    
                <span style={{ fontSize: 14, fontWeight: 600, color: "#3D3529" }}>Report submitted successfully</span>    
              </div>    
              <p style={{ fontSize: 12, color: "#9E9585", margin: "8px 0 0 0" }}>    
                Just kidding. But wouldn't that be nice?    
              </p>    
            </div>    
          )}    
        </div>    
      </Card>    
    </div>    

    <div style={{ height: 20 }} />    

    {/* ── April Fools Reveal ── */}    
    <div style={sectionStyle(10)}>    
      <div style={{    
        background: "linear-gradient(135deg, #FFFDF9, #FFF5EB)",    
        borderRadius: 20, border: "2px dashed #E8A87C",    
        padding: "32px 28px", textAlign: "center",    
      }}>    
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>    
        <h2 style={{    
          fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 800,    
          color: "#3D3529", margin: "0 0 8px 0",    
        }}>Happy April Fools' Day!</h2>    
        <p style={{ fontSize: 14.5, color: "#6B6358", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 16px" }}>    
          None of this data is real. We didn't actually read your prototype. The "Credit Confidence Score" was always going to be low.    
        </p>    
        <p style={{ fontSize: 13, color: "#9E9585", lineHeight: 1.5, maxWidth: 400, margin: "0 auto 16px" }}>    
          But the frustration about credit transparency? <strong style={{ color: "#3D3529" }}>That part is 100% real.</strong>    
        </p>    
        <div style={{    
          display: "inline-block", background: "#FAF7F2",    
          border: "1px solid #E8E2D9", borderRadius: 10,    
          padding: "12px 20px", fontSize: 12.5, color: "#9E9585",    
        }}>    
          Made with love, personally sourced credits, and residual anxiety 🫡    
        </div>    
        <p style={{ fontSize: 11, color: "#C8C0B4", marginTop: 16 }}>    
          TokenTrail™ is not a real product. But honestly? Maybe it should be.    
        </p>    
      </div>    
    </div>    

    {/* Footer */}    
    <div style={{ textAlign: "center", marginTop: 32, ...sectionStyle(10) }}>    
      <p style={{ fontSize: 11, color: "#C8C0B4", lineHeight: 1.5 }}>    
        TokenTrail v2.0.4 · "Transparency is a feature, not a bug" · Not affiliated with Figma · Est. April 1st    
      </p>    
    </div>    
  </div>    
</div>

);
}

// ─── App Root ───────────────────────────────────────────────────────────────
export default function TokenTrail() {
const [phase, setPhase] = useState("input");
const [url, setUrl] = useState("");
const [data, setData] = useState(null);

const handleSubmit = (submittedUrl) => {
setUrl(submittedUrl);
setPhase("loading");
};

const handleLoadingComplete = () => {
setData(generateData(url));
setPhase("dashboard");
};

if (phase === "input") return <InputPhase onSubmit={handleSubmit} />;
if (phase === "loading") return <LoadingPhase onComplete={handleLoadingComplete} />;
return <Dashboard data={data} />;
}
