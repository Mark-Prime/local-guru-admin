import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Page,
  Card,
  ResourceList,
  TextStyle,
  Pagination,
  Thumbnail,
  Badge,
  Stack
} from "@shopify/polaris";
import Moment from "react-moment";
import styled from "styled-components";
import { connectInfiniteHits } from "react-instantsearch-dom";

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const Orders = ({ hits, refine }) => {
  const transactions = useSelector(state => state.transactions);

  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("DATE_MODIFIED_DESC");

  const handleSearchChange = value => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      setLoaded(true);
    }
  }, [transactions.length]);

  const handleSelectionChange = selected => {
    setSelectedItems(selected);
  };

  const onNext = () => {};

  const onPrev = () => {};

  const renderItem = item => {
    const { id, title, created_at, user, total, items } = item;
    const firstItem = Object.values(items)[0];

    return (
      <ResourceList.Item
        id={id}
        media={<Thumbnail source={firstItem.image} alt={firstItem.title} />}
        url={`/order/view/${id}`}
        accessibilityLabel={`View details for ${title}`}
      >
        <Stack distribution="fillEvenly" spacing="extraLoose">
          <p>{user.displayName}</p>
          <Badge status="success">Delivered</Badge>
          <p>
            <TextStyle>${total.toFixed(2)}</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              <Moment fromNow unix>
                {created_at / 1000}
              </Moment>
            </TextStyle>
          </p>
        </Stack>
      </ResourceList.Item>
    );
  };

  const resourceName = {
    singular: "order",
    plural: "orders"
  };

  return (
    <Page title="Orders">
      <Card sectioned>
        {loaded ? (
          <>
            <ResourceList
              resourceName={resourceName}
              items={hits}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={handleSelectionChange}
              sortValue={sortValue}
              sortOptions={[
                { label: "Most Recent", value: "DATE_MODIFIED_DESC" },
                { label: "Oldest", value: "DATE_MODIFIED_ASC" }
              ]}
              onSortChange={selected => {
                setSortValue(selected);
                console.log(`Sort option changed to ${selected}.`);
              }}
            />
            {transactions.length > 49 ? (
              <PaginationFooter>
                <Pagination
                  hasPrevious={page > 1}
                  previousKeys={[74]}
                  previousTooltip="j"
                  onPrevious={onPrev}
                  hasNext
                  nextKeys={[75]}
                  nextTooltip="k"
                  onNext={onNext}
                />
              </PaginationFooter>
            ) : null}
          </>
        ) : null}
      </Card>
    </Page>
  );
};

export default connectInfiniteHits(Orders);
