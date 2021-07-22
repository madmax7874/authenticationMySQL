const mysql = require("mysql")

const server = mysql.createConnection({
  host: 'localhost',
  user: 'dreams',
  password: 'dreams',
  database: 'dreams'
});

// CREATE TABLE user (
//   user_id int(11)
//   firstName varchar(255),
//   lastName varchar(255),
//   email varchar(255),
//   password varchar(255)
// );

//user_id is unique and primary
//email is unique

server.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

module.exports = server;