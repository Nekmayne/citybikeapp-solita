const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);

const db1 = mongoose.createConnection(
  "mongodb://localhost:27017/citybikedb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("connected to citybikedb");
    } else {
      console.log("errrrrr");
    }
  }
);

const db2 = mongoose.createConnection(
  "mongodb://localhost:27017/stationsdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("connected to stationdb");
    } else {
      console.log("errrrrr");
    }
  }
);

const bikeSchema = new mongoose.Schema({
  departure: String,
  return: String,
  departure_station_id: String,
  return_station_name: String,
  return_station_id: String,
  return_station_name: String,
  covered_distance: String,
  duration: String,
});

const stationSchema = new mongoose.Schema({
  Nimi: String,
  Osoite: String,
  Kaupunki: String,
  Kapasiteet: String,
});

const db1Model = db1.model("db1", bikeSchema, "citybikedata");
const db2Model = db2.model("db2", stationSchema, "stations");

app.get("/bikedata", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sortKey = req.query.sortKey;
  const sortOrder = req.query.sortOrder;
  const sort = { [sortKey]: sortOrder === "asc" ? 1 : -1 };

  db1Model.countDocuments({}, (error, totalCount) => {
    if (error) {
      res.status(500).send(error);
    }

    db1Model
      .find({})
      .limit(limit)
      .sort(sort)
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

app.get("/stationdata", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sortKey = req.query.sortKey;
  const sortOrder = req.query.sortOrder;
  const sort = { [sortKey]: sortOrder === "asc" ? 1 : -1 };

  db2Model.countDocuments({}, (error, totalCount) => {
    if (error) {
      res.status(500).send(error);
    }

    db2Model
      .find({})
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .then((stations) => {
        res.json({
          data: stations,
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
