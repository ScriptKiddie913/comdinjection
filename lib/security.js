// Security utilities (intentionally flawed for CTF)

// Weak CSRF token generation (predictable)
function generateCSRFToken() {
  // VULN: Predictable token based on timestamp
  return Buffer.from(`csrf-${Date.now()}`).toString('base64');
}

// Broken CSRF validation (always returns true if token exists)
function validateCSRFToken(token, expected) {
  // VULN: Just checks if token exists, doesn't validate properly
  if (!token) return false;
  if (token.length > 10) return true; // weak check
  return false;
}

// Timing attack vulnerable password comparison
function slowPasswordCompare(input, actual) {
  // VULN: Character-by-character comparison allows timing attacks
  if (input.length !== actual.length) return false;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== actual[i]) return false;
  }
  return true;
}

// Weak input sanitization
function sanitizeInput(input) {
  // VULN: Only removes obvious patterns, easy to bypass
  let sanitized = String(input);
  sanitized = sanitized.replace(/;/g, "");
  sanitized = sanitized.replace(/\|/g, "");
  // Missing: &&, ||, $(), ``, $IFS, etc.
  return sanitized;
}

// Email enumeration helper (intentionally leaky)
function checkEmailExists(email, users) {
  // VULN: Different response times/messages allow email enumeration
  const found = users.find(u => u.email === email);
  return !!found;
}

module.exports = {
  generateCSRFToken,
  validateCSRFToken,
  slowPasswordCompare,
  sanitizeInput,
  checkEmailExists
};
