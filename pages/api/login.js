import { findUserByEmail } from "../../lib/db";
import { signToken, setTokenCookie } from "../../lib/auth";

function fakeHash(pwd) {
  // Intentionally silly "hash": reverse string (just for show).
  return pwd.split("").reverse().join("");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body || {};
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // VULN: Broken password logic.
  // Stored password is cleartext. But we also allow a weird hash match:
  // (user.password == fakeHash(password)) OR (user.password == password)
  if (user.password === fakeHash(password) || user.password === password) {
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role // "agent" or "admin"
    });
    setTokenCookie(res, token);
    return res.status(200).json({
      message:
        "Login successful. JWT stored in cookie 'token'. Try decoding it."
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials." });
  }
}
