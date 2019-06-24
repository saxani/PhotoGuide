import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
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

async function testTheImage(img){
  const result = await testImages(img);
  document.querySelector('.answer').innerHTML = result[0].label;
}


function PictureUpload(classifier) {
  console.log(classifier);
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
    <section className="container">
      <Typography variant="h5" align="center" style={titleStyle}>
        Your city is loaded!
      </Typography>
      <div {...getRootProps({className: 'dropzone'})} style={dropper}>
        <input {...getInputProps()} />
        <Typography variant="h5" align="center">
        <p>Drag 'n' drop some files here, or click to select files</p>
        </Typography>
        {thumbs}
      </div>
      <Typography variant="h5" align="center">
      <div className="answer"></div>
      </Typography>
    </section>
  );
}

export default PictureUpload;
