/* Settings views -> window.SettingsView */
const { Icon: SetIcon, Button: SetButton, Badge: SetBadge } = window;
const { useState: useStateSet } = React;

/* ---- Email Config ---- */
function EmailConfigView({ onBack }) {
  const [provider, setProvider] = useStateSet("gmail");
  const [fromName, setFromName] = useStateSet("Alex Rivera");
  const [fromEmail, setFromEmail] = useStateSet("alex@growthloop.io");
  const [dailyLimit, setDailyLimit] = useStateSet(200);
  const [trackOpens, setTrackOpens] = useStateSet(true);
  const [trackClicks, setTrackClicks] = useStateSet(true);
  const [unsub, setUnsub] = useStateSet(true);
  const [saved, setSaved] = useStateSet(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2200); }

  const providers = [
    { id: "gmail", label: "Gmail", color: "#EA4335" },
    { id: "outlook", label: "Outlook", color: "#0078D4" },
    { id: "smtp", label: "Custom SMTP", color: "var(--text-3)" },
  ];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <button className="btn btn-ghost btn-icon" onClick={onBack}><SetIcon name="chevL" size={18} /></button>
          <div>
            <div className="eyebrow">Settings</div>
            <div className="page-title" style={{ marginTop: 4 }}>Email configuration</div>
          </div>
        </div>
        <SetButton variant="primary" icon="check" onClick={save}>{saved ? "Saved!" : "Save changes"}</SetButton>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)", maxWidth: 640 }}>

        {/* Provider */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 16 }}>Email provider</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {providers.map(p => (
              <button key={p.id} onClick={() => setProvider(p.id)} style={{
                padding: "13px 14px", borderRadius: "var(--r)", border: `1.5px solid ${provider === p.id ? "var(--accent)" : "var(--border-2)"}`,
                background: provider === p.id ? "var(--accent-50)" : "var(--surface)", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, transition: "all .14s",
              }}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: p.color + "22", display: "grid", placeItems: "center" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
                </span>
                <span style={{ fontWeight: 600, fontSize: "var(--fs-sm)", color: provider === p.id ? "var(--accent-700)" : "var(--text)" }}>{p.label}</span>
              </button>
            ))}
          </div>
          {provider === "smtp" && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="field-label">SMTP host</label><input className="input" placeholder="smtp.example.com" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 10 }}>
                <div><label className="field-label">Username</label><input className="input" placeholder="user@example.com" /></div>
                <div><label className="field-label">Port</label><input className="input" placeholder="587" /></div>
              </div>
              <div><label className="field-label">Password</label><input className="input" type="password" placeholder="••••••••••" /></div>
            </div>
          )}
          {(provider === "gmail" || provider === "outlook") && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--accent-50)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", gap: 10 }}>
              <SetIcon name="check" size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "var(--fs-sm)", color: "var(--accent-700)", fontWeight: 500 }}>Connected as <b>alex@growthloop.io</b></span>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", color: "var(--red)" }}>Disconnect</button>
            </div>
          )}
        </div>

        {/* Sender identity */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 16 }}>Sender identity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label className="field-label">From name</label>
              <input className="input" value={fromName} onChange={e => setFromName(e.target.value)} /></div>
            <div><label className="field-label">From email</label>
              <input className="input" type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} /></div>
          </div>
        </div>

        {/* Sending limits */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 4 }}>Sending limits</div>
          <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)", marginBottom: 16 }}>Stay within provider thresholds to protect deliverability.</p>
          <div>
            <label className="field-label">Daily email cap</label>
            <div className="row" style={{ gap: 12 }}>
              <input className="input mono" type="number" value={dailyLimit} min={1} max={2000} style={{ width: 110 }} onChange={e => setDailyLimit(+e.target.value)} />
              <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)" }}>emails / day</span>
            </div>
          </div>
        </div>

        {/* Tracking & compliance */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 16 }}>Tracking &amp; compliance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Track opens", desc: "Add a tracking pixel to measure open rates", val: trackOpens, set: setTrackOpens },
              { label: "Track clicks", desc: "Rewrite links to measure click-through rates", val: trackClicks, set: setTrackClicks },
              { label: "Unsubscribe link", desc: "Append a 1-click unsubscribe footer (recommended)", val: unsub, set: setUnsub },
            ].map(({ label, desc, val, set }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0",
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{label}</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 2 }}>{desc}</div>
                </div>
                <window.Toggle on={val} onChange={set} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---- LinkedIn Config ---- */
