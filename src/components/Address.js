import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';


class AddressSearch extends Component {
  constructor(props) {
    super(props);

    this.state = { term: '' };
  }

  onInputChange(term)  {
    this.setState({term});
    this.props.onSearchTermChange(term);
    // Get latidude & longitude from address.
  }

  render() {
    return (
      <div className="search-address">

        <TextField
          className="input"
          onChange={event => this.onInputChange(event.target.value)}
          id="filled-full-width"
          label="Input new address"
          style={{ margin: 8 }}
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
}

export default AddressSearch;
