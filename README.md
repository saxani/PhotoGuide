# PhotoGuide

## Overview:
When I visit a new city, I am generally well aware of the most famous points of interest. However, I don't know about all the smaller places that have such an interesting history. PhotoGuide utilizes Google Maps, Google Images, and Machine Learning to allow a user to type in their address and get nearby points of interest. Then, when they upload or take a photo of a building/monument they see when they're venturing through their new city, they can get information on the building if it's a significant point of interest.


## The Process:
- When a user launches the app, they are prompted to input an address.
- Google Geocode API returns its best suggestion for what the address is.
- When they click the button, a server request searches for the nearby points of interest (20-60), from the Google Places API.
- When the places are returned, a Google Custom Search Engine makes an image request for each of the places, returning 100.
- Those image links are then fed to ml5.js for Feature Extraction, along with the place name.
- After the training is complete, the user can upload a photo, and the app will return it's name (if it's recognized), and other relevant info.

## Current Limitations:
- Ideally the machine learning would happen on the server side, but ml5.js is only client side at the moment (will try to migrate to tensorflow)
- There are many issues with cross-origin requests to get the images, though roughly 50% of them are accepted
- Since incorporating the machine learning tests into the React app, ml5.js is throwing a backend error that needs to be solved. So the training is incomplete


## Live Site
