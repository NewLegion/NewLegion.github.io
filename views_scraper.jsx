/* LinkedIn Scraper view -> window.ScraperView */
const { Icon: SIcon, Button: SButton, Avatar: SAvatar, Progress, EmptyState } = window;
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

const SCRAPE_COLORS = ["#4f46e5","#0d9488","#d97706","#0891b2","#7c3aed","#db2777","#2563eb","#15803d"];

function extractName(url, idx) {
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    const q = u.searchParams.get("query") || u.searchParams.get("keywords");
    if (q) return decodeURIComponent(q).replace(/\+/g, " ").slice(0, 48);
  } catch {}
  return `Scrape #${idx}`;
}

/* ── Create List Modal ─────────────────────────────── */
function CreateListModal({ job, onClose, onCreate }) {
  const [name, setName] = useStateS(job.name);
  const count = job.profileCount || job.profiles.length;
  const withEmail = job.withEmailCount !== undefined ? job.withEmailCount : job.profiles.filter(p => p.email).length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200, display: "grid", placeItems: "center", padding: 24 }}
      onClick={onClose}>
      <div className="card card-pad" style={{ width: 420, boxShadow: "var(--sh-pop)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontWeight: 650, fontSize: 16 }}>Create list from scrape</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><SIcon name="x" size={16} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="field-label">List name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: "var(--r-sm)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div>
              <div className="mono" style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-.02em" }}>{count.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>total profiles</div>
            </div>
            <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />
            <div>
              <div className="mono" style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-.02em", color: "var(--green)" }}>{withEmail.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>with email</div>
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <SButton variant="secondary" onClick={onClose}>Cancel</SButton>
          <SButton variant="primary" icon="plus" onClick={() => { onCreate(name); onClose(); }} disabled={!name.trim()}>
            Create list
          </SButton>
        </div>
      </div>
    </div>
  );
}

