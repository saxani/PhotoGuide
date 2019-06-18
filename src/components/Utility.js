// Importing ml5.js as ml5
import * as ml5 from "ml5";

export const classifyImages = (data) => {
  console.log(data);
  const featureExtractor = ml5.featureExtractor("MobileNet", modelLoaded(data));
  const classifier = featureExtractor.classification();

  function modelLoaded(data) {
      console.log('model loaded!');

    let classifyData = data.map(function (place) {
      Object.keys(place)
      .forEach(async function eachKey(key) {
        const links = place[key];
        for (let i = 0; i < links.length; i++) {
          await corsProxy(links[i], key);
        }
      });
    });

    setTimeout(function(){
      train();
    }, 30000);
  }

  async function corsProxy(url, place) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    const response = await fetch(proxyurl + url)
    .then(validateResponse)
    .then(readResponseAsBlob)
    .then((responseAsBlob) => addImageToClassifer(responseAsBlob, place))
    .catch(logError);
  }

  function validateResponse(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  function readResponseAsBlob(response) {
    return response.blob();
  }

  function logError(error) {
    console.log('Looks like there was a problem: \n', error);
  }

  function addImageToClassifer(responseAsBlob, place) {
    return new Promise(resolve => {
      let url = URL.createObjectURL(responseAsBlob);
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;

      img.addEventListener('load', () => {
        classifier.addImage(img, place, () => {
          console.log('added: ' + place);
          resolve();
        });
      });
    });
  }

  function train() {
    classifier.train(whileTraining);
  }

  function whileTraining(loss) {
    if (loss == null) {
      console.log('Training Complete');
      return {isTrained: true, isLoading: false};
    } else {
      console.log(loss);
    }
  }
}
