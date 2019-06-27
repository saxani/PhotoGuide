import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { ThemeProvider } from '@material-ui/styles';

import theme from './Theme';
import PictureUpload from './PictureUpload';

const loadingMessage = {
  marginTop: '20px'
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function Loading(props) {
  let openDialogButton;
  let loadingText;

  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  if (props.isTrained) {
     openDialogButton =
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Discover your city!
      </Button>;
   } else {
     openDialogButton = ''
   }

   if (props.isTrained) {
     loadingText = 'Important points found!';
   } else {
     loadingText = 'Finding points of interest, analyzing.';
   }

  return (
    <div className="loading">
      <ThemeProvider theme= {theme}>
        {!props.isTrained && <div>
          <LinearProgress color= "primary"/>
          <br />
          <LinearProgress color="secondary" />
        </div> }
        <Typography variant="h5" align="center" style={loadingMessage} gutterBottom>
          {loadingText}
        </Typography>
        {openDialogButton}
      </ThemeProvider>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <PictureUpload onClose={handleClose}/>
      </Dialog>
    </div>
  );
}
