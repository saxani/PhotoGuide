import * as ml5 from "ml5";
const featureExtractor = ml5.featureExtractor("MobileNet");
let classifier = featureExtractor.classification();
let receivedData;

export async function testImages(img) {
  let result = await classifier.classify(img, gotResults);
  return result;

  // TODO: this is still a work in progress, to send and receive detailed place data.
  //
  // let placeInfo;
  //
  // receivedData.map(async function(place){
  //   if (place.name == result[0].label) {
  //     placeInfo = await getPlaceInfo(place.id);
  //   }
  // });
  //
  // return placeInfo;
}

function getPlaceInfo(id) {
  console.log(id);
  fetch('/getPlaceInfo', {
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
     method: 'POST',
     body: JSON.stringify(id)
    })
    .then(function (response) {
      //return response.json();
    });
}

function gotResults(error, result) {
  return new Promise(resolve => {
    if (error) {
      resolve(error);
    } else {
      resolve(result);
    }
  });
}


export async function classifyImages(data) {
  receivedData = data;
  featureExtractor.config.numLabels = data.length;
  classifier = await addImagesToClassifier(data);
  await classifier.train(whileTraining);
  return classifier;
}

async function addImagesToClassifier(data) {
  let promises = [];

  data.map(function(place) {
    place.images.map(function(imgURL) {
      promises.push(corsProxy(imgURL, place.name)
      .then((blob) => addImage(blob, place.name)));
    })
  });

  const results = await Promise.all(promises);
  return classifier;
}

function addImage(responseAsBlob, place) {
  return new Promise(resolve => {
    try {
      let url = URL.createObjectURL(responseAsBlob);
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;

      img.onload= () => {
         classifier.addImage(img, place, () => {
           resolve(classifier);
         });
       }

     img.onerror = (e) => {
       resolve(e);
     }
    }

    catch(error) {
      resolve(error);
    }
  });
}

async function corsProxy(url, place) {
  return new Promise((resolve, reject) => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    fetch(proxyurl + url)
    .then(validateResponse)
    .then(res => resolve(res.blob()))
    .catch(logError => resolve(logError));
  });
}

function validateResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function logError(error) {
  console.log('Looks like there was a problem: \n', error);
}

function whileTraining(loss){
  //Nothing to do
}
