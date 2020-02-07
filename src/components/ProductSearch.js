import React, { useState, useCallback } from "react";
import { connectAutoComplete } from "react-instantsearch-dom";
import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchMajorMonotone } from "@shopify/polaris-icons";

const ProductSearch = ({ refine, onSelect, hits, selected }) => {
  const [inputText, setInputText] = useState("");

  const handleChange = useCallback(
    value => {
      setInputText(value);
      refine(value);
    },
    [refine]
  );

  const handleSelect = useCallback(
    value => {
      setInputText(value[0]);
      onSelect(value);
    },
    [onSelect]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={handleChange}
      label="Product"
      value={inputText}
      autoComplete="autocomplete_off_hack_xfr4!k"
      prefix={<Icon source={SearchMajorMonotone} color="inkLighter" />}
      placeholder="Search"
    />
  );

  return (
    <Autocomplete
      options={hits.map(hit => ({ label: hit.title, value: hit.title }))}
      selected={[selected.title]}
      onSelect={handleSelect}
      textField={textField}
    />
  );
};

export default connectAutoComplete(ProductSearch);
