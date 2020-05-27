import React, { useState, useCallback } from "react";
import {
  Card,
  ResourceList,
  Filters,
  Page,
  TextField,
  TextStyle,
  ResourceItem,
  Avatar,
  Button
} from "@shopify/polaris";
import { connectInfiniteHits } from "react-instantsearch-dom";

const OrdersAdmin = ({ hits }) => {
  const [taggedWith, setTaggedWith] = useState("VIP");
  const [queryValue, setQueryValue] = useState(null);

  const handleTaggedWithChange = useCallback(value => setTaggedWith(value), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = {
    singular: "customer",
    plural: "customers"
  };

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      ),
      shortcut: true
    }
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: "taggedWith",
          label: disambiguateLabel("taggedWith", taggedWith),
          onRemove: handleTaggedWithRemove
        }
      ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={setQueryValue}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{ paddingLeft: "8px" }}>
        <Button onClick={() => console.log("New filter saved")}>Save</Button>
      </div>
    </Filters>
  );

  return (
    <Page title="Orders">
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={hits}
          renderItem={renderItem}
          filterControl={filterControl}
        />
      </Card>
    </Page>
  );

  function renderItem(item) {
    console.log(item);
    const { id, url, name, location } = item;
    const media = <Avatar customer size="medium" name={name} />;

    return (
      <ResourceItem id={id} url={url} media={media}>
        <h3>
          <TextStyle variation="strong">{name}</TextStyle>
        </h3>
        <div>{location}</div>
      </ResourceItem>
    );
  }

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
};

export default connectInfiniteHits(OrdersAdmin);
