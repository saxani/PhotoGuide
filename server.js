/*---------------  Express Server Setup  ----------------*/
require('dotenv').config();
var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080
var fs = require('fs');
var https = require('https');
var http = require('http');

/* ----- Password Protection ------ */
// const auth = require('./auth');
// app.use(auth);

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY
});
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

const IMAGE_API_INCREMENT = 10;
const IMAGE_API_MAX = 30;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});


app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});


/*--------------- ^^^ Express Server Setup ^^^ ----------------*/


/* --------------- TODO: Call Remote APIs ---------------- */
app.get('/getGoogleKey', function(request, response){
  const data = process.env.GOOGLE_API_KEY;
// TODO: error handling
  response.json(data);

});


app.post('/getPlacesData', async function(request, response){
  googleMapsClient.places({
    location: request.body.location,
    radius: 2000,
    query: 'point of interest'
  }, async function(err, data) {
    if (!err) {
      const places = data.json.results.map(item => item.name)
      const urls = await Promise.all(places.map(async function (place) {
        const newUrls= await imageSearch(place, request.body.city, 1, []);
        return {
          [place]: newUrls
        }
      }));

      response.json(urls);
    }
  });
});

async function imageSearch(query, city, index, urls) {
  if(index > IMAGE_API_MAX) {
    return [...urls];
  } else {
    const data = await customsearch.cse.list({
      cx: '002529004652784734871:cadocxkhd9g',
      q: query + " " + city,
      auth: "AIzaSyAi2TGFCA7tVP2rHrDMG4FugLc6WJk3i54",
      searchType: "image",
      imgColorType: "color",
      rights: "cc_publicdomain, cc_noncommercial",
      imgType: "photo",
      start: index
    });

    const newUrls = await imageSearch(query, city, index + IMAGE_API_INCREMENT, data.data.items.map(item => item.link));
    return [...urls, ...newUrls]
  }
}
