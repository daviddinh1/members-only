const pool = require("./pool");

async function addUserData(username, first_name, last_name, password) {
  await pool.query(
    "INSERT INTO users (username, first_name, last_name, password) VALUES ($1,$2,$3,$4)",
    [username, first_name, last_name, password]
  );
}

async function changeMembershipStatus(username) {
  await pool.query(
    "UPDATE users SET membership_status = true WHERE usernames = $1",
    [username]
  );
}

async function addMessageData(user_id, title, message) {
  await pool.query(
    "INSERT INTO messages (user_id,title,message) VALUES ($1,$2,$3)",
    [user_id, title, message]
  );
}

module.exports = {
  addUserData,
  changeMembershipStatus,
  addMessageData,
};
