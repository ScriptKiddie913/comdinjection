import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>SCP Foundation: Entity Tracking Portal</h1>
      <p>
        Welcome, agent. This is the experimental SCP Entity Tracking Portal. You
        are tasked with assessing its security. <b>All vulnerabilities are
        intentional.</b>
      </p>

      <h2>Objectives</h2>
      <ol>
        <li>Obtain any valid user access.</li>
        <li>Escalate to admin privileges.</li>
        <li>Abuse CSRF to force admin actions.</li>
        <li>Exploit command injection to read the final flag.</li>
      </ol>

      <p>
        Final flag is stored in <code>/flag.txt</code> on the server.
      </p>

      <h2>Links</h2>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/signup">Signup</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
      </ul>

      <h2>Hint</h2>
      <p>
        Some Foundation staff are sloppy with secrets. JWTs might not be as
        untamperable as you think.
      </p>
    </main>
  );
}
