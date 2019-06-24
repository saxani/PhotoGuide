import * as ml5 from "ml5";
const featureExtractor = ml5.featureExtractor("MobileNet");
let classifier = featureExtractor.classification();

export async function testImages(img) {
  let result = await classifier.classify(img, gotResults);
  return result;
}

  function gotResults(error, result) {
    return new Promise(resolve => {
      if (error) {
        console.error(error);
        resolve(error);
      } else {
        console.log (result);
        resolve(result);
      }
    });
  }


export async function classifyImages(data) {
  console.log(data);
  featureExtractor.config.numLabels = data.length;
  classifier = await addImagesToClassifier(data);
  console.log('back from classifying');
  await classifier.train(whileTraining);
  console.log('back from training');

  return classifier;
}

async function addImagesToClassifier(data) {
  let promises = [];

  data.map(function(place) {
    const placeName = Object.keys(place)[0];
    place[placeName].map(function(imgURL) {
      promises.push(corsProxy(imgURL, placeName)
      .then((blob) => addImage(blob, placeName)));
    })
  });

  const results = await Promise.all(promises);
  console.log('added all promises');
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

function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
  } else {
    console.log(loss);
  }
}
