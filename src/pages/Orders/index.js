import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchTransactions } from "../../actions/TransactionActions";
import {
  Page,
  Card,
  ResourceList,
  TextStyle,
  Pagination,
  Avatar,
  Stack,
  Thumbnail,
  EmptyState
} from "@shopify/polaris";
import Moment from "react-moment";
import styled from "styled-components";
import emptyOrders from "../../assets/empty-orders.svg";
import { withRouter } from "react-router-dom";
import OrderOverview from "../../components/OrderOverview";

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

class Orders extends Component {
  state = {
    page: 1,
    isLoaded: false,
    modalOpen: false,
    modalType: "",
    selectedItems: [],
    searchValue: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.transactions !== prevProps.transactions) {
      this.setState({ isLoaded: true });
    }
  }

  handleSearchChange = searchValue => {
    this.setState({ searchValue });
  };

  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onPrev = () => {
    const { page } = this.state;
    const limit = 50;
    const firstProduct = Object.keys(this.props.transactions)[0];
    const offset = this.props.transactions[firstProduct].created_at;
    this.props.fetchProducts({ endBefore: offset, limit: limit }).then(() => {
      this.setState({ page: page - 1 });
      if (page === 2) {
        this.props.history.push(`/transactions`);
      } else {
        this.props.history.push(`/transactions/page/${this.state.page}`);
      }
    });
  };

  onNext = () => {
    const { page } = this.state;
    const limit = 50;
    const lastProduct = Object.keys(this.props.transactions)[49];
    const offset = this.props.transactions[lastProduct].created_at;
    this.props
      .fetchTransactions({ startAfter: offset, limit: limit })
      .then(() => {
        this.setState({ page: page + 1 });
        this.props.history.push(`/transactions/page/${this.state.page}`);
      });
  };

  handleModalToggle = type => {
    this.setState({ modalOpen: !this.state.modalOpen, modalType: type });
  };

  orderTotal = item => {
    let total = 0;

    Object.keys(item.items).map(i => {
      const { price, count, producer } = item.items[i];

      if (producer === this.props.user.uid) {
        return (total = total + price * count);
      } else {
        return false;
      }
    });

    return total;
  };

  listItems = item => {
    let list = [];

    Object.keys(item.items).map((i, index) => {
      const { count, title } = item.items[i];

      return (list[index] = `${title} x${count}`);
    });

    return list.join(", ");
  };

  transformTransactions = transactions => {
    // create empty object
    let orders = {};

    let arr = [...transactions];

    // Map through transactions array
    arr.forEach(transaction => {
      // Get User ID
      const { uid } = transaction.user;
      let currentUserOrder = orders[uid];

      // check if user is in orders object
      if (currentUserOrder) {
        // map through the items in the transaction
        Object.keys(transaction.items).map(item => {
          let currentItem = currentUserOrder.items[item];

          // if the items already exists, add to it
          if (currentItem?.items) {
            const newCount = currentItem.count + transaction.items[item].count;

            return (currentUserOrder.items = {
              ...currentUserOrder.items,
              [item.count]: newCount
            });
          } else {
            orders[uid].total = orders[uid].total + transaction.total;
            return (orders[uid].items[item] = transaction.items[item]);
          }
        });

        // If they don't add the first transaction
      } else {
        orders = { ...orders, [uid]: transaction };
      }
    });

    return Object.values(orders);
  };

  renderItem = item => {
    const { id, title, created_at, user } = item;

    return (
      <ResourceList.Item
        id={id}
        media={
          <Avatar
            customer
            source={user.photoURL ? user.photoURL : null}
            name={user.displayName}
          />
        }
        url={`/order/view/${user.uid}`}
        accessibilityLabel={`View details for ${title}`}
      >
        <h3>
          <TextStyle variation="strong">{user.displayName}</TextStyle>
        </h3>
        <p>
          <TextStyle variation="subdued">
            <Moment format="MMMM Do, YYYY" unix>
              {created_at / 1000}
            </Moment>
          </TextStyle>
        </p>
        <br />
        <p>
          <strong>Total:</strong> ${item.total.toFixed(2)}
        </p>
        <p>
          <strong>Items:</strong>{" "}
          <TextStyle variation="subdued">{this.listItems(item)}</TextStyle>
        </p>
        <br />
        <Card title="Items" sectioned>
          <ResourceList
            items={Object.values(item.items)}
            renderItem={item => {
              console.log(item);
              const { count, price, title, image, unit } = item;

              const media = <Thumbnail source={image} alt={title} />;

              return (
                <ResourceList.Item media={media}>
                  <Stack distribution="fillEvenly" spacing="extraLoose">
                    <h3>
                      <TextStyle variation="strong">{title}</TextStyle>
                    </h3>
                    <p>
                      {count} x {unit}
                    </p>
                    <p>${(count * price).toFixed(2)}</p>
                  </Stack>
                </ResourceList.Item>
              );
            }}
          />
        </Card>
      </ResourceList.Item>
    );
  };

  render() {
    const resourceName = {
      singular: "order",
      plural: "orders"
    };

    return (
      <Page
        title={
          Object.keys(this.props.transactions).length > 0 ? "Orders" : null
        }
      >
        {this.state.isLoaded &&
        Object.keys(this.props.transactions).length > 0 ? (
          <>
            <OrderOverview
              orders={this.props.transactions}
              user={this.props.user.uid}
            />
            <br />
            <Card title="Orders to be packaged" sectioned>
              <ResourceList
                resourceName={resourceName}
                items={this.transformTransactions(this.props.transactions)}
                renderItem={this.renderItem}
                selectedItems={this.state.selectedItems}
                onSelectionChange={this.handleSelectionChange}
              />
              {Object.keys(this.props.transactions).length > 49 && (
                <PaginationFooter>
                  <Pagination
                    hasPrevious={this.state.page > 1}
                    previousKeys={[74]}
                    previousTooltip="j"
                    onPrevious={this.onPrev}
                    hasNext
                    nextKeys={[75]}
                    nextTooltip="k"
                    onNext={this.onNext}
                  />
                </PaginationFooter>
              )}
            </Card>
          </>
        ) : (
          <EmptyState
            image={emptyOrders}
            heading="Manage Orders"
            action={{ content: "Edit products", url: "/products" }}
            secondaryAction={{ content: "Learn more", url: "/help" }}
          >
            Looks like you don't have any orders yet. Check back soon!
          </EmptyState>
        )}
      </Page>
    );
  }
}

export default withRouter(
  connect(
    (state, ownProps) => ({
      transactions: state.transactions,
      user: state.user
    }),
    { fetchTransactions }
  )(Orders)
);
