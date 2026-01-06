// Extremely insecure in-memory "database" for the CTF.
// Data resets on each deployment / restart – fine for CTF.

const users = [
  // pre-created admin with weak credentials
  {
    id: 1,
    email: "dr.bright@scp.foundation",
    password: "ContainmentIsOptional123", // stored in cleartext (vuln)
    role: "admin",
    clearance: 5
  }
];

let nextUserId = 2;

const entities = [
  {
    id: 1,
    name: "SCP-173",
    classification: "Euclid",
    status: "contained",
    description: "The Sculpture. Object class: Euclid. Do not blink.",
    containmentProcedures: "Must be kept in locked container. When personnel must enter SCP-173's container, no fewer than 3 may enter at any time.",
    notes: "Constructed from concrete and rebar with traces of Krylon brand spray paint.",
    createdBy: "dr.bright@scp.foundation"
  },
  {
    id: 2,
    name: "SCP-096",
    classification: "Euclid",
    status: "contained",
    description: "The Shy Guy. Humanoid creature that enters rage state when face is viewed.",
    containmentProcedures: "SCP-096 is to be contained in its cell, a 5m x 5m x 5m airtight steel cube. Weekly checks for any cracks or holes are mandatory.",
    notes: "Extreme caution required during containment. No direct visual contact permitted.",
    createdBy: "dr.bright@scp.foundation"
  },
  {
    id: 3,
    name: "SCP-682",
    classification: "Keter",
    status: "contained",
    description: "Hard-to-Destroy Reptile. Large, vaguely reptile-like creature of unknown origin.",
    containmentProcedures: "SCP-682 must be destroyed as soon as possible. At this time, no means available to SCP teams are capable of destroying SCP-682.",
    notes: "Termination attempts have consistently failed. Entity shows extreme adaptability.",
    createdBy: "dr.bright@scp.foundation"
  },
  {
    id: 4,
    name: "SCP-999",
    classification: "Safe",
    status: "contained",
    description: "The Tickle Monster. Large, amorphous, gelatinous mass of translucent orange slime.",
    containmentProcedures: "SCP-999 is allowed to freely roam the facility. It seems to have a compelling desire to be loved.",
    notes: "Classification: Safe. Demonstrates friendly behavior toward all personnel.",
    createdBy: "dr.bright@scp.foundation"
  },
  {
    id: 5,
    name: "SCP-087",
    classification: "Euclid",
    status: "contained",
    description: "The Stairwell. An unlit platform staircase descending into darkness.",
    containmentProcedures: "SCP-087 is located on a university campus. The door to SCP-087 is to be kept locked at all times.",
    notes: "Exploration beyond 200 meters depth is strictly prohibited. Unknown entity detected.",
    createdBy: "dr.bright@scp.foundation"
  }
];

let nextEntityId = 6;

function createUser(email, password) {
  const existing = users.find((u) => u.email === email);
  if (existing) return null;
  const user = { id: nextUserId++, email, password, role: "agent" };
  users.push(user);
  return user;
}

function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function changePassword(email, newPassword) {
  const user = findUserByEmail(email);
  if (!user) return false;
  user.password = newPassword;
  return true;
}

function listEntities() {
  return entities;
}

function createEntity(name, status, description, createdByEmail, classification, containmentProcedures, notes) {
  const ent = {
    id: nextEntityId++,
    name,
    classification: classification || "Safe",
    status,
    description,
    containmentProcedures: containmentProcedures || "Standard containment procedures apply.",
    notes: notes || "",
    createdBy: createdByEmail
  };
  entities.push(ent);
  return ent;
}

function getAllUsers() {
  return users.map(u => ({ id: u.id, email: u.email, role: u.role, clearance: u.clearance }));
}

module.exports = {
  users,
  entities,
  createUser,
  findUserByEmail,
  findUserById,
  changePassword,
  listEntities,
  createEntity,
  getAllUsers
};
