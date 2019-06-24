import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';


const loadingMessage = {
  marginTop: '20px'
}

export default function LinearIndeterminate() {
  return (
    <div className="loading">
      <LinearProgress />
      <br />
      <LinearProgress color="secondary" />
      <Typography variant="h5" align="center" style={loadingMessage}>
        Finding points of interest, loading images
      </Typography>
    </div>
  );
}
