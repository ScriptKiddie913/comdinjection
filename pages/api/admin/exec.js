import { exec } from "child_process";
import { getTokenFromReq, unsafeDecode } from "../../../lib/auth";

// VULN: command injection on `target` with weak filtering.
export default function handler(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  // VULN: Uses unsafeDecode - no signature verification
  // This means JWT can be tampered with to set role="admin"
  const decoded = unsafeDecode(token);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ 
      error: "Admin role required. Check your JWT token - maybe you can modify it?" 
    });
  }

  const target = req.query.target || "127.0.0.1";

  // VULN: Extremely weak input "sanitization"
  // Only blocks semicolons - many bypass techniques available:
  // - && (AND operator): 127.0.0.1&&cat${IFS}/flag.txt
  // - || (OR operator): invalidhost||cat${IFS}/flag.txt
  // - Backticks: 127.0.0.1`cat /flag.txt`
  // - $() command substitution: 127.0.0.1$(cat /flag.txt)
  // - $IFS for space bypass: cat${IFS}/flag.txt
  // - Newlines: %0a for command chaining
  // - Pipes with space alternatives: cat</flag.txt
  
  let sanitized = String(target);
  sanitized = sanitized.replace(/;/g, ""); // Only removes semicolons!
  
  // Still vulnerable to: &&, ||, |, `, $(), ${IFS}, %0a, etc.

  const cmd = `ping -c 1 ${sanitized}`;

  exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
    if (err) {
      // VULN: Error output might contain command execution results
      return res.status(200).json({
        output:
          "Command executed with errors (useful for blind injection):\n" +
          stdout +
          "\n" +
          stderr +
          "\n\nTip: Try bypassing with &&, ||, backticks, or $IFS"
      });
    }
    return res.status(200).json({ 
      output: stdout || stderr || "No output.",
      hint: "Filter only blocks semicolons. Try: 127.0.0.1&&cat${IFS}/flag.txt"
    });
  });
}
