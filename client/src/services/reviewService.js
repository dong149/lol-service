import axios from "axios";
export default {
  //   getReviewAll: async () => {
  //     let res = await axios.get(`/api/review`);
  //     return res.data || [];
  //   },
  getReview: async () => {
    let res = await axios.get(`/api/review`);
    // console.log(res.data);
    return res.data || [];
  },
  getSummonerReview: async (name) => {
    let res = await axios.get(`api/review/name/${name}`);
    // console.log(res.data);
    return res.data || [];
  },

  postReview: async (object) => {
    await axios
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
