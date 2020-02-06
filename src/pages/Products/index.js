import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchUserProducts,
  fetchAllProducts
} from "../../actions/ProductActions";
import {
  Page,
  Card,
  ResourceList,
  TextStyle,
  Thumbnail,
  Pagination,
  EmptyState,
  Link
} from "@shopify/polaris";
import emptyProducts from "../../assets/empty-products.svg";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

class Products extends Component {
  state = {
    page: 1,
    isLoaded: false,
    modalOpen: false,
    modalType: "",
    selectedItems: [],
    searchValue: "",
    appliedFilters: []
  };

  componentDidMount() {
    if (this.props.user.admin) {
      this.props.fetchAllProducts().then(() => {
        this.setState({ isLoaded: true });
      });
    } else {
      this.props.fetchUserProducts(this.props.user.uid).then(() => {
        this.setState({ isLoaded: true });
      });
    }
  }

  handleSearchChange = searchValue => {
    this.setState({ searchValue });
  };

  handleFiltersChange = appliedFilters => {
    this.setState({ appliedFilters });
    if (appliedFilters.length > 0) {
      this.props.fetchProducts({ limit: 50 }, appliedFilters);
    } else {
      this.props.fetchProducts({ limit: 50 });
    }
  };

  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onPrev = () => {
    const { page } = this.state;
    const limit = 50;
    const firstProduct = Object.keys(this.props.products)[0];
    const offset = this.props.products[firstProduct].created_at;
    console.log(`end before ${firstProduct}`);
    this.props.fetchProducts({ endBefore: offset, limit: limit }).then(() => {
      this.setState({ page: page - 1 });
      if (page === 2) {
        this.props.history.push(`/products`);
      } else {
        this.props.history.push(`/products/page/${this.state.page}`);
      }
    });
  };

  onNext = () => {
    const { page } = this.state;
    const limit = 50;
    const lastProduct = Object.keys(this.props.products)[49];
    const offset = this.props.products[lastProduct].created_at;
    console.log(`start after ${lastProduct}`);
    this.props.fetchProducts({ startAfter: offset, limit: limit }).then(() => {
      this.setState({ page: page + 1 });
      this.props.history.push(`/products/page/${this.state.page}`);
    });
  };

  handleModalToggle = type => {
    console.log("toggle modal");
    this.setState({ modalOpen: !this.state.modalOpen, modalType: type });
  };

  renderItem = item => {
    const { product, title, created_at, image } = item;
    const media = <Thumbnail alt={title} source={image} />;

    return (
      <ResourceList.Item
        id={created_at}
        media={media}
        url={
          this.props.user.admin
            ? `/product/edit/${item.id}`
            : `/product/edit/${product}`
        }
        accessibilityLabel={`View details for ${title}`}
      >
        <h3>
          <TextStyle variation="strong">{title}</TextStyle>
        </h3>
      </ResourceList.Item>
    );
  };

  render() {
    const resourceName = {
      singular: "product",
      plural: "products"
    };

    const promotedBulkActions = [
      {
        content: "Edit products",
        onAction: () => this.handleModalToggle()
      }
    ];

    // If the user has empty business details, disallow creating a product
    let businessDetails = false;
    if (this.props.user.businessDetails) {
      const {
        businessName,
        fullName,
        street,
        city,
        zip
      } = this.props.user.businessDetails;

      if (
        businessName !== "" &&
        fullName !== "" &&
        street !== "" &&
        zip !== "" &&
        city !== ""
      ) {
        businessDetails = true;
      }
    }

    return (
      <Page
        title="Products"
        primaryAction={{
          content: "Add Product",
          url: "/products/add",
          disabled: !businessDetails
        }}
      >
        {this.state.isLoaded &&
          (this.props.products.length > 0 ? (
            <>
              <>
                {!businessDetails && (
                  <Card sectioned title="Profile Incomplete">
                    Your <Link to="/settings">Business details</Link> must be
                    complete in order to create products
                  </Card>
                )}
              </>
              <Card>
                <ResourceList
                  resourceName={resourceName}
                  items={this.props.products}
                  renderItem={this.renderItem}
                  selectedItems={this.state.selectedItems}
                  onSelectionChange={this.handleSelectionChange}
                  promotedBulkActions={promotedBulkActions}
                />
                {this.props.products.length > 49 ? (
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
                ) : null}
              </Card>
            </>
          ) : (
            <EmptyState
              action={{ content: "Add product", url: "/products/add" }}
              secondaryAction={{
                content: "Learn more",
                url: "/help"
              }}
              heading="Manage your products"
              image={emptyProducts}
            >
              <p>Add and edit your available products for customers.</p>
            </EmptyState>
          ))}
      </Page>
    );
  }
}

Products.propTypes = {
  user: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  fetchUserProducts: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(
  connect(
    (state, ownProps) => ({
      products: state.products,
      user: state.user
    }),
    { fetchUserProducts, fetchAllProducts }
  )(Products)
);
