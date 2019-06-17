import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Typography from '@material-ui/core/Typography';


class PictureUpload extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.querySelector('.headline').classList.add('hide');
    document.querySelector('.search-address').classList.add('hide');
    document.querySelector('.new-address').classList.add('hide');
    document.querySelector('.search-button').classList.add('hide');
  }


  render() {
    return (
      <div>
        <Typography variant="h5" align="center">
          Your city is loaded!
        </Typography>
        <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
            <section className="drag-and-drop">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography variant="h5" align="center">
                <p>Drag 'n' drop some files here, or click to select files</p>
                </Typography>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    );
  }
}

export default PictureUpload;
