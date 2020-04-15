import axios from "axios";
import dotenv from "dotenv";

// let BASE_URL;
// if (process.env.NODE_ENV == "production") {
//   BASE_URL = "https://league-of-legend-service.herokuapp.com";
// } else {
//   BASE_URL = "http://localhost:5000";
// }

// const baseAPI = axios.create({
//   baseURL: BASE_URL,
// });

export const api = {
  getSummonerByName: async (summonerName) => {
    const res = await axios.get(`/api/summoner-by-name?name=${summonerName}`);
    return res.data;
  },
  getLeagueByEncryptedId: async (encryptedId) => {
    const result = await axios.get(
      `/api/league-by-encrypted-id?id=${encryptedId}`
    );
    return result.data;
  },
};
