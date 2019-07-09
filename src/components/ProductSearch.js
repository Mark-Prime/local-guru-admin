import React, { Component } from 'react'
import { connectAutoComplete } from 'react-instantsearch-dom'
import { Autocomplete, Icon } from '@shopify/polaris'

class ProductSearch extends Component {

  state = {
    inputText: ''
  }

  handleChange = (value) => {
    this.setState({ inputText: value })
    this.props.refine(value)
  }

  handleSelect = (value) => {
    this.setState({ inputText: value })
    this.props.onSelect(value)
  }

  render() {

    const { hits, selected } = this.props;

    const textField = (
      <Autocomplete.TextField
        onChange={this.handleChange}
        label="Product"
        value={this.state.inputText}
        autoComplete="autocomplete_off_hack_xfr4!k"
        prefix={<Icon source="search" color="inkLighter" />}
        placeholder="Search"
      />
    );

    return (
      <Autocomplete
        options={hits.map(hit => (
          {label:hit.title, value: hit.title}
        ))}
        selected={selected}
        onSelect={this.handleSelect}
        textField={textField}
      />
    );
  }

}

export default connectAutoComplete(ProductSearch);
