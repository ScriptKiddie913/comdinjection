import Link from "next/link";

export default function Home() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title-block">
          <span className="panel-eyebrow">CLASSIFIED</span>
          <h1 className="panel-title">Entity Tracking Portal</h1>
          <p className="panel-subtitle">
            Advanced security assessment required. All vulnerabilities are intentional.
          </p>
        </div>
        <div className="panel-meta">
          <div>CLEARANCE: PENDING</div>
          <div>STATUS: ASSESSMENT MODE</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="grid-stack">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Mission Objectives</h3>
              <span className="card-tag">MULTI-STAGE</span>
            </div>
            <div style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#ff6b6b", fontWeight: 600, marginBottom: "0.3rem" }}>
                  STAGE 1: Initial Access
                </div>
                <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                  Gain authenticated access to the system through available endpoints.
                </div>
              </div>
              <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#ff6b6b", fontWeight: 600, marginBottom: "0.3rem" }}>
                  STAGE 2: Token Analysis
                </div>
                <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                  Examine authentication mechanisms and session management implementations.
                </div>
              </div>
              <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#ff6b6b", fontWeight: 600, marginBottom: "0.3rem" }}>
                  STAGE 3: Privilege Escalation
                </div>
                <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                  Elevate privileges from standard user to administrative access level.
                </div>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ color: "#ff2e2e", fontWeight: 600, marginBottom: "0.3rem" }}>
                  STAGE 4: Final Objective
                </div>
                <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                  Achieve arbitrary command execution and retrieve the flag from the server.
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Mission Briefing</h3>
              <span className="card-tag">CLASSIFIED</span>
            </div>
            <div style={{ fontSize: "0.82rem", lineHeight: "1.6" }}>
              <p className="text-muted">
                Your task is to assess the security of this experimental entity tracking system. 
                All identified vulnerabilities should be documented and exploited to demonstrate impact.
              </p>
              <p className="text-muted" style={{ marginTop: "0.8rem" }}>
                Begin with reconnaissance. Examine the application behavior, inspect source code, 
                and test authentication mechanisms. The final objective is command execution capability.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-stack">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Access Points</h3>
              <span className="card-tag">NAVIGATION</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/login" style={{ 
                display: "block", 
                padding: "0.6rem 0.8rem", 
                background: "rgba(255,46,46,0.1)", 
                borderRadius: "8px",
                border: "1px solid rgba(255,46,46,0.3)",
                textDecoration: "none"
              }}>
                <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>Agent Login →</div>
                <div className="text-muted" style={{ fontSize: "0.74rem" }}>
                  Authenticate with Foundation credentials
                </div>
              </Link>
              <Link href="/signup" style={{ 
                display: "block", 
                padding: "0.6rem 0.8rem", 
                background: "rgba(0,255,195,0.05)", 
                borderRadius: "8px",
                border: "1px solid rgba(0,255,195,0.2)",
                textDecoration: "none"
              }}>
                <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>Register New Agent →</div>
                <div className="text-muted" style={{ fontSize: "0.74rem" }}>
                  Create new field agent credentials
                </div>
              </Link>
              <Link href="/dashboard" style={{ 
                display: "block", 
                padding: "0.6rem 0.8rem", 
                background: "rgba(255,255,255,0.03)", 
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none"
              }}>
                <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>Dashboard →</div>
                <div className="text-muted" style={{ fontSize: "0.74rem" }}>
                  Entity tracking interface (auth required)
                </div>
              </Link>
              <Link href="/admin/panel" style={{ 
                display: "block", 
                padding: "0.6rem 0.8rem", 
                background: "rgba(255,46,46,0.15)", 
                borderRadius: "8px",
                border: "1px solid rgba(255,46,46,0.4)",
                textDecoration: "none"
              }}>
                <div style={{ fontWeight: 600, marginBottom: "0.2rem", color: "#ff2e2e" }}>
                  Admin Panel →
                </div>
                <div className="text-muted" style={{ fontSize: "0.74rem" }}>
                  Administrative controls (L5 clearance)
                </div>
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Challenge Details</h3>
              <span className="card-tag">INFO</span>
            </div>
            <div style={{ fontSize: "0.82rem", lineHeight: "1.6" }}>
              <div className="text-muted" style={{ marginBottom: "0.8rem" }}>
                <strong style={{ color: "#f5f5f5" }}>Difficulty:</strong> Hard
              </div>
              <div className="text-muted" style={{ marginBottom: "0.8rem" }}>
                <strong style={{ color: "#f5f5f5" }}>Time Estimate:</strong> 2-4 hours
              </div>
              <div className="text-muted" style={{ marginBottom: "0.8rem" }}>
                <strong style={{ color: "#f5f5f5" }}>Skills Required:</strong> Authentication bypass, JWT manipulation, CSRF exploitation, command injection
              </div>
              <div className="text-muted">
                <strong style={{ color: "#f5f5f5" }}>Final Flag:</strong> Located in{" "}
                <code style={{ color: "#00ffc3" }}>/flag.txt</code> on server
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Vulnerability Categories</h3>
              <span className="card-tag">OWASP TOP 10</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.72rem" }}>
              <span className="pill">
                <span className="pill-label">A01</span>
                <span className="pill-value">Broken Access Control</span>
              </span>
              <span className="pill">
                <span className="pill-label">A02</span>
                <span className="pill-value">Cryptographic Failures</span>
              </span>
              <span className="pill">
                <span className="pill-label">A03</span>
                <span className="pill-value">Injection</span>
              </span>
              <span className="pill">
                <span className="pill-label">A07</span>
                <span className="pill-value">Authentication Failures</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: "1.5rem", 
        padding: "1rem", 
        background: "rgba(255,46,46,0.08)", 
        borderRadius: "10px",
        border: "1px solid rgba(255,46,46,0.3)",
        textAlign: "center"
      }}>
        <div style={{ color: "#ff6b6b", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
          ⚠️ Security Notice
        </div>
        <div className="text-muted" style={{ fontSize: "0.82rem" }}>
          This is a controlled security assessment environment. All vulnerabilities are intentionally implemented for educational purposes.
        </div>
      </div>
    </div>
  );
}
