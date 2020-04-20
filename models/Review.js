const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마를 만든다.
const reviewSchema = new Schema({
  name: String,
  date: String,
  type: String,
  content: String,
});

mongoose.model("reviews", reviewSchema);
