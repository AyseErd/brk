"use strict";

const path = require("path");
const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const keyDataPath = path.join(__dirname, "/KeyData.txt");

app.get("/query", async (req, res) => {
    try {
        let queryString = req.query.key.toString().trim();
        if (queryString.length !== 0) {
            let data = fs.readFileSync(keyDataPath, 'utf8');
            data = data.split(',')
            let keyCount = data.filter(s => s == queryString);
            const countOfKey = keyCount.length.toString();
            return res.status(200).send({"Key Count: ": countOfKey});
        } else
            return res.status(406).send("Please provide query string key with single string");

    } catch (e) {
        console.error(e);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/input", async (req, res) => {
    try {
        let string_key = req.body.key.toString();
        string_key = string_key.trim();
        string_key = string_key.replace(/[^a-zA-Z ]/g, '')
        string_key += ",";

        if (string_key.length !== 0) {
            fs.appendFile(keyDataPath, string_key, err => {
                if (err) {
                    console.error(err)
                    return res.status(500).send("Internal Server Error");
                }
                console.log("key append successful");
            })
        } else {
            return res.status(406).send("Please provide single string as input");
        }
        return res.status(200).send("key append successful");
    } catch (e) {
        console.error(e);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(9000);
console.log(`App listening on port: 9000`);