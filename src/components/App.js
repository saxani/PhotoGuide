import '../assets/stylesheets/base.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';

import Geocode from "react-geocode";
import _ from 'lodash';

import { classifyImages } from './Classifier';
import theme from './Theme';
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
          console.log(data);
          classifyImages(data).then((classifier) => {
            this.setState({
              isTrained: true,
              classifier: classifier
            });
          });
        }
      }.bind(this));
  }

  render() {
    const addressSearch = _.debounce((term) => {this.addressSearch(term)}, 300);

    const { isLoading, isTrained, address } = this.state;

    return (
      <Container maxWidth="sm" className="container">
        {!isLoading && !isTrained &&
          <Typography variant="h4" component="h1" className="headline" gutterBottom>
            Photo Guide
          </Typography> }
        {!isLoading && !isTrained &&
          <Typography variant="body1" component="p" gutterBottom>
            Input address, find points of interest near you, upload your photos to see if it's an important place!
          </Typography>
        }
        <ThemeProvider theme={theme}>
        {!isLoading && !isTrained && <AddressSearch onSearchTermChange = {addressSearch} />}
        {!isLoading && !isTrained && <Typography variant="h5" align="center" color="secondary" paragraph className="new-address">
          {this.state.address}
        </Typography>}
          {!isLoading && !isTrained && address && <Button variant="contained" color="primary"
            onClick = {this.getPlaces}>Find nearby stuff!</Button>}
        </ThemeProvider>
        {isLoading && <Loading isTrained= {this.state.isTrained}/>}
      </Container>
    )
  }
};

export default App;
