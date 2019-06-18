import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function LinearIndeterminate() {
  return (
    <div className="loading">
      <LinearProgress />
      <br />
      <LinearProgress color="secondary" />
    </div>
  );
}
