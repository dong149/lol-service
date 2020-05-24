import axios from "axios";

let BASE_URL;
if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://donghoon.tk";
} else {
  BASE_URL = "http://localhost:3000";
}
const baseAPI = axios.create({
  baseURL: BASE_URL,
});

export default {
  //   getReviewAll: async () => {
  //     let res = await axios.get(`/api/review`);
  //     return res.data || [];
  //   },
  getReview: async () => {
    let res = await baseAPI.get(`/api/review`);
    // console.log(res.data);
    return res.data || [];
  },
  getSummonerReview: async (name) => {
    let res = await baseAPI.get(`api/review/name/${name}`);
    // console.log(res.data);
    return res.data || [];
  },

  postReview: async (object) => {
    await baseAPI
      .post(`/api/review`, object)
      .then((res) => {
        console.log("post");
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
