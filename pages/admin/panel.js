import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [cmdTarget, setCmdTarget] = useState("127.0.0.1");
  const [cmdOutput, setCmdOutput] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.error || data.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setEntities(data.entities || []);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });

    // Load users list
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
        }
      })
      .catch(console.error);
  }, [router]);

  async function execCmd(e) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(
      `/api/admin/exec?target=${encodeURIComponent(cmdTarget)}`
    );
    const d = await res.json();
    setCmdOutput(d.output || d.error || JSON.stringify(d));
  }

  async function changePassword(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const newPassword = form.newPassword.value;
    const res = await fetch("/api/admin/change_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });
    const d = await res.json();
    setMsg(d.message || JSON.stringify(d));
  }

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-block">
            <span className="panel-eyebrow">LOADING</span>
            <h1 className="panel-title">Admin Panel</h1>
          </div>
        </div>
        <p className="text-muted">Verifying clearance level...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title-block">
          <span className="panel-eyebrow">CLEARANCE LEVEL 5</span>
          <h1 className="panel-title">Administrative Control Panel</h1>
          <p className="panel-subtitle">
            Foundation personnel management and diagnostics
          </p>
        </div>
        <div className="panel-meta">
          <div>ACCESS: GRANTED</div>
          <div>ROLE: ADMINISTRATOR</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="grid-stack">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Registered Personnel</h3>
              <span className="card-tag">{users.length} USERS</span>
            </div>
            <div className="terminal" style={{ maxHeight: "200px" }}>
              {users.map((u) => (
                <div key={u.id} style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#ff6b6b" }}>ID:{u.id}</span> |{" "}
                  <span style={{ color: "#00ffc3" }}>{u.email}</span> |{" "}
                  <span
                    style={{
                      color: u.role === "admin" ? "#ff2e2e" : "#9aa3b5"
                    }}
                  >
                    {u.role.toUpperCase()}
                  </span>
                  {u.clearance && <span> | L{u.clearance}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Password Management</h3>
              <span className="card-tag">CSRF VULNERABLE</span>
            </div>
            <form onSubmit={changePassword}>
              <label>
                Target Email
                <input
                  name="email"
                  type="email"
                  defaultValue="dr.bright@scp.foundation"
                  required
                />
              </label>
              <label>
                New Password
                <input
                  name="newPassword"
                  type="text"
                  defaultValue="NewAdminPass123"
                  required
                />
              </label>
              <button type="submit">Update Password</button>
            </form>
            {msg && (
              <p className="text-muted" style={{ marginTop: "0.5rem" }}>
                {msg}
              </p>
            )}
          </div>
        </div>

        <div className="grid-stack">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">SCP Entity Count</h3>
              <span className="card-tag">{entities.length} ENTITIES</span>
            </div>
            <div style={{ padding: "0.5rem 0" }}>
              {entities.map((e) => (
                <div
                  key={e.id}
                  style={{
                    padding: "0.4rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {e.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#9aa3b5",
                      textTransform: "uppercase"
                    }}
                  >
                    {e.classification} • {e.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">System Diagnostics</h3>
              <span className="card-tag">CMD INJECTION</span>
            </div>
            <p className="text-small text-muted" style={{ marginBottom: "0.6rem" }}>
              Network diagnostics utility. Input sanitization bypassed.
            </p>
            <form onSubmit={execCmd}>
              <label>
                Target Address
                <input
                  value={cmdTarget}
                  onChange={(e) => setCmdTarget(e.target.value)}
                  placeholder="127.0.0.1"
                  required
                />
              </label>
              <button type="submit">Execute Ping</button>
            </form>
            {cmdOutput && (
              <div className="terminal" style={{ marginTop: "0.8rem" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {cmdOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <a href="/dashboard" style={{ marginRight: "1rem" }}>
          ← Back to Dashboard
        </a>
        <a href="/api/logout">Logout</a>
      </div>
    </div>
  );
}
