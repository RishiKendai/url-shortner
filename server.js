// ! Import Packages
const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

// ! Mongoose Models
const Url = require("./models/url_models");

// ! Configure Stuffs for Express
const app = express();
app.set("view engine", "ejs");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json({ extended: true }));
mongoose.set("strictQuery", true);

// Set Port and Fetch Variables from .env file
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// ! Connect to MongoDB
mongoose.connect(uri, {
  useUnifiedTopology: true,
});

// app.get("/", async (req, res) => {
//   return res.render("index");
// });
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
app.get("/favicon.ico", function (req, res) {
  return;
});

// ! Create Short URL and store in DB
app.post("/short-url", async (req, res) => {
  const long_url = req.body.full_url;

  if (long_url === "https://get.ly.vercel.app") {
    return res.json({ status: false, msg: "😒Dont try to short me" });
  }
  // if url is empty return
  if (long_url === "") {
    return res.json({ status: false, msg: "URL Field is empty!" });
  }
  // Check whether url is already present in DB
  const hasURL = await Url.findOne({ long_url });
  // if present return the shorten url
  if (hasURL) {
    return res.json({
      status: true,
      long_url: hasURL.long_url,
      short_url: hasURL.short_url,
    });
  }
  // Create a Shorten URL
  const short_url = `https://get.ly.vercel.app/${shortid.generate()}`;
  //  Add it to DB
  const createdUrl = await Url.create({
    long_url: long_url,
    short_url: short_url,
  });
  if (createdUrl)
    return res.json({ status: true, long_url: long_url, short_url: short_url });
  return res.json({ status: false, msg: "Error creating url" });
});

// ! Fetch all URL from DB
app.get("/all-url", async (req, res) => {
  const allUrl = await Url.find({}, "long_url short_url clicks");
  if (allUrl.length > 0) return res.json({ status: true, urls: allUrl });
  return res.json({ status: false, msg: "Oops! No URL Available☹️" });
});

// ! Get Shorten URL and redirect to original link
app.get("/:shortId", async (req, res) => {
  const short_url = req.params.shortId;
  const hasURL = await Url.findOne({ short_url: short_url });
  if (hasURL) {
    hasURL.clicks++;
    hasURL.save();
    return res.redirect(hasURL.long_url);
  } else {
    return res.render("404");
  }
});

// ! Server Listening
app.listen(port);
