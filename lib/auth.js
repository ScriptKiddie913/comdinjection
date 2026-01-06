const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// Weak secret – leaked in source (vuln).
const JWT_SECRET = "scpsecret";

// Vulnerable: We also accept 'none' algorithm and don't verify properly in some places.
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "2h" });
}

// Proper verification (but some endpoints will skip it intentionally).
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (e) {
    return null;
  }
}

// VULN: Insecure verification that accepts 'none' algorithm
function insecureVerifyToken(token) {
  try {
    // This accepts tokens with no signature (algorithm: 'none')
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256", "none"] });
  } catch (e) {
    // If standard verification fails, try decoding anyway
    return unsafeDecode(token);
  }
}

// Insecure: decode without verification (for role checks in some places).
function unsafeDecode(token) {
  try {
    return jwt.decode(token, { complete: false });
  } catch (e) {
    return null;
  }
}

// VULN: Weak secret allows easy brute-forcing
function canBruteForce() {
  // The secret "scpsecret" is weak and visible in source
  // It can be cracked with tools like john or hashcat
  return true;
}

function getTokenFromReq(req) {
  const cookies = req.headers.cookie
    ? cookie.parse(req.headers.cookie || "")
    : {};
  return cookies["token"] || null;
}

function setTokenCookie(res, token) {
  const header = cookie.serialize("token", token, {
    httpOnly: false, // vuln: JS accessible
    secure: false,   // vuln: works over HTTP
    sameSite: "lax", // vuln: CSRF-prone (not 'strict')
    path: "/",
    maxAge: 7200 // 2 hours
  });
  res.setHeader("Set-Cookie", header);
}

function clearTokenCookie(res) {
  const header = cookie.serialize("token", "", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  res.setHeader("Set-Cookie", header);
}

module.exports = {
  JWT_SECRET,
  signToken,
  verifyToken,
  insecureVerifyToken,
  unsafeDecode,
  getTokenFromReq,
  setTokenCookie,
  clearTokenCookie
};
