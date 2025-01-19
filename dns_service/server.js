const express = require("express");
const app = express();
const cors = require("cors");
const { exec } = require("child_process");
const iconv = require("iconv-lite");

const bodyParser = require("body-parser");
const axios = require("axios");

let corsOptions = {
  origin: "*",
  credential: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/ban", (req, res) => {
  const domain = req.body.link;
  console.log(`${domain} 밴작업 시작`);

  const command = `./ban.sh ${domain}`;

  exec(command, { encoding: "euc-kr" }, (error, stdout, stderr) => {
    if (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
      console.log(JSON.stringify(stderr));
      return;
    } else {
      console.log(`${domain} 밴작업 끝`);
      res.send("ok");
    }
  });
});
app.post("/info", (req, res) => {
  const domain = req.body.link;
  console.log(`${domain} info 작업 시작`);

  const command = `bash info.sh ${domain}`;

  exec(command, { encoding: "euc-kr" }, (error, stdout, stderr) => {
    if (error) {
      console.error(error.message);
      console.log(JSON.stringify(stderr));
      return;
    } else {
      const decodedOutput = iconv.decode(stdout, "EUC-KR");
      let isDomain = decodedOutput;
      if (isDomain !== "false") {
        res.json({ ip: decodedOutput });
      } else {
        res.json({ ip: false });
      }
    }
  });
});

app.post("/buy", (req, res) => {
  const domain = req.body.link;
  const ip = req.body.ip;

  const command = `bash buy.sh ${domain} ${ip}`;
  console.log(`${ip} customer wants to buy domain "${domain}"`);
  exec(command, { encoding: "euc-kr" }, (error, stdout, stderr) => {
    if (error) {
      console.error(error.message);
      console.log(JSON.stringify(stderr));
      return;
    } else {
      //작업
      const decodedOutput = iconv.decode(stdout, "EUC-KR");
      if (decodedOutput.startsWith("Start")) {
        console.log(`${ip} customer has purchase domain "www.${domain}"`);
        res.json({ isSold: true });
      } else {
        res.json({ isSold: false });
      }
    }
  });
});

app.listen(5000, () => {
  console.log("서버가동");
});
