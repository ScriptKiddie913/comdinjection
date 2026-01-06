import { createUser, findUserByEmail } from "../../lib/db";
import { signToken, setTokenCookie } from "../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password, role } = req.body || {};

  // Intentionally weak password checks (vuln).
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }
  if (password.length < 4) {
    return res
      .status(400)
      .json({ message: "Password too short. Minimum 4 characters required." });
  }

  // VULN: Email enumeration - check if user exists
  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ 
      message: "User already exists. Try logging in or use a different email." 
    });
  }

  // VULN: If client sends 'role' in request body, it's ignored but hints at potential injection
  // The actual role assignment is done server-side (correctly), but this could mislead attackers
  // to try JWT tampering instead
  const user = createUser(email, password);
  if (!user) {
    return res.status(500).json({ message: "Failed to create user." });
  }

  // VULN: JWT includes role which can be tampered with client-side
  const token = signToken({ 
    id: user.id, 
    email: user.email, 
    role: user.role, // Always "agent" for new signups
    clearance: user.clearance || 1
  });
  setTokenCookie(res, token);

  return res.status(201).json({
    message: "Signup successful. Token set as cookie. Your role is 'agent' - inspect the JWT to see how roles work."
  });
}
