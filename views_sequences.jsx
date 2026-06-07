/* LinkedIn Sequences view -> window.SequencesView */
const { Icon: QIcon, Button: QButton, StatusBadge: QStatus, Funnel: QFunnel, Donut, AreaChart: QArea, PillTabs, Token, StatCard: QStat, Toggle: QToggle } = window;
const { useState: useStateQ } = React;

const STEP_META = {
  visit:   { ic: "eye",    color: "#64748b", label: "View profile" },
  connect: { ic: "users",  color: "#0a66c2", label: "Connection request" },
  message: { ic: "message",color: "#4f46e5", label: "Message" },
  inmail:  { ic: "send",   color: "#7c3aed", label: "InMail" },
  delay:   { ic: "clock",  color: "#94a3b8", label: "Wait" },
};

function StepNode({ step, selected, onClick }) {
  const m = STEP_META[step.type];
  if (step.type === "delay") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={onClick} className="row" style={{ gap: 7, padding: "5px 12px", borderRadius: 99, border: `1px solid ${selected ? "var(--accent)" : "var(--border-2)"}`,
          background: selected ? "var(--accent-50)" : "var(--surface)", fontSize: "var(--fs-xs)", fontWeight: 600, color: "var(--text-2)", cursor: "pointer", boxShadow: "var(--sh-xs)" }}>
          <QIcon name="clock" size={13} style={{ color: "var(--text-3)" }} />
          <span>{`Wait ${step.wait} day${step.wait > 1 ? "s" : ""}`}</span>
        </button>
      </div>
    );
  }
  return (
    <button onClick={onClick} style={{ textAlign: "left", width: "100%", background: "var(--surface)", cursor: "pointer",
      border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--r-md)", padding: 14,
      boxShadow: selected ? "0 0 0 3px var(--accent-50), var(--sh-sm)" : "var(--sh-xs)", transition: "all .14s" }}>
      <div className="row" style={{ gap: 11 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: m.color + "1a", color: m.color, display: "grid", placeItems: "center", flex: "0 0 34px" }}><QIcon name={m.ic} size={17} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{step.label}</span>
            {step.sent != null && <span className="mono" style={{ fontSize: "var(--fs-xs)", color: "var(--text-4)" }}>{step.sent} sent</span>}
          </div>
          {step.note
            ? <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 3, lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{step.note}</div>
            : <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-4)", marginTop: 3 }}>No template yet</div>}
          {step.replied != null && (
            <div className="row" style={{ gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>Replies <b className="mono" style={{ color: "var(--green)" }}>{step.replied}</b></span>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>Rate <b className="mono">{Math.round(step.replied / Math.max(step.sent, 1) * 100)}%</b></span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function Connector({ onAdd }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 26 }}>
      <div style={{ width: 2, background: "var(--border-2)", height: "100%" }} />
      <button onClick={onAdd} className="add-step" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 22, height: 22, borderRadius: 99, border: "1.5px solid var(--border-2)", background: "var(--surface)", color: "var(--text-3)",
        display: "grid", placeItems: "center", opacity: 0, transition: "all .14s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-3)"; }}>
        <QIcon name="plus" size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
}

