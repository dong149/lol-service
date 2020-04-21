// /routes/reviewRoutes.js
const mongoose = require("mongoose");
const Review = mongoose.model("reviews");

module.exports = (app) => {
  app.get(`/api/review`, async (req, res) => {
    let reviews = await Review.find();
    return res.status(200).send(reviews);
  });

  app.post(`/api/review`, async (req, res) => {
    let review = await Review.create(req.body);
    return res.status(201).send({
      error: false,
      review,
    });
  });

  //   app.put(`/api/product/:id`, async (req, res) => {
  //     const { id } = req.params;

  //     let product = await Product.findByIdAndUpdate(id, req.body);

  //     return res.status(202).send({
  //       error: false,
  //       product,
  //     });
  //   });

  app.delete(`/api/review/:id`, async (req, res) => {
    const { id } = req.params;

    let review = await Review.findByIdAndDelete(id);

    return res.status(202).send({
      error: false,
      product,
    });
  });
};
