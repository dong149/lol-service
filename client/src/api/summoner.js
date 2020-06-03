import axios from "axios";
import dotenv from "dotenv";

let BASE_URL;
if (process.env.NODE_ENV == "production") {
  BASE_URL = "https://league-of-legend-service.herokuapp.com";
} else {
  BASE_URL = "http://localhost:3000";
}

const baseAPI = axios.create({
  baseURL: BASE_URL,
});

// let BASE_URL;
// if (process.env.NODE_ENV === "production") {
//   BASE_URL = "https://donghoon.tk";
// } else {
//   BASE_URL = "http://localhost:3000";
// }
// const baseAPI = axios.create({
//   baseURL: BASE_URL,
// });

export const api = {
  getSummonerByName: async (summonerName) => {
    const res = await baseAPI.get(`/api/summoner-by-name?name=${summonerName}`);
    return res.data;
  },

  getLeagueByEncryptedId: async (encryptedId) => {
    const result = await baseAPI.get(
      `/api/league-by-encrypted-id?id=${encryptedId}`
    );
    return result.data;
  },
  getChampionMasteryByEncryptedSummonerId: async (encryptedSummonerId) => {
    const result = await baseAPI.get(
      `/api/champion-mastery-by-encrypted-summoner-id?id=${encryptedSummonerId}`
    );
    return result.data;
  },
  getChampionInfo: async () => {
    const result = await axios.get(
      "https://ddragon.leagueoflegends.com/cdn/10.8.1/data/ko_KR/champion.json"
    );
    return result.data.data;
  },
  getMatchList: async (encryptedId) => {
    const result = await baseAPI.get(`/api/matchlist?id=${encryptedId}`);
    return result.data;
  },
  getMatchInfo: async (matchId) => {
    const result = await baseAPI.get(`/api/matchInfo?id=${matchId}`);
    return result.data;
  },
};
