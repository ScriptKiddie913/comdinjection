import { getAllUsers } from "../../../lib/db";
import { getTokenFromReq, unsafeDecode } from "../../../lib/auth";

// VULN: Lists all users if role=admin (based on unverified JWT decode)
export default function handler(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  // VULN: Uses unsafeDecode without signature verification
  const decoded = unsafeDecode(token);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ error: "Admin role required." });
  }

  // Return list of all users (sensitive information leak)
  const users = getAllUsers();
  return res.status(200).json({ users });
}
