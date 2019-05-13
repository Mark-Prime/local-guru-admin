import React, { Component } from 'react'

class AutocompleteExample extends Component {
  options = [
    {value: 'rustic', label: 'Rustic'},
    {value: 'antique', label: 'Antique'},
    {value: 'vinyl', label: 'Vinyl'},
    {value: 'vintage', label: 'Vintage'},
    {value: 'refurbished', label: 'Refurbished'},
  ];

  state = {
    selected: [],
    inputText: '',
    options: this.options,
  };

  render() {
    const textField = (
      <Autocomplete.TextField
        onChange={this.updateText}
        label="Tags"
        value={this.state.inputText}
        prefix={<Icon source="search" color="inkLighter" />}
        placeholder="Search"
      />
    );
    return (
      <div style={{height: '225px'}}>
        <Autocomplete
          options={this.state.options}
          selected={this.state.selected}
          onSelect={this.updateSelection}
          textField={textField}
        />
      </div>
    );
  }

  updateText = (newValue) => {
    this.setState({inputText: newValue});
    this.filterAndUpdateOptions(newValue);
  };

  filterAndUpdateOptions = (inputString) => {
    if (inputString === '') {
      this.setState({
        options: this.options,
      });
      return;
    }

    const filterRegex = new RegExp(inputString, 'i');
    const resultOptions = this.options.filter((option) =>
      option.label.match(filterRegex),
    );
    this.setState({
      options: resultOptions,
    });
  };

  updateSelection = (selected) => {
    const selectedText = selected.map((selectedItem) => {
      const matchedOption = this.options.find((option) => {
        return option.value.match(selectedItem);
      });
      return matchedOption && matchedOption.label;
    });
    this.setState({selected, inputText: selectedText});
  };
}

export default Autocomplete
