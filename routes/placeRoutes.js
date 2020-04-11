const mongoose = require("mongoose");
const Place = mongoose.model("places");

module.exports = (app) => {
  app.get(`api/places`, async (req, res) => {
    let places = await Place.find();
    return res.status(200).send(places);
  });
  app.post(`api/places`, async (req, res) => {
    let places = await Product.create(req.body);
    return res.status(201).send({ error: false, places });
  });
};
