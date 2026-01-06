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

// Insecure: decode without verification (for role checks in some places).
function unsafeDecode(token) {
  try {
    return jwt.decode(token, { complete: false });
  } catch (e) {
    return null;
  }
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
    secure: false,   // vuln
    sameSite: "lax", // CSRF-prone
    path: "/"
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
  unsafeDecode,
  getTokenFromReq,
  setTokenCookie,
  clearTokenCookie
};
