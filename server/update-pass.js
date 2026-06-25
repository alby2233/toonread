const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.sqlite');
const hash = bcrypt.hashSync('admin098', 10);

db.run("UPDATE users SET password = ? WHERE username = 'admin'", [hash], (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Admin password updated successfully in existing database!');
  }
});
