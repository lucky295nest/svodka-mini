//con express
const express = require('express');
const app = express();
const port = 3000;

//con body-parser
const bP = require('body-parser');

//con moment
const moment = require('moment');

//con csv to json
const csvtojson = require('csvtojson');

//con fs & path
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

//setup main folder for static pages
app.use(express.static('public'));

//setup main folder for dynamic pages
app.set("views", path.join(__dirname, "views"));

//setup pug as main render engine
app.set("view engine", "pug");

//setup data saving
const urlEncParser = bodyParser.urlencoded({ extended: false });
app.post('/savedata', urlEncParser, (req, res) => {
    let date = moment().format('DD-MM-YYYY');
    let str = `"${date}","${req.body.location}","${req.body.type}","${req.body.note}"\n`;

    fs.appendFile(path.join(__dirname, 'data/records.csv'), str, function (err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "File saving failed."
            });
        }
        res.redirect(301, '/');
    });
});

//reaction to methods sent to adress /list
app.get("/list", (req, res) => {
    //use csv to json to load data from records.csv
    csvtojson({headers:['date','location','type','note']}).fromFile(path.join(__dirname, 'data/records.csv'))
    .then(data => {
        res.render('index', {title: "List of malfunctions", records: data});
    })
    .catch(err => {
        res.render('error', {title: "Aplication malfunctioned", error: err});
    });
});

//server listening on set port
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});