/* Prospects — Database · Lists · Monitor
   Exports: window.ProspectsDB, window.ProspectsLists, window.ProspectsMonitor */

const {
  Icon: PIc, Button: PBtn, Avatar: PAv, StatCard: PSC,
  Progress: PPrg, EmptyState: PEs, Chip: PCh,
  AreaChart: PAc, Sparkline: PSp,
} = window;
const { useState: useSt, useMemo: useMm, useRef: useRf } = React;

/* ─── Prospect Lists mock data ──────────────────────────── */
const PLISTS = [
  { id:"l1", name:"SaaS Founders — EU",      count:412,  color:"#4f46e5", sources:["linkedin"],
    usedIn:[{type:"seq",    name:"SaaS Founders — Q2"}],       created:"May 12",
    health:{ active:404, bounced:3,  unsub:5  },
    spark:[38,42,44,47,52,55,58,61,64,68,71,73,77,82] },
  { id:"l2", name:"Fintech VPs of Sales",    count:188,  color:"#0d9488", sources:["linkedin"],
    usedIn:[{type:"seq",    name:"Fintech VPs of Sales"}],     created:"May 18",
    health:{ active:183, bounced:2,  unsub:3  },
    spark:[18,21,22,24,26,28,30,31,33,35,37,38,40,42] },
  { id:"l3", name:"Spring Campaign Targets", count:824,  color:"#7c3aed", sources:["csv","linkedin"],
    usedIn:[{type:"campaign",name:"Spring Outbound — Founders"}], created:"Apr 28",
    health:{ active:795, bounced:18, unsub:11 },
    spark:[70,78,85,91,95,99,103,107,111,116,120,124,128,132] },
  { id:"l4", name:"Re-engage 2024",          count:1190, color:"#d97706", sources:["csv"],
    usedIn:[{type:"campaign",name:"Re-engage cold leads"}],    created:"Apr 2",
    health:{ active:1121,bounced:42, unsub:27 },
    spark:[120,115,110,105,101,99,97,95,93,92,91,90,89,88] },
  { id:"l5", name:"DevTools Founders",       count:96,   color:"#0891b2", sources:["linkedin"],
    usedIn:[{type:"seq",    name:"DevTools — cold open"}],     created:"May 24",
    health:{ active:93,  bounced:1,  unsub:2  },
    spark:[8,9,10,11,12,13,14,15,16,17,18,18,19,20] },
];

const P_SRCS  = ["linkedin","linkedin","linkedin","csv","csv","manual"];
const P_STATS = ["active","active","active","active","active","active","active","bounced","unsubscribed","do_not_contact"];
const P_DATES = ["Jun 4","Jun 3","Jun 3","Jun 2","Jun 2","Jun 1","May 31","May 30","May 29","May 28","May 27","May 26","May 25","May 24","May 20","May 18","May 15","May 12"];

let _pcache = null;
function getProspects() {
  if (!_pcache) {
    _pcache = (window.DATA.seedProfiles || []).map((p, i) => ({
      ...p,
      source:   P_SRCS[i  % P_SRCS.length],
      status:   P_STATS[i % P_STATS.length],
      addedDate:P_DATES[i % P_DATES.length],
      listIds:  PLISTS.filter((_, li) => (i + li) % 3 === 0).map(l => l.id),
    }));
  }
  return _pcache;
}

const SRC_CFG = {
  linkedin:{ label:"LinkedIn", color:"var(--linkedin)", icon:"linkedin" },
  csv:     { label:"CSV",      color:"var(--green)",    icon:"doc" },
  manual:  { label:"Manual",   color:"var(--text-3)",   icon:"user" },
};
const ST_CFG = {
  active:        { bg:"var(--green-50)",  fg:"var(--green)"  },
  bounced:       { bg:"var(--red-50)",    fg:"var(--red)"    },
  unsubscribed:  { bg:"var(--amber-50)", fg:"var(--amber)"  },
  do_not_contact:{ bg:"var(--surface-3)",fg:"var(--text-3)" },
};

