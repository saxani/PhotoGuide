import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

const AddressSearch = ({ onSearchTermChange }) => {
  return (
    <div className="search-address">

      <TextField
        className="input"
        onChange={event => onSearchTermChange(event.target.value)}
        id="filled-full-width"
        label="Input new address"
        placeholder="501 The Embarcadero, Pier 28 Annex, San Francisco, CA"
        fullWidth
        margin="normal"
        variant="filled"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
}

export default AddressSearch;
