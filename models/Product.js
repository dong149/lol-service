const mongoose = require("mongoose");
const { Schema } = mongoose;

// 스키마를 만든다.
const productSchema = new Schema({
  name: String,
  description: String,
});

mongoose.model("products", productSchema);
