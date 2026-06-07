/* Sign-in page -> window.SignIn */
const { useState: siState, useEffect: siEffect } = React;
const { Icon: SIcon } = window;

function SignIn({ onAuth }) {
  const [mode, setMode] = siState("login"); // "login" | "forgot" | "sent"
  const [email, setEmail] = siState("");
  const [password, setPassword] = siState("");
  const [showPass, setShowPass] = siState(false);
  const [busy, setBusy] = siState(false);

  function handleSignIn(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      localStorage.setItem("ob_auth", "1");
      onAuth();
    }, 580);
  }

  function handleForgot(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setMode("sent"); }, 680);
  }

  const wrap = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: 24,
  };

  const card = {
    width: "100%",
    maxWidth: 408,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-xl)",
    boxShadow: "var(--sh-lg)",
    padding: "42px 40px 36px",
    display: "flex",
    flexDirection: "column",
    gap: 26,
  };

  const Brand = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 15,
        background: "linear-gradient(150deg, var(--accent), var(--accent-700))",
        display: "grid", placeItems: "center", color: "#fff",
        boxShadow: "0 6px 20px rgba(79,70,229,.30)",
      }}>
        <SIcon name="target" size={25} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 650, fontSize: 17, letterSpacing: "-.025em" }}>GrowthLoop</div>
        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>Outbound OS</div>
      </div>
    </div>
  );

  /* ── Sent state ── */
  if (mode === "sent") {
    return (
      <div style={wrap}>
        <div style={card}>
          <Brand />
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 99,
              background: "var(--green-50)", display: "grid", placeItems: "center", color: "var(--green)",
            }}>
              <SIcon name="checkCircle" size={26} />
            </div>
            <div style={{ fontWeight: 650, fontSize: 18, letterSpacing: "-.02em" }}>Check your inbox</div>
            <p style={{ fontSize: 13.5, color: "var(--text-3)", lineHeight: 1.6, margin: 0, maxWidth: 290 }}>
              A reset link was sent to{" "}
              <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>{email || "your email"}</strong>.
              It expires in 15 minutes.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => { setMode("login"); setBusy(false); }}
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  /* ── Forgot password ── */
  if (mode === "forgot") {
    return (
      <div style={wrap}>
        <div style={card}>
          <Brand />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 650, fontSize: 18, letterSpacing: "-.025em", marginBottom: 6 }}>Reset your password</div>
            <p style={{ fontSize: 13.5, color: "var(--text-3)", lineHeight: 1.55, margin: 0 }}>
              Enter your email and we'll send you a reset link.
            </p>
          </div>
          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="field-label">Email address</label>
              <input
                className="input input-lg"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 2 }}
              disabled={busy}
            >
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--text-3)", padding: "4px 8px", borderRadius: "var(--r-sm)" }}
              onClick={() => setMode("login")}
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Sign in (default) ── */
  return (
    <div style={wrap}>
      <div style={card}>
        <Brand />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 650, fontSize: 18, letterSpacing: "-.025em", marginBottom: 4 }}>Welcome back</div>
          <p style={{ fontSize: 13.5, color: "var(--text-3)", margin: 0 }}>Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="field-label">Email</label>
            <input
              className="input input-lg"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                style={{ background: "none", border: "none", padding: 0, fontSize: 12.5, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-group input-lg" style={{ paddingRight: 6 }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ flex: 1, minWidth: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                title={showPass ? "Hide password" : "Show password"}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "0 6px",
                  color: "var(--text-4)", display: "grid", placeItems: "center", height: 30,
                  borderRadius: "var(--r-sm)", flexShrink: 0,
                }}
              >
                <SIcon name={showPass ? "eyeOff" : "eye"} size={16} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            disabled={busy}
          >
            {busy
              ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: 99, animation: "spin .7s linear infinite", display: "block" }} />
                  Signing in…
                </span>
              : "Sign in →"}
          </button>
        </form>

        <p style={{
          textAlign: "center", fontSize: 12.5, color: "var(--text-4)",
          borderTop: "1px solid var(--border)", paddingTop: 20, marginTop: -2, marginBottom: 0,
        }}>
          Don't have an account?{" "}
          <a href="#" style={{ color: "var(--accent)", fontWeight: 600 }} onClick={e => e.preventDefault()}>
            Request access
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

Object.assign(window, { SignIn });
