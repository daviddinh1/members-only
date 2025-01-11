const pool = require("./pool");

async function addUserData(usernames, first_name, last_name, password) {
  await pool.query(
    "INSERT INTO users (usernames, first_name, last_name, password) VALUES ($1,$2,$3,$4)",
    [usernames, first_name, last_name, password]
  );
}

async function changeMembershipStatus(username) {
  await pool.query(
    "UPDATE users SET membership_status = true WHERE usernames = $1",
    [username]
  );
}

module.exports = {
  addUserData,
  changeMembershipStatus,
};
