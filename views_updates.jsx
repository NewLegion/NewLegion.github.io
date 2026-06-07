/* Dev Updates / Newsletter view -> window.UpdatesView */
const { Icon: UIcon, Button: UButton, Badge: UBadge, StatusBadge: UStatus, PillTabs: UPills, StatCard: UStat, Donut: UDonut } = window;
const { useState: useStateU } = React;

const SEC_META = {
  feature:     { label: "New", color: "#4f46e5", bg: "var(--accent-50)", ic: "sparkles" },
  improvement: { label: "Improved", color: "#0d9488", bg: "#e3f6f3", ic: "bolt" },
  fix:         { label: "Fixed", color: "#d97706", bg: "var(--amber-50)", ic: "check" },
};

function NewsletterPreview({ u }) {
  return (
    <div style={{ background: "var(--surface-3)", borderRadius: "var(--r-md)", padding: 20, maxHeight: 620, overflowY: "auto" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", background: "#fff", borderRadius: "var(--r-md)", overflow: "hidden", boxShadow: "var(--sh-md)" }}>
        {/* header band */}
        <div style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-700))", padding: "26px 28px", color: "#fff" }}>
          <div className="row" style={{ gap: 8, opacity: .85, fontSize: 12, fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,.22)", display: "grid", placeItems: "center" }}><UIcon name="rocket" size={11} /></div>
            <span>Product update · {u.version}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 12, letterSpacing: "-.02em", lineHeight: 1.2 }}>{u.title}</div>
          <div style={{ opacity: .9, fontSize: 13.5, marginTop: 8, lineHeight: 1.5 }}>{u.summary}</div>
        </div>
        <div style={{ padding: "8px 28px 28px" }}>
          {u.sections.length === 0 && <p style={{ color: "var(--text-3)", padding: "24px 0", textAlign: "center", fontSize: 13 }}>Add sections to see them rendered here.</p>}
          {u.sections.map((s, i) => {
            const m = SEC_META[s.type];
            return (
              <div key={i} style={{ paddingTop: 22 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: m.color, background: m.bg, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: ".03em" }}>
                  <UIcon name={m.ic} size={11} />{m.label}
                </span>
                <div style={{ fontWeight: 650, fontSize: 15.5, marginTop: 9, color: "#1a1d27" }}>{s.title}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#454b5a", marginTop: 5 }}>{s.body}</p>
              </div>
            );
          })}
          <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid #eee", textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "var(--accent)", color: "#fff", padding: "11px 22px", borderRadius: 8, fontWeight: 600, fontSize: 13.5 }}>See what's new →</span>
            <p style={{ fontSize: 11.5, color: "#9aa0ad", marginTop: 18 }}>You're receiving this because you use GrowthLoop.<br />Manage preferences · Unsubscribe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateComposer({ u, onBack }) {
  const [draft, setDraft] = useStateU(u);
  function update(patch) { setDraft({ ...draft, ...patch }); }
  function updateSec(i, patch) { update({ sections: draft.sections.map((s, j) => j === i ? { ...s, ...patch } : s) }); }
  function addSec(type) { update({ sections: [...draft.sections, { type, title: "", body: "" }] }); }
  function removeSec(i) { update({ sections: draft.sections.filter((_, j) => j !== i) }); }

  return (
    <div className="page-wide fade-in" style={{ maxWidth: 1320 }}>
      <div className="row" style={{ gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}><UIcon name="chevL" size={18} /></button>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ gap: 10 }}><span className="page-title" style={{ fontSize: 20 }}>{draft.status === "draft" ? "Compose update" : draft.title}</span><UStatus status={draft.status} /></div>
          <p style={{ color: "var(--text-3)", fontSize: "var(--fs-sm)", marginTop: 4 }}>Write patch notes & ship them to your clients as a polished newsletter.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <UButton variant="secondary" icon="eye">Send test</UButton>
          <UButton variant="primary" icon="send"><span>Publish to {draft.audience || 1840} clients</span></UButton>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start", gap: "var(--gap)" }}>
        {/* editor */}
        <div className="card">
          <div className="card-head"><div className="card-title">Editor</div></div>
          <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div className="row" style={{ gap: 12 }}>
              <div style={{ width: 120 }}><label className="field-label">Version</label><input className="input mono" value={draft.version} onChange={e => update({ version: e.target.value })} /></div>
              <div style={{ flex: 1 }}><label className="field-label">Headline</label><input className="input" value={draft.title} onChange={e => update({ title: e.target.value })} placeholder="What shipped?" /></div>
            </div>
            <div><label className="field-label">Summary</label><textarea className="textarea" rows={2} value={draft.summary} onChange={e => update({ summary: e.target.value })} placeholder="One-line teaser" /></div>
            <div className="divider" />
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>Sections</span>
              <div className="row" style={{ gap: 6 }}>
                {Object.entries(SEC_META).map(([k, m]) => (
                  <button key={k} onClick={() => addSec(k)} className="row" style={{ gap: 5, padding: "4px 9px", borderRadius: 99, border: "1px solid var(--border-2)", background: "var(--surface)", fontSize: 11.5, fontWeight: 600, color: m.color, cursor: "pointer" }}>
                    <UIcon name="plus" size={12} />{m.label}
                  </button>
                ))}
              </div>
            </div>
            {draft.sections.map((s, i) => {
              const m = SEC_META[s.type];
              return (
                <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 13, position: "relative" }}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 9 }}>
                    <span className="row" style={{ gap: 6, fontSize: 11, fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: ".03em" }}><UIcon name={m.ic} size={12} />{m.label}</span>
                    <button onClick={() => removeSec(i)} className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--text-4)", width: 24, height: 24 }}><UIcon name="x" size={14} /></button>
                  </div>
                  <input className="input" style={{ marginBottom: 8, fontWeight: 600 }} value={s.title} placeholder="Section title" onChange={e => updateSec(i, { title: e.target.value })} />
                  <textarea className="textarea" rows={2} value={s.body} placeholder="Describe the change…" onChange={e => updateSec(i, { body: e.target.value })} />
                </div>
              );
            })}
            {draft.sections.length === 0 && <p style={{ color: "var(--text-4)", fontSize: "var(--fs-sm)", textAlign: "center", padding: "14px 0" }}>No sections yet — add one above.</p>}
          </div>
        </div>
        {/* preview */}
        <div>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}><span className="card-title">Email preview</span><UBadge variant="neutral">Desktop</UBadge></div>
          <NewsletterPreview u={draft} />
        </div>
      </div>
    </div>
  );
}

