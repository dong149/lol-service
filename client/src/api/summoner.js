import axios from "axios";

let BASE_URL;
if (process.env.NODE_ENV == "production") {
  BASE_URL = `https://${process.env.PORT}`;
} else {
  BASE_URL = "http://localhost:5000";
}

const baseAPI = axios.create({
  baseURL: BASE_URL,
});

export const api = {
  getSummonerByName: async (summonerName) => {
    console.log(summonerName);
    const res = await baseAPI.get(`/api/summoner-by-name?name=${summonerName}`);
    return res.data;
  },
  getLeagueByEncryptedId: async (encryptedId) => {
    console.log(encryptedId);
    const result = await baseAPI.get(
      `/api/league-by-encrypted-id?id=${encryptedId}`
    );
    return result.data;
  },
};
