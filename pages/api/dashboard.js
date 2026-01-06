import { listEntities } from "../../lib/db";
import { getTokenFromReq, unsafeDecode } from "../../lib/auth";

// VULN: uses unsafeDecode (no signature check) to trust role.
export default function handler(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated. No token." });
  }

  // Intentionally skip verification here.
  const decoded = unsafeDecode(token);
  if (!decoded || !decoded.email) {
    return res.status(401).json({ error: "Invalid token." });
  }

  const { email, role } = decoded;

  return res.status(200).json({
    email,
    role,
    entities: listEntities()
  });
}
