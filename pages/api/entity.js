import { createEntity } from "../../lib/db";
import { getTokenFromReq, unsafeDecode } from "../../lib/auth";

export default function handler(req, res) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  // Again, no signature verification (vuln).
  const decoded = unsafeDecode(token);
  if (!decoded || !decoded.email) {
    return res.status(401).json({ message: "Invalid token." });
  }

  if (req.method === "POST") {
    const { name, status, description, classification, containmentProcedures, notes } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: "Name required." });
    }
    const ent = createEntity(
      name,
      status || "pending",
      description || "",
      decoded.email,
      classification || "Safe",
      containmentProcedures || "",
      notes || ""
    );
    return res.status(201).json({
      message: "Entity created successfully. Check if role was verified...",
      entity: ent
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
