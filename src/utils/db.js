const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});

const connectionPromise = connection.promise();

async function executeQuery(query, data) {
  try {
    let y;
    await connectionPromise.query(query, data).then((response) => {
      y = response;
    });
    return y;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  executeQuery,
};
