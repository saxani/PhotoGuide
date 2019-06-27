import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { testImages } from './Classifier';

const titleStyle = {
  marginBottom: '20px'
}

const thumb = {
  display: 'inline-flex',
  marginBottom: 8,
  marginRight: 8,
  width: 400,
  height: 400,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const dropper = {
  height: 'auto',
  width: '100%',
  borderRadius: '5px',
  borderStyle: 'solid',
  borderWidth: '1px'
}

const closeButton = {
  position: 'absolute',
  top: '20px',
  left: '20px'
}

async function testTheImage(img){
  const result = await testImages(img);
  const confidence = Math.round(result[0].confidence * 100);
  document.querySelector('.answer').innerHTML = result[0].label + '<br />' + confidence + '% confidence';
}


function PictureUpload(props) {
  const [files, setFiles] = useState([]);

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const url = URL.createObjectURL(acceptedFiles[0]);
      let img = new Image();
      img.src = url;

      img.onload= () => {
        testTheImage(img);
      }

      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <Container maxWidth="sm" className="container">
      <section className="container">
        <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="Close" style={closeButton}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" align="center" className="headline" style={titleStyle}>
          The area around you is loaded!
        </Typography>
        <div {...getRootProps({className: 'dropzone'})} style={dropper}>
          <input {...getInputProps()} />
          <Typography variant="h5" align="center">
          <p>Think something you saw is a point of interest? Drag 'n' drop a photo here or click to upload and see!</p>
          </Typography>
          {thumbs}
        </div>
        <Typography variant="h5" align="center">
        <div className="answer"></div>
        </Typography>
      </section>
    </Container>
  );
}

export default PictureUpload;
