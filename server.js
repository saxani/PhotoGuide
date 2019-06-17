/*---------------  Express Server Setup  ----------------*/
var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080
var fs = require('fs');
var https = require('https');
var http = require('http');
var config = require('./config.js');

const googleMapsClient = require('@google/maps').createClient({
  key: config.API_KEY
});


const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

let usableImageLinks = [];

const IMAGE_API_INCREMENT = 10;
const IMAGE_API_MAX = 10;


/* ----- Password Protection ------ */
// const auth = require('./auth');
// app.use(auth);


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
app.post('/getPlacesData', async function(request, response){
  googleMapsClient.places({
    location: request.body,
    radius: 2000,
    query: 'point of interest'
  }, async function(err, data) {
    if (!err) {
      const places = data.json.results.map(item => item.name)
      const urls = await Promise.all(places.map(async function (place) {
        const newUrls= await imageSearch(place, 1, []);
        return {
          [place]: newUrls
        }
      }));
      response.json(urls);
    }
  });
});

async function imageSearch(query, index, urls) {
  if(index > IMAGE_API_MAX) {
    return [...urls];
  } else {
    const data = await customsearch.cse.list({
      cx: '002529004652784734871:cadocxkhd9g',
      q: query,
      auth: "AIzaSyAi2TGFCA7tVP2rHrDMG4FugLc6WJk3i54",
      searchType: "image",
      imgColorType: "color",
      start: index
    });

    const newUrls = await imageSearch(query, index + IMAGE_API_INCREMENT, data.data.items.map(item => item.link));
    return [...urls, ...newUrls]
  }
}

app.get('/getImageSearch', async function(request, response){
  const data = await imageSearch('empire state building', 1, []);
// TODO: error handling
  response.json(data);

});


/* --------------- Load Local JSON ---------------- */

app.get('/getLocalData', function(request, response) {
  var local_data = JSON.parse(fs.readFileSync('data/my_data.json', 'utf8'))
  response.json(local_data)
})
