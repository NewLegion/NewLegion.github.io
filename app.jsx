/* App shell + routing + tweaks -> mounts #root */
const { useState, useEffect } = React;
const { Icon, Avatar, Button } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } = window;

const GROUPS = [
  { label: null, items: [{ id: "dashboard", label: "Dashboard", icon: "dashboard" }] },
  { label: "Prospects", icon: "users", color: "var(--green)", items: [
    { id: "prospects", label: "Database",  icon: "contacts" },
    { id: "lists",     label: "Lists",     icon: "filter" },
    { id: "monitor",   label: "Monitor",   icon: "eye" },
  ] },
  { label: "LinkedIn", icon: "linkedin", color: "var(--linkedin)", items: [
    { id: "scraper", label: "Scraper", icon: "scrape" },
    { id: "sequences", label: "Sequences", icon: "flow", badge: 2 },
  ] },
  { label: "Email", icon: "mail", color: "var(--accent)", items: [
    { id: "email",   label: "Campaigns", icon: "megaphone", badge: 1 },
    { id: "warmup", label: "Warmup",    icon: "bolt" },
  ] },
];
const FOOT = [{ id: "settings", label: "Settings", icon: "settings" }];
const ALL = [...GROUPS.flatMap(g => g.items), ...FOOT];
const groupOf = id => GROUPS.find(g => g.items.some(i => i.id === id));
const pageOf = id => ALL.find(i => i.id === id);

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "accent": "indigo",
  "navLayout": "sidebar"
}/*EDITMODE-END*/;

