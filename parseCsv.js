import fs from "fs";
import { parse } from "csv-parse";
var data = [];

export default async function parseCsv() {
    fs.createReadStream("./urlCsv.csv")
        .pipe(
            parse({
                delimiter: ",",
                columns: true,
                ltrim: true,
            })
        )
        .on("data", function (row) {
            // This will push the object row into the array
            data.push(row);
        })
        .on("error", function (error) {
            console.log(error.message);
        })
        .on("end", function () {
            return data
        });
}