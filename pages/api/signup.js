import { createUser } from "../../lib/db";
import { signToken, setTokenCookie } from "../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body || {};

  // Intentionally weak password checks (vuln).
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }
  if (password.length < 4) {
    return res
      .status(400)
      .json({ message: "Password too short. (Try something guessable.)" });
  }

  const user = createUser(email, password);
  if (!user) {
    return res.status(400).json({ message: "User already exists." });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  setTokenCookie(res, token);

  return res.status(201).json({
    message: "Signup successful. Token set as cookie. Inspect it carefully."
  });
}
