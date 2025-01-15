const pool = require("./pool");

async function addUserData(username, first_name, last_name, password) {
  await pool.query(
    "INSERT INTO users (username, first_name, last_name, password) VALUES ($1,$2,$3,$4)",
    [username, first_name, last_name, password]
  );
}

async function changeMembershipStatus(username, password) {
  if (password === "cool22") {
    await pool.query(
      "UPDATE users SET membership_status = true, admin_status = true WHERE id = $1",
      [username]
    );
  } else if (password === "coolboy111") {
    await pool.query(
      "UPDATE users SET membership_status = true WHERE id = $1",
      [username]
    );
  }
}

async function addMessageData(user_id, title, message) {
  await pool.query(
    "INSERT INTO messages (user_id,title,message) VALUES ($1,$2,$3)",
    [user_id, title, message]
  );
}

async function showMessages(membershipStatus) {
  let messagesArr;
  if (membershipStatus === true) {
    const rows = await pool.query(
      "SELECT first_name, last_name, message,timestamp_val FROM users JOIN messages ON messages.user_id = users.id"
    );
    messagesArr = rows.rows;
  } else {
    const rows = await pool.query(
      "SELECT first_name, last_name, timestamp_val FROM users JOIN messages ON messages.user_id = users.id"
    );
    messagesArr = rows.rows;
  }

  return messagesArr;
}

async function deleteMessage(message_id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [message_id]);
}

module.exports = {
  addUserData,
  changeMembershipStatus,
  addMessageData,
  showMessages,
  deleteMessage,
};