function App({ onSignOut }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [dark, setDark] = useState(() => localStorage.getItem("ob_dark") === "true");
  const [route, setRoute] = useState(() => localStorage.getItem("ob_route") || "dashboard");

  useEffect(() => {
    localStorage.setItem("ob_dark", dark);
    document.documentElement.setAttribute("data-dark", dark);
  }, [dark]);

  // apply on first render too
  useEffect(() => {
    document.documentElement.setAttribute("data-dark", dark);
  }, []);
  const [seqOpen, setSeqOpen] = useState(null);
  const [campOpen, setCampOpen] = useState(null);
  const [updOpen, setUpdOpen] = useState(null);

  useEffect(() => { localStorage.setItem("ob_route", route); }, [route]);

  function go(module, sub) {
    setRoute(module);
    if (module === "sequences") setSeqOpen(sub || null);
    if (module === "email") setCampOpen(sub || null);
    if (module === "updates") setUpdOpen(sub || null);
    document.querySelector(".content")?.scrollTo(0, 0);
  }

  const grp = groupOf(route);
  const page = pageOf(route);

  const NavItem = ({ item }) => (
    <a className={`nav-item${route === item.id ? " active" : ""}`} onClick={() => go(item.id)}>
      <span className="nav-ico"><Icon name={item.icon} size={17} /></span>
      {item.label}
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </a>
  );

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo"><Icon name="target" size={17} /></div>
        <div><div className="brand-name">GrowthLoop</div><div className="brand-sub">Outbound OS</div></div>
      </div>
      <nav className="nav">
        {GROUPS.map((g, i) => (
          <React.Fragment key={i}>
            {g.label && <div className="nav-label">{g.icon && <Icon name={g.icon} size={14} style={{ color: g.color }} />}{g.label}</div>}
            {g.items.map(it => <NavItem key={it.id} item={it} />)}
          </React.Fragment>
        ))}
        <div style={{ flex: 1 }} />
        <div className="nav-label">Workspace</div>
        {FOOT.map(it => <NavItem key={it.id} item={it} />)}
      </nav>
      <div className="sidebar-foot">
        <div className="user-chip" style={{ cursor: "default" }}>
          <Avatar name="Omar Tlati" size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Omar Tlati</div>
          </div>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            title="Sign out"
            onClick={onSignOut}
            style={{ color: "var(--text-4)", flexShrink: 0 }}
          >
            <Icon name="arrowR" size={15} />
          </button>
        </div>
      </div>
    </aside>
  );

  const ContextNav = () => {
    if (!grp || grp.items.length < 2) return <div style={{ fontWeight: 600, fontSize: 14 }}>{page?.label}</div>;
    return (
      <div className="row" style={{ gap: 12 }}>
        {grp.label && <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>{grp.label}<span style={{ margin: "0 8px", color: "var(--text-4)" }}>/</span></span>}
        <div className="subnav">
          {grp.items.map(it => (
            <button key={it.id} className={`subnav-item${route === it.id ? " active" : ""}`} onClick={() => go(it.id)}>{it.label}</button>
          ))}
        </div>
      </div>
    );
  };

  const Topbar = () => (
    <header className="topbar">
      <ContextNav />
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div className="input-group" style={{ width: 230, height: 34 }}>
          <Icon name="search" size={15} style={{ color: "var(--text-4)" }} />
          <input placeholder="Search prospects, campaigns…" />
        </div>
        <button className="btn btn-ghost btn-icon" style={{ position: "relative", flexShrink: 0 }}>
          <Icon name="bell" size={18} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 99, background: "var(--red)", border: "1.5px solid var(--surface)" }} />
        </button>
        <Button variant="primary" size="sm" icon="plus">Create</Button>
      </div>
    </header>
  );

  const TopNav = () => (
    <div className="topnav-bar">
      <div className="brand" style={{ padding: "0 18px 0 0" }}>
        <div className="brand-logo"><Icon name="target" size={17} /></div>
        <div className="brand-name">GrowthLoop</div>
      </div>
      <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 8px" }} />
      {ALL.filter(i => !FOOT.includes(i)).map(it => (
        <a key={it.id} className={`nav-item${route === it.id ? " active" : ""}`} onClick={() => go(it.id)} style={{ height: 34 }}>
          <span className="nav-ico"><Icon name={it.icon} size={16} /></span>{it.label}
          {it.badge && <span className="nav-badge">{it.badge}</span>}
        </a>
      ))}
      <div style={{ flex: 1 }} />
      <button className="btn btn-ghost btn-icon"><Icon name="bell" size={18} /></button>
      <Avatar name="Omar Tlati" size={30} />
    </div>
  );

  const content = (() => {
    switch (route) {
      case "dashboard": return <window.DashboardView go={go} />;
      case "scraper": return <window.ScraperView />;
      case "sequences": return <window.SequencesView openId={seqOpen} setOpenId={setSeqOpen} />;
      case "email": return <window.EmailView openId={campOpen} setOpenId={setCampOpen} />;
      case "warmup": return <window.WarmupView />;

      case "prospects": return <window.ProspectsDB />;
      case "lists":     return <window.ProspectsLists />;
      case "monitor":   return <window.ProspectsMonitor />;
      case "contacts": return <div className="page fade-in"><div className="page-head"><div><div className="eyebrow">Workspace</div><div className="page-title" style={{ marginTop: 4 }}>Contacts</div></div></div><div className="card"><window.EmptyState icon="contacts" title="Your unified contact list" desc="Everyone you've scraped, messaged or emailed — deduped across LinkedIn and email — would live here." action={<Button variant="primary" icon="upload">Import contacts</Button>} /></div></div>;
      case "settings": return <window.SettingsView dark={dark} setDark={setDark} />;
      default: return null;
    }
  })();

  const accents = [["indigo", "#4f46e5"], ["violet", "#7c3aed"], ["teal", "#0d9488"], ["blue", "#2563eb"]];

  return (
    <div className={`app${t.navLayout === "top" ? " topnav" : ""}`} data-density={t.density} data-accent={t.accent} data-dark={dark}>
      {t.navLayout === "top" ? <TopNav /> : <Sidebar />}
      <div className="main">
        {t.navLayout === "top"
          ? <header className="topbar" style={{ height: 48 }}><ContextNav /></header>
          : <Topbar />}
        <div className="content">{content}</div>
      </div>

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio label="Navigation" value={t.navLayout} options={["sidebar", "top"]} onChange={v => setTweak("navLayout", v)} />
        <TweakRadio label="Density" value={t.density} options={["comfortable", "compact"]} onChange={v => setTweak("density", v)} />
        <TweakSection label="Accent" />
        <div style={{ display: "flex", gap: 9, padding: "2px 2px 4px" }}>
          {accents.map(([name, hex]) => (
            <button key={name} onClick={() => setTweak("accent", name)} title={name} style={{
              width: 30, height: 30, borderRadius: 8, background: hex, cursor: "pointer",
              border: t.accent === name ? "2px solid var(--text)" : "2px solid transparent",
              boxShadow: t.accent === name ? "0 0 0 2px #fff inset" : "none" }} />
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

function Root() {
  const [authed, setAuthed] = React.useState(false);

  // Apply persisted dark mode before any render
  React.useEffect(() => {
    document.documentElement.setAttribute("data-dark", localStorage.getItem("ob_dark") === "true");
  }, []);

  function handleAuth() { setAuthed(true); }
  function handleSignOut() {
    localStorage.removeItem("ob_auth");
    setAuthed(false);
  }

  if (!authed) return <window.SignIn onAuth={handleAuth} />;
  return <App onSignOut={handleSignOut} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
