import React, { useEffect, useState, useCallback } from "react";
import { Filters, TextField } from "@shopify/polaris";
import {
  connectRefinementList,
  connectSearchBox
} from "react-instantsearch-dom";

function disambiguateLabel(key, value) {
  switch (key) {
    case "taggedWith":
      return `Tagged with ${value}`;
    default:
      return value;
  }
}

function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}

const OrdersFilterSearch = connectSearchBox(({ refine }) => {
  const [queryValue, setQueryValue] = useState("");
  const [taggedWith, setTaggedWith] = useState("");

  const handleTaggedWithChange = useCallback(value => setTaggedWith(value), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const handleSearchChange = useCallback(value => {
    setQueryValue(value);
  }, []);

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: "taggedWith",
          label: disambiguateLabel("taggedWith", taggedWith),
          onRemove: handleTaggedWithRemove
        }
      ]
    : [];

  useEffect(() => {
    refine(queryValue);
  }, [queryValue, refine]);

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      )
    }
  ];
  return (
    <Filters
      filters={filters}
      queryValue={queryValue}
      appliedFilters={appliedFilters}
      onQueryChange={handleSearchChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    />
  );
});

const OrdersFilterControl = () => {
  return <OrdersFilterSearch />;
};

export default connectRefinementList(OrdersFilterControl);
