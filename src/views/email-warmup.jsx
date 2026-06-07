/* Email Warmup view -> window.WarmupView */
const { useState: wuState } = React;
const { Icon: WuIcon, Button: WuButton, Sparkline: WuSpark, Progress: WuProgress } = window;

const repColor = r => r >= 85 ? "var(--green)" : r >= 65 ? "var(--amber)" : "var(--red)";

const ACCOUNTS_DATA = [
  {
    id: 1, email: "alex@growthloop.io", provider: "gmail",
    status: "active", paused: false, day: 18, totalDays: 30,
    reputation: 91, inboxRate: 94, spamRate: 2,
    todaySent: 42, todayTarget: 45,
    sparkData: [64,68,72,75,78,81,84,86,88,90,91,94],
    auth: { spf: true, dkim: true, dmarc: true },
    connectedAt: "19 mai 2026",
  },
  {
    id: 2, email: "outreach@growthloop.io", provider: "outlook",
    status: "warming", paused: false, day: 7, totalDays: 30,
    reputation: 68, inboxRate: 76, spamRate: 8,
    todaySent: 18, todayTarget: 20,
    sparkData: [45,52,57,62,66,70,76],
    auth: { spf: true, dkim: true, dmarc: false },
    connectedAt: "30 mai 2026",
  },
  {
    id: 3, email: "sales@growthloop.io", provider: "custom",
    status: "paused", paused: true, day: 12, totalDays: 30,
    reputation: 74, inboxRate: 81, spamRate: 5,
    todaySent: 0, todayTarget: 28,
    sparkData: [55,60,65,70,74,77,79,81,81,80,81,81],
    auth: { spf: true, dkim: false, dmarc: false },
    connectedAt: "25 mai 2026",
  },
];

const STATUS_CFG = {
  active:  { variant: "green",   label: "Active",      dot: true  },
  warming: { variant: "accent",  label: "Warming up",  dot: true  },
  paused:  { variant: "amber",   label: "Paused",      dot: false },
};

/* ── Sub-components ── */
function AuthPill({ label, ok }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      height: 20, padding: "0 7px", borderRadius: 4,
      fontSize: 11, fontWeight: 700, letterSpacing: ".01em",
      background: ok ? "var(--green-50)" : "var(--red-50)",
      color: ok ? "var(--green)" : "var(--red)",
    }}>
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}

function RepRing({ score }) {
  const color = repColor(score);
  const r = 28, sw = 6;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return (
    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx="34" cy="34" r={r} fill="none" stroke="var(--surface-3)" strokeWidth={sw} />
        <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset .7s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
      </div>
    </div>
  );
}

