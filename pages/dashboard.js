import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [entityName, setEntityName] = useState("");
  const [entityClassification, setEntityClassification] = useState("Safe");
  const [entityStatus, setEntityStatus] = useState("contained");
  const [entityDesc, setEntityDesc] = useState("");
  const [entityProcedures, setEntityProcedures] = useState("");
  const [entityNotes, setEntityNotes] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setData({ error: e.message }));
  }, []);

  async function createEntity(e) {
    e.preventDefault();
    setMsg("Creating entity...");
    const res = await fetch("/api/entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: entityName,
        classification: entityClassification,
        status: entityStatus,
        description: entityDesc,
        containmentProcedures: entityProcedures,
        notes: entityNotes
      })
    });
    const d = await res.json();
    setMsg(d.message || JSON.stringify(d));
    
    // Refresh entity list
    if (res.ok || res.status === 201) {
      const updated = await fetch("/api/dashboard").then((r) => r.json());
      setData(updated);
      // Clear form
      setEntityName("");
      setEntityDesc("");
      setEntityProcedures("");
      setEntityNotes("");
    }
  }

  if (!data) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-block">
            <span className="panel-eyebrow">LOADING</span>
            <h1 className="panel-title">Entity Dashboard</h1>
          </div>
        </div>
        <p className="text-muted">Establishing secure connection...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-block">
            <span className="panel-eyebrow">ERROR</span>
            <h1 className="panel-title">Access Denied</h1>
          </div>
        </div>
        <div style={{ 
          padding: "1rem", 
          background: "rgba(255,46,46,0.1)", 
          borderRadius: "8px",
          border: "1px solid rgba(255,46,46,0.3)"
        }}>
          <p style={{ color: "#ff6b6b" }}>{data.error}</p>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            Authentication required. <a href="/login">Login here →</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title-block">
          <span className="panel-eyebrow">SECURE CONTAINMENT</span>
          <h1 className="panel-title">Entity Tracking Dashboard</h1>
          <p className="panel-subtitle">
            SCP Foundation anomaly management system
          </p>
        </div>
        <div className="panel-meta">
          <div>USER: {data.email}</div>
          <div>ROLE: {data.role.toUpperCase()}</div>
          <div>STATUS: ACTIVE</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="grid-stack">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tracked Entities</h3>
              <span className="card-tag">{data.entities?.length || 0} ITEMS</span>
            </div>
            <div className="terminal" style={{ maxHeight: "400px", overflow: "auto" }}>
              {data.entities && data.entities.length > 0 ? (
                data.entities.map((entity) => (
                  <div 
                    key={entity.id} 
                    style={{ 
                      marginBottom: "1.2rem",
                      paddingBottom: "1.2rem",
                      borderBottom: "1px solid rgba(0,255,195,0.15)"
                    }}
                  >
                    <div style={{ 
                      fontSize: "1rem", 
                      fontWeight: 700,
                      color: "#00ffc3",
                      marginBottom: "0.3rem",
                      letterSpacing: "0.05em"
                    }}>
                      {entity.name}
                    </div>
                    <div style={{ 
                      fontSize: "0.75rem",
                      marginBottom: "0.4rem",
                      display: "flex",
                      gap: "0.8rem"
                    }}>
                      <span style={{ 
                        color: entity.classification === "Keter" ? "#ff2e2e" : 
                               entity.classification === "Euclid" ? "#ff9f40" : "#00ffc3"
                      }}>
                        CLASS: {entity.classification?.toUpperCase() || "SAFE"}
                      </span>
                      <span style={{ color: "#9aa3b5" }}>
                        STATUS: {entity.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </div>
                    {entity.description && (
                      <div style={{ fontSize: "0.78rem", marginBottom: "0.3rem", color: "#c5d0e3" }}>
                        {entity.description}
                      </div>
                    )}
                    {entity.containmentProcedures && (
                      <div style={{ fontSize: "0.72rem", color: "#7a8499", marginTop: "0.3rem" }}>
                        <span style={{ color: "#ff6b6b" }}>PROCEDURES:</span> {entity.containmentProcedures}
                      </div>
                    )}
                    {entity.notes && (
                      <div style={{ 
                        fontSize: "0.72rem", 
                        color: "#9aa3b5", 
                        marginTop: "0.3rem",
                        fontStyle: "italic",
                        background: "rgba(255,255,255,0.02)",
                        padding: "0.4rem",
                        borderRadius: "4px"
                      }}>
                        <span style={{ color: "#00ffc3" }}>NOTE:</span> {entity.notes}
                      </div>
                    )}
                    <div style={{ fontSize: "0.68rem", color: "#7a8499", marginTop: "0.4rem" }}>
                      Created by: {entity.createdBy || "Unknown"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted">No entities tracked yet.</div>
              )}
            </div>
          </div>

          {data.role === "admin" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Admin Actions</h3>
                <span className="card-tag badge-critical">LEVEL 5</span>
              </div>
              <p className="text-small text-muted" style={{ marginBottom: "0.8rem" }}>
                Administrative controls available. Access the full admin panel for advanced features.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a 
                  href="/admin/panel" 
                  style={{ 
                    padding: "0.6rem", 
                    background: "rgba(255,46,46,0.15)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,46,46,0.4)",
                    textAlign: "center",
                    display: "block",
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  Open Admin Panel →
                </a>
              </div>
              <div style={{ 
                marginTop: "1rem", 
                padding: "0.6rem", 
                background: "rgba(255,46,46,0.08)",
                borderRadius: "6px",
                fontSize: "0.75rem"
              }}>
                <div className="text-muted">
                  Admin panel includes: User management, password reset, and diagnostic command execution.
                </div>
              </div>
            </div>
          )}

          {data.role !== "admin" && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Privilege Escalation</h3>
                <span className="card-tag">CHALLENGE</span>
              </div>
              <p className="text-small text-muted" style={{ marginBottom: "0.6rem" }}>
                You currently have <strong>agent</strong> clearance. Admin features are hidden but not inaccessible...
              </p>
              <div style={{ fontSize: "0.78rem", lineHeight: "1.6" }}>
                <div className="text-muted" style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#ff6b6b" }}>▸</span> JWT tokens may be tampered with
                </div>
                <div className="text-muted" style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#ff6b6b" }}>▸</span> Some endpoints use unsafe token decoding
                </div>
                <div className="text-muted" style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#ff6b6b" }}>▸</span> CSRF attacks might change admin passwords
                </div>
                <div className="text-muted">
                  <span style={{ color: "#ff6b6b" }}>▸</span> Try accessing <code>/admin/panel</code> directly
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid-stack">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Create SCP Entity</h3>
              <span className="card-tag">ALL CLEARANCES</span>
            </div>
            <form onSubmit={createEntity}>
              <label>
                Entity Designation
                <input
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="SCP-XXXX"
                  required
                />
              </label>
              
              <label>
                Classification
                <select
                  value={entityClassification}
                  onChange={(e) => setEntityClassification(e.target.value)}
                >
                  <option value="Safe">Safe</option>
                  <option value="Euclid">Euclid</option>
                  <option value="Keter">Keter</option>
                  <option value="Apollyon">Apollyon</option>
                  <option value="Thaumiel">Thaumiel</option>
                </select>
              </label>

              <label>
                Containment Status
                <select
                  value={entityStatus}
                  onChange={(e) => setEntityStatus(e.target.value)}
                >
                  <option value="contained">Contained</option>
                  <option value="breached">Breached</option>
                  <option value="neutralized">Neutralized</option>
                  <option value="pending">Pending</option>
                </select>
              </label>

              <label>
                Description
                <textarea
                  value={entityDesc}
                  onChange={(e) => setEntityDesc(e.target.value)}
                  placeholder="Anomalous properties and behavior..."
                  rows={2}
                />
              </label>

              <label>
                Containment Procedures (Optional)
                <textarea
                  value={entityProcedures}
                  onChange={(e) => setEntityProcedures(e.target.value)}
                  placeholder="Special containment procedures..."
                  rows={2}
                />
              </label>

              <label>
                Research Notes (Optional)
                <textarea
                  value={entityNotes}
                  onChange={(e) => setEntityNotes(e.target.value)}
                  placeholder="Additional observations..."
                  rows={2}
                />
              </label>

              <button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
                Submit Entity Report
              </button>
            </form>

            {msg && (
              <div style={{ 
                marginTop: "1rem", 
                padding: "0.6rem", 
                background: "rgba(0,255,195,0.1)",
                borderRadius: "6px",
                border: "1px solid rgba(0,255,195,0.3)",
                fontSize: "0.78rem"
              }}>
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
        <a href="/">← Back to briefing</a>
        <span className="text-muted" style={{ margin: "0 0.8rem" }}>|</span>
        <a href="/api/logout">Logout</a>
      </div>
    </div>
  );
}