/* ── Job Detail View ───────────────────────────────── */
function JobDetail({ job, onBack, onPause, onResume, onDelete, onCreateList }) {
  const [showCreate, setShowCreate] = useStateS(false);
  const scrollRef = useRefS(null);

  const profiles    = job.profiles || [];
  const profileCount= job.profileCount !== undefined ? job.profileCount : profiles.length;
  const withEmail   = job.withEmailCount !== undefined ? job.withEmailCount : profiles.filter(p => p.email).length;
  const pct         = Math.min(Math.round((profileCount / job.target) * 100), 100);
  const running     = job.phase === "scraping";

  const barColor = job.phase === "done" ? "var(--green)" : job.phase === "paused" ? "var(--amber)" : job.color;

  return (
    <div className="page-wide fade-in" style={{ maxWidth: 1280 }}>
      {/* Header */}
      <div className="row" style={{ gap: 12, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}><SIcon name="chevL" size={18} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: job.color, flexShrink: 0 }} />
            <span style={{ fontWeight: 650, fontSize: 20 }}>{job.name}</span>
            {running && <span className="live-dot" />}
            {job.phase === "paused" && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", background: "var(--amber-50)", padding: "2px 9px", borderRadius: 99 }}>Paused</span>
            )}
            {job.phase === "done" && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", background: "var(--green-50)", padding: "2px 9px", borderRadius: 99 }}>Complete</span>
            )}
          </div>
          <div className="mono" style={{ fontSize: "var(--fs-xs)", color: "var(--text-4)", marginTop: 4,
            maxWidth: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {job.url}
          </div>
        </div>
        <div className="row" style={{ gap: 8, flexShrink: 0 }}>
          {job.phase === "scraping" && <SButton variant="secondary" icon="pause" onClick={onPause}>Pause</SButton>}
          {job.phase === "paused"   && <SButton variant="primary"   icon="play"  onClick={onResume}>Resume</SButton>}
          <SButton variant={job.phase === "done" ? "primary" : "secondary"} icon="plus" onClick={() => setShowCreate(true)}>
            Create list
          </SButton>
          <SButton variant="ghost" icon="trash" style={{ color: "var(--red)" }} onClick={onDelete} />
        </div>
      </div>

      {/* Progress card */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <div className="row" style={{ gap: 10 }}>
            {running
              ? <span className="live-dot" />
              : <SIcon name={job.phase === "done" ? "checkCircle" : "pause"} size={17}
                  style={{ color: job.phase === "done" ? "var(--green)" : "var(--amber)" }} />
            }
            <span style={{ fontWeight: 600 }}>
              {running ? "Scraping in progress…" : job.phase === "paused" ? "Paused" : "Scrape complete"}
            </span>
            <span className="mono" style={{ color: "var(--text-3)", fontSize: "var(--fs-sm)" }}>
              {profileCount.toLocaleString()} / {job.target.toLocaleString()}
            </span>
          </div>
          <div className="row" style={{ gap: 24 }}>
            <ScrapeMetric label="Found"      value={profileCount} />
            <ScrapeMetric label="With email" value={withEmail} accent />
            <ScrapeMetric label="Duplicates" value={Math.round(profileCount * 0.04)} />
          </div>
        </div>
        <Progress value={pct} height={8} color={barColor} />
      </div>

      {/* Profile table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-head">
          <div className="card-title">Extracted profiles</div>
          <div className="row" style={{ gap: 8 }}>
            <SButton variant="secondary" size="sm" icon="download">CSV</SButton>
          </div>
        </div>
        <div ref={scrollRef} style={{ maxHeight: 460, overflowY: "auto" }}>
          {profiles.length > 0 ? (
            <table className="tbl">
              <thead style={{ position: "sticky", top: 0, background: "var(--surface)", zIndex: 1 }}>
                <tr><th>Name</th><th>Title</th><th>Company</th><th>Email</th><th>Location</th><th style={{ textAlign: "right" }}>Conns</th></tr>
              </thead>
              <tbody>
                {profiles.map((p, i) => (
                  <tr key={p.id} className={i < 4 && running ? "slide-in" : ""}>
                    <td>
                      <span className="row" style={{ gap: 10 }}>
                        <SAvatar name={`${p.first} ${p.last}`} size={28} />
                        <b style={{ fontWeight: 600 }}>{p.first} {p.last}</b>
                      </span>
                    </td>
                    <td style={{ color: "var(--text-2)" }}>{p.title}</td>
                    <td>
                      <span className="row" style={{ gap: 7 }}>
                        <span style={{ width: 18, height: 18, borderRadius: 4, background: "var(--surface-3)", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700, color: "var(--text-3)", flexShrink: 0 }}>
                          {p.company[0]}
                        </span>
                        {p.company}
                      </span>
                    </td>
                    <td className="mono" style={{ color: "var(--text-2)", fontSize: "var(--fs-xs)" }}>{p.email}</td>
                    <td style={{ color: "var(--text-3)" }}>{p.location}</td>
                    <td className="mono" style={{ textAlign: "right", color: "var(--text-2)" }}>{p.connections.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-4)", fontSize: "var(--fs-sm)" }}>
              No profiles yet — scraping will start populating this table shortly.
            </div>
          )}
          {running && (
            <div className="row" style={{ justifyContent: "center", gap: 9, padding: "14px", color: "var(--text-3)", fontSize: "var(--fs-sm)" }}>
              <span className="live-dot" /> Extracting more profiles…
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateListModal
          job={{ ...job, profileCount, withEmailCount: withEmail }}
          onClose={() => setShowCreate(false)}
          onCreate={name => onCreateList(job.id, name)}
        />
      )}
    </div>
  );
}

/* ── Main Scraper View ─────────────────────────────── */
function ScraperView() {
  const { genProfile, seedProfiles } = window.DATA;

  const [url, setUrl] = useStateS("");
  const [jobCounter, setJobCounter] = useStateS(3);
  const [createdList, setCreatedList] = useStateS(null);

  const [jobs, setJobs] = useStateS(() => [
    {
      id: "j1", color: "#4f46e5",
      name: "SaaS · Heads of Growth · EU",
      url: "https://www.linkedin.com/sales/search/people?query=saas+head+of+growth+EU",
      phase: "done", target: 412,
      profileCount: 412, withEmailCount: 287,
      profiles: (seedProfiles || []).slice(0, 22),
      createdAt: "Jun 3",
    },
    {
      id: "j2", color: "#0d9488",
      name: "Fintech · VP Sales · 50-500",
      url: "https://www.linkedin.com/sales/search/people?query=fintech+vp+sales",
      phase: "paused", target: 188,
      profileCount: 94, withEmailCount: 61,
      profiles: (seedProfiles || []).slice(11, 22),
      createdAt: "Jun 4",
    },
  ]);

  const [selectedJob, setSelectedJob] = useStateS(null);

  /* Single interval drives all scraping jobs */
  useEffectS(() => {
    const timer = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.phase !== "scraping") return job;
        const count = job.profileCount || 0;
        if (count >= job.target) return { ...job, phase: "done", profileCount: job.target };
        const batch = 1 + ((Math.random() * 3) | 0);
        const newProfiles = Array.from({ length: batch }, () => genProfile());
        const updatedProfiles = [...newProfiles, ...(job.profiles || [])].slice(0, 60);
        const newCount = Math.min(count + batch, job.target);
        return { ...job, profiles: updatedProfiles, profileCount: newCount, withEmailCount: Math.round(newCount * 0.7) };
      }));
    }, 240);
    return () => clearInterval(timer);
  }, []);

  function startScraping() {
    if (!url.trim()) return;
    const idx = jobCounter;
    const newJob = {
      id: "j" + idx,
      url: url.trim(),
      name: extractName(url, idx),
      phase: "scraping",
      target: 150 + ((Math.random() * 350) | 0),
      profiles: [],
      profileCount: 0,
      withEmailCount: 0,
      createdAt: "Jun 5",
      color: SCRAPE_COLORS[idx % SCRAPE_COLORS.length],
    };
    setJobs(prev => [newJob, ...prev]);
    setJobCounter(idx + 1);
    setSelectedJob(newJob.id);
    setUrl("");
  }

  const pauseJob  = id => setJobs(prev => prev.map(j => j.id === id ? { ...j, phase: "paused"   } : j));
  const resumeJob = id => setJobs(prev => prev.map(j => j.id === id ? { ...j, phase: "scraping" } : j));
  const deleteJob = id => { setJobs(prev => prev.filter(j => j.id !== id)); if (selectedJob === id) setSelectedJob(null); };
  const createList = (id, name) => setCreatedList(name);

  /* Detail drill-in */
  const selJob = jobs.find(j => j.id === selectedJob);
  if (selJob) {
    return (
      <JobDetail
        job={selJob}
        onBack={() => setSelectedJob(null)}
        onPause={() => pauseJob(selJob.id)}
        onResume={() => resumeJob(selJob.id)}
        onDelete={() => deleteJob(selJob.id)}
        onCreateList={createList}
      />
    );
  }

  /* ── List view ── */
  const groups = [
    { label: "In progress", items: jobs.filter(j => j.phase === "scraping") },
    { label: "Paused",      items: jobs.filter(j => j.phase === "paused")   },
    { label: "Done",        items: jobs.filter(j => j.phase === "done")     },
  ].filter(g => g.items.length > 0);

  function JobRow({ job }) {
    const count   = job.profileCount !== undefined ? job.profileCount : job.profiles.length;
    const pct     = Math.min(Math.round((count / job.target) * 100), 100);
    const running = job.phase === "scraping";

    return (
      <div
        className="row"
        style={{ padding: "11px 16px", gap: 14, cursor: "pointer", transition: "background .12s",
          borderRadius: "var(--r-sm)", alignItems: "center" }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        onClick={() => setSelectedJob(job.id)}
      >
        {/* Icon */}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: job.color + "18",
          color: job.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
          {running
            ? <span className="live-dot" style={{ background: job.color, boxShadow: `0 0 0 3px ${job.color}30` }} />
            : <SIcon name={job.phase === "done" ? "checkCircle" : "pause"} size={16} />
          }
        </div>

        {/* Name + progress bar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)", marginBottom: 6,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {job.name}
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div style={{ flex: 1, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: pct + "%", borderRadius: 99, transition: "width .3s",
                background: job.phase === "done" ? "var(--green)" : job.phase === "paused" ? "var(--amber)" : job.color,
              }} />
            </div>
            <span className="mono" style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap", flexShrink: 0 }}>
              {count.toLocaleString()} / {job.target.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Created */}
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-4)", flexShrink: 0 }}>{job.createdAt}</span>

        {/* Quick actions */}
        <div className="row" style={{ gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {running && (
            <button className="btn btn-ghost btn-icon btn-sm" title="Pause" onClick={() => pauseJob(job.id)}>
              <SIcon name="pause" size={14} />
            </button>
          )}
          {job.phase === "paused" && (
            <button className="btn btn-ghost btn-icon btn-sm" title="Resume" onClick={() => resumeJob(job.id)}>
              <SIcon name="play" size={14} />
            </button>
          )}
          {job.phase === "done" && (
            <button className="btn btn-ghost btn-icon btn-sm" title="Create list" style={{ color: "var(--accent)" }}
              onClick={() => setSelectedJob(job.id)}>
              <SIcon name="plus" size={14} />
            </button>
          )}
          <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: "var(--text-4)" }}
            onClick={() => deleteJob(job.id)}>
            <SIcon name="trash" size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wide fade-in" style={{ maxWidth: 1280 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">LinkedIn · Prospecting</div>
          <div className="page-title" style={{ marginTop: 4 }}>Prospects</div>
          <p className="page-desc">Paste a LinkedIn Sales Navigator URL to start scraping prospects.</p>
        </div>
      </div>

      {/* URL bar */}
      <div className="card card-pad" style={{ marginBottom: "var(--gap)" }}>
        <div className="row" style={{ gap: 10 }}>
          <div className="input-group input-lg" style={{ flex: 1 }}>
            <SIcon name="linkedin" size={18} style={{ color: "var(--linkedin)" }} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && startScraping()}
              placeholder="https://www.linkedin.com/sales/search/people?query=..."
            />
            {url && (
              <button onClick={() => setUrl("")}
                style={{ border: "none", background: "transparent", color: "var(--text-4)", display: "grid", placeItems: "center" }}>
                <SIcon name="x" size={16} />
              </button>
            )}
          </div>
          <SButton variant="primary" icon="scrape" size="lg" onClick={startScraping} disabled={!url.trim()}>
            Start scraping
          </SButton>
        </div>
      </div>

      {/* Jobs */}
      {jobs.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: "center", padding: "56px 0" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--surface-3)", display: "grid", placeItems: "center", color: "var(--text-3)", margin: "0 auto 14px" }}>
            <SIcon name="search" size={22} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>No scraping jobs yet</div>
          <div style={{ color: "var(--text-3)", fontSize: "var(--fs-sm)" }}>Paste a LinkedIn Sales Navigator URL above to get started.</div>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {groups.map((group, gi) => (
            <React.Fragment key={group.label}>
              {gi > 0 && <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />}
              <div style={{ padding: "10px 16px 2px", fontSize: "var(--fs-xs)", fontWeight: 700,
                color: "var(--text-4)", textTransform: "uppercase", letterSpacing: ".07em" }}>
                {group.label} · {group.items.length}
              </div>
              {group.items.map(j => <JobRow key={j.id} job={j} />)}
            </React.Fragment>
          ))}
          <div style={{ height: 8 }} />
        </div>
      )}

      {/* Success banner */}
      {createdList && (
        <div style={{ marginTop: "var(--gap)", padding: "11px 16px", borderRadius: "var(--r-sm)",
          background: "var(--green-50)", border: "1px solid var(--green)",
          display: "flex", alignItems: "center", gap: 10 }}>
          <SIcon name="checkCircle" size={16} style={{ color: "var(--green)", flexShrink: 0 }} />
          <span style={{ fontSize: "var(--fs-sm)", fontWeight: 600, color: "var(--green)" }}>
            List "<b>{createdList}</b>" created — find it in Prospects › Lists
          </span>
          <button onClick={() => setCreatedList(null)}
            style={{ marginLeft: "auto", border: "none", background: "transparent", cursor: "pointer", color: "var(--green)", display: "grid", placeItems: "center" }}>
            <SIcon name="x" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function ScrapeMetric({ label, value, accent }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div className="mono" style={{ fontSize: 19, fontWeight: 650, letterSpacing: "-.02em",
        color: accent ? "var(--accent)" : "var(--text)" }}>
        {(value || 0).toLocaleString()}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

window.ScraperView = ScraperView;
