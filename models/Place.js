const mongoose = require("mongoose");
const { Schema } = mongoose;

const placeSchema = new Schema({
  name: String,
  xpos: int,
  ypos: int,
});

mongoose.model("places", placeShema);
