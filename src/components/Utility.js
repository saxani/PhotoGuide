// Importing ml5.js as ml5
import * as ml5 from "ml5";


export const classifyImages = (data) => {
  const featureExtractor = ml5.featureExtractor("MobileNet", modelLoaded(data));
  const classifier = featureExtractor.classification();
  let success = 0;
  let failure = 0;
  let promises = [];

  function modelLoaded(data) {
    console.log('model loaded!');

    data.map(function (place) {
      Object.keys(place)
      .forEach(function eachKey(key) {
        const links = place[key];
        for (let i = 0; i < links.length; i++) {
          makeCORSRequest(links[i], key);
        }
      });
    });

    setTimeout(train, 1000);

  }

  function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
      } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;
      }

      return xhr;
    }



  // Make the actual CORS request.
  function makeCORSRequest(url, place) {

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
      console.log('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {

      let newImageClassifier = new Promise(resolve => {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.addEventListener('load', () => {
          classifier.addImage(img, place), () => {
              resolve();
              img = null;
          };
        });

      });

      success++;
    };

    xhr.onerror = function() {
      console.log('Whoops, there was an error making the request.');
      failure++;
    };

    xhr.send();
  }

  function train() {
    console.log('images loaded!');
    console.log(success, failure);
    console.log('Training Complete');
    return true;
    //classifier.train(whileTraining);
  }

  function whileTraining(loss) {
    if (loss == null) {


    } else {
      console.log(loss);
    }
  }
}
