/* Dashboard view -> window.DashboardView */
const { Icon: DIcon, StatCard, AreaChart, BarChart, Avatar, StatusBadge, Button, Funnel, Badge } = window;

function ActivityIcon({ kind }) {
  const map = {
    reply: ["reply", "var(--green)", "var(--green-50)"],
    accept: ["check", "var(--accent)", "var(--accent-50)"],
    open: ["eye", "var(--blue)", "var(--blue-50)"],
    meeting: ["calendar", "var(--accent)", "var(--accent-50)"],
    click: ["click", "var(--amber)", "var(--amber-50)"],
    unsub: ["x", "var(--text-3)", "var(--surface-3)"],
  };
  const [ic, c, bg] = map[kind] || map.open;
  return <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, color: c, display: "grid", placeItems: "center", flex: "0 0 30px" }}><DIcon name={ic} size={15} /></div>;
}

function DashboardView({ go }) {
  const { days, activity, sequences, campaigns } = window.DATA;
  const sentSeries = days.map(d => d.sent);
  const labels = ["", "", "Mon", "", "", "Thu", "", "", "Sun", "", "", "Wed", "", "Today"];

  const QuickAction = ({ icon, title, desc, onClick, accent }) => (
    <button onClick={onClick} style={{ textAlign: "left", border: "1px solid var(--border)", background: "var(--surface)",
      borderRadius: "var(--r)", padding: "13px 14px", display: "flex", gap: 12, alignItems: "center", transition: "all .14s", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-200)"; e.currentTarget.style.boxShadow = "var(--sh-sm)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent-50)", color: "var(--accent)", display: "grid", placeItems: "center", flex: "0 0 34px" }}><DIcon name={icon} size={17} /></div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{title}</div>
        <div style={{ color: "var(--text-3)", fontSize: "var(--fs-xs)" }}>{desc}</div>
      </div>
      <DIcon name="arrowR" size={15} style={{ marginLeft: "auto", color: "var(--text-4)" }} />
    </button>
  );

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Good morning, Alex 👋</div>
          <p className="page-desc">Here's how your outbound is performing across LinkedIn and email this week.</p>
        </div>
        <div className="row">
          <Button icon="download" size="sm">Export</Button>
          <Button variant="primary" icon="plus" onClick={() => go("scraper")}>New prospects</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
        <StatCard label="Prospects scraped" value="4,182" delta="12%" icon="scrape" accent sub="this month" spark={[12,18,15,22,28,25,34]} />
        <StatCard label="Messages sent" value="1,824" delta="8%" icon="send" sub="LinkedIn + email" spark={[20,24,22,30,28,36,40]} />
        <StatCard label="Reply rate" value="21.4%" delta="3.1%" icon="reply" accent sub="vs 18.3% last week" spark={[14,16,15,18,19,20,21]} />
        <StatCard label="Meetings booked" value="22" delta="5" icon="calendar" sub="across all campaigns" spark={[2,3,3,4,5,4,6]} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.7fr 1fr", alignItems: "start", marginBottom: "var(--gap)" }}>
        {/* Volume chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Outbound volume</div>
              <div className="card-sub">Messages sent &amp; replies · last 14 days</div>
            </div>
            <div className="row" style={{ gap: 14 }}>
              <span className="row" style={{ gap: 6, fontSize: "var(--fs-xs)", color: "var(--text-2)" }}><span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--accent)" }} />Sent</span>
              <span className="row" style={{ gap: 6, fontSize: "var(--fs-xs)", color: "var(--text-2)" }}><span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--green)" }} />Replies</span>
            </div>
          </div>
          <div className="card-pad">
            <AreaChart data={sentSeries} labels={labels} height={172} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 14 }}>Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <QuickAction icon="scrape" title="Scrape a search" desc="Paste a Sales Navigator URL" onClick={() => go("scraper")} />
            <QuickAction icon="flow" title="Build a sequence" desc="Automate LinkedIn outreach" onClick={() => go("sequences")} />
            <QuickAction icon="megaphone" title="Launch email campaign" desc="Import a CSV & send" onClick={() => go("email")} />
            <QuickAction icon="doc" title="Write a dev update" desc="Ship patch notes to clients" onClick={() => go("updates")} />
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
        {/* Active campaigns */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Active campaigns</div>
            <Button variant="ghost" size="sm" iconRight="arrowR" onClick={() => go("sequences")}>View all</Button>
          </div>
          <table className="tbl">
            <thead><tr><th>Campaign</th><th>Channel</th><th>Prospects</th><th>Reply rate</th><th>Status</th></tr></thead>
            <tbody>
              {sequences.slice(0, 3).map(s => (
                <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => go("sequences", s.id)}>
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>
                    <span className="row" style={{ gap: 9 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: s.color }} />{s.name}</span>
                  </td>
                  <td><span className="row" style={{ gap: 6, color: "var(--linkedin)" }}><DIcon name="linkedin" size={15} /><span style={{ color: "var(--text-2)" }}>LinkedIn</span></span></td>
                  <td className="mono">{s.prospects}</td>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{s.replyRate}%</span></td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
              {campaigns.slice(0, 1).map(c => (
                <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => go("email", c.id)}>
                  <td style={{ fontWeight: 600 }}><span className="row" style={{ gap: 9 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: c.color }} />{c.name}</span></td>
                  <td><span className="row" style={{ gap: 6, color: "var(--amber)" }}><DIcon name="mail" size={15} /><span style={{ color: "var(--text-2)" }}>Email</span></span></td>
                  <td className="mono">{c.audience}</td>
                  <td><span className="mono" style={{ fontWeight: 600 }}>{Math.round(c.replied / Math.max(c.delivered,1) * 100) || 0}%</span></td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live activity */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Live activity</div>
            <span className="row" style={{ gap: 6, fontSize: "var(--fs-xs)", color: "var(--text-2)", fontWeight: 600 }}><span className="live-dot" />Live</span>
          </div>
          <div style={{ padding: "6px 0" }}>
            {activity.map((a, i) => (
              <div key={i} className="row" style={{ gap: 11, padding: "9px var(--pad-card)", alignItems: "flex-start" }}>
                <ActivityIcon kind={a.kind} />
                <div style={{ flex: 1, minWidth: 0, lineHeight: 1.4 }}>
                  <span style={{ fontSize: "var(--fs-sm)" }}>
                    <b style={{ fontWeight: 600 }}>{a.who}</b> <span style={{ color: "var(--text-2)" }}>{a.action}</span> <span style={{ color: "var(--text)" }}>{a.target}</span>
                  </span>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-4)", marginTop: 1 }}>{a.company} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.DashboardView = DashboardView;
