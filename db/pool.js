require("dotenv").config();
const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: `postgresql://${process.env.ROLE_NAME}:${process.env.ROLE_PASS}@localhost:5432/members_only`,
});
