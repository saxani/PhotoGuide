# PhotoGuide

## Overview:
When I visit a new city, I am generally well aware of the most famous points of interest. However, I don't know about all the smaller places that have such an interesting history. PhotoGuide utilizes Google Maps, Google Images, and Machine Learning to allow a user to type in their address and get nearby points of interest. Then, when they upload or take a photo of a building/monument they see when they're venturing through their new city, they can get information on the building if it's a significant point of interest.


## The Process:
- When a user launches the app, they are prompted to input an address.
- Google Geocode API returns its best suggestion for what the address is.
- When they click the button, a server request searches for the nearby points of interest (20-60), from the Google Places API.
- When the places are returned, a Google Custom Search Engine makes an image request for each of the places, returning up to 100.
- Those image links are then fed to ml5.js for Feature Extraction, along with the place name.
- After the training is complete, the user can upload a photo, and the app will return it's name and other relevant info.

## Current Limitations:
- Ideally the machine learning would happen on the server side, but ml5.js is only client side at the moment (will eventually migrate to TensorFlow)
- As a result, this process crashes on mobile at the moment
- Not all images retrieved from the custom search are able to be turned into image elements for ml5.js to classify, and errors will show up on the JS console (which will also be fixed by migrating to TensorFlow)
- The order that Google returns points of interest are not based on significance, so the results are fairly random. I will be getting a google map with markers of the returned places working, so the user can see what it finds. But, in the mean time, there's a console log showing the places returned. If you were to google search any of these locations, scroll down well past what the image search would return, and drag and drop an image, it will likely give the right response!


## Live Site
- You can see the current build here: https://floating-depths-64639.herokuapp.com/
