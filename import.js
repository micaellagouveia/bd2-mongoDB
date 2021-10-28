const fs = require("fs");
const fastcsv = require("fast-csv");
const mongodb = require("mongodb").MongoClient;

let url = "mongodb://localhost:27017";
let stream = fs.createReadStream("exemplo.csv");
let csvData = [];
let csvStream = fastcsv
  .parse({ delimiter: ';' })
  .on("data", function (data) {
    console.log({
      idUsuario: data[0],
      local: data[1],
      idade: data[2],
    })
    console.log("***********************************************")
    csvData.push({
      idUsuario: data[0],
      local: data[1],
      idade: data[2],
    });
  })
  .on("end", function () {
    csvData.shift();

    console.log(csvData);

    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db("exemplo")
          .collection("users")
          .insertMany(csvData, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows`);
            client.close();
          });
      }
    );
  });

stream.pipe(csvStream);