function UpdatesView({ openId, setOpenId }) {
  const { updates } = window.DATA;
  const open = updates.find(u => u.id === openId);
  if (open) return <UpdateComposer u={open} onBack={() => setOpenId(null)} />;

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Email · Product</div>
          <div className="page-title" style={{ marginTop: 4 }}>Dev updates</div>
          <p className="page-desc">Turn your release notes into beautiful newsletters and keep clients in the loop on every ship.</p>
        </div>
        <UButton variant="primary" icon="plus" onClick={() => setOpenId("u3")}>New update</UButton>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: "var(--gap)" }}>
        <UStat label="Updates shipped" value="14" icon="rocket" sub="this year" />
        <UStat label="Avg. open rate" value="69%" accent icon="eye" sub="across published" />
        <UStat label="Subscribers" value="1,840" icon="users" sub="receiving updates" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {updates.map(u => (
          <button key={u.id} onClick={() => setOpenId(u.id)} className="card" style={{ textAlign: "left", cursor: "pointer", overflow: "hidden", transition: "all .14s", padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--sh-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--sh-xs)"; e.currentTarget.style.transform = "none"; }}>
            <div style={{ height: 90, background: u.status === "draft" ? "var(--surface-3)" : "linear-gradient(135deg, var(--accent), var(--accent-700))", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: u.status === "draft" ? "var(--text-3)" : "rgba(255,255,255,.9)" }}>{u.version}</span>
                <UStatus status={u.status} />
              </div>
              <UIcon name="rocket" size={20} style={{ color: u.status === "draft" ? "var(--text-4)" : "rgba(255,255,255,.8)" }} />
            </div>
            <div className="card-pad">
              <div style={{ fontWeight: 650, fontSize: 15, letterSpacing: "-.01em", lineHeight: 1.3 }}>{u.title}</div>
              <p style={{ color: "var(--text-3)", fontSize: "var(--fs-sm)", marginTop: 6, lineHeight: 1.5, minHeight: 38 }}>{u.summary}</p>
              <div className="divider" style={{ margin: "12px 0" }} />
              <div className="row" style={{ justifyContent: "space-between", fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>
                <span>{u.date}</span>
                {u.status === "published" ? <span className="row" style={{ gap: 5 }}><UIcon name="eye" size={13} /><span>{u.opened}% opened</span></span> : <span>—</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
window.UpdatesView = UpdatesView;
