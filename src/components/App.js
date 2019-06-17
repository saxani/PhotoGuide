import '../assets/stylesheets/base.scss'

import React, { Component } from 'react';
import * as Utility from './Utility.js';
import Geocode from "react-geocode";
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import config from '../../config.js';

import AddressSearch from './Address';
import PointsOfInterest from './PointsOfInterest';


// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(config.API_KEY);

// Enable or disable logs. Its optional.
Geocode.enableDebug();


var MobileDetect = require('mobile-detect'),
  md = new MobileDetect(navigator.userAgent);


/* ---------------------------------------------------- */

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: null,
      location: null,
      lat: null,
      lng: null
    };

    this.getPlaces = this.getPlaces.bind(this);
    this.getImages = this.getImages.bind(this);
  }

  componentDidMount() {

  }

  addressSearch(term) {
    Geocode.fromAddress(term).then(
      response => {
        this.setState({
          address: response.results[0].formatted_address,
          location: response.results[0].geometry.location,
          lat : response.results[0].geometry.location.lat,
          lng: response.results[0].geometry.location.lat
        });
      },
      error => {
        console.error(error);
    });
  }

  getPlaces() {
    fetch('/getPlacesData', {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
	     method: 'POST',
	     body: JSON.stringify(this.state.location)
      })
      .then(function (response) {
        return response.json()
      }, function (error) { console.log('error- ' + error) })
      .then(function (data) {
        if (data) {
          console.log(data);
        } else {
          console.log('didnt get any data');
        }
      });
  }

  getImages() {
    fetch('/getImageSearch')
    .then(function (response) {
      return response.json()
    }, function (error) { console.log('error- ' + error) })
    .then(function (data) {
      if (data) {
        console.log(data);
      } else {
        console.log('didnt get any data');
      }
    });
  }

  render() {
    const addressSearch = _.debounce((term) => {this.addressSearch(term)}, 300);
    // const getPlaces = this.getPlaces('/getPlacesData', this.callback);

    return (
        <div>
          <AddressSearch onSearchTermChange = {addressSearch} />
          <div className = "new-address">{this.state.address}</div>
          <Button variant="primary" onClick = {this.getPlaces}>Find nearby stuff!</Button>
          <Button variant="primary" onClick = {this.getImages}>Get images!</Button>

        </div>
    )
  }

  //
  // {!isLoading && <UploadPhoto hasThingINeed={hasThingINeed}/>}

  /* --------------- Networking Methods --------------- */

  /*
  Example calls:
    this.getRequestToServer('/getLocalData', this.callback.bind(this))
  */

};

export default App;
