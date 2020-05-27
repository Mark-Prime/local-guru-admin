import React, { Component } from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import { ResourceList } from "@shopify/polaris";

class FilterControl extends Component {
  state = {
    value: ""
  };

  render() {
    const { filters, refine, handleFilterChange, appliedFilters } = this.props;
    return (
      <ResourceList.FilterControl
        filters={filters}
        searchValue={this.state.value}
        appliedFilters={appliedFilters}
        onFiltersChange={handleFilterChange}
        onSearchChange={value => {
          this.setState({ value: value }, () => {
            refine(value);
          });
        }}
      />
    );
  }
}

export default connectSearchBox(FilterControl);