function ProviderIcon({ provider }) {
  const map = { gmail: ["#EA4335","G"], outlook: ["#0078d4","O"], custom: ["var(--text-4)","✉"] };
  const [bg, lbl] = map[provider] || map.custom;
  return (
    <div style={{ width: 24, height: 24, borderRadius: 6, background: bg, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
      {lbl}
    </div>
  );
}

function AccountCard({ acc, onToggle }) {
  const cfg = STATUS_CFG[acc.paused ? "paused" : acc.status] || STATUS_CFG.paused;
  const pct = Math.round((acc.day / acc.totalDays) * 100);
  const borderColor = repColor(acc.reputation);

  return (
    <div className="card" style={{ borderTop: `3px solid ${borderColor}`, display: "flex", flexDirection: "column" }}>
      {/* Head */}
      <div className="card-head" style={{ gap: 9 }}>
        <ProviderIcon provider={acc.provider} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.email}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>Connecté le {acc.connectedAt}</div>
        </div>
        <span className={`badge badge-${cfg.variant}`} style={{ flexShrink: 0 }}>
          {cfg.dot && <span className="dot" />}{cfg.label}
        </span>
        <button className="btn btn-ghost btn-icon btn-sm" title="Account settings" style={{ color: "var(--text-4)" }}>
          <WuIcon name="settings" size={14} />
        </button>
      </div>

      {/* Metrics */}
      <div className="card-pad" style={{ flex: 1, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <RepRing score={acc.reputation} />
          <span style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 500 }}>Rep. score</span>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 13 }}>
          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Warmup progress</span>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>Jour {acc.day} / {acc.totalDays}</span>
            </div>
            <WuProgress value={pct} color="var(--accent)" height={5} />
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
            {[
              ["Envoyés", `${acc.todaySent}`, `/${acc.todayTarget}`, null],
              ["Inbox rate", `${acc.inboxRate}%`, null, repColor(acc.inboxRate)],
              ["Spam rate", `${acc.spamRate}%`, null, acc.spamRate > 5 ? "var(--red)" : "var(--text)"],
            ].map(([lbl, val, sub, color], i) => (
              <div key={lbl} style={{ flex: 1, paddingLeft: i > 0 ? 12 : 0, borderLeft: i > 0 ? "1px solid var(--border)" : "none", marginLeft: i > 0 ? 12 : 0 }}>
                <div style={{ fontSize: 10.5, color: "var(--text-3)", marginBottom: 2 }}>{lbl}</div>
                <div style={{ fontWeight: 650, fontSize: 17, letterSpacing: "-.02em", color: color || "var(--text)" }}>
                  {val}<span style={{ fontSize: 11.5, color: "var(--text-3)", fontWeight: 500 }}>{sub}</span>
                </div>
              </div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end" }}>
              {acc.sparkData.length > 2 && (
                <WuSpark data={acc.sparkData} w={66} h={26} color={repColor(acc.reputation)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "9px var(--pad-card)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <AuthPill label="SPF" ok={acc.auth.spf} />
          <AuthPill label="DKIM" ok={acc.auth.dkim} />
          <AuthPill label="DMARC" ok={acc.auth.dmarc} />
        </div>
        <WuButton variant="secondary" size="sm" icon={acc.paused ? "play" : "pause"} onClick={() => onToggle(acc.id)}>
          {acc.paused ? "Reprendre" : "Pause"}
        </WuButton>
      </div>
    </div>
  );
}

/* ── Connect modal ── */
function ConnectModal({ onClose }) {
  const [step, setStep] = wuState(1);
  const [email, setEmail] = wuState("");
  const [provider, setProvider] = wuState("gmail");
  const [speed, setSpeed] = wuState("normal");
  const [target, setTarget] = wuState(50);

  const estDays = speed === "slow" ? 45 : speed === "normal" ? 30 : 20;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.36)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: "100%", maxWidth: 460, boxShadow: "var(--sh-pop)" }}>
        <div className="card-head">
          <div>
            <div className="card-title">Connecter un compte email</div>
            <div className="card-sub">Étape {step} sur 2</div>
          </div>
          <WuButton variant="ghost" icon="x" size="sm" onClick={onClose} />
        </div>
        <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {step === 1 ? (
            <>
              <div>
                <label className="field-label">Adresse email</label>
                <input className="input input-lg" type="email" placeholder="vous@entreprise.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="field-label">Fournisseur</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["gmail","Gmail","#EA4335"],["outlook","Outlook","#0078d4"],["custom","SMTP","var(--text-3)"]].map(([id,lbl]) => (
                    <button key={id} onClick={() => setProvider(id)} style={{
                      flex: 1, height: 52, border: `1.5px solid ${provider===id ? "var(--accent)" : "var(--border-2)"}`,
                      borderRadius: "var(--r-sm)", background: provider===id ? "var(--accent-50)" : "var(--surface)",
                      cursor: "pointer", fontFamily: "var(--font)", fontSize: 13, fontWeight: 600,
                      color: provider===id ? "var(--accent-700)" : "var(--text-2)", transition: "all .12s",
                    }}>{lbl}</button>
                  ))}
                </div>
              </div>
              {provider === "custom" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label className="field-label">Serveur SMTP</label>
                    <input className="input" placeholder="smtp.mondomaine.com" />
                  </div>
                  <div style={{ display: "flex", gap: 9 }}>
                    <div style={{ flex: 1 }}>
                      <label className="field-label">Port</label>
                      <input className="input" placeholder="587" />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label className="field-label">Mot de passe</label>
                      <input className="input" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="field-label">Vitesse de montée en charge</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["slow","Lente","+ 2/j"],["normal","Normale","+ 5/j"],["fast","Rapide","+ 10/j"]].map(([id,lbl,sub]) => (
                    <button key={id} onClick={() => setSpeed(id)} style={{
                      flex: 1, height: 54, border: `1.5px solid ${speed===id ? "var(--accent)" : "var(--border-2)"}`,
                      borderRadius: "var(--r-sm)", background: speed===id ? "var(--accent-50)" : "var(--surface)",
                      cursor: "pointer", fontFamily: "var(--font)", transition: "all .12s",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: speed===id ? "var(--accent-700)" : "var(--text-2)" }}>{lbl}</span>
                      <span style={{ fontSize: 11, color: speed===id ? "var(--accent)" : "var(--text-3)" }}>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Volume cible</label>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{target} emails / jour</span>
                </div>
                <input type="range" min={20} max={200} step={5} value={target} onChange={e => setTarget(+e.target.value)}
                  style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-4)", marginTop: 3 }}>
                  <span>20</span><span>200 / jour</span>
                </div>
              </div>
              <div style={{ background: "var(--accent-50)", borderRadius: "var(--r-sm)", display: "flex", gap: 10, padding: "11px 13px", fontSize: 13, color: "var(--text-2)" }}>
                <WuIcon name="clock" size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
                <span>À cette vitesse, votre compte sera entièrement warmup en <strong style={{ color: "var(--accent-700)" }}>environ {estDays} jours</strong>.</span>
              </div>
            </>
          )}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "13px var(--pad-card)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {step === 2 && <WuButton variant="secondary" onClick={() => setStep(1)}>← Retour</WuButton>}
          <WuButton variant="primary" onClick={() => step === 1 ? setStep(2) : onClose()}>
            {step === 1 ? "Continuer →" : "Démarrer le warmup"}
          </WuButton>
        </div>
      </div>
    </div>
  );
}

