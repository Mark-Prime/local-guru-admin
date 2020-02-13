import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Page,
  Card,
  ResourceList,
  TextStyle,
  Thumbnail,
  Pagination,
  EmptyState,
  Link,
  Modal,
  TextContainer
} from "@shopify/polaris";
import { db } from "../../firebase";
import emptyProducts from "../../assets/empty-products.svg";
import styled from "styled-components";

const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const Products = () => {
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const user = useSelector(state => state.user);
  const history = useHistory();

  useEffect(() => {
    const fetchUserProducts = async () => {
      let array = [];

      const snapshot = await db
        .collectionGroup("producers")
        .where(`uid`, "==", user.uid)
        .get();

      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          if (doc.data().product) {
            array = [{ id: doc.data().product, ...doc.data() }, ...array];
          }
        });

        setProducts(array);
        setLoaded(true);
      } else {
        setLoaded(true);
      }
    };

    if (!loaded) {
      fetchUserProducts();
    }
  }, [user, loaded]);

  // const handleSearchChange = useCallback(searchValue => {
  //   setSearchValue(searchValue);
  // }, []);

  const handleSelectionChange = useCallback(selection => {
    console.log(selection);
    setSelectedItems(selection);
  }, []);

  const handleDelete = useCallback(() => {
    selectedItems.map(id => {
      return db
        .collection("products")
        .doc(id)
        .collection("producers")
        .doc(user.uid)
        .delete();
    });
    setModal(false);
    setLoaded(false);
  }, [selectedItems, user.uid]);

  const onPrev = useCallback(() => {
    const { page } = this.state;
    const limit = 50;
    const firstProduct = products[0];
    const offset = products[firstProduct].created_at;
    console.log(`end before ${firstProduct}`);
    this.props.fetchProducts({ endBefore: offset, limit: limit }).then(() => {
      this.setState({ page: page - 1 });
      if (page === 2) {
        history.push(`/products`);
      } else {
        history.push(`/products/page/${this.state.page}`);
      }
    });
  }, [history, products]);

  const onNext = useCallback(() => {
    const limit = 50;
    const lastProduct = Object.keys(products)[49];
    const offset = this.props.products[lastProduct].created_at;
    console.log(`start after ${lastProduct}`);
    this.props.fetchProducts({ startAfter: offset, limit: limit }).then(() => {
      this.setState({ page: page + 1 });
      setPage(page => page + 1);
      history.push(`/products/page/${this.state.page}`);
    });
  }, [history, page, products]);

  // const handleModalToggle = useCallback(type => {
  //   setModal(modal => !modal);
  // }, []);

  const renderItem = useCallback(item => {
    const { product, title, image } = item;
    const media = <Thumbnail alt={title} source={image} />;

    return (
      <ResourceList.Item
        id={product}
        media={media}
        url={`/product/edit/${product}`}
        accessibilityLabel={`View details for ${title}`}
      >
        <h3>
          <TextStyle variation="strong">{title}</TextStyle>
        </h3>
      </ResourceList.Item>
    );
  }, []);

  const resourceName = {
    singular: "product",
    plural: "products"
  };

  const promotedBulkActions = [
    {
      content: selectedItems.length > 1 ? `Delete products` : `Delete product`,
      onAction: () => setModal(true)
    }
  ];

  // If the user has empty business details, disallow creating a product
  let businessDetails = false;
  if (user.businessDetails) {
    const { businessName, fullName, street, city, zip } = user.businessDetails;

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
      {loaded &&
        (products.length > 0 ? (
          <>
            <>
              {!businessDetails && (
                <Card sectioned title="Profile Incomplete">
                  Your <Link url="/account">Business details</Link> must be
                  complete in order to create products
                </Card>
              )}
            </>
            <Card>
              <ResourceList
                items={products}
                resourceName={resourceName}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
                selectable
                promotedBulkActions={promotedBulkActions}
              />
              {products.length > 49 ? (
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
      <Modal
        open={modal}
        sectioned
        onClose={() => setModal(false)}
        title={
          selectedItems.length > 1
            ? `Delete ${selectedItems.length} products?`
            : `Delete 1 product?`
        }
        primaryAction={{
          content: "Delete product",
          destructive: true,
          onAction: handleDelete
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setModal(false)
          }
        ]}
      >
        <TextContainer>
          {selectedItems.length > 1 ? (
            <p>Are you sure you want to delete these products?</p>
          ) : (
            <p>Are you sure you want to delete this product?</p>
          )}
        </TextContainer>
      </Modal>
    </Page>
  );
};

export default Products;