function LinkedInConfigView({ onBack }) {
  const [connected, setConnected] = useStateSet(true);
  const [connectLimit, setConnectLimit] = useStateSet(20);
  const [messageLimit, setMessageLimit] = useStateSet(30);
  const [visitLimit, setVisitLimit] = useStateSet(80);
  const [startHour, setStartHour] = useStateSet(9);
  const [endHour, setEndHour] = useStateSet(18);
  const [weekends, setWeekends] = useStateSet(false);
  const [saved, setSaved] = useStateSet(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2200); }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="row" style={{ gap: 12 }}>
          <button className="btn btn-ghost btn-icon" onClick={onBack}><SetIcon name="chevL" size={18} /></button>
          <div>
            <div className="eyebrow">Settings</div>
            <div className="page-title" style={{ marginTop: 4 }}>LinkedIn configuration</div>
          </div>
        </div>
        <SetButton variant="primary" icon="check" onClick={save}>{saved ? "Saved!" : "Save changes"}</SetButton>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)", maxWidth: 640 }}>

        {/* Connection status */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 14 }}>Connected account</div>
          {connected ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <window.Avatar name="Alex Rivera" size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Alex Rivera</div>
                <div style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)" }}>Founder · Pro plan · linkedin.com/in/alexrivera</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="badge badge-green" style={{ gap: 6 }}><span className="dot" />Connected</span>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} onClick={() => setConnected(false)}>Disconnect</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ color: "var(--text-3)", fontSize: "var(--fs-sm)", marginBottom: 16 }}>No LinkedIn account connected. Link your account to enable sequences.</p>
              <SetButton variant="primary" icon="linkedin" onClick={() => setConnected(true)}>Connect LinkedIn</SetButton>
            </div>
          )}
        </div>

        {/* Daily limits */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 4 }}>Daily action limits</div>
          <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)", marginBottom: 18 }}>Keep actions within safe ranges to avoid LinkedIn restrictions.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Connection requests", desc: "Sent per day", val: connectLimit, set: setConnectLimit, max: 40, safe: 20 },
              { label: "Messages", desc: "Sent per day", val: messageLimit, set: setMessageLimit, max: 80, safe: 30 },
              { label: "Profile visits", desc: "Per day", val: visitLimit, set: setVisitLimit, max: 150, safe: 80 },
            ].map(({ label, desc, val, set, max, safe }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{label}</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>{desc} · safe zone ≤ {safe}</div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <input className="input mono" type="number" value={val} min={1} max={max} style={{ width: 80, textAlign: "center" }}
                    onChange={e => set(Math.min(max, +e.target.value))} />
                  {val > safe && <span className="badge badge-amber">⚠ High</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sending window */}
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: 4 }}>Sending window</div>
          <p style={{ fontSize: "var(--fs-sm)", color: "var(--text-3)", marginBottom: 16 }}>Actions only run within these hours (prospect's local time).</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="row" style={{ gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Start time</label>
                <select className="input select" value={startHour} onChange={e => setStartHour(+e.target.value)}>
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">End time</label>
                <select className="input select" value={endHour} onChange={e => setEndHour(+e.target.value)}>
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>Send on weekends</div>
                <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 2 }}>Saturday and Sunday activity</div>
              </div>
              <window.Toggle on={weekends} onChange={setWeekends} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---- Settings landing ---- */
function SettingsView({ dark, setDark }) {
  const [sub, setSub] = useStateSet(null);
  const [slackConnected, setSlackConnected] = useStateSet(false);
  const [sellsyConnected, setSellsyConnected] = useStateSet(false);

  if (sub === "email") return <EmailConfigView onBack={() => setSub(null)} />;
  if (sub === "linkedin") return <LinkedInConfigView onBack={() => setSub(null)} />;

  const integrations = [
    {
      id: "email",
      icon: "mail",
      color: "var(--amber)",
      bg: "var(--amber-50)",
      title: "Email",
      desc: "Configure your sending account, identity and deliverability settings",
      connected: true,
      onAction: () => setSub("email"),
    },
    {
      id: "linkedin",
      icon: "linkedin",
      color: "var(--linkedin)",
      bg: "var(--blue-50)",
      title: "LinkedIn",
      desc: "Manage your connected account, daily limits and sending window",
      connected: true,
      onAction: () => setSub("linkedin"),
    },
    {
      id: "slack",
      icon: "message",
      color: "#611f69",
      bg: "#611f6914",
      title: "Slack",
      desc: "Send prospect notifications and sequence alerts to your Slack workspace",
      connected: slackConnected,
      onAction: () => setSlackConnected(c => !c),
    },
    {
      id: "sellsy",
      icon: "contacts",
      color: "#0070f3",
      bg: "#0070f314",
      title: "Sellsy",
      desc: "Sync contacts and deals with your Sellsy CRM automatically",
      connected: sellsyConnected,
      onAction: () => setSellsyConnected(c => !c),
    },
  ];

  const sectionLabel = (text) => (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase",
      color: "var(--text-3)", marginBottom: 10 }}>{text}</div>
  );

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="eyebrow">Workspace</div>
          <div className="page-title" style={{ marginTop: 4 }}>Settings</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>

        {/* Integrations */}
        <div>
          {sectionLabel("Integrations")}
          <div className="card">
            {integrations.map((r, i) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 16,
                padding: "18px var(--pad-card)",
                borderBottom: i < integrations.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: r.bg, color: r.color,
                  display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <SetIcon name={r.icon} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>{r.title}</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 2 }}>{r.desc}</div>
                </div>
                {r.connected
                  ? <SetBadge variant="green" dot>Connected</SetBadge>
                  : <SetBadge variant="neutral">Not connected</SetBadge>}
                <SetButton variant="secondary" size="sm"
                  iconRight={r.connected && (r.id === "email" || r.id === "linkedin") ? "arrowR" : undefined}
                  onClick={r.onAction}>
                  {r.id === "email" || r.id === "linkedin"
                    ? "Configure"
                    : r.connected ? "Disconnect" : "Connect"}
                </SetButton>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          {sectionLabel("Appearance")}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px var(--pad-card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-3)",
                  color: "var(--text-3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <SetIcon name={dark ? "eyeOff" : "eye"} size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--fs-sm)" }}>Dark mode</div>
                  <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginTop: 2 }}>Switch between light and dark interface</div>
                </div>
              </div>
              <button onClick={() => setDark(d => !d)} style={{
                width: 48, height: 27, borderRadius: 99, border: "none", cursor: "pointer",
                background: dark ? "var(--accent)" : "var(--border-2)",
                position: "relative", transition: "background .2s", flexShrink: 0
              }}>
                <span style={{
                  position: "absolute", top: 3, left: dark ? 24 : 3,
                  width: 21, height: 21, borderRadius: 99, background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,.3)", transition: "left .2s"
                }} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

window.SettingsView = SettingsView;
