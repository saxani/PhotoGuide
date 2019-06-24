import '../assets/stylesheets/base.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Geocode from "react-geocode";
import _ from 'lodash';

import { classifyImages } from './Classifier';

import AddressSearch from './Address';
import PictureUpload from './PictureUpload';
import Loading from './Loading';


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
      city: null,
      isLoading: false,
      isTrained: false,
      classifier: null
    };

    this.getPlaces = this.getPlaces.bind(this);
  }

  componentDidMount(){
      fetch('/getGoogleKey')
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        Geocode.setApiKey(data);
      })
      .catch(logError => console.log(logError));
  }

  addressSearch(term) {
    Geocode.fromAddress(term).then(
      response => {
        response.results[0].address_components.forEach(component => {
          component.types.forEach(type => {
            if (type == "locality"){
              this.setState({
                city: component.long_name,
                address: response.results[0].formatted_address,
                location: response.results[0].geometry.location
              });
            }
          })
        });
      },
      error => {
        console.error(error);
    });
  }

  getPlaces() {
    this.setState({isLoading: true});
    fetch('/getPlacesData', {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
	     method: 'POST',
	     body: JSON.stringify(this.state)
      })
      .then(function (response) {
        return response.json()
      }, function (error) { console.log('error- ' + error) })
      .then(function (data) {
        if (data) {
          classifyImages(data).then((classifier) => {
            this.setState({
              isLoading: false,
              isTrained: true,
              classifier: classifier
            });
          });
        } else {
          console.log('didnt get any data');
        }
      }.bind(this));
  }

  render() {
    const addressSearch = _.debounce((term) => {this.addressSearch(term)}, 300);

    const { isLoading, isTrained } = this.state;

    return (
      <Container maxWidth="sm" className="container">
        {!isLoading && !isTrained &&  <Typography variant="h4" component="h1" className="headline" gutterBottom>
          Photo Guide
        </Typography> }
        {!isLoading && !isTrained && <AddressSearch onSearchTermChange = {addressSearch} />}
        {!isLoading && !isTrained && <Typography variant="h5" align="center" color="primary" paragraph className="new-address">
          {this.state.address}
        </Typography>}
        {!isLoading && !isTrained && <Button variant="contained" color="primary" className="search-button"
          onClick = {this.getPlaces}>Find nearby stuff!</Button>}
        {isLoading && <Loading />}
        {isTrained && <PictureUpload props={this.state.classifier}/>}
      </Container>
    )
  }
};

export default App;
