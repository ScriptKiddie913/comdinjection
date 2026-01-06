import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMsg(data.message || "Unknown response");
  }

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>Agent Login</h1>
      <p>
        Log into the SCP Entity Tracking Portal. Successful login returns a JWT
        in a cookie. Maybe inspect it.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:&nbsp;
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "300px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Password:&nbsp;
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              style={{ width: "300px" }}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      {msg && (
        <p>
          <b>Server:</b> {msg}
        </p>
      )}
    </main>
  );
}
