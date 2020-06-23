import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Page,
  Card,
  ResourceList,
  TextStyle,
  Pagination,
  Avatar,
  Badge,
  Stack
} from "@shopify/polaris";
import Moment from "react-moment";
import styled from "styled-components";
import { connectInfiniteHits } from "react-instantsearch-dom";
import OrdersFilterControl from "./OrdersFilterControl";

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const Divider = styled.div`
  margin: 2rem 0;
  background: rgba(0, 0, 0, 0.12);
  height: 1px;
`;

const Orders = ({ hits, refinePrevious }) => {
  const transactions = useSelector(state => state.transactions);

  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [sortValue, setSortValue] = useState("DATE_MODIFIED_DESC");

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
    const { objectID, title, created_at, user, total, items, producer } = item;
    const media = (
      <Avatar
        customer
        size="medium"
        source={user.photoURL}
        name={user.displayName}
      />
    );

    return (
      <ResourceList.Item
        id={objectID}
        media={media}
        url={`/order/view/${objectID}`}
        accessibilityLabel={`View details for ${title}`}
      >
        <Stack distribution="fillEvenly" spacing="extraLoose">
          <p>{user.displayName}</p>
          <Badge status="success">Delivered</Badge>
          <p>
            <TextStyle>${total && total.toFixed(2)}</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">
              <Moment fromNow unix>
                {created_at / 1000}
              </Moment>
            </TextStyle>
          </p>
        </Stack>
        <br />
        <Divider />
        <Stack spacing="tight">
          <TextStyle variation="subdued">Item(s):</TextStyle>
          {items.map((item, index) => (
            <span>{item.title}</span>
          ))}
        </Stack>
        <br />
        <Stack spacing="tight">
          <TextStyle variation="subdued">From seller(s):</TextStyle>
          {items.map((item, index) => {
            const { producer } = item;
            const { displayName } = producer;
            return (
              <span>
                {displayName}
                {index < items.length - 1 && `, `}
              </span>
            );
          })}
        </Stack>
        <br />
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
              filterControl={
                <OrdersFilterControl attribute="user.displayName" />
              }
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
