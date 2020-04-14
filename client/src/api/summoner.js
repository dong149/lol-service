import axios from "axios";

const BASE_URL = "http://localhost:5000";

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
