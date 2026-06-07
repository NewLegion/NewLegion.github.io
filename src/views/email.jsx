/* Email Campaigns view -> window.EmailView */
const { Icon: EIcon, Button: EButton, StatusBadge: EStatus, StatCard: EStat, Funnel: EFunnel, Donut: EDonut, PillTabs: EPills, Token: EToken, Avatar: EAvatar, Progress: EProg, Badge: EBadge } = window;
const { useState: useStateE, useEffect: useEffectE } = React;

function rate(n, d) { return d ? Math.round((n / d) * 100) : 0; }

function EmailPreview({ c }) {
  return (
    <div style={{ background: "var(--surface-3)", borderRadius: "var(--r-md)", padding: 22, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 540, background: "#fff", borderRadius: "var(--r)", boxShadow: "var(--sh-md)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 10 }}>
            <EAvatar name={c.fromName} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.fromName} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>&lt;{c.fromEmail}&gt;</span></div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>to Camille Dubois</div>
            </div>
            <span style={{ fontSize: 11.5, color: "var(--text-4)" }}>9:02 AM</span>
          </div>
          <div style={{ fontWeight: 650, fontSize: 16, marginTop: 12, letterSpacing: "-.01em" }}>{c.subject.replace("{{company}}", "Pennylane")}</div>
        </div>
        <div style={{ padding: "20px", fontSize: 14, lineHeight: 1.6, color: "#2a2f3c" }}>
          <p style={{ marginBottom: 14 }}>Hi Camille,</p>
          <p style={{ marginBottom: 14 }}>I've been following what Pennylane is building in fintech — impressive traction. I'm reaching out because we help growth teams like yours run outbound that actually books meetings.</p>
          <p style={{ marginBottom: 14 }}>Most teams we work with see reply rates jump from ~8% to over 20% within the first month. Worth a quick 15-minute look?</p>
          <div style={{ margin: "20px 0" }}><span style={{ display: "inline-block", background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13.5 }}>Book a time →</span></div>
          <p style={{ color: "#6b7280", fontSize: 13 }}>Best,<br />{c.fromName}</p>
        </div>
      </div>
    </div>
  );
}

function CsvImport() {
  const cols = [["first_name", "First name", "Camille"], ["last_name", "Last name", "Dubois"], ["email", "Email", "camille@pennylane.com"], ["company", "Company", "Pennylane"], ["title", "Title", "Head of Growth"]];
  return (
    <div className="card">
      <div className="card-head"><div className="card-title">Audience source</div><EBadge variant="green" dot>CSV imported</EBadge></div>
      <div className="card-pad">
        <div className="row" style={{ gap: 13, padding: 14, border: "1px solid var(--border)", borderRadius: "var(--r)", background: "var(--surface-2)", marginBottom: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--green-50)", color: "var(--green)", display: "grid", placeItems: "center" }}><EIcon name="doc" size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="row" style={{ gap: 8 }}><span style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>founders_q2.csv</span><span className="mono" style={{ fontSize: 11, color: "var(--text-4)" }}>824 rows · 41 KB</span></div>
            <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>818 valid emails · 6 duplicates removed · 0 invalid</div>
          </div>
          <EButton variant="secondary" size="sm" icon="upload">Replace</EButton>
        </div>
        <div style={{ fontSize: "var(--fs-xs)", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 10 }}>Column mapping</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cols.map(([k, label, ex]) => (
            <div key={k} className="row" style={{ gap: 12, justifyContent: "space-between" }}>
              <span className="mono" style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", width: 110 }}>{k}</span>
              <EIcon name="arrowR" size={14} style={{ color: "var(--text-4)" }} />
              <span className="row" style={{ gap: 8, flex: 1 }}><EToken>{`{{${k.split("_")[0]}}}`}</EToken><span style={{ color: "var(--text-4)", fontSize: "var(--fs-xs)" }}>e.g. {ex}</span></span>
              <EIcon name="check" size={15} style={{ color: "var(--green)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Campaign Edit Modal ──────────────────────────── */
function CampaignEditModal({ c, onClose, onSave }) {
  const [name,      setName]      = useStateE(c.name);
  const [fromName,  setFromName]  = useStateE(c.fromName);
  const [fromEmail, setFromEmail] = useStateE(c.fromEmail);
  const [subject,   setSubject]   = useStateE(c.subject);
  const [body,      setBody]      = useStateE(`Hi {{first}},\n\nI've been following what {{company}} is building — impressive traction.\n\nWe help growth teams run outbound that books meetings.\n\nWorth a quick 15 min?\n\nBest,\n${c.fromName}`);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
      display:"grid", placeItems:"center", padding:24 }} onClick={onClose}>
      <div className="card" style={{ width:"100%", maxWidth:680, maxHeight:"90vh",
        display:"flex", flexDirection:"column", boxShadow:"var(--sh-pop)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ fontWeight:650, fontSize:16 }}>Edit campaign</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><EIcon name="x" size={16} /></button>
        </div>
        <div style={{ overflowY:"auto", padding:22, display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label className="field-label">Campaign name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label className="field-label">From name</label>
              <input className="input" value={fromName} onChange={e => setFromName(e.target.value)} />
            </div>
            <div>
              <label className="field-label">From email</label>
              <input className="input" type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="field-label">Subject line</label>
            <input className="input" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Body</label>
            <textarea className="textarea" rows={8} value={body} onChange={e => setBody(e.target.value)} />
            <div className="row" style={{ gap:6, flexWrap:"wrap", marginTop:8 }}>
              <span style={{ fontSize:11, color:"var(--text-3)" }}>Merge fields:</span>
              {["{{first}}", "{{company}}", "{{title}}"].map(t => (
                <button key={t} onClick={() => setBody(b => b + " " + t)}
                  style={{ border:"none", background:"transparent", padding:0, cursor:"pointer" }}>
                  <EToken>{t}</EToken>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)",
          display:"flex", justifyContent:"space-between", flexShrink:0 }}>
          <EButton variant="secondary" onClick={onClose}>Cancel</EButton>
          <EButton variant="primary" icon="check"
            onClick={() => onSave({ name, fromName, fromEmail, subject, body })}>
            Save changes
          </EButton>
        </div>
      </div>
    </div>
  );
}

/* ── Progress Tab ──────────────────────────────────── */
function ProgressTab({ c }) {
  const profiles = window.DATA.seedProfiles || [];
  const replied  = Math.min(c.replied,  profiles.length);
  const clicked  = Math.min(Math.max(c.clicked  - c.replied, 0), profiles.length - replied);
  const opened   = Math.min(Math.max(c.opened   - c.clicked, 0), profiles.length - replied - clicked);
  const sentRest = Math.min(Math.max(Math.min(c.sent, profiles.length) - replied - clicked - opened, 0), profiles.length - replied - clicked - opened);

  const recipients = [
    ...profiles.slice(0, replied).map((p, i)                          => ({ ...p, status:"replied", timeAgo:`${i*7+3}m ago`   })),
    ...profiles.slice(replied, replied+clicked).map((p, i)            => ({ ...p, status:"clicked", timeAgo:`${i*11+18}m ago` })),
    ...profiles.slice(replied+clicked, replied+clicked+opened).map((p,i) => ({ ...p, status:"opened",  timeAgo:`${i*17+42}m ago` })),
    ...profiles.slice(replied+clicked+opened, replied+clicked+opened+sentRest).map((p,i) => ({ ...p, status:"sent", timeAgo:`${i*20+110}m ago` })),
  ];

  const ST = {
    replied: { bg:"var(--green-50)",  fg:"var(--green)",  label:"Replied"  },
    clicked: { bg:"var(--accent-50)", fg:"var(--accent)", label:"Clicked"  },
    opened:  { bg:"var(--blue-50)",   fg:"var(--blue)",   label:"Opened"   },
    sent:    { bg:"var(--surface-3)", fg:"var(--text-3)", label:"Sent"     },
  };

  const stats = [
    { label:"Sent",     value:c.sent,      base:c.sent,      icon:"send",  color:"var(--text-3)"  },
    { label:"Delivered",value:c.delivered, base:c.sent,      icon:"check", color:"var(--blue)"    },
    { label:"Opened",   value:c.opened,    base:c.delivered, icon:"eye",   color:"var(--accent)"  },
    { label:"Clicked",  value:c.clicked,   base:c.delivered, icon:"click", color:"var(--accent)"  },
    { label:"Replied",  value:c.replied,   base:c.delivered, icon:"reply", color:"var(--green)"   },
    { label:"Bounced",  value:c.bounced,   base:c.sent,      icon:"x",     color:"var(--red)"     },
  ];

  return (
    <div className="fade-in">
      {c.status === "sending" && (
        <div className="card card-pad" style={{ marginBottom:"var(--gap)" }}>
          <div className="row" style={{ justifyContent:"space-between", marginBottom:12 }}>
            <span className="row" style={{ gap:8, fontWeight:600 }}>
              <span className="live-dot" />Sending in progress
            </span>
            <span className="mono" style={{ fontSize:"var(--fs-sm)", color:"var(--text-2)" }}>
              {c.sent.toLocaleString()} / {c.audience.toLocaleString()}
            </span>
          </div>
          <EProg value={rate(c.sent, c.audience)} height={8} />
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns:"1.4fr 1fr", gap:"var(--gap)", alignItems:"start" }}>
        {/* Recipients table */}
        <div className="card" style={{ overflow:"hidden" }}>
          <div className="card-head">
            <div className="card-title">Recipients</div>
            <span className="card-sub">{recipients.length} shown</span>
          </div>
          <div style={{ maxHeight:440, overflowY:"auto" }}>
            <table className="tbl">
              <thead style={{ position:"sticky", top:0, background:"var(--surface)", zIndex:1 }}>
                <tr><th>Name</th><th>Company</th><th>Status</th><th style={{ textAlign:"right" }}>When</th></tr>
              </thead>
              <tbody>
                {recipients.map((p, i) => {
                  const st = ST[p.status] || ST.sent;
                  return (
                    <tr key={i}>
                      <td><div className="row" style={{ gap:8 }}><EAvatar name={`${p.first} ${p.last}`} size={26} /><span style={{ fontWeight:600 }}>{p.first} {p.last}</span></div></td>
                      <td style={{ color:"var(--text-2)" }}>{p.company}</td>
                      <td><span style={{ display:"inline-flex", alignItems:"center", height:20, padding:"0 8px",
                        borderRadius:99, fontSize:11, fontWeight:600, background:st.bg, color:st.fg }}>{st.label}</span></td>
                      <td style={{ textAlign:"right", color:"var(--text-4)", fontSize:"var(--fs-xs)", whiteSpace:"nowrap" }}>{p.timeAgo}</td>
                    </tr>
                  );
                })}
                {recipients.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign:"center", color:"var(--text-4)", padding:"32px 0" }}>No activity yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Stats breakdown */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {stats.map(({ label, value, base, icon, color }) => {
            const pct = base > 0 ? Math.round(value / base * 100) : 0;
            return (
              <div key={label} className="card" style={{ padding:"11px 16px" }}>
                <div className="row" style={{ justifyContent:"space-between", marginBottom:7 }}>
                  <div className="row" style={{ gap:9 }}>
                    <div style={{ width:26, height:26, borderRadius:7, background:"var(--surface-3)",
                      display:"grid", placeItems:"center", flexShrink:0 }}>
                      <EIcon name={icon} size={13} style={{ color }} />
                    </div>
                    <span style={{ fontWeight:500, fontSize:"var(--fs-sm)" }}>{label}</span>
                  </div>
                  <div className="row" style={{ gap:7 }}>
                    <span className="mono" style={{ fontWeight:700, fontSize:14, color }}>{value.toLocaleString()}</span>
                    {label !== "Sent" && base > 0 && (
                      <span style={{ fontSize:11, color:"var(--text-4)" }}>{pct}%</span>
                    )}
                  </div>
                </div>
                <div style={{ height:3, background:"var(--surface-3)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:pct+"%", background:color, borderRadius:99, transition:"width .4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CampaignDetail({ c, onBack, onSave }) {
  const [tab, setTab] = useStateE("overview");
  const [editing, setEditing] = useStateE(false);
  const funnel = [
    { label: "Sent", value: c.sent, color: "#94a3b8" },
    { label: "Delivered", value: c.delivered, color: "#2563eb" },
    { label: "Opened", value: c.opened, color: "#4f46e5" },
    { label: "Clicked", value: c.clicked, color: "#7c3aed" },
    { label: "Replied", value: c.replied, color: "#15a36e" },
  ];
  return (
    <div className="page-wide fade-in" style={{ maxWidth: 1320 }}>
      <div className="row" style={{ gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}><EIcon name="chevL" size={18} /></button>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />
            <span className="page-title" style={{ fontSize: 20 }}>{c.name}</span>
            <EStatus status={c.status} />
          </div>
          <div className="row" style={{ gap: 6, marginTop: 5, color: "var(--text-3)", fontSize: "var(--fs-sm)" }}>
            <EIcon name="mail" size={14} /><span>Subject:</span><span style={{ color: "var(--text-2)" }}>{c.subject}</span>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <EButton variant="secondary" icon="edit" onClick={() => setEditing(true)}>Edit</EButton>
          {c.status === "draft" || c.status === "scheduled" ? <EButton variant="primary" icon="send">Send now</EButton> : <EButton variant="secondary" icon="pause">Pause</EButton>}
        </div>
      </div>

      {c.status === "sending" && (
        <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 11 }}>
            <span className="row" style={{ gap: 9, fontWeight: 600, fontSize: "var(--fs-sm)" }}><span className="live-dot" />{c.schedule}</span>
            <span className="mono" style={{ fontSize: "var(--fs-sm)", color: "var(--text-2)" }}>{rate(c.sent, c.audience)}%</span>
          </div>
          <EProg value={rate(c.sent, c.audience)} height={8} />
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <EPills items={[{ id: "overview", label: "Overview" }, { id: "progress", label: "Progress" }, { id: "audience", label: "Audience" }, { id: "content", label: "Content" }]} value={tab} onChange={setTab} />
      </div>

      {tab === "overview" && (
        c.sent === 0 ? <div className="card"><window.EmptyState icon="megaphone" title="Not sent yet" desc="Stats will appear here once this campaign starts sending." /></div> : (
          <div className="fade-in">
            <div className="grid" style={{ gridTemplateColumns: "repeat(5,1fr)", marginBottom: "var(--gap)" }}>
              <EStat label="Delivered" value={c.delivered.toLocaleString()} sub={`${rate(c.delivered, c.sent)}% of sent`} icon="check" />
              <EStat label="Open rate" value={rate(c.opened, c.delivered) + "%"} accent icon="eye" sub={`${c.opened} opens`} />
              <EStat label="Click rate" value={rate(c.clicked, c.delivered) + "%"} icon="click" sub={`${c.clicked} clicks`} />
              <EStat label="Reply rate" value={rate(c.replied, c.delivered) + "%"} accent icon="reply" sub={`${c.replied} replies`} />
              <EStat label="Bounce rate" value={rate(c.bounced, c.sent) + "%"} icon="x" sub={`${c.bounced} bounced`} />
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
              <div className="card">
                <div className="card-head"><div className="card-title">Delivery funnel</div></div>
                <div className="card-pad"><EFunnel steps={funnel} /></div>
              </div>
              <div className="card">
                <div className="card-head"><div className="card-title">Engagement</div></div>
                <div className="card-pad row" style={{ justifyContent: "space-around", padding: "26px 0" }}>
                  <div style={{ textAlign: "center" }}><EDonut value={rate(c.opened, c.delivered)} label={rate(c.opened, c.delivered) + "%"} sub="open" color="var(--accent)" /><div style={{ marginTop: 8, fontSize: "var(--fs-sm)", fontWeight: 600 }}>Opens</div></div>
                  <div style={{ textAlign: "center" }}><EDonut value={rate(c.replied, c.delivered)} label={rate(c.replied, c.delivered) + "%"} sub="reply" color="var(--green)" /><div style={{ marginTop: 8, fontSize: "var(--fs-sm)", fontWeight: 600 }}>Replies</div></div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {tab === "progress" && <ProgressTab c={c} />}
      {tab === "audience" && <CsvImport />}

      {tab === "content" && (
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
          <div className="card">
            <div className="card-head"><div className="card-title">Compose</div><EBadge variant="accent">Personalized</EBadge></div>
            <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label className="field-label">From</label><input className="input" defaultValue={`${c.fromName} <${c.fromEmail}>`} /></div>
              <div><label className="field-label">Subject line</label><input className="input" defaultValue={c.subject} /></div>
              <div><label className="field-label">Body</label><textarea className="textarea" rows={9} defaultValue={"Hi {{first}},\n\nI've been following what {{company}} is building — impressive traction. We help growth teams run outbound that books meetings.\n\nWorth a quick 15-minute look?\n\nBest,\nAlex"} /></div>
              <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>Merge fields:</span>
                {["{{first}}", "{{company}}", "{{title}}"].map(t => <EToken key={t}>{t}</EToken>)}
              </div>
            </div>
          </div>
          <div>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}><span className="card-title">Live preview</span><EBadge variant="neutral">Sample: Camille</EBadge></div>
            <EmailPreview c={c} />
          </div>
        </div>
      )}

      {editing && (
        <CampaignEditModal c={c} onClose={() => setEditing(false)}
          onSave={patch => { if (onSave) onSave(c.id, patch); setEditing(false); }} />
      )}
    </div>
  );
}

function EmailView({ openId, setOpenId }) {
  const { campaigns: baseCampaigns } = window.DATA;
  const [extraCampaigns, setExtraCampaigns] = useStateE([]);
  const [creating,    setCreating]    = useStateE(false);
  const [overrides,   setOverrides]   = useStateE({});
  const [archivedIds, setArchivedIds] = useStateE(new Set());
  const [showArchived,setShowArchived]= useStateE(false);
  const [menuOpen,    setMenuOpen]    = useStateE(null);

  useEffectE(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const allCampaigns = [...baseCampaigns, ...extraCampaigns]
    .map(c => ({ ...c, ...(overrides[c.id] || {}) }));
  const active   = allCampaigns.filter(c => !archivedIds.has(c.id));
  const archived = allCampaigns.filter(c =>  archivedIds.has(c.id));

  function toggleArchive(id, e) {
    e.stopPropagation();
    setMenuOpen(null);
    setArchivedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function saveCampaign(id, patch) {
    setOverrides(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  }

  if (creating) return (
    <window.NewCampaignWizard
      onClose={() => setCreating(false)}
      onLaunch={c => { setExtraCampaigns(prev => [...prev, c]); setCreating(false); setOpenId(c.id); }}
    />
  );

  const open = allCampaigns.find(c => c.id === openId);
  if (open) return <CampaignDetail c={open} onBack={() => setOpenId(null)} onSave={saveCampaign} />;

  const totalSent  = allCampaigns.reduce((a, c) => a + c.sent, 0);
  const totalOpen  = allCampaigns.reduce((a, c) => a + c.opened, 0);
  const totalDel   = allCampaigns.reduce((a, c) => a + c.delivered, 0);
  const totalReply = allCampaigns.reduce((a, c) => a + c.replied, 0);

  function CampaignRow({ c, isArchived }) {
    return (
      <tr style={{ cursor: isArchived ? "default" : "pointer", opacity: isArchived ? 0.6 : 1 }}
        onClick={() => !isArchived && setOpenId(c.id)}>
        <td>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 3, background: c.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-4)" }}>{c.subject}</div>
            </div>
          </div>
        </td>
        <td className="mono">{c.audience.toLocaleString()}</td>
        <td><span className="mono" style={{ fontWeight: 600 }}>{rate(c.opened, c.delivered)}%</span></td>
        <td className="mono" style={{ color: "var(--text-2)" }}>{rate(c.clicked, c.delivered)}%</td>
        <td><span className="mono" style={{ fontWeight: 600, color: c.replied ? "var(--green)" : "var(--text-3)" }}>{rate(c.replied, c.delivered)}%</span></td>
        <td style={{ color: "var(--text-3)", fontSize: "var(--fs-xs)" }}>{c.schedule}</td>
        <td>
          {isArchived
            ? <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-4)", background: "var(--surface-3)", padding: "2px 8px", borderRadius: 99 }}>Archived</span>
            : <EStatus status={c.status} />
          }
        </td>
        <td style={{ position: "relative", overflow: "visible", width: 44 }} onClick={e => e.stopPropagation()}>
          <button
            style={{ width: 26, height: 26, borderRadius: "var(--r-sm)", border: `1px solid ${menuOpen === c.id ? "var(--border-2)" : "transparent"}`,
              background: menuOpen === c.id ? "var(--surface-3)" : "transparent", display: "grid", placeItems: "center",
              cursor: "pointer", color: menuOpen === c.id ? "var(--text)" : "var(--text-4)", transition: "all .15s",
              opacity: menuOpen === c.id ? 1 : 0.5 }}
            onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === c.id ? null : c.id); }}
          >
            <EIcon name="dots" size={14} strokeWidth={2.5} />
          </button>
          {menuOpen === c.id && (
            <div style={{ position: "absolute", top: "50%", right: 38, zIndex: 50,
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)", boxShadow: "var(--sh-md)", overflow: "hidden", whiteSpace: "nowrap" }}
              onClick={e => e.stopPropagation()}>
              {!isArchived && (
                <button className="btn btn-ghost btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start", padding: "9px 14px", borderRadius: 0 }}
                  onClick={() => { setOpenId(c.id); setMenuOpen(null); }}>
                  <EIcon name="edit" size={13} />Edit
                </button>
              )}
              <button className="btn btn-ghost btn-sm"
                style={{ width: "100%", justifyContent: "flex-start", padding: "9px 14px", borderRadius: 0,
                  color: isArchived ? "var(--accent)" : "var(--text-2)",
                  borderTop: !isArchived ? "1px solid var(--border)" : "none" }}
                onClick={e => toggleArchive(c.id, e)}>
                <EIcon name={isArchived ? "arrowUp" : "inbox"} size={13} />
                {isArchived ? "Unarchive" : "Archive"}
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Email · Campaigns</div>
          <div className="page-title" style={{ marginTop: 4 }}>Campaigns</div>
          <p className="page-desc">Import a CSV, personalize with merge fields, and track opens, clicks and replies in real time.</p>
        </div>
        <EButton variant="primary" icon="plus" onClick={() => setCreating(true)}>New campaign</EButton>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
        <EStat label="Emails sent"      value={totalSent.toLocaleString()}                     icon="send"     sub="all campaigns" />
        <EStat label="Avg. open rate"   value={rate(totalOpen, totalDel) + "%"}   accent icon="eye"      sub="across delivered" />
        <EStat label="Avg. reply rate"  value={rate(totalReply, totalDel) + "%"}  accent icon="reply"    sub="across delivered" />
        <EStat label="Active campaigns" value={active.filter(c => c.status === "sending" || c.status === "scheduled").length} icon="megaphone" sub="sending or scheduled" />
      </div>

      <div className="card" style={{ marginBottom: archived.length > 0 ? "var(--gap)" : 0 }}>
        <div className="card-head">
          <div className="card-title">All campaigns</div>
          <span className="card-sub">{active.length} total</span>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Campaign</th><th>Audience</th><th>Open rate</th><th>Click</th><th>Reply</th><th>Schedule</th><th>Status</th><th style={{ width: 44 }}></th></tr>
          </thead>
          <tbody>
            {active.map(c => <CampaignRow key={c.id} c={c} isArchived={false} />)}
          </tbody>
        </table>
      </div>

      {archived.length > 0 && (
        <div>
          <button className="row"
            style={{ gap: 7, background: "none", border: "none", cursor: "pointer", padding: "4px 0 10px",
              color: "var(--text-3)", fontSize: "var(--fs-sm)", fontWeight: 600 }}
            onClick={() => setShowArchived(v => !v)}>
            <EIcon name={showArchived ? "chevD" : "chevR"} size={14} />
            Archived · {archived.length}
          </button>
          {showArchived && (
            <div className="card">
              <table className="tbl">
                <thead>
                  <tr><th>Campaign</th><th>Audience</th><th>Open rate</th><th>Click</th><th>Reply</th><th>Schedule</th><th>Status</th><th style={{ width: 44 }}></th></tr>
                </thead>
                <tbody>
                  {archived.map(c => <CampaignRow key={c.id} c={c} isArchived={true} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
window.EmailView = EmailView;
