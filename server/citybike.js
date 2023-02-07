const csv = require("csv-parser");
const { exec } = require("child_process");
const fs = require("fs");

const validate = (data) => {
  if (data.covered_distance < 10 || data.duration < 10) {
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
    if (!validate(row)) {
      console.log("Invalid data:");
      return;
    }
    validData.push(row);
  })
  .on("end", () => {
    console.log("CSV file validation complete");

    fs.writeFileSync("validData.json", JSON.stringify(validData));
    exec(
      `mongoimport --db citybikedb --collection citybikedata --file validData.json --jsonArray`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  });
