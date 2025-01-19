const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const axios = require("axios");

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

const domain_list = {
  "mumu.com": "empty",
  "mumu1.com": "empty",
  "mumu2.com": "empty",
  "mumu3.com": "empty",
  "mumu4.com": "empty",
  "mumu5.com": "empty",
};

// 얘를 새로고침으로 해주자.
app.get("/was_twitter", (req, res) => {
  res.send("was연결됐음");
  res.json(domain_list);
});

app.get("/db_twitter", (req, res) => {
  connection.query("show databases;", (error, rows, fields) => {
    if (error) throw error;
    res.send(JSON.stringify(rows));
  });
});

const find_empty_domain = () => {
  let empty_domain;
  for (let is_empty_domain in domain_list) {
    if (domain_list[is_empty_domain] == "empty") {
      empty_domain = is_empty_domain;
      console.log("Let's buy : " + empty_domain);
      return empty_domain;
    }
  }
};

const is_alive_domain = () => {
  for (const domain in domain_list) {
    if (domain_list[domain] == "ok") {
      return true;
    }
  }
};

const buy_domain = (wanted_domain) => {
  axios
    .post("http://211.183.3.53:5000/buy", {
      link: wanted_domain,
      ip: "211.183.3.150",
    })
    .then((res) => {
      if (res.data.isSold) {
        domain_list[wanted_domain] = "ok";
        console.log(`${wanted_domain}구매완료`);
      } else {
        console.log(`${wanted_domain}은 구매할 수 없습니다.`);
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
};

const check_domain = (domain) => {
  axios
    .post("http://211.183.3.53:5000/info", { link: domain })
    .then((res) => {
      const ip = res.data.ip.replace(/[\n\r]/g, "");
      if (ip == "211.183.3.112") {
        // 리스트에 해당 domain키값 detacted로 바꾸기
        domain_list[domain] = "detacted";
        // 리스트 순회후 empty인거 찾고 하나 골라서 /buy요청보냄
        console.log("detacted!! : " + domain);
        if (is_alive_domain()) {
          //하나라도 살아있다면
          console.log("there is alive domain");
        } else {
          //다죽었다면
          let new_domain = find_empty_domain();
          // axios요청
          buy_domain(new_domain);
        }
      } else if (ip == "false") {
        // skip
        console.log("not yet purchased");
      } else if (ip == "211.183.3.150") {
        domain_list[domain] = "ok";
        // insert domain to domain list
        console.log("mine");
      } else {
        console.log("??");
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
};

// check_domain(domain);//

const mornitoring = (work) => {
  const domains = Object.keys(domain_list);
  let currentIndex = 0;
  setInterval(() => {
    const currentDomain = domains[currentIndex];

    // console.log(`Key: ${currentDomain}, Value: ${domain_list[currentDomain]}`);

    //작업
    work(currentDomain);
    //작업
    if (currentIndex + 2 == Object.keys(domain_list).length) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
  }, 3000);
};

mornitoring(check_domain);

app.listen(3000, () => {
  console.log("서버가동");
});
