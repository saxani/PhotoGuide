# React + Node.js Starter Pack

## Skills we want you to show:
- That you are an independent developer who writes clean code
- That you can come up with a sensible architecture for your web app and pass information between components 
- That you have a knack for visual design 
- That you can engage with external APIs
- That you can build software in a human-centered way


## The Task:
Your parents/best friend/childhood crush/etc… has just moved to a new city and you, as the creative hacker you are, want to create a mobile-web app that will help them in some way adjust to their new city, be creative ;)

## The Deliverables:
- Clearly state who you are designing for and what problem you are addressing for them
Create a single-page mobile web app using a Node.js server, a React frontend and hosted on Heroku. 

- The web app should display information from an external API of your choosing in an intuitive way. 
  * Ex. Spotify https://developer.spotify.com/documentation/web-api/quick-start/

- Allow the user to interact with the data and/or input their own preferences.

- Provide some recommendation or analysis based on the data displayed and the user’s preferences in a modal of some sort 

  * you are encouraged to leverage open sourced libraries, just cite them in the  README
  * you are encouraged to componentize your code where it makes sense
  * Bonus points if you leverage Machine Learning libraries such as ml5.js
    * https://ml5js.org/
  * Bonus points if you leverage data visualization libraries such as D3
    * https://d3js.org/
  * Bonus points if you integrate a cloud database such as firebase
    * https://firebase.google.com/
  * Bonus points if you leverage mapping libraries such as Google Maps API
    * https://developers.google.com/maps/documentation/
  * Bonus points for any other cool libraries you want to show off with ;)


## File Structure


### Client Side Components(/src/components)

- App.js 
  * **Primary/Parent React Component**

- Utility.js 
  * **Helper functions and constants**


### Server Side
- server.js 
  * simple node.js server that reads in data from /data directory
	
- auth.js
  * handles authentication requirements (username/password)


### UP & RUNNING
* `npm install`
* `nodemon ./server.js localhost 8080` -- or -- `npm start`
* visit `http://localhost:8080/`


### DEPLOYING TO HEROKU
This app is set up for deployment to Heroku!

Heroku will follow the `postinstall` command in your `package.json` and compile assets with `webpack.prod.config.js`. It runs the Express web server in `server.js`. You'll notice there's a special section set up for running in development.
