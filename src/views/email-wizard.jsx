/* Email Campaign Wizard -> window.NewCampaignWizard */
const { Icon: WIcon, Button: WButton, Token: WToken, Avatar: WAvatar } = window;
const { useState: useStateW, useMemo: useMemoW, useEffect: useEffectW } = React;

const WIZARD_STEPS = ["Basics", "Audience", "Messages", "Review"];

/* ── Step progress bar ─────────────────────────────── */
function WizardSteps({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {WIZARD_STEPS.map((label, i) => {
        const n = i + 1, done = n < step, current = n === step;
        return (
          <React.Fragment key={n}>
            {i > 0 && (
              <div style={{ width: 36, height: 2, background: done ? "var(--accent)" : "var(--border-2)", transition: "background .3s", flexShrink: 0 }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", fontSize: 11.5, fontWeight: 700,
                display: "grid", placeItems: "center", transition: "all .2s",
                background: done || current ? "var(--accent)" : "var(--surface-3)",
                color: done || current ? "#fff" : "var(--text-4)",
                border: done || current ? "none" : "1.5px solid var(--border-2)",
              }}>
                {done ? <WIcon name="check" size={12} strokeWidth={2.5} /> : n}
              </div>
              <span style={{ fontSize: 10.5, fontWeight: current ? 700 : 500, color: current ? "var(--text)" : "var(--text-4)", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Sequence node types ───────────────────────────── */
function MsgConnector({ onAdd }) {
  const [open, setOpen] = useStateW(false);
  return (
    <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 30 }}>
      <div style={{ width: 2, background: "var(--border-2)", height: "100%", position: "absolute", left: "50%", transform: "translateX(-50%)" }} />
      <button
        style={{ position: "relative", zIndex: 2, width: 20, height: 20, borderRadius: 99, marginTop: 5,
          border: "1.5px solid var(--border-2)", background: "var(--surface)", color: "var(--text-3)",
          display: "grid", placeItems: "center", cursor: "pointer", transition: "all .13s" }}
        onClick={() => setOpen(v => !v)}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-3)"; } }}
      >
        <WIcon name="plus" size={11} strokeWidth={2.5} />
      </button>
      {open && (
        <React.Fragment>
          <div style={{ position: "fixed", inset: 0, zIndex: 19 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: 26, left: "50%", transform: "translateX(-50%)", zIndex: 20,
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)",
            boxShadow: "var(--sh-md)", overflow: "hidden", whiteSpace: "nowrap" }}>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start", padding: "8px 14px", borderRadius: 0 }}
              onClick={() => { onAdd("email"); setOpen(false); }}>
              <WIcon name="mail" size={13} style={{ color: "#4f46e5" }} />Add email
            </button>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "flex-start", padding: "8px 14px", borderRadius: 0, borderTop: "1px solid var(--border)" }}
              onClick={() => { onAdd("delay"); setOpen(false); }}>
              <WIcon name="clock" size={13} style={{ color: "var(--text-3)" }} />Add delay
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function MsgNode({ step, emailNum, selected, onClick, onRemove }) {
  if (step.type === "delay") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="row" style={{ gap: 8, padding: "5px 12px", borderRadius: 99, cursor: "pointer",
          border: `1px solid ${selected ? "var(--accent)" : "var(--border-2)"}`,
          background: selected ? "var(--accent-50)" : "var(--surface)", boxShadow: "var(--sh-xs)" }}
          onClick={onClick}>
          <WIcon name="clock" size={13} style={{ color: "var(--text-3)" }} />
          <span style={{ fontSize: "var(--fs-xs)", fontWeight: 600, color: "var(--text-2)" }}>
            Wait {step.days} day{step.days !== 1 ? "s" : ""}
          </span>
          <button onClick={e => { e.stopPropagation(); onRemove(); }}
            style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-4)", display: "grid", placeItems: "center", padding: 0 }}>
            <WIcon name="x" size={11} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <button onClick={onClick} style={{ width: "100%", textAlign: "left",
      background: "var(--surface)", cursor: "pointer",
      border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
      borderRadius: "var(--r-md)", padding: 12,
      boxShadow: selected ? "0 0 0 3px var(--accent-50), var(--sh-sm)" : "var(--sh-xs)", transition: "all .13s" }}>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#4f46e51a", color: "#4f46e5", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <WIcon name="mail" size={15} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>Email {emailNum}</span>
            <button onClick={e => { e.stopPropagation(); onRemove(); }}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--text-4)", display: "grid", placeItems: "center", padding: 0 }}>
              <WIcon name="trash" size={12} />
            </button>
          </div>
          <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {step.subject || "No subject"}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Email preview ─────────────────────────────────── */
function WizardPreview({ step, fromName, fromEmail }) {
  if (!step) return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-4)", fontSize: "var(--fs-sm)" }}>
      Select an email step to preview it
    </div>
  );
  const sub = (txt) => (txt || "")
    .replace(/\{\{first\}\}/g, "Camille").replace(/\{\{company\}\}/g, "Pennylane")
    .replace(/\{\{title\}\}/g, "Head of Growth").replace(/\{\{industry\}\}/g, "Fintech");
  return (
    <div style={{ background: "var(--surface-3)", borderRadius: "var(--r-md)", padding: 16, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 500, background: "#fff", borderRadius: "var(--r)", boxShadow: "var(--sh-md)", overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #e5e7eb" }}>
          <div className="row" style={{ gap: 9 }}>
            <WAvatar name={fromName} size={32} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>
                {fromName} <span style={{ color: "#9ca3af", fontWeight: 400 }}>&lt;{fromEmail}&gt;</span>
              </div>
              <div style={{ fontSize: 11.5, color: "#9ca3af" }}>to Camille Dubois</div>
            </div>
          </div>
          <div style={{ fontWeight: 650, fontSize: 15, marginTop: 10, color: "#111", letterSpacing: "-.01em" }}>
            {sub(step.subject) || "(no subject)"}
          </div>
        </div>
        <div style={{ padding: "16px 18px", fontSize: 13.5, lineHeight: 1.65, color: "#374151", whiteSpace: "pre-wrap", maxHeight: 280, overflowY: "auto" }}>
          {sub(step.body) || "(empty body)"}
        </div>
      </div>
    </div>
  );
}

/* ── Main wizard ───────────────────────────────────── */
function NewCampaignWizard({ onClose, onLaunch }) {
  const [step, setStep] = useStateW(1);

  // Step 1 — Basics
  const [name,      setName]      = useStateW("New campaign");
  const [fromName,  setFromName]  = useStateW("Alex Rivera");
  const [fromEmail, setFromEmail] = useStateW("alex@growthloop.io");

  // Step 2 — Audience
  const [listId,  setListId]  = useStateW(null);
  const [removed, setRemoved] = useStateW(new Set());
  const [pSearch, setPSearch] = useStateW("");

  // Step 3 — Messages
  const [msgSteps, setMsgSteps] = useStateW([
    { id: "m1", type: "email", subject: "Quick idea for {{company}}'s pipeline",
      body: "Hi {{first}},\n\nI've been following what {{company}} is building — impressive traction.\n\nWe help growth teams like yours run outbound that actually books meetings. Most teams see reply rates jump from ~8% to over 20% within the first month.\n\nWorth a quick 15-minute look?\n\nBest,\nAlex" },
    { id: "d1", type: "delay", days: 3 },
    { id: "m2", type: "email", subject: "Following up — worth 15 min?",
      body: "Hi {{first}},\n\nJust circling back on my last note. Happy to share the playbook we use with teams at {{company}}'s stage — no strings.\n\nWorth a quick call?\n\nAlex" },
  ]);
  const [selMsgId, setSelMsgId] = useStateW("m1");

  const lists      = window.PLISTS || [];
  const selList    = lists.find(l => l.id === listId);

  const allProspects = useMemoW(() => {
    if (!listId) return [];
    const all = window.getProspects ? window.getProspects() : (window.DATA.seedProfiles || []);
    const inList = all.filter(p => p.listIds && p.listIds.includes(listId));
    return inList.length > 0 ? inList : all.slice(0, 15);
  }, [listId]);

  const visProspects = useMemoW(() => {
    let ps = allProspects.filter(p => !removed.has(p.id));
    if (pSearch) {
      const q = pSearch.toLowerCase();
      ps = ps.filter(p => `${p.first} ${p.last} ${p.company}`.toLowerCase().includes(q));
    }
    return ps;
  }, [allProspects, removed, pSearch]);

  const totalProspects = allProspects.length - removed.size;

  // Message helpers
  function getEmailNum(id) {
    let n = 0;
    for (const s of msgSteps) { if (s.type === "email") n++; if (s.id === id) return n; }
    return n;
  }
  function addMsg(insertAt, type) {
    const ns = type === "email"
      ? { id: "m" + Date.now(), type: "email", subject: "Follow-up", body: "Hi {{first}},\n\nJust following up on my previous message.\n\nAlex" }
      : { id: "d" + Date.now(), type: "delay", days: 3 };
    setMsgSteps(prev => { const c = [...prev]; c.splice(insertAt, 0, ns); return c; });
    if (type === "email") setSelMsgId(ns.id);
  }
  function removeMsg(id) {
    setMsgSteps(prev => prev.filter(s => s.id !== id));
    if (selMsgId === id) setSelMsgId(msgSteps.find(s => s.id !== id && s.type === "email")?.id || null);
  }
  function updateMsg(id, patch) { setMsgSteps(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s)); }

  const selMsg   = msgSteps.find(s => s.id === selMsgId);
  const emailSteps = msgSteps.filter(s => s.type === "email");
  const delaySteps = msgSteps.filter(s => s.type === "delay");

  const canNext = () => {
    if (step === 1) return name.trim() && fromEmail.trim();
    if (step === 2) return listId && totalProspects > 0;
    if (step === 3) return emailSteps.length > 0;
    return true;
  };

  function handleLaunch() {
    onLaunch({
      id: "nc_" + Date.now(),
      name, fromName, fromEmail,
      subject: emailSteps[0]?.subject || "",
      audience: totalProspects,
      sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsub: 0,
      status: "scheduled",
      color: "#4f46e5",
      schedule: `Scheduled · starts sending shortly`,
    });
  }

  return (
    <div className="page-wide fade-in" style={{ maxWidth: 1320 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div className="eyebrow">Email · Campaigns</div>
          <div className="page-title" style={{ marginTop: 4 }}>New campaign</div>
        </div>
        <div className="row" style={{ gap: 20, alignItems: "center" }}>
          <WizardSteps step={step} />
          <WButton variant="ghost" icon="x" onClick={onClose}>Cancel</WButton>
        </div>
      </div>

      {/* ── Step 1: Basics ── */}
      {step === 1 && (
        <div className="fade-in" style={{ maxWidth: 540 }}>
          <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="field-label">Campaign name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Spring Outbound — Founders" autoFocus />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="field-label">From name</label>
                <input className="input" value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Alex Rivera" />
              </div>
              <div>
                <label className="field-label">From email</label>
                <input className="input" type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="alex@company.io" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Audience ── */}
      {step === 2 && (
        <div className="fade-in">
          <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", color: "var(--text-2)", marginBottom: 12 }}>Select a prospect list</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "var(--gap)" }}>
            {lists.map(list => {
              const on = listId === list.id;
              return (
                <button key={list.id}
                  onClick={() => { setListId(list.id); setRemoved(new Set()); setPSearch(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                    borderRadius: "var(--r-md)", border: `2px solid ${on ? list.color : "var(--border)"}`,
                    background: on ? list.color + "0e" : "var(--surface)", cursor: "pointer",
                    transition: "all .13s", minWidth: 190, textAlign: "left" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: list.color + "18", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <WIcon name="users" size={15} style={{ color: list.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{list.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{list.health.active.toLocaleString()} active</div>
                  </div>
                  {on && <WIcon name="checkCircle" size={15} style={{ color: list.color }} />}
                </button>
              );
            })}
          </div>

          {selList ? (
            <div className="card" style={{ overflow: "hidden" }}>
              <div className="card-head">
                <div>
                  <div className="card-title">Prospects</div>
                  <div className="card-sub">
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>{totalProspects}</span> selected
                    {removed.size > 0 && <span style={{ color: "var(--red)", marginLeft: 8 }}>· {removed.size} removed</span>}
                  </div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  {removed.size > 0 && (
                    <WButton variant="ghost" size="sm" onClick={() => setRemoved(new Set())}>Restore all</WButton>
                  )}
                  <div className="input-group" style={{ width: 200 }}>
                    <WIcon name="search" size={14} style={{ color: "var(--text-4)" }} />
                    <input value={pSearch} onChange={e => setPSearch(e.target.value)}
                      placeholder="Search…" style={{ fontSize: "var(--fs-sm)" }} />
                  </div>
                </div>
              </div>
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                <table className="tbl">
                  <thead style={{ position: "sticky", top: 0, background: "var(--surface)", zIndex: 1 }}>
                    <tr><th>Name</th><th>Title</th><th>Company</th><th>Email</th><th style={{ width: 40 }}></th></tr>
                  </thead>
                  <tbody>
                    {visProspects.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="row" style={{ gap: 8 }}>
                            <WAvatar name={`${p.first} ${p.last}`} size={26} />
                            <span style={{ fontWeight: 600 }}>{p.first} {p.last}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-2)" }}>{p.title}</td>
                        <td>{p.company}</td>
                        <td className="mono" style={{ color: "var(--text-2)", fontSize: "var(--fs-xs)" }}>{p.email || "—"}</td>
                        <td>
                          <button className="btn btn-ghost btn-icon btn-sm" title="Remove"
                            style={{ color: "var(--text-4)" }}
                            onClick={() => setRemoved(prev => { const n = new Set(prev); n.add(p.id); return n; })}>
                            <WIcon name="x" size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visProspects.length === 0 && (
                  <div style={{ padding: "32px", textAlign: "center", color: "var(--text-4)", fontSize: "var(--fs-sm)" }}>
                    No prospects match your search.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card card-pad" style={{ textAlign: "center", padding: "40px 0", color: "var(--text-4)", fontSize: "var(--fs-sm)" }}>
              Select a list above to view and manage prospects
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Messages ── */}
      {step === 3 && (
        <div className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: "var(--gap)", alignItems: "start" }}>

            {/* Flow */}
            <div>
              <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", color: "var(--text-2)", marginBottom: 12 }}>Sequence</div>
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                padding: "18px 14px", backgroundImage: "radial-gradient(var(--border-2) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
                  <div className="row" style={{ gap: 6, padding: "4px 11px", borderRadius: 99, background: "var(--text)", color: "#fff", fontSize: "var(--fs-xs)", fontWeight: 600 }}>
                    <WIcon name="play" size={10} fill />Start
                  </div>
                </div>
                {msgSteps.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <MsgConnector onAdd={type => addMsg(i, type)} />
                    <MsgNode step={s} emailNum={s.type === "email" ? getEmailNum(s.id) : null}
                      selected={selMsgId === s.id}
                      onClick={() => setSelMsgId(s.id)}
                      onRemove={() => msgSteps.length > 1 && removeMsg(s.id)} />
                  </React.Fragment>
                ))}
                <MsgConnector onAdd={type => addMsg(msgSteps.length, type)} />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="btn btn-secondary btn-sm" style={{ borderStyle: "dashed" }}
                    onClick={() => addMsg(msgSteps.length, "email")}>
                    <WIcon name="plus" size={13} />Add email
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div>
              <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", color: "var(--text-2)", marginBottom: 12 }}>
                {selMsg?.type === "email" ? `Email ${getEmailNum(selMsg.id)} — edit` : selMsg?.type === "delay" ? "Delay" : "Select a step"}
              </div>
              {selMsg?.type === "email" && (
                <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="field-label">Subject line</label>
                    <input className="input" value={selMsg.subject}
                      onChange={e => updateMsg(selMsg.id, { subject: e.target.value })} placeholder="Subject…" />
                  </div>
                  <div>
                    <label className="field-label">Body</label>
                    <textarea className="textarea" rows={10} value={selMsg.body}
                      onChange={e => updateMsg(selMsg.id, { body: e.target.value })} placeholder="Hi {{first}},…" />
                  </div>
                  <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>Merge fields:</span>
                    {["{{first}}", "{{company}}", "{{title}}", "{{industry}}"].map(t => (
                      <button key={t} onClick={() => updateMsg(selMsg.id, { body: (selMsg.body || "") + " " + t })}
                        style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}>
                        <WToken>{t}</WToken>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selMsg?.type === "delay" && (
                <div className="card card-pad">
                  <label className="field-label">Wait duration</label>
                  <div className="row" style={{ gap: 10 }}>
                    <input className="input mono" type="number" min={1} max={30} value={selMsg.days}
                      onChange={e => updateMsg(selMsg.id, { days: Math.max(1, +e.target.value) })}
                      style={{ width: 80 }} />
                    <span style={{ color: "var(--text-2)", fontSize: "var(--fs-sm)" }}>days before next email</span>
                  </div>
                </div>
              )}
              {!selMsg && (
                <div className="card card-pad" style={{ color: "var(--text-4)", fontSize: "var(--fs-sm)", textAlign: "center" }}>
                  Click a step on the left to edit it
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", color: "var(--text-2)", marginBottom: 12 }}>Live preview</div>
              <WizardPreview
                step={selMsg?.type === "email" ? selMsg : emailSteps[0]}
                fromName={fromName} fromEmail={fromEmail}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {step === 4 && (
        <div className="fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
              {/* Summary */}
              <div className="card card-pad">
                <div className="card-title" style={{ marginBottom: 16 }}>Summary</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {[
                    ["Campaign",  name],
                    ["From",      `${fromName} <${fromEmail}>`],
                    ["Audience",  `${totalProspects.toLocaleString()} prospects · ${selList?.name || "—"}`],
                    ["Emails",    `${emailSteps.length} message${emailSteps.length !== 1 ? "s" : ""}`],
                    ["Delays",    `${delaySteps.length} delay${delaySteps.length !== 1 ? "s" : ""}`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)", fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: "var(--fs-sm)", fontWeight: 500, textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Sequence summary */}
              <div className="card card-pad">
                <div className="card-title" style={{ marginBottom: 14 }}>Sequence</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {msgSteps.map(s => (
                    <div key={s.id} className="row" style={{ gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "grid", placeItems: "center",
                        background: s.type === "email" ? "#4f46e51a" : "var(--surface-3)",
                        color: s.type === "email" ? "#4f46e5" : "var(--text-3)" }}>
                        <WIcon name={s.type === "email" ? "mail" : "clock"} size={13} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>
                          {s.type === "email" ? (s.subject || "No subject") : `Wait ${s.days} day${s.days !== 1 ? "s" : ""}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", color: "var(--text-2)", marginBottom: 12 }}>First email preview</div>
              <WizardPreview step={emailSteps[0]} fromName={fromName} fromEmail={fromEmail} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32,
        paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        <WButton variant="secondary" icon="chevL"
          onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}>
          {step === 1 ? "Cancel" : "Back"}
        </WButton>
        {step < 4
          ? <WButton variant="primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Continue →
            </WButton>
          : <WButton variant="primary" icon="send" onClick={handleLaunch}>
              Launch campaign
            </WButton>
        }
      </div>
    </div>
  );
}

window.NewCampaignWizard = NewCampaignWizard;
