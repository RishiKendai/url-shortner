const mongoose = require("mongoose");

const url_schema = new mongoose.Schema({
  long_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Url", url_schema);