/* ── Main view ── */
function WarmupView() {
  const [accounts, setAccounts] = wuState(ACCOUNTS_DATA);
  const [showConnect, setShowConnect] = wuState(false);

  function handleToggle(id) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, paused: !a.paused } : a));
  }

  const active    = accounts.filter(a => !a.paused);
  const avgRep    = Math.round(accounts.reduce((s, a) => s + a.reputation, 0) / accounts.length);
  const totalSent = accounts.reduce((s, a) => s + a.todaySent, 0);
  const avgInbox  = active.length ? Math.round(active.reduce((s, a) => s + a.inboxRate, 0) / active.length) : 0;

  return (
    <div className="page fade-in">
      {/* ── Page header ── */}
      <div className="page-head">
        <div>
          <div className="eyebrow">Email</div>
          <div className="page-title" style={{ marginTop: 4 }}>Warmup</div>
          <div className="page-desc">Montez progressivement en volume pour bâtir votre réputation d'expéditeur et rester hors des filtres spam.</div>
        </div>
        <WuButton variant="primary" icon="plus" onClick={() => setShowConnect(true)}>Connecter un compte</WuButton>
      </div>

      {/* ── KPIs ── */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: "var(--gap)" }}>
        {[
          { label: "Comptes actifs",       val: `${active.length}`,  sub: `${accounts.length - active.length} en pause`, color: null },
          { label: "Réputation moyenne",   val: `${avgRep}`,         sub: "sur 100",                                     color: repColor(avgRep) },
          { label: "Envoyés aujourd'hui",  val: `${totalSent}`,      sub: "emails de warmup",                            color: null },
          { label: "Taux inbox moyen",     val: `${avgInbox}%`,      sub: "comptes actifs seulement",                    color: repColor(avgInbox) },
        ].map(({ label, val, sub, color }) => (
          <div key={label} className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: "var(--fs-sm)", color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
            <span className="kpi-val" style={color ? { color } : {}}>
              {val}
              {label === "Réputation moyenne" && <span style={{ fontSize: 16, color: "var(--text-3)", fontWeight: 500 }}>/100</span>}
            </span>
            <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* ── Account cards ── */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {accounts.map(acc => <AccountCard key={acc.id} acc={acc} onToggle={handleToggle} />)}
      </div>

      {/* ── How it works ── */}
      <div className="card" style={{ marginTop: "var(--gap)" }}>
        <div className="card-head">
          <div className="card-title">Comment fonctionne le warmup</div>
        </div>
        <div className="card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
          {[
            ["bolt",     "1. Connecter",    "Liez votre compte email via OAuth (Gmail / Outlook) ou identifiants SMTP."],
            ["send",     "2. Montée douce", "GrowthLoop envoie quelques emails par jour et augmente progressivement le volume."],
            ["users",    "3. Engagement",   "Les emails partent vers notre réseau pair-à-pair et reçoivent de vraies réponses."],
            ["sparkles", "4. Go live",      "Après ~30 jours, votre réputation est établie. Lancez vos vraies campagnes."],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent-50)", display: "grid", placeItems: "center", color: "var(--accent)" }}>
                <WuIcon name={icon} size={17} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {showConnect && <ConnectModal onClose={() => setShowConnect(false)} />}
    </div>
  );
}

Object.assign(window, { WarmupView });
