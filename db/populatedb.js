require("dotenv").config();
const { Client } = require("pg");

const SQL = `CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 username VARCHAR(50),
 first_name VARCHAR(20),
 last_name VARCHAR(20),
 password VARCHAR(255),
 membership_status BOOLEAN DEFAULT false,
 admin_status BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS messages(
 user_id INTEGER REFERENCES users(id),
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 title VARCHAR(30),
 message TEXT,
 timestamp_val TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.ROLE_NAME}:${process.env.ROLE_PASS}@localhost:5432/members_only`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
