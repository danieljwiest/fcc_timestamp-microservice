// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
// let bodyParser = require('body-parser');
// require('dotenv').config();

// app.use(bodyParser.urlencoded({extended: false}));


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(__dirname + '/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const setReqDateType = (req, res, next) => {
  let reqDate = req.params.date;
  
  if (reqDate === undefined) {
    req.dateType = 'Current Date'
  } else if (isNumeric(reqDate)) {
    req.dateType = 'unix'
  } else {
    req.dateType = 'utc'
  } 
  next();
}

const handleUnixDate = (req, res, next) => {
  if(req.dateType !== "unix") return next();
  let dateNum = parseInt(req.params.date)
  let date = new Date(dateNum);
  res.json({"unix": date.valueOf(), "utc": date.toUTCString()});
}

const handleUTCDate = (req, res, next) => {
  if(req.dateType !== "utc") return next();

  let date = new Date(req.params.date);
  //check for invalid Date Strings
  if(isNaN(date.valueOf())) return res.send({error : "Invalid Date"});
  
  res.json({"unix": date.valueOf(), "utc": date.toUTCString()});
}

const handleCurDate = (req, res, next) => {
  if(req.dateType !== 'Current Date') return next();
  let date = new Date();
  res.json({"unix": date.valueOf(), "utc": date.toUTCString()})
}

app.get(
  '/api/:date?',
  setReqDateType,
  handleCurDate,
  handleUnixDate,
  handleUTCDate
)
