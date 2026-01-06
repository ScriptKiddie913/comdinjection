import { changePassword } from "../../../lib/db";
import { getTokenFromReq, unsafeDecode } from "../../../lib/auth";

// VULN: no CSRF protection. Also only weak role check via unsafeDecode.
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const decoded = unsafeDecode(token);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ message: "Admin role required." });
  }

  const { email, newPassword } = req.body || {};
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "email and newPassword required." });
  }

  const ok = changePassword(email, newPassword);
  if (!ok) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({
    message:
      "Password changed successfully via admin endpoint. Hope this wasn't CSRF'ed."
  });
}
