// /routes/reviewRoutes.js
const mongoose = require("mongoose");
const Review = mongoose.model("reviews");

module.exports = (app) => {
  app.get(`/api/review`, async (req, res) => {
    let reviews = await Review.find();
    return res.status(200).send(reviews);
  });
  app.get("/api/review/name/:name", async (req, res) => {
    await Review.find({ name: req.params.name }, (err, reviews) => {
      if (err) return res.status(500).json({ error: err });
      if (reviews.length === 0)
        return res.status(404).json({ error: "reviews not found" });
      return res.json(reviews);
    });
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
