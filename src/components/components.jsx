/* Shared UI components — exported to window */
const { Icon } = window;

/* ---------- Avatar ---------- */
function Avatar({ name = "?", size = 32, color }) {
  const colors = window.DATA.avatarColors;
  const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  const c = color || colors[(name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0)) % colors.length];
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: c }}>
      {initials}
    </div>
  );
}

/* ---------- Badge ---------- */
function Badge({ children, variant = "neutral", dot }) {
  return <span className={`badge badge-${variant}`}>{dot && <span className="dot" />}{children}</span>;
}
const STATUS_MAP = {
  active: ["green", "Active"], sending: ["green", "Sending"], paused: ["amber", "Paused"],
  draft: ["neutral", "Draft"], scheduled: ["blue", "Scheduled"], completed: ["accent", "Completed"],
  published: ["green", "Published"],
};
function StatusBadge({ status }) {
  const [v, label] = STATUS_MAP[status] || ["neutral", status];
  return <Badge variant={v} dot={status === "active" || status === "sending"}>{label}</Badge>;
}

/* ---------- Button ---------- */
function Button({ children, variant = "secondary", size, icon, iconRight, onClick, disabled, style, title }) {
  const cls = `btn btn-${variant}${size ? " btn-" + size : ""}${!children && icon ? " btn-icon" : ""}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style} title={title}>
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 14 : 16} />}
    </button>
  );
}

/* ---------- KPI / Stat card ---------- */
function StatCard({ label, value, delta, deltaDir, icon, accent, sub, spark }) {
  return (
    <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
        {icon && (
          <div style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center",
            background: accent ? "var(--accent-50)" : "var(--surface-3)", color: accent ? "var(--accent)" : "var(--text-3)" }}>
            <Icon name={icon} size={16} />
          </div>
        )}
      </div>
      <div className="row" style={{ alignItems: "baseline", gap: 9 }}>
        <span className="kpi-val">{value}</span>
        {delta != null && (
          <span className={`delta ${deltaDir === "down" ? "down" : "up"}`}>
            <Icon name={deltaDir === "down" ? "arrowDown" : "arrowUp"} size={12} strokeWidth={2.4} />{delta}
          </span>
        )}
      </div>
      {(sub || spark) && (
        <div className="row" style={{ justifyContent: "space-between", marginTop: 2 }}>
          {sub && <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>{sub}</span>}
          {spark && <Sparkline data={spark} />}
        </div>
      )}
    </div>
  );
}

/* ---------- Sparkline ---------- */
function Sparkline({ data, w = 78, h = 26, color = "var(--accent)" }) {
  const max = Math.max(...data), min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * (h - 4) - 2}`);
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="2.4" fill={color} />
    </svg>
  );
}

