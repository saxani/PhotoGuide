import '../assets/stylesheets/base.scss'

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Geocode from "react-geocode";
import _ from 'lodash';

import { classifyImages } from './Utility.js';

import AddressSearch from './Address';
import PictureUpload from './PictureUpload';
import Loading from './Loading';


// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey('AIzaSyAfmVgaJYfVmyGe7NqIrkre8yE4HYNfJhI');

var MobileDetect = require('mobile-detect'),
  md = new MobileDetect(navigator.userAgent);

var trained = false;


/* ---------------------------------------------------- */

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: null,
      location: null,
      lat: null,
      lng: null,
      isLoading: false,
      isTrained: false
    };

    this.getPlaces = this.getPlaces.bind(this);
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
          this.setState({isLoading: true});
          this.setState(classifyImages(data));
        } else {
          console.log('didnt get any data');
        }
      }.bind(this));
  }

  render() {
    const addressSearch = _.debounce((term) => {this.addressSearch(term)}, 300);

    return (
        <Container maxWidth="sm" className="container">
          <Typography variant="h4" component="h1" className="headline" gutterBottom>
            Photo Guide
          </Typography>
          {!this.state.isLoading && !this.state.isTrained && <AddressSearch onSearchTermChange = {addressSearch} />}
          {!this.state.isLoading && !this.state.isTrained && <Typography variant="h5" align="center" color="primary" paragraph className="new-address">
            {this.state.address}
          </Typography>}
          {!this.state.isLoading && !this.state.isTrained && <Button variant="contained" color="primary" className="search-button"
            onClick = {this.getPlaces}>Find nearby stuff!</Button>}
          {this.state.isLoading && <Loading />}
          {this.state.isTrained && <PictureUpload />}
        </Container>
    )
  }
};

export default App;
