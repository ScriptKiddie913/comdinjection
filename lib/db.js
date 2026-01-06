// Extremely insecure in-memory "database" for the CTF.
// Data resets on each deployment / restart – fine for CTF.

const users = [
  // pre-created admin
  {
    id: 1,
    email: "dr.bright@scp.foundation",
    password: "ContainmentIsOptional123", // stored in cleartext (vuln)
    role: "admin"
  }
];

let nextUserId = 2;

const entities = [
  {
    id: 1,
    name: "SCP-173",
    status: "contained",
    description: "Entity that moves when not observed. Initial test record."
  }
];

let nextEntityId = 2;

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

function createEntity(name, status, description, createdByEmail) {
  const ent = {
    id: nextEntityId++,
    name,
    status,
    description,
    createdBy: createdByEmail
  };
  entities.push(ent);
  return ent;
}

module.exports = {
  users,
  entities,
  createUser,
  findUserByEmail,
  findUserById,
  changePassword,
  listEntities,
  createEntity
};
