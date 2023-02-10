const csv = require("csv-parser");
const { exec } = require("child_process");
const fs = require("fs");

const validate = (rowData) => {
  const [
    departure,
    returnTime,
    departure_station_id,
    departure_station_name,
    return_station_id,
    return_station_name,
    covered_distance,
    duration,
  ] = rowData.split(",");

  const match = rowData.match(/,/g);
  if (!match || match.length !== 7) {
    return false;
  }
  if (covered_distance < 10 || duration < 10) {
    return false;
  }
  return true;
};

const validData = [];

fs.createReadStream("citybikesdata.csv")
  .pipe(
    csv([
      "departure",
      "return",
      "departure_station_id",
      "departure_station_name",
      "return_station_id",
      "return_station_name",
      "covered_distance",
      "duration",
    ])
  )
  .on("data", (row) => {
    const rowString = Object.values(row).join(",");
    if (!validate(rowString)) {
      console.log(row, "Invalid data:");
      return;
    }
    validData.push(row);
  })
  .on("end", () => {
    console.log("CSV file validation complete");

    fs.writeFileSync("validData.json", JSON.stringify(validData));
    exec(
      `mongoimport --db citybikedb --collection citybikedata --file validData.json --jsonArray`
    );
  });
