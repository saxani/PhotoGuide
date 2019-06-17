import React, { Component } from 'react';



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
        <input
          value={this.state.term}
          onChange={event => this.onInputChange(event.target.value)} />
      </div>
    );
  }
}

export default AddressSearch;
