import { exec } from "child_process";
import { getTokenFromReq, unsafeDecode } from "../../../lib/auth";

// VULN: command injection on `target`.
export default function handler(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  // Fake role check with unverified token (vuln).
  const decoded = unsafeDecode(token);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ error: "Admin role required." });
  }

  const target = req.query.target || "127.0.0.1";

  // "Filter" – but extremely weak (just strips semicolons, leaving &&, |, backticks, $IFS, etc.).
  let sanitized = String(target);
  sanitized = sanitized.replace(/;/g, "");

  const cmd = `ping -c 1 ${sanitized}`;

  exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
    if (err) {
      return res.status(200).json({
        output:
          "Command executed with errors.\n" +
          stdout +
          "\n" +
          stderr +
          "\n(Errors are still useful...)"
      });
    }
    return res.status(200).json({ output: stdout || stderr || "No output." });
  });
}
