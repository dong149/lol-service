import axios from "axios";
import { formatRelativeWithOptions } from "date-fns/fp";
import { reset } from "nodemon";
import { response } from "express";
export default {
  //   getReviewAll: async () => {
  //     let res = await axios.get(`/api/review`);
  //     return res.data || [];
  //   },
  //   getReview: async (name) => {
  //     let res = await axios.get(`/api/review`).then((res) => {
  //       res.filter((data) => {
  //         if (data.name === name) return true;
  //         else {
  //           return false;
  //         }
  //       });
  //       // .map((data) => {
  //       //   console.log(data);
  //       // });
  //     });
  //     return res.data || [];
  //   },
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