/* ---------- Bar chart (grouped) ---------- */
function BarChart({ series, height = 150, labels }) {
  // series: [{name,color,data:[]}]
  const n = series[0].data.length;
  const max = Math.max(...series.flatMap(s => s.data)) || 1;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 0, height, padding: "0 2px" }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: "100%" }}>
            {series.map((s, si) => (
              <div key={si} title={`${s.name}: ${s.data[i]}`}
                style={{ width: series.length > 1 ? 7 : "62%", maxWidth: 18, height: `${(s.data[i] / max) * 100}%`,
                  background: s.color, borderRadius: "4px 4px 2px 2px", transition: "height .5s cubic-bezier(.22,1,.36,1)", minHeight: 2 }} />
            ))}
          </div>
        ))}
      </div>
      {labels && (
        <div style={{ display: "flex", marginTop: 7 }}>
          {labels.map((l, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10.5, color: "var(--text-4)" }}>{l}</div>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Area / line chart ---------- */
function AreaChart({ data, height = 170, color = "var(--accent)", labels }) {
  const w = 600;
  const max = Math.max(...data) * 1.12 || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - (v / max) * height]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;
  const id = "ag" + Math.round(max);
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(g => <line key={g} x1="0" x2={w} y1={height * g} y2={height * g} stroke="var(--border)" strokeWidth="1" />)}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => i === pts.length - 1 && <circle key={i} cx={p[0]} cy={p[1]} r="3.6" fill={color} stroke="#fff" strokeWidth="2" />)}
      </svg>
      {labels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10.5, color: "var(--text-4)" }}>
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Donut ring ---------- */
function Donut({ value, size = 96, stroke = 11, color = "var(--accent)", track = "var(--surface-3)", label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .7s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: size * 0.24, fontWeight: 650, letterSpacing: "-.02em" }}>{label}</div>
          {sub && <div style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: -2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Funnel ---------- */
function Funnel({ steps }) {
  // steps: [{label, value, color}]
  const max = Math.max(...steps.map(s => s.value)) || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s, i) => {
        const pct = (s.value / max) * 100;
        const conv = i > 0 ? Math.round((s.value / steps[i - 1].value) * 100) : 100;
        return (
          <div key={i}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: "var(--fs-sm)", fontWeight: 500, color: "var(--text-2)" }}>{s.label}</span>
              <span className="row" style={{ gap: 8 }}>
                <span className="mono" style={{ fontSize: "var(--fs-sm)", fontWeight: 600 }}>{s.value.toLocaleString()}</span>
                {i > 0 && <span style={{ fontSize: 11, color: "var(--text-4)", width: 38, textAlign: "right" }}>{conv}%</span>}
              </span>
            </div>
            <div style={{ height: 9, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: s.color || "var(--accent)", borderRadius: 99,
                transition: "width .6s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Progress bar ---------- */
function Progress({ value, color = "var(--accent)", height = 7 }) {
  return (
    <div style={{ height, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: color, borderRadius: 99, transition: "width .5s ease" }} />
    </div>
  );
}

/* ---------- Toggle ---------- */
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 38, height: 22, borderRadius: 99, border: "none", padding: 2, cursor: "pointer",
      background: on ? "var(--accent)" : "var(--border-2)", transition: "background .18s", display: "flex" }}>
      <span style={{ width: 18, height: 18, borderRadius: 99, background: "#fff", boxShadow: "var(--sh-sm)",
        transform: on ? "translateX(16px)" : "none", transition: "transform .18s" }} />
    </button>
  );
}

/* ---------- Segmented sub-nav ---------- */
function SubNav({ items, value, onChange }) {
  return (
    <div className="subnav">
      {items.map(it => (
        <button key={it.id} className={`subnav-item${value === it.id ? " active" : ""}`} onClick={() => onChange(it.id)}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Pill tabs ---------- */
function PillTabs({ items, value, onChange }) {
  return (
    <div className="pill-tab">
      {items.map(it => (
        <button key={it.id} className={value === it.id ? "on" : ""} onClick={() => onChange(it.id)}>{it.label}</button>
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({ icon, title, desc, action }) {
  return (
    <div style={{ textAlign: "center", padding: "54px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--surface-3)", display: "grid", placeItems: "center", color: "var(--text-4)", marginBottom: 6 }}>
        <Icon name={icon} size={24} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
      {desc && <div style={{ color: "var(--text-3)", fontSize: "var(--fs-sm)", maxWidth: 320 }}>{desc}</div>}
      {action && <div style={{ marginTop: 10 }}>{action}</div>}
    </div>
  );
}

/* ---------- Tag input chip ---------- */
function Chip({ children, onRemove, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 4px 0 10px",
      borderRadius: 99, background: "var(--surface-3)", fontSize: 12.5, fontWeight: 500, color: "var(--text-2)" }}>
      {color && <span style={{ width: 7, height: 7, borderRadius: 99, background: color }} />}
      {children}
      {onRemove && (
        <button onClick={onRemove} style={{ border: "none", background: "transparent", display: "grid", placeItems: "center",
          width: 18, height: 18, borderRadius: 99, color: "var(--text-3)", padding: 0 }}>
          <Icon name="x" size={12} />
        </button>
      )}
    </span>
  );
}

/* ---------- Token / merge-field chip used in editors ---------- */
function Token({ children }) {
  return <span className="mono" style={{ background: "var(--accent-50)", color: "var(--accent-700)", borderRadius: 5, padding: "1px 5px", fontSize: ".92em", fontWeight: 500 }}>{children}</span>;
}

Object.assign(window, {
  Avatar, Badge, StatusBadge, Button, StatCard, Sparkline, BarChart, AreaChart,
  Donut, Funnel, Progress, Toggle, SubNav, PillTabs, EmptyState, Chip, Token,
});
