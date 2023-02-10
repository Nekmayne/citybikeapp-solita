const csv = require("csv-parser");
const { exec } = require("child_process");
const fs = require("fs");

const data = [];

fs.createReadStream("stations.csv")
  .pipe(
    csv([
      "FID",
      "ID",
      "Nimi",
      "Namn",
      "Name",
      "Osoite",
      "Adress",
      "Kaupunki",
      "Stad",
      "Operaattor",
      "Kapasiteet",
      "x",
      "y",
    ])
  )

  .on("data", (row) => {
    if (row.Kaupunki === " ") {
      console.log("Invalid data:", row);
    } else {
      data.push(row);
    }
  })
  .on("end", () => {
    console.log("CSV file validation complete");

    fs.writeFileSync("data.json", JSON.stringify(data));
    exec(
      `mongoimport --db stationsdb --collection stations --file data.json --jsonArray`
    );
  });
