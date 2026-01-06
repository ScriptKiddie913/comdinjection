import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [entityName, setEntityName] = useState("");
  const [entityStatus, setEntityStatus] = useState("contained");
  const [entityDesc, setEntityDesc] = useState("");
  const [cmdTarget, setCmdTarget] = useState("127.0.0.1");
  const [cmdOutput, setCmdOutput] = useState("");
  const [csrfMsg, setCsrfMsg] = useState("");
  const [passwordChangeMsg, setPasswordChangeMsg] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setData({ error: e.message }));
  }, []);

  async function createEntity(e) {
    e.preventDefault();
    const res = await fetch("/api/entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: entityName,
        status: entityStatus,
        description: entityDesc
      })
    });
    const d = await res.json();
    setCsrfMsg(d.message || JSON.stringify(d));
    const updated = await fetch("/api/dashboard").then((r) => r.json());
    setData(updated);
  }

  async function execCmd(e) {
    e.preventDefault();
    const res = await fetch(`/api/admin/exec?target=${encodeURIComponent(cmdTarget)}`);
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
    setPasswordChangeMsg(d.message || JSON.stringify(d));
  }

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>Entity Tracking Dashboard</h1>
      {data && data.error && <p style={{ color: "red" }}>{data.error}</p>}
      {!data && <p>Loading...</p>}
      {data && !data.error && (
        <>
          <p>
            Logged in as: <b>{data.email}</b> | Role: <b>{data.role}</b>
          </p>

          <h2>Tracked Entities</h2>
          <pre style={{ background: "#111", color: "#0f0", padding: "1rem" }}>
            {JSON.stringify(data.entities, null, 2)}
          </pre>

          <h2>Create New SCP Entity (Agent / Admin)</h2>
          <form onSubmit={createEntity}>
            <div>
              <label>
                Name:&nbsp;
                <input
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  required
                  style={{ width: "300px" }}
                />
              </label>
            </div>
            <div>
              <label>
                Status:&nbsp;
                <select
                  value={entityStatus}
                  onChange={(e) => setEntityStatus(e.target.value)}
                >
                  <option value="contained">contained</option>
                  <option value="breached">breached</option>
                  <option value="pending">pending</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Description:&nbsp;
                <textarea
                  value={entityDesc}
                  onChange={(e) => setEntityDesc(e.target.value)}
                  rows={3}
                  style={{ width: "400px" }}
                />
              </label>
            </div>
            <button type="submit">Create Entity</button>
          </form>
          {csrfMsg && (
            <p>
              <b>Response:</b> {csrfMsg}
            </p>
          )}

          {data.role === "admin" && (
            <>
              <h2>Admin Panel</h2>
              <h3>Change User Password (CSRF-vulnerable)</h3>
              <form onSubmit={changePassword}>
                <div>
                  <label>
                    Target Email:&nbsp;
                    <input name="email" defaultValue="dr.bright@scp.foundation" />
                  </label>
                </div>
                <div>
                  <label>
                    New Password:&nbsp;
                    <input name="newPassword" defaultValue="NewAdminPass123" />
                  </label>
                </div>
                <button type="submit">Change Password</button>
              </form>
              {passwordChangeMsg && (
                <p>
                  <b>Result:</b> {passwordChangeMsg}
                </p>
              )}

              <h3>Execute Diagnostic Command (VULNERABLE)</h3>
              <p>
                This runs a diagnostic ping on a target. Input is not really
                sanitized.
              </p>
              <form onSubmit={execCmd}>
                <div>
                  <label>
                    Target:&nbsp;
                    <input
                      value={cmdTarget}
                      onChange={(e) => setCmdTarget(e.target.value)}
                      style={{ width: "300px" }}
                    />
                  </label>
                </div>
                <button type="submit">Run Command</button>
              </form>
              {cmdOutput && (
                <pre
                  style={{
                    background: "#111",
                    color: "#0f0",
                    padding: "1rem",
                    marginTop: "1rem"
                  }}
                >
                  {cmdOutput}
                </pre>
              )}
            </>
          )}

          {data.role !== "admin" && (
            <p>
              <i>
                Admin-only controls are hidden. But are they really inaccessible?
              </i>
            </p>
          )}

          <p style={{ marginTop: "2rem" }}>
            <a href="/api/logout">Logout</a>
          </p>
        </>
      )}
    </main>
  );
}
