const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb://localhost:27017/citybikedb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("connected to db");
    } else {
      console.log("errrrrr");
    }
  }
);

const bikeSchema = new mongoose.Schema({
  departure: String,
  return: String,
  departure_station_id: String,
  departure_station_name: String,
  return_station_id: String,
  return_station_name: String,
  covered_distance: String,
  duration: String,
});

const Model = mongoose.model("Model", bikeSchema, "citybikedata");

app.get("/bikedata", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  Model.countDocuments({}, (error, totalCount) => {
    if (error) {
      res.status(500).send(error);
    }

    Model.find({})
      .limit(limit)
      .skip(skip)
      .then((citybikes) => {
        res.json({
          data: citybikes,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        });
      });
  });
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
