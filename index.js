const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceValu = (temp, orgval) => {
  let temperature = temp.replace("{%temp%}", orgval.main.temp);
  temperature = temperature.replace("{%tempMin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempMax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);

  temperature = temperature.replace("{%tempStatus%}", orgval.weather[0].main);
 
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=ef7f4681ae56a36965177ad32e4ce94f"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];

        const realTimeData = arrdata
          .map((val) => replaceValu(homeFile, val))
          .join("");
       res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(8000, () => {
  console.log(`http://localhost:${8000}/`);
});