/* ── Upload List Modal ──────────────────────────────────── */
function UploadModal({ onClose, onImport }) {
  const [drag,    setDrag]    = useSt(false);
  const [fileName,setFileName]= useSt(null);
  const [hdrs,    setHdrs]    = useSt([]);
  const [csvRows, setCsvRows] = useSt([]);
  const [mapping, setMapping] = useSt({});
  const fileRef = useRf(null);
  const FIELDS = ["First name","Last name","Email","Company","Title","Location"];

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { hdrs:[], rows:[] };
    const h = lines[0].split(",").map(v => v.trim().replace(/^"|"$/g,""));
    const data = lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g,""));
      const obj = {}; h.forEach((col,i) => { obj[col] = vals[i] || ""; }); return obj;
    }).filter(r => Object.values(r).some(v => v));
    return { hdrs: h, rows: data };
  }

  function autoMap(h) {
    const m = {};
    const norm = s => s.toLowerCase().replace(/[^a-z]/g,"");
    FIELDS.forEach(f => {
      const fn = norm(f);
      const match = h.find(col => norm(col).includes(fn.slice(0,4)) || fn.includes(norm(col)));
      if (match) m[f] = match;
    });
    return m;
  }

  function handleFile(file) {
    if (!file || !file.name.endsWith(".csv")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const { hdrs: h, rows } = parseCSV(e.target.result);
      setHdrs(h); setCsvRows(rows); setMapping(autoMap(h));
    };
    reader.readAsText(file);
  }

  const getMapped = (row, field) => { const col = mapping[field]; return col ? row[col] || "" : ""; };

  function doImport() {
    const base = Date.now();
    onImport(csvRows.map((row, i) => {
      const first   = getMapped(row,"First name") || "Unknown";
      const last    = getMapped(row,"Last name")  || "";
      const company = getMapped(row,"Company")    || "—";
      return { id:base+i, first, last, title:getMapped(row,"Title"), company,
        domain: company.toLowerCase().replace(/[^a-z]/g,"")+".com",
        email:getMapped(row,"Email"), location:getMapped(row,"Location"),
        source:"csv", status:"active", addedDate:"Jun 5", listIds:[] };
    }));
    onClose();
  }

  const hasData = csvRows.length > 0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}>
      <div className="card" style={{ width:"100%", maxWidth:760, maxHeight:"88vh",
        display:"flex", flexDirection:"column", boxShadow:"var(--sh-pop)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"18px 22px 16px", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontWeight:650, fontSize:16 }}>Upload prospect list</div>
            <div style={{ fontSize:"var(--fs-sm)", color:"var(--text-3)", marginTop:2 }}>Import a CSV to add prospects to your database</div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><PIc name="x" size={16} /></button>
        </div>

        <div style={{ overflowY:"auto", padding:22, display:"flex", flexDirection:"column", gap:18 }}>
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current && fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            style={{ border:`2px dashed ${drag?"var(--accent)":"var(--border-2)"}`,
              borderRadius:"var(--r-md)", padding:"32px 24px", textAlign:"center",
              background:drag?"var(--accent-50)":"var(--surface-2)", cursor:"pointer", transition:"all .15s" }}>
            <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files[0])} />
            <div style={{ width:44, height:44, borderRadius:12, background:"var(--surface-3)", display:"grid", placeItems:"center", color:"var(--accent)", margin:"0 auto 12px" }}>
              <PIc name="upload" size={20} />
            </div>
            {fileName
              ? <React.Fragment>
                  <div style={{ fontWeight:600, fontSize:14 }}>{fileName}</div>
                  <div style={{ color:"var(--text-3)", fontSize:"var(--fs-sm)", marginTop:3 }}>{csvRows.length} rows detected · click to replace</div>
                </React.Fragment>
              : <React.Fragment>
                  <div style={{ fontWeight:600, fontSize:14 }}>Drop a CSV file here</div>
                  <div style={{ color:"var(--text-3)", fontSize:"var(--fs-sm)", marginTop:3 }}>or click to browse · columns auto-mapped</div>
                </React.Fragment>
            }
          </div>

          {/* Column mapping */}
          {hasData && (
            <div>
              <div style={{ fontWeight:600, fontSize:"var(--fs-sm)", color:"var(--text-2)", marginBottom:10 }}>Column mapping</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {FIELDS.map(field => (
                  <div key={field}>
                    <label className="field-label">{field}</label>
                    <select className="input select" value={mapping[field] || ""}
                      onChange={e => setMapping({...mapping, [field]: e.target.value || undefined})}>
                      <option value="">— skip —</option>
                      {hdrs.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {hasData && (
            <div>
              <div style={{ fontWeight:600, fontSize:"var(--fs-sm)", color:"var(--text-2)", marginBottom:10 }}>
                Preview <span style={{ color:"var(--text-4)", fontWeight:400 }}>· first 5 rows</span>
              </div>
              <div style={{ borderRadius:"var(--r-sm)", border:"1px solid var(--border)", overflow:"hidden" }}>
                <table className="tbl">
                  <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Title</th><th>Location</th></tr></thead>
                  <tbody>
                    {csvRows.slice(0,5).map((row, i) => {
                      const name = [getMapped(row,"First name"),getMapped(row,"Last name")].filter(Boolean).join(" ") || "—";
                      return (
                        <tr key={i}>
                          <td><div className="row" style={{ gap:8 }}><PAv name={name} size={26} /><span style={{ fontWeight:600 }}>{name}</span></div></td>
                          <td className="mono" style={{ color:"var(--text-2)", fontSize:"var(--fs-xs)" }}>{getMapped(row,"Email")||"—"}</td>
                          <td>{getMapped(row,"Company")||"—"}</td>
                          <td style={{ color:"var(--text-2)" }}>{getMapped(row,"Title")||"—"}</td>
                          <td style={{ color:"var(--text-3)" }}>{getMapped(row,"Location")||"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Template hint */}
          {!hasData && (
            <div className="card card-pad" style={{ background:"var(--surface-2)" }}>
              <div style={{ fontSize:"var(--fs-sm)", fontWeight:600, color:"var(--text-2)", marginBottom:10 }}>Expected CSV format</div>
              <div style={{ overflowX:"auto" }}>
                <table className="tbl">
                  <thead><tr><th>first_name</th><th>last_name</th><th>email</th><th>company</th><th>title</th><th>location</th></tr></thead>
                  <tbody>
                    <tr>
                      <td style={{ color:"var(--text-3)" }}>Sophie</td><td style={{ color:"var(--text-3)" }}>Martin</td>
                      <td className="mono" style={{ color:"var(--text-3)", fontSize:"var(--fs-xs)" }}>sophie@notion.com</td>
                      <td style={{ color:"var(--text-3)" }}>Notion</td>
                      <td style={{ color:"var(--text-3)" }}>Head of Growth</td>
                      <td style={{ color:"var(--text-3)" }}>Paris, FR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop:12 }}>
                <PIc name="download" size={13} />Download template
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:"var(--fs-sm)", color:"var(--text-3)" }}>
            {hasData ? `${csvRows.length} prospects ready to import` : "No file selected"}
          </span>
          <div className="row" style={{ gap:8 }}>
            <PBtn variant="secondary" onClick={onClose}>Cancel</PBtn>
            <PBtn variant="primary" icon="upload" onClick={doImport} disabled={!hasData}>
              Import{hasData ? ` ${csvRows.length}` : ""} prospects
            </PBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Add Prospect Modal ──────────────────────────────────── */
function AddProspectModal({ onClose, onAdd }) {
  const [form,  setForm]  = useSt({ first:"", last:"", title:"", company:"", email:"", location:"" });
  const [lists, setLists] = useSt([]);
  const [flash, setFlash] = useSt(false);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const toggleList = id => setLists(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  function handleSave(andAnother) {
    if (!form.first.trim()) return;
    const company = form.company.trim() || "—";
    onAdd({
      id: Date.now() + Math.random(),
      first: form.first.trim(), last: form.last.trim(),
      title: form.title.trim(), company,
      domain: company.toLowerCase().replace(/[^a-z]/g,"")+".com",
      email: form.email.trim(), location: form.location.trim(),
      source:"manual", status:"active", addedDate:"Jun 5", listIds: lists,
    });
    if (andAnother) {
      setForm({ first:"", last:"", title:"", company:"", email:"", location:"" });
      setLists([]);
      setFlash(true);
      setTimeout(() => setFlash(false), 2000);
    } else {
      onClose();
    }
  }

  const valid = form.first.trim().length > 0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200, display:"grid", placeItems:"center" }}
      onClick={onClose}>
      <div className="card card-pad" style={{ width:500, maxHeight:"92vh", overflowY:"auto", boxShadow:"var(--sh-pop)" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontWeight:650, fontSize:16 }}>Add prospect</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><PIc name="x" size={16} /></button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label className="field-label">First name <span style={{ color:"var(--red)" }}>*</span></label>
              <input className="input" value={form.first} onChange={e => set("first",e.target.value)} placeholder="Sophie" autoFocus />
            </div>
            <div>
              <label className="field-label">Last name</label>
              <input className="input" value={form.last} onChange={e => set("last",e.target.value)} placeholder="Martin" />
            </div>
          </div>
          <div>
            <label className="field-label">Job title</label>
            <input className="input" value={form.title} onChange={e => set("title",e.target.value)} placeholder="Head of Growth" />
          </div>
          <div>
            <label className="field-label">Company</label>
            <input className="input" value={form.company} onChange={e => set("company",e.target.value)} placeholder="Notion" />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => set("email",e.target.value)} placeholder="sophie@notion.com" />
          </div>
          <div>
            <label className="field-label">Location</label>
            <input className="input" value={form.location} onChange={e => set("location",e.target.value)} placeholder="Paris, FR" />
          </div>

          <div>
            <label className="field-label">Add to lists <span style={{ color:"var(--text-4)", fontWeight:400 }}>(optional)</span></label>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {PLISTS.map(l => (
                <label key={l.id} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer",
                  padding:"8px 10px", borderRadius:"var(--r-sm)",
                  border:`1px solid ${lists.includes(l.id) ? l.color : "var(--border)"}`,
                  background: lists.includes(l.id) ? l.color+"0e" : "transparent",
                  transition:"all .13s" }}>
                  <input type="checkbox" checked={lists.includes(l.id)} onChange={() => toggleList(l.id)}
                    style={{ cursor:"pointer", accentColor:l.color }} />
                  <div style={{ width:8, height:8, borderRadius:99, background:l.color, flexShrink:0 }} />
                  <span style={{ fontWeight:500, fontSize:"var(--fs-sm)", flex:1 }}>{l.name}</span>
                  <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)", fontWeight:600 }}>{l.count.toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {flash && (
          <div style={{ marginTop:14, padding:"10px 14px", borderRadius:"var(--r-sm)",
            background:"var(--green-50)", color:"var(--green)", fontSize:"var(--fs-sm)", fontWeight:600,
            display:"flex", alignItems:"center", gap:8 }}>
            <PIc name="checkCircle" size={15} /> Prospect saved — add another
          </div>
        )}

        <div className="row" style={{ gap:8, justifyContent:"flex-end", marginTop:20 }}>
          <PBtn variant="secondary" onClick={onClose}>Cancel</PBtn>
          <PBtn variant="secondary" onClick={() => handleSave(true)} disabled={!valid}>Save &amp; add another</PBtn>
          <PBtn variant="primary" icon="plus" onClick={() => handleSave(false)} disabled={!valid}>Add prospect</PBtn>
        </div>
      </div>
    </div>
  );
}

/* expose lists + prospect getter for cross-view usage */
window.PLISTS = PLISTS;
window.getProspects = getProspects;

/* ══════════════════════════════════════════════════════════
   DATABASE VIEW
══════════════════════════════════════════════════════════ */
function ProspectsDB() {
  const [q,          setQ]          = useSt("");
  const [srcF,       setSrcF]       = useSt("all");
  const [stF,        setStF]        = useSt("all");
  const [sel,        setSel]        = useSt(new Set());
  const [extras,     setExtras]     = useSt([]);
  const [deleted,    setDeleted]    = useSt(new Set());
  const [sort,       setSort]       = useSt({ col:null, dir:"asc" });
  const [showUpload, setShowUpload] = useSt(false);
  const [showAdd,    setShowAdd]    = useSt(false);

  const all  = useMm(() => [...getProspects(), ...extras].filter(p => !deleted.has(p.id)), [extras, deleted]);
  const rows = useMm(() => {
    const filtered = all.filter(p => {
      const s = `${p.first} ${p.last} ${p.company} ${p.email || ""}`.toLowerCase();
      if (q && !s.includes(q.toLowerCase())) return false;
      if (srcF !== "all" && p.source !== srcF) return false;
      if (stF  !== "all" && p.status !== stF)  return false;
      return true;
    });
    if (!sort.col) return filtered;
    const key = p => {
      switch (sort.col) {
        case "name":     return `${p.first} ${p.last}`.toLowerCase();
        case "title":    return (p.title    || "").toLowerCase();
        case "company":  return (p.company  || "").toLowerCase();
        case "email":    return (p.email    || "").toLowerCase();
        case "location": return (p.location || "").toLowerCase();
        case "source":   return (p.source   || "").toLowerCase();
        case "status":   return (p.status   || "").toLowerCase();
        case "lists":    return String(p.listIds.length).padStart(4, "0");
        case "added":    return (p.addedDate|| "").toLowerCase();
        default: return "";
      }
    };
    return [...filtered].sort((a, b) => {
      const cmp = key(a).localeCompare(key(b));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [all, q, srcF, stF, sort]);

  const toggleAll  = () => setSel(sel.size === rows.length ? new Set() : new Set(rows.map(p => p.id)));
  const handleSort = col => setSort(prev => ({ col, dir: prev.col === col && prev.dir === "asc" ? "desc" : "asc" }));
  const toggleRow = id => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n); };

  const total  = all.length;
  const wEmail = all.filter(p => p.email).length;
  const wLI    = all.filter(p => p.source === "linkedin").length;
  const thisWk = all.filter(p => ["Jun 4","Jun 3","Jun 2","Jun 1"].includes(p.addedDate)).length;

  return (
    <div className="page fade-in" style={{ maxWidth:1320 }}>

      {/* ── Header ── */}
      <div className="page-head">
        <div>
          <div className="eyebrow">Prospects</div>
          <div className="page-title" style={{ marginTop:4 }}>Database</div>
          <p className="page-desc">All prospects across every channel — deduplicated and searchable.</p>
        </div>
        <div className="row" style={{ gap:9 }}>
          <PBtn variant="secondary" size="sm" icon="download">Export CSV</PBtn>
          <PBtn variant="secondary" size="sm" icon="upload" onClick={() => setShowUpload(true)}>Upload list</PBtn>
          <PBtn variant="primary"   size="sm" icon="plus"   onClick={() => setShowAdd(true)}>Add prospect</PBtn>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid" style={{ gridTemplateColumns:"repeat(4,1fr)", marginBottom:"var(--gap)" }}>
        <PSC label="Total prospects" value={total.toLocaleString()}  icon="contacts" accent delta="+34"  deltaDir="up" sub="all time" />
        <PSC label="With email"      value={wEmail.toLocaleString()} icon="mail"           delta="+12"  deltaDir="up" sub={`${Math.round(wEmail/total*100)}% coverage`} />
        <PSC label="From LinkedIn"   value={wLI.toLocaleString()}    icon="linkedin"                    sub="scraped or imported" />
        <PSC label="Added this week" value={String(thisWk)}          icon="bolt"     accent delta="+8"  deltaDir="up" sub="vs last week" />
      </div>

      {/* ── Toolbar ── */}
      <div className="row" style={{ gap:9, marginBottom:"var(--gap)", flexWrap:"wrap" }}>
        <div className="input-group" style={{ flex:1, minWidth:200 }}>
          <PIc name="search" size={15} style={{ color:"var(--text-4)" }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, company, email…" />
          {q && (
            <button onClick={() => setQ("")} style={{ border:"none", background:"transparent", cursor:"pointer", color:"var(--text-4)", display:"grid", placeItems:"center", padding:0 }}>
              <PIc name="x" size={14} />
            </button>
          )}
        </div>
        <select className="input select" style={{ width:148 }} value={srcF} onChange={e => setSrcF(e.target.value)}>
          <option value="all">All sources</option>
          <option value="linkedin">LinkedIn</option>
          <option value="csv">CSV import</option>
          <option value="manual">Manual</option>
        </select>
        <select className="input select" style={{ width:148 }} value={stF} onChange={e => setStF(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="bounced">Bounced</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="do_not_contact">Do not contact</option>
        </select>
        <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)", fontWeight:600, whiteSpace:"nowrap", alignSelf:"center" }}>
          {rows.length.toLocaleString()} results
        </span>
      </div>

      {/* ── Bulk action bar ── */}
      {sel.size > 0 && (
        <div className="card" style={{ marginBottom:"var(--gap)", padding:"10px 16px", background:"var(--accent-50)", border:"1px solid var(--accent-100)", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <span style={{ fontWeight:600, fontSize:"var(--fs-sm)", color:"var(--accent-700)" }}>{sel.size} selected</span>
          <div style={{ width:1, height:20, background:"var(--accent-200)", flexShrink:0 }} />
          <PBtn variant="secondary" size="sm" icon="filter">Add to list</PBtn>
          <PBtn variant="secondary" size="sm" icon="send">Use in campaign</PBtn>
          <PBtn variant="secondary" size="sm" icon="flow">Add to sequence</PBtn>
          <PBtn variant="secondary" size="sm" icon="download">Export</PBtn>
          <div style={{ flex:1 }} />
          <PBtn variant="ghost" size="sm" icon="trash" style={{ color:"var(--red)" }} onClick={() => {
            setDeleted(prev => { const next = new Set(prev); sel.forEach(id => next.add(id)); return next; });
            setSel(new Set());
          }}>Delete {sel.size > 1 ? `${sel.size} prospects` : "prospect"}</PBtn>
          <button onClick={() => setSel(new Set())} style={{ border:"none", background:"transparent", cursor:"pointer", color:"var(--text-3)", display:"grid", placeItems:"center" }}>
            <PIc name="x" size={15} />
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width:40, paddingRight:4 }}>
                  <input type="checkbox" checked={sel.size > 0 && sel.size === rows.length} onChange={toggleAll} style={{ cursor:"pointer" }} />
                </th>
                {[["name","Name"],["title","Title"],["company","Company"],["email","Email"],["location","Location"],["source","Source"],["status","Status"],["lists","Lists"]].map(([col, label]) => (
                  <th key={col} onClick={() => handleSort(col)} style={{ cursor:"pointer", userSelect:"none" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:4,
                      color: sort.col === col ? "var(--accent)" : undefined }}>
                      {label}
                      <span style={{ fontSize:9, opacity: sort.col === col ? 1 : 0.3 }}>
                        {sort.col === col ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </span>
                  </th>
                ))}
                <th onClick={() => handleSort("added")} style={{ textAlign:"right", cursor:"pointer", userSelect:"none" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4, justifyContent:"flex-end",
                    color: sort.col === "added" ? "var(--accent)" : undefined }}>
                    Added
                    <span style={{ fontSize:9, opacity: sort.col === "added" ? 1 : 0.3 }}>
                      {sort.col === "added" ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(p => {
                const src = SRC_CFG[p.source] || SRC_CFG.manual;
                const st  = ST_CFG[p.status]  || ST_CFG.active;
                const pls = PLISTS.filter(l => p.listIds.includes(l.id));
                return (
                  <tr key={p.id}>
                    <td style={{ paddingRight:4 }}>
                      <input type="checkbox" checked={sel.has(p.id)} onChange={() => toggleRow(p.id)} style={{ cursor:"pointer" }} />
                    </td>
                    <td>
                      <div className="row" style={{ gap:9 }}>
                        <PAv name={`${p.first} ${p.last}`} size={28} />
                        <span style={{ fontWeight:600 }}>{p.first} {p.last}</span>
                      </div>
                    </td>
                    <td style={{ color:"var(--text-2)" }}>{p.title}</td>
                    <td>
                      <div className="row" style={{ gap:7 }}>
                        <div style={{ width:18, height:18, borderRadius:4, background:"var(--surface-3)", display:"grid", placeItems:"center", fontSize:9, fontWeight:700, color:"var(--text-3)", flexShrink:0 }}>
                          {p.company[0]}
                        </div>
                        {p.company}
                      </div>
                    </td>
                    <td className="mono" style={{ color:"var(--text-2)", fontSize:"var(--fs-xs)" }}>{p.email || "—"}</td>
                    <td style={{ color:"var(--text-3)" }}>{p.location}</td>
                    <td>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11.5, fontWeight:600, color:src.color }}>
                        <PIc name={src.icon} size={12} style={{ color:src.color }} />
                        {src.label}
                      </span>
                    </td>
                    <td>
                      <span style={{ display:"inline-flex", alignItems:"center", height:20, padding:"0 7px", borderRadius:99, fontSize:11, fontWeight:600, background:st.bg, color:st.fg }}>
                        {p.status === "do_not_contact" ? "DNC" : p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {pls.slice(0, 2).map(l => (
                          <span key={l.id} style={{ height:20, padding:"0 7px", borderRadius:99, fontSize:11, fontWeight:600, background:l.color+"18", color:l.color, display:"inline-flex", alignItems:"center", whiteSpace:"nowrap" }}>
                            {l.name.length > 18 ? l.name.slice(0,16)+"…" : l.name}
                          </span>
                        ))}
                        {pls.length > 2 && <span style={{ fontSize:11, color:"var(--text-4)", fontWeight:600 }}>+{pls.length-2}</span>}
                      </div>
                    </td>
                    <td style={{ textAlign:"right", color:"var(--text-3)", fontSize:"var(--fs-xs)", whiteSpace:"nowrap" }}>
                      {p.addedDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)" }}>Showing {rows.length} of {total.toLocaleString()} prospects</span>
          <div className="row" style={{ gap:6 }}>
            <PBtn variant="secondary" size="sm">← Prev</PBtn>
            <PBtn variant="secondary" size="sm">Next →</PBtn>
          </div>
        </div>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onImport={ps => setExtras(prev => [...prev, ...ps])}
        />
      )}
      {showAdd && (
        <AddProspectModal
          onClose={() => setShowAdd(false)}
          onAdd={p => setExtras(prev => [...prev, p])}
        />
      )}
    </div>
  );
}

/* ── Scrape jobs surfaced in list wizard ─────────────────── */
const MOCK_SCRAPE_JOBS = [
  { id:"j1", name:"SaaS · Heads of Growth · EU", count:412, withEmail:287, color:"#4f46e5", phase:"done",   createdAt:"Jun 3" },
  { id:"j2", name:"Fintech · VP Sales · 50-500",  count:94,  withEmail:61,  color:"#0d9488", phase:"paused", createdAt:"Jun 4" },
];

/* ── New List Wizard ──────────────────────────────────────── */
function NewListWizard({ onClose, onCreate }) {
  const [step,    setStep]    = useSt("info");
  const [name,    setName]    = useSt("");
  const [desc,    setDesc]    = useSt("");

  /* — scrape — */
  const [selScrape, setSelScrape] = useSt(null);

  /* — csv — */
  const [drag,     setDrag]    = useSt(false);
  const [fileName, setFileName]= useSt(null);
  const [csvHdrs,  setCsvHdrs] = useSt([]);
  const [csvRows,  setCsvRows] = useSt([]);
  const [csvMap,   setCsvMap]  = useSt({});
  const csvRef = useRf(null);
  const CSV_FIELDS = ["First name","Last name","Email","Company","Title","Location"];

  /* — database — */
  const [dbQ,    setDbQ]    = useSt("");
  const [dbSrcF, setDbSrcF] = useSt("all");
  const [dbSel,  setDbSel]  = useSt(new Set());

  /* — manual — */
  const [mForm, setMForm] = useSt({ first:"", last:"", title:"", company:"", email:"", location:"" });
  const [mList, setMList] = useSt([]);

  const setF = (k, v) => setMForm(f => ({...f, [k]: v}));
  const getMapped = (row, field) => { const col = csvMap[field]; return col ? row[col] || "" : ""; };

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { hdrs:[], rows:[] };
    const h = lines[0].split(",").map(v => v.trim().replace(/^"|"$/g,""));
    const data = lines.slice(1).map(line => {
      const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g,""));
      const obj = {}; h.forEach((col,i) => { obj[col] = vals[i] || ""; }); return obj;
    }).filter(r => Object.values(r).some(v => v));
    return { hdrs:h, rows:data };
  }

  function autoMap(h) {
    const m = {};
    const norm = s => s.toLowerCase().replace(/[^a-z]/g,"");
    CSV_FIELDS.forEach(f => {
      const fn = norm(f);
      const match = h.find(col => norm(col).includes(fn.slice(0,4)) || fn.includes(norm(col)));
      if (match) m[f] = match;
    });
    return m;
  }

  function handleCSVFile(file) {
    if (!file || !file.name.endsWith(".csv")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const { hdrs:h, rows } = parseCSV(e.target.result);
      setCsvHdrs(h); setCsvRows(rows); setCsvMap(autoMap(h));
    };
    reader.readAsText(file);
  }

  const dbAll = useMm(() => {
    const all = getProspects();
    return all.filter(p => {
      const s = `${p.first} ${p.last} ${p.company} ${p.email||""}`.toLowerCase();
      if (dbQ && !s.includes(dbQ.toLowerCase())) return false;
      if (dbSrcF !== "all" && p.source !== dbSrcF) return false;
      return true;
    }).slice(0, 80);
  }, [dbQ, dbSrcF]);

  function toggleDbSel(id) {
    setDbSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function addManual() {
    if (!mForm.first.trim()) return;
    setMList(prev => [...prev, { ...mForm, id: Date.now() + Math.random() }]);
    setMForm({ first:"", last:"", title:"", company:"", email:"", location:"" });
  }

  const prospectCount =
    step === "scrape"   ? (selScrape ? (MOCK_SCRAPE_JOBS.find(j => j.id === selScrape)?.count || 0) : 0) :
    step === "csv"      ? csvRows.length :
    step === "database" ? dbSel.size :
    step === "manual"   ? mList.length : 0;

  const canCreate = name.trim().length > 0 && (
    step === "scrape"   ? !!selScrape :
    step === "csv"      ? csvRows.length > 0 :
    step === "database" ? dbSel.size > 0 :
    step === "manual"   ? mList.length > 0 : false
  );

  function handleCreate() {
    const PALETTE = ["#4f46e5","#0d9488","#7c3aed","#d97706","#0891b2","#db2777"];
    const color   = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const srcKey  = step === "scrape" ? "linkedin" : step === "csv" ? "csv" : "manual";
    onCreate({
      id:      "l" + Date.now(),
      name:    name.trim(),
      count:   prospectCount,
      color,
      sources: [srcKey],
      usedIn:  [],
      created: "Jun 7",
      health:  { active: Math.round(prospectCount * 0.97), bounced: 0, unsub: 0 },
      spark:   Array.from({ length:14 }, (_,i) => Math.round(prospectCount * 0.85 * (i / 13))),
    });
  }

  const SOURCE_OPTIONS = [
    { id:"scrape",   icon:"scrape",   label:"Scrape result",     desc:"Import from a LinkedIn scrape job" },
    { id:"csv",      icon:"doc",      label:"CSV upload",        desc:"Import prospects from a CSV file"  },
    { id:"database", icon:"contacts", label:"Existing database", desc:"Select from your prospect DB"     },
    { id:"manual",   icon:"user",     label:"Manual add",        desc:"Type in prospects one by one"     },
  ];
  const STEP_LABELS = { scrape:"From scrape result", csv:"Upload CSV", database:"From database", manual:"Manual add" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
      display:"grid", placeItems:"center", padding:24 }}
      onClick={onClose}>
      <div className="card" style={{ width:"100%", maxWidth: step === "database" ? 860 : 640, maxHeight:"92vh",
        display:"flex", flexDirection:"column", boxShadow:"var(--sh-pop)", transition:"max-width .2s" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"18px 22px 16px", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {step !== "info" && (
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setStep("info")}>
                <PIc name="chevL" size={16} />
              </button>
            )}
            <div>
              <div style={{ fontWeight:650, fontSize:16 }}>
                {step === "info" ? "New list" : STEP_LABELS[step]}
              </div>
              {step !== "info" && name && (
                <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)", marginTop:2 }}>→ {name}</div>
              )}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><PIc name="x" size={16} /></button>
        </div>

        {/* Body */}
        <div style={{ overflowY:"auto", padding:22, flex:1, display:"flex", flexDirection:"column", gap:16 }}>

          {/* ── Info: name + source picker ── */}
          {step === "info" && (
            <React.Fragment>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label className="field-label">List name <span style={{ color:"var(--red)" }}>*</span></label>
                  <input className="input" value={name} onChange={e => setName(e.target.value)}
                    placeholder="SaaS CTOs — Series B" autoFocus />
                </div>
                <div>
                  <label className="field-label">Description <span style={{ color:"var(--text-4)", fontWeight:400 }}>(optional)</span></label>
                  <input className="input" value={desc} onChange={e => setDesc(e.target.value)}
                    placeholder="What's this list for?" />
                </div>
              </div>
              <div>
                <label className="field-label" style={{ display:"block", marginBottom:10 }}>Populate from</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {SOURCE_OPTIONS.map(opt => (
                    <button key={opt.id}
                      onClick={() => { if (name.trim()) setStep(opt.id); }}
                      style={{ textAlign:"left", border:"1px solid var(--border-2)", borderRadius:"var(--r-md)",
                        padding:"14px 16px", background:"var(--surface)",
                        cursor: name.trim() ? "pointer" : "not-allowed",
                        opacity: name.trim() ? 1 : 0.45,
                        transition:"all .13s", display:"flex", gap:12, alignItems:"flex-start" }}
                      onMouseEnter={e => { if (name.trim()) { e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.background="var(--accent-50)"; }}}
                      onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border-2)"; e.currentTarget.style.background="var(--surface)"; }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:"var(--surface-3)",
                        display:"grid", placeItems:"center", color:"var(--accent)", flexShrink:0 }}>
                        <PIc name={opt.icon} size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight:650, fontSize:14 }}>{opt.label}</div>
                        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)", marginTop:3 }}>{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {!name.trim() && (
                  <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-4)", marginTop:8, textAlign:"center" }}>
                    Enter a list name first to unlock sources
                  </div>
                )}
              </div>
            </React.Fragment>
          )}

          {/* ── Scrape picker ── */}
          {step === "scrape" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {MOCK_SCRAPE_JOBS.map(job => {
                const isSel = selScrape === job.id;
                const badge = job.phase === "done"
                  ? { bg:"var(--green-50)", fg:"var(--green)", label:"Complete" }
                  : { bg:"var(--amber-50)", fg:"var(--amber)", label:"Paused" };
                return (
                  <div key={job.id} onClick={() => setSelScrape(job.id)}
                    style={{ border:`2px solid ${isSel ? job.color : "var(--border)"}`,
                      borderRadius:"var(--r-md)", padding:"14px 16px", cursor:"pointer", transition:"all .13s",
                      background: isSel ? job.color+"0d" : "var(--surface)", display:"flex", gap:14, alignItems:"center" }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:job.color+"18",
                      display:"grid", placeItems:"center", flexShrink:0 }}>
                      <PIc name="linkedin" size={18} style={{ color:job.color }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:650, fontSize:14 }}>{job.name}</div>
                      <div style={{ display:"flex", gap:14, marginTop:5 }}>
                        <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)" }}>
                          <b style={{ color:"var(--text-2)" }}>{job.count.toLocaleString()}</b> profiles
                        </span>
                        <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)" }}>
                          <b style={{ color:"var(--green)" }}>{job.withEmail.toLocaleString()}</b> with email
                        </span>
                        <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-4)" }}>Scraped {job.createdAt}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:99,
                        background:badge.bg, color:badge.fg }}>{badge.label}</span>
                      <div style={{ width:20, height:20, borderRadius:99,
                        border:`2px solid ${isSel ? job.color : "var(--border-2)"}`,
                        background: isSel ? job.color : "transparent",
                        display:"grid", placeItems:"center", transition:"all .13s", flexShrink:0 }}>
                        {isSel && <PIc name="check" size={11} style={{ color:"#fff" }} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              {selScrape && (
                <div style={{ padding:"11px 14px", borderRadius:"var(--r-sm)", background:"var(--accent-50)",
                  border:"1px solid var(--accent-100)", fontSize:"var(--fs-sm)", color:"var(--accent-700)",
                  display:"flex", alignItems:"center", gap:8 }}>
                  <PIc name="checkCircle" size={15} style={{ color:"var(--accent)", flexShrink:0 }} />
                  <span>
                    <b>{MOCK_SCRAPE_JOBS.find(j => j.id === selScrape)?.count.toLocaleString()}</b> prospects will be added to "<b>{name}</b>"
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── CSV upload ── */}
          {step === "csv" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div
                onClick={() => csvRef.current && csvRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleCSVFile(e.dataTransfer.files[0]); }}
                style={{ border:`2px dashed ${drag ? "var(--accent)" : "var(--border-2)"}`,
                  borderRadius:"var(--r-md)", padding:"28px 24px", textAlign:"center",
                  background: drag ? "var(--accent-50)" : "var(--surface-2)", cursor:"pointer", transition:"all .15s" }}>
                <input ref={csvRef} type="file" accept=".csv" style={{ display:"none" }}
                  onChange={e => handleCSVFile(e.target.files[0])} />
                <div style={{ width:40, height:40, borderRadius:12, background:"var(--surface-3)",
                  display:"grid", placeItems:"center", color:"var(--accent)", margin:"0 auto 10px" }}>
                  <PIc name="upload" size={18} />
                </div>
                {fileName
                  ? <React.Fragment>
                      <div style={{ fontWeight:600, fontSize:14 }}>{fileName}</div>
                      <div style={{ color:"var(--text-3)", fontSize:"var(--fs-sm)", marginTop:2 }}>{csvRows.length} rows · click to replace</div>
                    </React.Fragment>
                  : <React.Fragment>
                      <div style={{ fontWeight:600, fontSize:14 }}>Drop a CSV file here</div>
                      <div style={{ color:"var(--text-3)", fontSize:"var(--fs-sm)", marginTop:2 }}>or click to browse · columns auto-mapped</div>
                    </React.Fragment>
                }
              </div>
              {csvRows.length > 0 && (
                <React.Fragment>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"var(--fs-sm)", color:"var(--text-2)", marginBottom:8 }}>Column mapping</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                      {CSV_FIELDS.map(field => (
                        <div key={field}>
                          <label className="field-label">{field}</label>
                          <select className="input select" value={csvMap[field] || ""}
                            onChange={e => setCsvMap(m => ({...m, [field]: e.target.value || undefined}))}>
                            <option value="">— skip —</option>
                            {csvHdrs.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"var(--fs-sm)", color:"var(--text-2)", marginBottom:8 }}>
                      Preview <span style={{ color:"var(--text-4)", fontWeight:400 }}>· first 4 rows</span>
                    </div>
                    <div style={{ borderRadius:"var(--r-sm)", border:"1px solid var(--border)", overflow:"hidden" }}>
                      <table className="tbl">
                        <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Title</th></tr></thead>
                        <tbody>
                          {csvRows.slice(0,4).map((row, i) => {
                            const nm = [getMapped(row,"First name"),getMapped(row,"Last name")].filter(Boolean).join(" ") || "—";
                            return (
                              <tr key={i}>
                                <td><div className="row" style={{ gap:7 }}><PAv name={nm} size={24} /><span style={{ fontWeight:600 }}>{nm}</span></div></td>
                                <td className="mono" style={{ color:"var(--text-2)", fontSize:"var(--fs-xs)" }}>{getMapped(row,"Email")||"—"}</td>
                                <td>{getMapped(row,"Company")||"—"}</td>
                                <td style={{ color:"var(--text-2)" }}>{getMapped(row,"Title")||"—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </React.Fragment>
              )}
              {!fileName && (
                <div className="card card-pad" style={{ background:"var(--surface-2)" }}>
                  <div style={{ fontSize:"var(--fs-sm)", fontWeight:600, color:"var(--text-2)", marginBottom:8 }}>Expected format</div>
                  <table className="tbl">
                    <thead><tr><th>first_name</th><th>last_name</th><th>email</th><th>company</th><th>title</th></tr></thead>
                    <tbody>
                      <tr>
                        <td style={{ color:"var(--text-3)" }}>Sophie</td>
                        <td style={{ color:"var(--text-3)" }}>Martin</td>
                        <td className="mono" style={{ color:"var(--text-3)", fontSize:"var(--fs-xs)" }}>sophie@notion.com</td>
                        <td style={{ color:"var(--text-3)" }}>Notion</td>
                        <td style={{ color:"var(--text-3)" }}>Head of Growth</td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop:10 }}>
                    <PIc name="download" size={13} />Download template
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Existing database ── */}
          {step === "database" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                <div className="input-group" style={{ flex:1, minWidth:200 }}>
                  <PIc name="search" size={15} style={{ color:"var(--text-4)" }} />
                  <input value={dbQ} onChange={e => setDbQ(e.target.value)}
                    placeholder="Search name, company, email…" autoFocus />
                  {dbQ && (
                    <button onClick={() => setDbQ("")}
                      style={{ border:"none", background:"transparent", cursor:"pointer", color:"var(--text-4)", display:"grid", placeItems:"center", padding:0 }}>
                      <PIc name="x" size={14} />
                    </button>
                  )}
                </div>
                <select className="input select" style={{ width:140 }} value={dbSrcF} onChange={e => setDbSrcF(e.target.value)}>
                  <option value="all">All sources</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="csv">CSV</option>
                  <option value="manual">Manual</option>
                </select>
                {dbSel.size > 0 && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <span style={{ fontSize:"var(--fs-sm)", fontWeight:700, color:"var(--accent)", whiteSpace:"nowrap" }}>
                      {dbSel.size} selected
                    </span>
                    <button onClick={() => setDbSel(new Set())}
                      style={{ border:"none", background:"transparent", cursor:"pointer", color:"var(--text-4)", display:"grid", placeItems:"center" }}>
                      <PIc name="x" size={13} />
                    </button>
                  </div>
                )}
              </div>
              <div style={{ border:"1px solid var(--border)", borderRadius:"var(--r-md)", overflow:"hidden", maxHeight:380, overflowY:"auto" }}>
                <table className="tbl">
                  <thead style={{ position:"sticky", top:0, background:"var(--surface)", zIndex:1 }}>
                    <tr>
                      <th style={{ width:40 }}>
                        <input type="checkbox"
                          checked={dbAll.length > 0 && dbAll.every(p => dbSel.has(p.id))}
                          onChange={() => {
                            const allSel = dbAll.every(p => dbSel.has(p.id));
                            setDbSel(prev => {
                              const n = new Set(prev);
                              if (allSel) { dbAll.forEach(p => n.delete(p.id)); }
                              else        { dbAll.forEach(p => n.add(p.id)); }
                              return n;
                            });
                          }} style={{ cursor:"pointer" }} />
                      </th>
                      <th>Name</th><th>Title</th><th>Company</th><th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbAll.map(p => {
                      const src = SRC_CFG[p.source] || SRC_CFG.manual;
                      return (
                        <tr key={p.id}
                          style={{ background: dbSel.has(p.id) ? "var(--accent-50)" : undefined, cursor:"pointer" }}
                          onClick={() => toggleDbSel(p.id)}>
                          <td onClick={e => e.stopPropagation()}>
                            <input type="checkbox" checked={dbSel.has(p.id)} onChange={() => toggleDbSel(p.id)} style={{ cursor:"pointer" }} />
                          </td>
                          <td>
                            <div className="row" style={{ gap:8 }}>
                              <PAv name={`${p.first} ${p.last}`} size={26} />
                              <span style={{ fontWeight:600 }}>{p.first} {p.last}</span>
                            </div>
                          </td>
                          <td style={{ color:"var(--text-2)" }}>{p.title}</td>
                          <td>{p.company}</td>
                          <td>
                            <span style={{ fontSize:11.5, fontWeight:600, color:src.color, display:"flex", alignItems:"center", gap:4 }}>
                              <PIc name={src.icon} size={12} style={{ color:src.color }} />{src.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)" }}>
                Showing {dbAll.length} of {getProspects().length.toLocaleString()} · click rows to select
              </div>
            </div>
          )}

          {/* ── Manual add ── */}
          {step === "manual" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="card card-pad" style={{ background:"var(--surface-2)" }}>
                <div style={{ fontWeight:600, fontSize:"var(--fs-sm)", color:"var(--text-2)", marginBottom:10 }}>Add a prospect</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[
                    { key:"first",    label:"First name", req:true,  ph:"Sophie",          t:"text"  },
                    { key:"last",     label:"Last name",             ph:"Martin",          t:"text"  },
                    { key:"email",    label:"Email",                 ph:"sophie@notion.com",t:"email" },
                    { key:"company",  label:"Company",               ph:"Notion",          t:"text"  },
                    { key:"title",    label:"Title",                 ph:"Head of Growth",  t:"text"  },
                    { key:"location", label:"Location",              ph:"Paris, FR",       t:"text"  },
                  ].map(({ key, label, req, ph, t }) => (
                    <div key={key}>
                      <label className="field-label">{label}{req && <span style={{ color:"var(--red)" }}> *</span>}</label>
                      <input className="input" type={t} value={mForm[key]}
                        onChange={e => setF(key, e.target.value)}
                        placeholder={ph}
                        autoFocus={key === "first"}
                        onKeyDown={e => e.key === "Enter" && addManual()} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}>
                  <PBtn variant="secondary" size="sm" icon="plus" onClick={addManual} disabled={!mForm.first.trim()}>
                    Add to list
                  </PBtn>
                </div>
              </div>
              {mList.length > 0 ? (
                <div style={{ border:"1px solid var(--border)", borderRadius:"var(--r-md)", overflow:"hidden", maxHeight:240, overflowY:"auto" }}>
                  <table className="tbl">
                    <thead style={{ position:"sticky", top:0, background:"var(--surface)", zIndex:1 }}>
                      <tr><th>Name</th><th>Email</th><th>Company</th><th>Title</th><th style={{ width:36 }}></th></tr>
                    </thead>
                    <tbody>
                      {mList.map((p, i) => (
                        <tr key={i}>
                          <td><div className="row" style={{ gap:8 }}><PAv name={`${p.first} ${p.last}`} size={24} /><span style={{ fontWeight:600 }}>{p.first} {p.last}</span></div></td>
                          <td className="mono" style={{ color:"var(--text-2)", fontSize:"var(--fs-xs)" }}>{p.email||"—"}</td>
                          <td>{p.company||"—"}</td>
                          <td style={{ color:"var(--text-2)" }}>{p.title||"—"}</td>
                          <td>
                            <button className="btn btn-ghost btn-icon btn-sm" style={{ color:"var(--text-4)" }}
                              onClick={() => setMList(prev => prev.filter((_,j) => j !== i))}>
                              <PIc name="x" size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"24px 0", color:"var(--text-4)", fontSize:"var(--fs-sm)" }}>
                  No prospects added yet — fill the form and click "Add to list"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== "info" && (
          <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
            <span style={{ fontSize:"var(--fs-sm)", color:"var(--text-3)" }}>
              {prospectCount > 0
                ? <React.Fragment><b style={{ color:"var(--text)" }}>{prospectCount.toLocaleString()}</b> prospects ready</React.Fragment>
                : "Select prospects to continue"
              }
            </span>
            <div className="row" style={{ gap:8 }}>
              <PBtn variant="secondary" onClick={() => setStep("info")}>Back</PBtn>
              <PBtn variant="primary" icon="plus" onClick={handleCreate} disabled={!canCreate}>
                Create list{prospectCount > 0 ? ` · ${prospectCount.toLocaleString()}` : ""}
              </PBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LISTS VIEW
══════════════════════════════════════════════════════════ */
function ProspectsLists() {
  const [drill,      setDrill]      = useSt(null);
  const [showNew,    setShowNew]    = useSt(false);
  const [extraLists, setExtraLists] = useSt([]);

  const allLists = useMm(() => [...PLISTS, ...extraLists], [extraLists]);

  function handleCreate(newList) {
    setExtraLists(prev => [newList, ...prev]);
    setShowNew(false);
  }

  /* ── Drill-in: single list ── */
  if (drill) {
    const list      = allLists.find(l => l.id === drill);
    const prospects = getProspects().filter(p => p.listIds.includes(drill));
    return (
      <div className="page fade-in" style={{ maxWidth:1320 }}>
        <div className="page-head">
          <div className="row" style={{ gap:12, alignItems:"center" }}>
            <button onClick={() => setDrill(null)} className="btn btn-secondary btn-icon btn-sm">
              <PIc name="chevL" size={16} />
            </button>
            <div>
              <div className="eyebrow">Lists</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:4 }}>
                <div className="page-title">{list.name}</div>
                <span style={{ height:26, padding:"0 11px", borderRadius:99, fontSize:12.5, fontWeight:700,
                  background:list.color+"18", color:list.color, display:"inline-flex", alignItems:"center" }}>
                  {list.count.toLocaleString()} prospects
                </span>
              </div>
            </div>
          </div>
          <div className="row" style={{ gap:9 }}>
            <PBtn variant="secondary" size="sm" icon="download">Export</PBtn>
            <PBtn variant="secondary" size="sm" icon="send">Use in campaign</PBtn>
            <PBtn variant="secondary" size="sm" icon="flow">Use in sequence</PBtn>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns:"repeat(4,1fr)", marginBottom:"var(--gap)" }}>
          <PSC label="Total in list"  value={list.count.toLocaleString()}        icon="users"       />
          <PSC label="Active"         value={list.health.active.toLocaleString()} icon="checkCircle" accent />
          <PSC label="Bounced"        value={String(list.health.bounced)}         icon="x"           sub="removed from sends" />
          <PSC label="Unsubscribed"   value={String(list.health.unsub)}           icon="bell"        sub="opt-out" />
        </div>

        <div className="card" style={{ overflow:"hidden" }}>
          <div className="card-head">
            <div className="card-title">Prospects in this list</div>
            <span className="card-sub">{prospects.length} shown (sample)</span>
          </div>
          {prospects.length > 0 ? (
            <div style={{ overflowX:"auto" }}>
              <table className="tbl">
                <thead>
                  <tr><th>Name</th><th>Title</th><th>Company</th><th>Email</th><th>Location</th><th>Status</th><th style={{ textAlign:"right" }}>Added</th></tr>
                </thead>
                <tbody>
                  {prospects.map(p => {
                    const st = ST_CFG[p.status] || ST_CFG.active;
                    return (
                      <tr key={p.id}>
                        <td><div className="row" style={{ gap:9 }}><PAv name={`${p.first} ${p.last}`} size={28} /><span style={{ fontWeight:600 }}>{p.first} {p.last}</span></div></td>
                        <td style={{ color:"var(--text-2)" }}>{p.title}</td>
                        <td>{p.company}</td>
                        <td className="mono" style={{ color:"var(--text-2)", fontSize:"var(--fs-xs)" }}>{p.email || "—"}</td>
                        <td style={{ color:"var(--text-3)" }}>{p.location}</td>
                        <td><span style={{ display:"inline-flex", alignItems:"center", height:20, padding:"0 7px", borderRadius:99, fontSize:11, fontWeight:600, background:st.bg, color:st.fg }}>{p.status}</span></td>
                        <td style={{ textAlign:"right", color:"var(--text-3)", fontSize:"var(--fs-xs)" }}>{p.addedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding:"52px 0", textAlign:"center", color:"var(--text-4)" }}>
              <PIc name="users" size={28} style={{ opacity:.25, margin:"0 auto 12px", display:"block" }} />
              <div style={{ fontSize:"var(--fs-sm)", fontWeight:600 }}>No prospects loaded yet</div>
              <div style={{ fontSize:"var(--fs-xs)", marginTop:4 }}>Prospects will appear once the list is populated.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Lists grid ── */
  return (
    <div className="page fade-in" style={{ maxWidth:1320 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Prospects</div>
          <div className="page-title" style={{ marginTop:4 }}>Lists</div>
          <p className="page-desc">Segment prospects into reusable lists. Attach to sequences or email campaigns.</p>
        </div>
        <PBtn variant="primary" size="sm" icon="plus" onClick={() => setShowNew(true)}>New list</PBtn>
      </div>

      <div className="grid" style={{ gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))" }}>
        {allLists.map(list => (
          <div key={list.id} className="card card-pad"
            onClick={() => setDrill(list.id)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--sh-md)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--sh-xs)"}
            style={{ cursor:"pointer", transition:"box-shadow .15s", display:"flex", flexDirection:"column", gap:16 }}>

            {/* Icon + count */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:list.color+"18", display:"grid", placeItems:"center" }}>
                  <PIc name="users" size={18} style={{ color:list.color }} />
                </div>
                <div style={{ fontWeight:650, fontSize:15, letterSpacing:"-.01em" }}>{list.name}</div>
              </div>
              <span className="mono" style={{ fontSize:26, fontWeight:650, color:list.color, letterSpacing:"-.03em", lineHeight:1 }}>
                {list.count.toLocaleString()}
              </span>
            </div>

            {/* Health bar */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)", fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>Health</span>
                <span style={{ fontSize:"var(--fs-xs)", color:"var(--text-2)", fontWeight:700 }}>{list.count > 0 ? Math.round(list.health.active/list.count*100) : 0}% active</span>
              </div>
              <div style={{ height:6, background:"var(--surface-3)", borderRadius:99, overflow:"hidden", display:"flex", gap:1 }}>
                <div style={{ flex:list.health.active, background:list.color, borderRadius:99, transition:"flex .5s" }} />
                <div style={{ flex:list.health.bounced, background:"var(--red-50)" }} />
                <div style={{ flex:list.health.unsub, background:"var(--amber-50)" }} />
              </div>
              <div className="row" style={{ gap:12, marginTop:6 }}>
                <span style={{ fontSize:11, color:"var(--text-3)" }}>
                  <span style={{ color:"var(--red)", fontWeight:600 }}>{list.health.bounced}</span> bounced
                </span>
                <span style={{ fontSize:11, color:"var(--text-3)" }}>
                  <span style={{ color:"var(--amber)", fontWeight:600 }}>{list.health.unsub}</span> unsub
                </span>
              </div>
            </div>

            {/* Source chips */}
            <div className="row" style={{ gap:6 }}>
              {list.sources.map(s => {
                const sc = SRC_CFG[s] || SRC_CFG.manual;
                return (
                  <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:5, height:22, padding:"0 9px", borderRadius:99, fontSize:11.5, fontWeight:600, background:"var(--surface-3)", color:"var(--text-2)" }}>
                    <PIc name={sc.icon} size={11} style={{ color:sc.color }} />
                    {sc.label}
                  </span>
                );
              })}
            </div>

            {/* Used in */}
            {list.usedIn.length > 0 && (
              <div>
                <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-4)", fontWeight:600, textTransform:"uppercase", letterSpacing:".04em", marginBottom:6 }}>Used in</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {list.usedIn.map((u, i) => (
                    <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:5, height:24, padding:"0 9px", borderRadius:99, fontSize:11.5, fontWeight:600,
                      background: u.type==="seq" ? "var(--accent-50)" : "var(--blue-50)",
                      color:      u.type==="seq" ? "var(--accent-700)": "var(--blue)" }}>
                      <PIc name={u.type==="seq" ? "flow" : "megaphone"} size={11} />
                      {u.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sparkline + footer */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:8, borderTop:"1px solid var(--border)", marginTop:"auto" }}>
              <div>
                <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-4)", marginBottom:3 }}>Created {list.created}</div>
                <PSp data={list.spark} w={70} h={22} color={list.color} />
              </div>
              <div className="row" style={{ gap:2 }}>
                <PBtn variant="ghost" size="sm" icon="download" title="Export" onClick={e => e.stopPropagation()} />
                <PBtn variant="ghost" size="sm" icon="edit"     title="Rename" onClick={e => e.stopPropagation()} />
                <PBtn variant="ghost" size="sm" icon="trash"    title="Delete" onClick={e => { e.stopPropagation(); setExtraLists(prev => prev.filter(l => l.id !== list.id)); }} />
              </div>
            </div>
          </div>
        ))}

        {/* New list card */}
        <div className="card card-pad"
          onClick={() => setShowNew(true)}
          onMouseEnter={e => { e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.background="var(--accent-50)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border-2)"; e.currentTarget.style.background="transparent"; }}
          style={{ cursor:"pointer", border:"2px dashed var(--border-2)", background:"transparent", boxShadow:"none",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
            minHeight:220, transition:"border-color .15s, background .15s" }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"var(--surface-3)", display:"grid", placeItems:"center", color:"var(--text-3)" }}>
            <PIc name="plus" size={22} />
          </div>
          <div style={{ fontWeight:600, fontSize:14, color:"var(--text-2)" }}>New list</div>
          <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-4)", textAlign:"center", lineHeight:1.6 }}>
            Build a targeted segment from<br />scrape results, CSV, or filters
          </div>
        </div>
      </div>

      {showNew && (
        <NewListWizard
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MONITOR VIEW
══════════════════════════════════════════════════════════ */
function ProspectsMonitor() {
  const liTrend   = [48,52,49,55,58,61,57,63,66,71,68,74,79,82];
  const openTrend = [38,41,39,44,42,46,43,48,45,50,47,52,49,54];
  const DAY_LABELS = ["May 23","","","","","","","","","","","","","Jun 5"];

  const alerts = [
    { prospect:"Sarah Williams", company:"Front",   desc:"Email bounced — address invalid",         sev:"red",   kind:"Bounce",  time:"2h ago"  },
    { prospect:"Omar Haddad",    company:"Aircall",  desc:"Unsubscribed from Spring Outbound",       sev:"amber", kind:"Unsub",   time:"5h ago"  },
    { prospect:"Priya Patel",    company:"Ramp",     desc:"Accepted connection in SaaS Founders Q2", sev:"green", kind:"Accept",  time:"38m ago" },
    { prospect:"Thomas Petit",   company:"Qonto",    desc:"LinkedIn invite expired after 21 days",   sev:"amber", kind:"Expired", time:"1d ago"  },
    { prospect:"Emma Moreau",    company:"Alan",     desc:"Email bounced — domain unreachable",      sev:"red",   kind:"Bounce",  time:"1d ago"  },
  ];
  const SEV = { red:["var(--red-50)","var(--red)"], amber:["var(--amber-50)","var(--amber)"], green:["var(--green-50)","var(--green)"] };

  function MiniStat({ label, value, delta, good }) {
    return (
      <div className="card card-pad" style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)", fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>{label}</div>
        <div className="row" style={{ alignItems:"baseline", gap:8 }}>
          <span style={{ fontSize:24, fontWeight:650, letterSpacing:"-.03em",
            color: good === true ? "var(--green)" : good === false ? "var(--red)" : "var(--text)" }}>
            {value}
          </span>
          {delta && (
            <span style={{ fontSize:"var(--fs-xs)", fontWeight:600, color:"var(--green)" }}>{delta}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in" style={{ maxWidth:1320 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Prospects</div>
          <div className="page-title" style={{ marginTop:4 }}>Monitor</div>
          <p className="page-desc">Health of your outreach pipeline across LinkedIn and email.</p>
        </div>
      </div>

      {/* ── Two columns ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--gap)", marginBottom:"var(--gap)" }}>

        {/* LinkedIn */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--gap)" }}>
          <div className="row" style={{ gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"var(--blue-50)", display:"grid", placeItems:"center" }}>
              <PIc name="linkedin" size={18} style={{ color:"var(--linkedin)" }} />
            </div>
            <span style={{ fontWeight:650, fontSize:16 }}>LinkedIn</span>
          </div>

          <div className="grid" style={{ gridTemplateColumns:"1fr 1fr", gap:"var(--gap-sm)" }}>
            <MiniStat label="Acceptance rate" value="53%"   delta="+4%"  good={true}  />
            <MiniStat label="Pending invites" value="142"                              />
            <MiniStat label="Reply rate"      value="23.3%" delta="+1.2%" good={true}  />
            <MiniStat label="Avg reply time"  value="2.4d"                             />
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Acceptance rate</div>
              <span className="card-sub">Last 14 days</span>
            </div>
            <div style={{ padding:"14px var(--pad-card)" }}>
              <PAc data={liTrend} height={130} color="var(--linkedin)" labels={DAY_LABELS} />
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Pending invites by sequence</div></div>
            <div style={{ padding:"8px 0" }}>
              {[
                { name:"SaaS Founders — Q2",   pending:68, total:412, color:"#4f46e5" },
                { name:"Fintech VPs of Sales",  pending:41, total:188, color:"#0d9488" },
                { name:"DevTools — cold open",  pending:33, total:96,  color:"#0891b2" },
              ].map((s, i) => (
                <div key={i} style={{ padding:"10px var(--pad-card)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:"var(--fs-sm)", fontWeight:500 }}>{s.name}</span>
                    <span className="mono" style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)" }}>{s.pending} pending</span>
                  </div>
                  <div style={{ height:6, background:"var(--surface-3)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ width:`${Math.round(s.pending/s.total*100)}%`, height:"100%", background:s.color, borderRadius:99, transition:"width .6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email */}
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--gap)" }}>
          <div className="row" style={{ gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"var(--accent-50)", display:"grid", placeItems:"center" }}>
              <PIc name="mail" size={18} style={{ color:"var(--accent)" }} />
            </div>
            <span style={{ fontWeight:650, fontSize:16 }}>Email</span>
          </div>

          <div className="grid" style={{ gridTemplateColumns:"1fr 1fr", gap:"var(--gap-sm)" }}>
            <MiniStat label="Open rate"       value="41.8%" delta="+3.2%" good={true}  />
            <MiniStat label="Bounce rate"     value="2.1%"  delta="−0.4%" good={true}  />
            <MiniStat label="Unsubscribe"     value="0.6%"                              />
            <MiniStat label="Spam complaints" value="0.02%"               good={true}  />
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Open rate trend</div>
              <span className="card-sub">Last 14 days</span>
            </div>
            <div style={{ padding:"14px var(--pad-card)" }}>
              <PAc data={openTrend} height={130} color="var(--accent)" labels={DAY_LABELS} />
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Domain health</div></div>
            <div>
              {[
                { domain:"growthloop.io",          spf:true,  dkim:true,  dmarc:true,  rep:98 },
                { domain:"outbound.growthloop.io", spf:true,  dkim:true,  dmarc:false, rep:84 },
              ].map((d, i, arr) => (
                <div key={d.domain} style={{ padding:"14px var(--pad-card)", borderBottom: i < arr.length-1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                    <span className="mono" style={{ fontSize:"var(--fs-sm)", fontWeight:600 }}>{d.domain}</span>
                    <span style={{ fontSize:13, fontWeight:700, color: d.rep >= 90 ? "var(--green)" : "var(--amber)" }}>
                      {d.rep}<span style={{ fontSize:11, fontWeight:600, color:"var(--text-3)" }}>/100</span>
                    </span>
                  </div>
                  <div className="row" style={{ gap:7, marginBottom:9 }}>
                    {[["SPF",d.spf],["DKIM",d.dkim],["DMARC",d.dmarc]].map(([lbl,ok]) => (
                      <span key={lbl} style={{ display:"inline-flex", alignItems:"center", gap:4, height:22, padding:"0 8px", borderRadius:99, fontSize:11, fontWeight:600,
                        background:ok?"var(--green-50)":"var(--red-50)", color:ok?"var(--green)":"var(--red)" }}>
                        <PIc name={ok?"check":"x"} size={10} />{lbl}
                      </span>
                    ))}
                  </div>
                  <PPrg value={d.rep} color={d.rep >= 90 ? "var(--green)" : "var(--amber)"} height={5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alerts table ── */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Recent alerts</div>
          <span className="card-sub">Bounces, unsubscribes, expirations</span>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Prospect</th><th>Alert</th><th>Type</th><th style={{ textAlign:"right" }}>Time</th></tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => {
              const [bg, fg] = SEV[a.sev] || SEV.amber;
              return (
                <tr key={i}>
                  <td>
                    <div className="row" style={{ gap:9 }}>
                      <PAv name={a.prospect} size={28} />
                      <div>
                        <div style={{ fontWeight:600 }}>{a.prospect}</div>
                        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text-3)" }}>{a.company}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color:"var(--text-2)" }}>{a.desc}</td>
                  <td>
                    <span style={{ display:"inline-flex", alignItems:"center", height:22, padding:"0 8px", borderRadius:99, fontSize:11, fontWeight:600, background:bg, color:fg }}>
                      {a.kind}
                    </span>
                  </td>
                  <td style={{ textAlign:"right", color:"var(--text-3)", fontSize:"var(--fs-xs)", whiteSpace:"nowrap" }}>{a.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { ProspectsDB, ProspectsLists, ProspectsMonitor });
