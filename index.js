const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

// const cors = require("cors");
// IMPORT MODELS
require("./models/Product");

dotenv.config();
const BASE_URL = "https://kr.api.riotgames.com/lol/";
const TOKEN = process.env["RIOT_API_KEY"];
const baseAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-Riot-Token": TOKEN,
  },
});

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// mongoose.Promise = global.Promise;
// mongoose.connect(
//   process.env.MONGODB_URI || `mongodb://localhost:27017/node-react-starter`,
//   {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//   }
// );

// corsOptions = {
//   origin: "https://league-of-legend-service.herokuapp.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

app.use(bodyParser.json());

//IMPORT ROUTES
require("./routes/productRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// LOL api
app.get("/", (req, res) => res.send(`TOKEN: ${TOKEN}`));

app.get("/api/summoner-by-name", (req, res) => {
  getSummonerByName(res, req.query.name);
});
app.get(
  //rank 정보를 얻기위함.
  "/api/league-by-encrypted-id",
  (req, res) => {
    getLeagueByEncryptedId(res, req.query.id);
  }
);

const getSummonerByName = async (res, summonerName) => {
  baseAPI
    .get(`summoner/v4/summoners/by-name/${encodeURI(summonerName)}`)
    .then((resDataFromRiotGames) => {
      res.send(resDataFromRiotGames.data);
    })
    .catch(console.log);
};
const getLeagueByEncryptedId = async (res, encryptedId) => {
  baseAPI
    .get(`league/v4/entries/by-summoner/${encryptedId}`)
    .then((resDataFromRiotGames) => {
      res.send(resDataFromRiotGames.data);
    })
    .catch(console.log);
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
