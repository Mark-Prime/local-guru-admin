import React, { useState } from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import FilterControlSearch from "./FilterControlSearch";

const OrdersFilterControl = ({ refine, filters }) => {
  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleFilterChange = filters => {
    const { refine } = this.props;

    if (filters.length !== 0) {
      const { value } = filters[0];
      console.log(value);
      refine(value);
    } else {
      refine("");
    }

    setAppliedFilters(filters);
  };

  return (
    <div>
      <FilterControlSearch
        filters={filters}
        appliedFilters={appliedFilters}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default connectRefinementList(OrdersFilterControl);
