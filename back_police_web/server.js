const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser());

let corsOptions = {
  origin: "*",
  credential: true,
};

app.use(cors(corsOptions));

let env = process.env;
const connection = mysql.createConnection({
  host: "db",
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

app.post("/was", (req, ress) => {
  console.log(req.body.link);
  axios
    .post("http://211.183.3.53:5000/ban", { link: req.body.link })
    .then((res) => {
      console.log(req.body.link);
      ress.send("comfirm : " + req.body.link);
    })
    .catch((err) => {
      console.error(err.message);
    });
});

app.get("/db", (req, res) => {
  connection.query("show databases;", (error, rows, fields) => {
    if (error) throw error;
    res.send(JSON.stringify(rows));
  });
});

app.listen(3000, () => {
  console.log("서버가동");
});
