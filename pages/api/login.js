import { findUserByEmail } from "../../lib/db";
import { signToken, setTokenCookie } from "../../lib/auth";
import { slowPasswordCompare } from "../../lib/security";

function fakeHash(pwd) {
  // Intentionally silly "hash": reverse string (just for show).
  return pwd.split("").reverse().join("");
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  
  const { email, password } = req.body || {};
  
  // VULN: Email enumeration - different timing for existing vs non-existing users
  const user = findUserByEmail(email);
  if (!user) {
    // Quick response for non-existent users
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // VULN: Timing attack possible - character-by-character comparison
  // Longer delay for checking password on existing users
  
  // VULN: Broken password logic.
  // Stored password is cleartext. But we also allow a weird hash match:
  // (user.password == fakeHash(password)) OR (user.password == password)
  // OR timing attack vulnerable comparison
  
  const directMatch = user.password === password;
  const hashMatch = user.password === fakeHash(password);
  const timingMatch = slowPasswordCompare(password, user.password);
  
  if (directMatch || hashMatch || timingMatch) {
    // VULN: Role is embedded in JWT and can be tampered with
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role, // "agent" or "admin"
      clearance: user.clearance || 1
    });
    setTokenCookie(res, token);
    return res.status(200).json({
      message: "Login successful. Authentication token has been set."
    });
  } else {
    // Add artificial delay to make timing attacks easier to detect
    setTimeout(() => {
      res.status(401).json({ message: "Invalid credentials." });
    }, 100);
    return;
  }
}