/* ── Import from List modal ────────────────────────────── */
function ImportFromListModal({ seqName, onClose, onAdd }) {
  const [selected, setSelected] = useStateQ([]);
  const lists = window.PLISTS || [];
  const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const totalCount = lists.filter(l => selected.includes(l.id)).reduce((s, l) => s + l.health.active, 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200, display: "grid", placeItems: "center", padding: 24 }}
      onClick={onClose}>
      <div className="card" style={{ width: "100%", maxWidth: 500, maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "var(--sh-pop)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 650, fontSize: 16 }}>Import from list</div>
            <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)", marginTop: 2 }}>Add prospects to <b style={{ color: "var(--text)" }}>{seqName}</b></div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><QIcon name="x" size={16} /></button>
        </div>

        {/* List options */}
        <div style={{ overflowY: "auto", padding: "12px 18px", display: "flex", flexDirection: "column", gap: 7 }}>
          {lists.map(list => {
            const on = selected.includes(list.id);
            return (
              <label key={list.id} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                padding: "10px 12px", borderRadius: "var(--r-sm)",
                border: `1.5px solid ${on ? list.color : "var(--border)"}`,
                background: on ? list.color + "0e" : "transparent",
                transition: "all .13s" }}>
                <input type="checkbox" checked={on} onChange={() => toggle(list.id)}
                  style={{ cursor: "pointer", accentColor: list.color, flexShrink: 0 }} />
                <div style={{ width: 32, height: 32, borderRadius: 9, background: list.color + "18", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <QIcon name="users" size={15} style={{ color: list.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{list.name}</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 2 }}>
                    {list.health.active.toLocaleString()} active · created {list.created}
                  </div>
                </div>
                <span className="mono" style={{ fontWeight: 700, fontSize: 14, color: on ? list.color : "var(--text-2)", flexShrink: 0 }}>
                  {list.count.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "13px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)" }}>
            {selected.length === 0
              ? "No lists selected"
              : <span><b style={{ color: "var(--text)" }}>{totalCount.toLocaleString()}</b> prospects will be added</span>
            }
          </span>
          <div className="row" style={{ gap: 8 }}>
            <QButton variant="secondary" onClick={onClose}>Cancel</QButton>
            <QButton variant="primary" icon="users"
              onClick={() => { onAdd(selected, totalCount); onClose(); }}
              disabled={selected.length === 0}>
              Add to sequence
            </QButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SequenceBuilder({ seq, onBack }) {
  const [tab, setTab] = useStateQ("flow");
  const [steps, setSteps] = useStateQ(seq.steps);
  const [sel, setSel] = useStateQ(null);
  const [active, setActive] = useStateQ(seq.status === "active");
  const [showImport, setShowImport] = useStateQ(false);
  const [importBanner, setImportBanner] = useStateQ(null);

  function addStep(idx) {
    const ns = { id: "n" + Date.now(), type: "message", label: "New message", wait: 0, note: "" };
    const copy = [...steps]; copy.splice(idx, 0, ns); setSteps(copy); setSel(ns.id);
  }
  function updateStep(id, patch) { setSteps(steps.map(s => s.id === id ? { ...s, ...patch } : s)); }
  function removeStep(id) { setSteps(steps.filter(s => s.id !== id)); setSel(null); }
  const selStep = steps.find(s => s.id === sel);

  const funnelSteps = [
    { label: "Prospects", value: seq.prospects, color: "#94a3b8" },
    { label: "Connection sent", value: Math.round(seq.prospects * 0.97), color: "#0a66c2" },
    { label: "Accepted", value: seq.accepted, color: "#4f46e5" },
    { label: "Replied", value: seq.replied, color: "#15a36e" },
    { label: "Meetings", value: seq.meetings, color: "#d97706" },
  ];

  return (
    <div className="page-wide fade-in" style={{ maxWidth: 1320 }}>
      {/* header */}
      <div className="row" style={{ gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}><QIcon name="chevL" size={18} /></button>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: seq.color }} />
            <span className="page-title" style={{ fontSize: 20 }}>{seq.name}</span>
            <QStatus status={active ? "active" : seq.status === "draft" ? "draft" : "paused"} />
          </div>
          <div className="row" style={{ gap: 14, marginTop: 5, color: "var(--text-3)", fontSize: "var(--fs-sm)" }}>
            <span className="row" style={{ gap: 5 }}><QIcon name="users" size={14} /><span>{seq.prospects} prospects</span></span>
            <span className="row" style={{ gap: 5 }}><QIcon name="send" size={14} /><span>{seq.sent} sent</span></span>
            <span className="row" style={{ gap: 5 }}><QIcon name="reply" size={14} /><span>{seq.replyRate}% reply</span></span>
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <span className="row" style={{ gap: 8, fontSize: "var(--fs-sm)", fontWeight: 600, color: active ? "var(--green)" : "var(--text-3)" }}>
            <QToggle on={active} onChange={setActive} />{active ? "Running" : "Paused"}
          </span>
          <QButton variant="secondary" icon="users">Add prospects</QButton>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <PillTabs items={[{ id: "flow", label: "Flow" }, { id: "stats", label: "Performance" }, { id: "prospects", label: "Prospects" }]} value={tab} onChange={setTab} />
      </div>

      {tab === "flow" && (
        <div className="grid" style={{ gridTemplateColumns: selStep ? "1fr 340px" : "1fr", alignItems: "start", gap: "var(--gap)" }}>
          {/* canvas */}
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "28px 24px",
            backgroundImage: "radial-gradient(var(--border-2) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            <div style={{ maxWidth: 440, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
                <div className="row" style={{ gap: 8, padding: "6px 14px", borderRadius: 99, background: "var(--text)", color: "#fff", fontSize: "var(--fs-xs)", fontWeight: 600 }}>
                  <QIcon name="play" size={12} fill />Sequence start
                </div>
              </div>
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <Connector onAdd={() => addStep(i)} />
                  <StepNode step={s} selected={sel === s.id} onClick={() => setSel(s.id)} />
                </React.Fragment>
              ))}
              <Connector onAdd={() => addStep(steps.length)} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => addStep(steps.length)} style={{ borderStyle: "dashed" }}><QIcon name="plus" size={14} />Add step</button>
              </div>
            </div>
          </div>

          {/* inspector */}
          {selStep && (
            <div className="card slide-in" style={{ position: "sticky", top: 0 }}>
              <div className="card-head">
                <div className="card-title">Edit step</div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSel(null)}><QIcon name="x" size={16} /></button>
              </div>
              <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="field-label">Step type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {["visit", "connect", "message", "inmail", "delay"].map(t => {
                      const m = STEP_META[t]; const on = selStep.type === t;
                      return (
                        <button key={t} onClick={() => updateStep(selStep.id, { type: t, label: m.label })}
                          className="row" style={{ gap: 8, padding: "8px 10px", borderRadius: "var(--r-sm)", border: `1.5px solid ${on ? "var(--accent)" : "var(--border-2)"}`,
                            background: on ? "var(--accent-50)" : "var(--surface)", fontSize: "var(--fs-xs)", fontWeight: 600, color: on ? "var(--accent-700)" : "var(--text-2)", cursor: "pointer" }}>
                          <QIcon name={m.ic} size={14} style={{ color: m.color }} />{m.label.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selStep.type === "delay" ? (
                  <div>
                    <label className="field-label">Wait duration</label>
                    <div className="row" style={{ gap: 8 }}>
                      <input className="input mono" type="number" value={selStep.wait} min={1} style={{ width: 80 }} onChange={e => updateStep(selStep.id, { wait: +e.target.value })} />
                      <span style={{ color: "var(--text-2)", fontSize: "var(--fs-sm)" }}>days before next step</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="field-label">Message template</label>
                    <textarea className="textarea" rows={6} value={selStep.note || ""} placeholder="Hi {{first}}, …" onChange={e => updateStep(selStep.id, { note: e.target.value })} />
                    <div className="row" style={{ gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>Insert:</span>
                      {["{{first}}", "{{company}}", "{{title}}", "{{industry}}"].map(t => (
                        <button key={t} onClick={() => updateStep(selStep.id, { note: (selStep.note || "") + " " + t })} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}><Token>{t}</Token></button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="divider" />
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)", justifyContent: "flex-start" }} onClick={() => removeStep(selStep.id)}><QIcon name="trash" size={14} />Delete step</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="fade-in">
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
            <QStat label="Acceptance rate" value={seq.acceptRate + "%"} icon="check" accent sub={`${seq.accepted} accepted`} />
            <QStat label="Reply rate" value={seq.replyRate + "%"} icon="reply" accent sub={`${seq.replied} replies`} />
            <QStat label="Meetings booked" value={seq.meetings} icon="calendar" sub="from this sequence" />
            <QStat label="Messages sent" value={seq.sent.toLocaleString()} icon="send" sub="all steps" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
            <div className="card">
              <div className="card-head"><div className="card-title">Conversion funnel</div><span className="card-sub">Prospect → meeting</span></div>
              <div className="card-pad"><QFunnel steps={funnelSteps} /></div>
            </div>
            <div className="card">
              <div className="card-head"><div className="card-title">Reply rate by step</div></div>
              <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {steps.filter(s => s.replied != null).map(s => (
                  <div key={s.id}>
                    <div className="row" style={{ justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: "var(--fs-sm)", fontWeight: 500 }}>{s.label}</span>
                      <span className="mono" style={{ fontSize: "var(--fs-sm)", fontWeight: 600 }}>{Math.round(s.replied / Math.max(s.sent, 1) * 100)}%</span>
                    </div>
                    <window.Progress value={Math.round(s.replied / Math.max(s.sent, 1) * 100)} color="var(--green)" />
                  </div>
                ))}
                {!steps.some(s => s.replied != null) && <window.EmptyState icon="reply" title="No replies yet" desc="Performance shows up once this sequence starts sending." />}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "prospects" && (
        <div className="fade-in">
          {importBanner && (
            <div style={{ marginBottom: "var(--gap)", padding: "11px 16px", borderRadius: "var(--r-sm)",
              background: "var(--green-50)", border: "1px solid var(--green)", display: "flex", alignItems: "center", gap: 10 }}>
              <QIcon name="checkCircle" size={16} style={{ color: "var(--green)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--green)" }}>{importBanner}</span>
              <button onClick={() => setImportBanner(null)} style={{ marginLeft: "auto", border: "none", background: "transparent", cursor: "pointer", color: "var(--green)", display: "grid", placeItems: "center" }}>
                <QIcon name="x" size={14} />
              </button>
            </div>
          )}
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="card-head">
              <div>
                <div className="card-title">{seq.prospects} prospects enrolled</div>
                <div className="card-sub">Current step &amp; reply status</div>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <QButton variant="secondary" size="sm" icon="download">Export</QButton>
                <QButton variant="primary" size="sm" icon="users" onClick={() => setShowImport(true)}>Import more</QButton>
              </div>
            </div>
            {seq.prospects > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead>
                    <tr><th>Name</th><th>Company</th><th>Title</th><th>Current step</th><th style={{ textAlign: "right" }}>Status</th></tr>
                  </thead>
                  <tbody>
                    {(window.DATA.seedProfiles || []).slice(0, Math.min(seq.prospects, 12)).map((p, i) => {
                      const activeSteps = steps.filter(s => s.type !== "delay");
                      const step = activeSteps[i % Math.max(activeSteps.length, 1)];
                      const statLabels = ["active","active","active","replied","replied","accepted","active","pending","active","replied","active","accepted"];
                      const st = statLabels[i % statLabels.length];
                      const stColors = { active: "var(--text-2)", replied: "var(--green)", accepted: "var(--accent)", pending: "var(--text-4)" };
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="row" style={{ gap: 9 }}>
                              <window.Avatar name={`${p.first} ${p.last}`} size={28} />
                              <span style={{ fontWeight: 600 }}>{p.first} {p.last}</span>
                            </div>
                          </td>
                          <td>
                            <div className="row" style={{ gap: 7 }}>
                              <div style={{ width: 18, height: 18, borderRadius: 4, background: "var(--surface-3)", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700, color: "var(--text-3)", flexShrink: 0 }}>
                                {p.company[0]}
                              </div>
                              {p.company}
                            </div>
                          </td>
                          <td style={{ color: "var(--text-2)" }}>{p.title}</td>
                          <td style={{ color: "var(--text-3)", fontSize: "var(--fs-xs)" }}>{step ? step.label : "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <span style={{ fontSize: 11.5, fontWeight: 650, color: stColors[st] }}>{st}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {seq.prospects > 12 && (
                  <div style={{ padding: "11px 20px", borderTop: "1px solid var(--border)", fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>
                    Showing 12 of {seq.prospects} prospects
                  </div>
                )}
              </div>
            ) : (
              <div className="card-pad">
                <window.EmptyState icon="users" title="No prospects yet"
                  desc="Import from an existing list to enroll people in this sequence."
                  action={<QButton variant="primary" icon="users" onClick={() => setShowImport(true)}>Import from list</QButton>} />
              </div>
            )}
          </div>
          {showImport && (
            <ImportFromListModal
              seqName={seq.name}
              onClose={() => setShowImport(false)}
              onAdd={(listIds, count) => {
                const names = (window.PLISTS || []).filter(l => listIds.includes(l.id)).map(l => l.name);
                setImportBanner(`${count.toLocaleString()} prospects added from ${names.join(", ")}`);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SequencesView({ openId, setOpenId }) {
  const { sequences } = window.DATA;
  const open = sequences.find(s => s.id === openId);
  if (open) return <SequenceBuilder seq={open} onBack={() => setOpenId(null)} />;

  const [archived, setArchived] = useStateQ(new Set());
  const [showArchived, setShowArchived] = useStateQ(true);
  const [menuOpen, setMenuOpen] = useStateQ(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const toggleArchive = (id, e) => {
    e.stopPropagation();
    setMenuOpen(null);
    setArchived(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const active = sequences.filter(s => !archived.has(s.id));
  const archivedSeqs = sequences.filter(s => archived.has(s.id));

  function SeqCard({ s, isArchived }) {
    const [hover, setHover] = useStateQ(false);
    const isMenuOpen = menuOpen === s.id;
    return (
      <div
        className="card card-pad"
        style={{
          position: "relative", textAlign: "left",
          cursor: isArchived ? "default" : "pointer",
          transition: "all .14s", display: "flex", flexDirection: "column", gap: 14,
          opacity: isArchived ? 0.6 : 1,
        }}
        onClick={() => !isArchived && setOpenId(s.id)}
        onMouseEnter={e => {
          setHover(true);
          if (!isArchived) { e.currentTarget.style.boxShadow = "var(--sh-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }
        }}
        onMouseLeave={e => {
          setHover(false);
          e.currentTarget.style.boxShadow = "var(--sh-xs)"; e.currentTarget.style.transform = "none";
        }}
      >
        {/* ⋯ menu trigger */}
        <button
          style={{
            position: "absolute", top: 10, right: 10, zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "var(--r-sm)",
            border: `1px solid ${hover || isMenuOpen ? "var(--border-2)" : "transparent"}`,
            background: isMenuOpen ? "var(--surface-3)" : hover ? "var(--surface-2)" : "transparent",
            color: hover || isMenuOpen ? "var(--text)" : "var(--text-4)",
            cursor: "pointer", transition: "all .15s",
            opacity: hover || isMenuOpen ? 1 : 0.5,
          }}
          onClick={e => { e.stopPropagation(); setMenuOpen(isMenuOpen ? null : s.id); }}
        >
          <QIcon name="dots" size={15} strokeWidth={2.5} />
        </button>

        {/* Dropdown */}
        {isMenuOpen && (
          <div
            style={{
              position: "absolute", top: 38, right: 10, zIndex: 30,
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)", boxShadow: "var(--sh-md)",
              minWidth: 152, overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            {!isArchived && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: "100%", justifyContent: "flex-start", padding: "9px 14px", borderRadius: 0 }}
                onClick={e => { e.stopPropagation(); setOpenId(s.id); }}
              >
                <QIcon name="edit" size={14} />Open
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm"
              style={{ width: "100%", justifyContent: "flex-start", padding: "9px 14px", borderRadius: 0,
                color: isArchived ? "var(--accent)" : "var(--text-2)" }}
              onClick={e => toggleArchive(s.id, e)}
            >
              <QIcon name={isArchived ? "arrowUp" : "inbox"} size={14} />
              {isArchived ? "Unarchive" : "Archive"}
            </button>
          </div>
        )}

        <div className="row" style={{ justifyContent: "space-between", paddingRight: 22 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontWeight: 650, fontSize: 15 }}>{s.name}</span>
          </div>
          {isArchived
            ? <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", background: "var(--surface-3)", padding: "2px 9px", borderRadius: 99, whiteSpace: "nowrap" }}>Archived</span>
            : <QStatus status={s.status} />
          }
        </div>

        <div className="row" style={{ gap: 6 }}>
          {s.steps.map((st, i) => (
            <span key={i} title={STEP_META[st.type].label}
              style={{ width: 26, height: 26, borderRadius: 7, background: STEP_META[st.type].color + "1a", color: STEP_META[st.type].color, display: "grid", placeItems: "center" }}>
              <QIcon name={STEP_META[st.type].ic} size={13} />
            </span>
          ))}
        </div>

        <div className="divider" />

        <div className="row" style={{ justifyContent: "space-between" }}>
          {[["Prospects", s.prospects], ["Sent", s.sent], ["Reply rate", s.replyRate + "%"], ["Meetings", s.meetings]].map(([l, v]) => (
            <div key={l}>
              <div className="mono" style={{ fontWeight: 650, fontSize: 16 }}>{v}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">LinkedIn · Automation</div>
          <div className="page-title" style={{ marginTop: 4 }}>Sequences</div>
          <p className="page-desc">Multi-step LinkedIn outreach with connection requests, messages and smart delays — running on autopilot.</p>
        </div>
        <QButton variant="primary" icon="plus">New sequence</QButton>
      </div>

      {/* Active / draft / paused sequences */}
      {active.length > 0
        ? <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
            {active.map(s => <SeqCard key={s.id} s={s} isArchived={false} />)}
          </div>
        : <div className="card card-pad" style={{ textAlign: "center", color: "var(--text-3)", fontSize: "var(--fs-sm)" }}>
            No active sequences — create one or unarchive an existing one.
          </div>
      }

      {/* Archived section */}
      {archivedSeqs.length > 0 && (
        <div style={{ marginTop: "var(--gap)" }}>
          <button
            className="row"
            style={{ gap: 7, background: "none", border: "none", cursor: "pointer", padding: "4px 0 10px", color: "var(--text-3)", fontSize: "var(--fs-sm)", fontWeight: 600 }}
            onClick={() => setShowArchived(v => !v)}
          >
            <QIcon name={showArchived ? "chevD" : "chevR"} size={14} />
            Archived · {archivedSeqs.length}
          </button>
          {showArchived && (
            <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
              {archivedSeqs.map(s => <SeqCard key={s.id} s={s} isArchived={true} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
window.SequencesView = SequencesView;

