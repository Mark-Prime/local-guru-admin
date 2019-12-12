import React, { Component } from "react";
import { connect } from "react-redux";
import { Page, Layout, Card } from "@shopify/polaris";
import {
  fetchAllProducts,
  editProduct,
  fetchSingleProduct,
  createProduct
} from "../../actions/ProductActions";
import { toggleToast } from "../../actions/UIActions";
import { withRouter } from "react-router-dom";
import AddProduct from "../../components/AddProduct";
import AddProductAdmin from "../../components/AddProductAdmin";
import styled from "styled-components";
import PropTypes from "prop-types";
import ProductPhotoUpload from "../../components/ProductPhotoUpload";

const Image = styled.div`
  img {
    width: 100%;
  }
`;

class AddSingleProduct extends Component {
  state = {
    isLoaded: false,
    values: {
      description: "",
      price: 0
    },
    units: [{ value: "lb", price: 0 }],
    title: "",
    selected: "",
    category: "veggies",
    photo: "",
    tags: [],
    inputText: "",
    products: {},
    touched: false
  };

  componentDidMount() {
    if (!this.props.user.admin) {
      this.props.fetchAllProducts().then(products => {
        this.setState({ products: products });
      });
    }
  }

  handleProductChoice = selected => {
    console.log(selected[0]);
    let index = this.props.products.findIndex(p => p.title === selected[0]);
    this.setState({ selected: index });
  };

  handleChangeTextField = (value, id) => {
    this.setState({ touched: true });
    this.setState({ values: { ...this.state.values, [id]: value } });
  };

  updateText = newValue => {
    this.setState({ inputText: newValue });
    this.filterAndUpdateOptions(newValue);
  };

  handleSelectChange = (value, id) => {
    this.setState({ touched: true });
    this.setState({ values: { ...this.state.values, [id]: value } });
  };

  handleFocus = e => {
    e.target.select();
  };

  handleCurrencyBlur = index => {
    console.log(index);
    const price = Number(this.state.units[index].price).toFixed(2);
    console.log(price);

    let units = this.state.units.slice();

    units[index] = { ...units[index], price: price };

    console.log(units[index].price);

    this.setState({
      units: units
    });
  };

  handleChangeUnit = (index, value, price) => {
    // copy array
    const units = this.state.units.slice();
    // edit array
    units[index] = { price: Number(price), value: value };
    // set state with new array
    this.setState({
      units: units
    });
  };

  handleAddTag = tag => {
    const newTags = [...this.state.tags, tag];
    this.setState({ tags: newTags });
  };

  handleRemoveTag = index => {
    const tags = [...this.state.tags];
    const newTags = tags.splice(index, 1);
    this.setState({ tags: newTags, touched: true });
  };

  handleAddUnit = () => {
    // copy array
    let units = this.state.units.slice();
    // check length
    units = [...units, { value: "lb", price: 0 }];
    // set state with new array
    this.setState({ units: units });
  };

  handleRemoveUnit = index => {
    console.log(index);
    // copy array
    const units = this.state.units.slice();
    // remove item
    units.splice(index, 1);
    // set state with new array
    this.setState({ units: units });
  };

  handleSubmitAdmin = () => {
    const { tags, photo, category, values } = this.state;
    const { title } = values;

    createProduct(title, category, tags, photo)
      .then(id => {
        fetchSingleProduct(id).then(product => {
          this.setState({
            isLoaded: true,
            touched: false
          });
        });
      })
      .then(() => {
        this.props.toggleToast("Product updated");
      });
  };

  handleSubmit = () => {
    const { selected, values, units } = this.state;
    const { user } = this.props;
    const { image, title, unit, id } = this.props.products[selected];
    console.log(id);
    editProduct(user, id, values, image, title, unit, units)
      .then(() => {
        fetchSingleProduct(id).then(product => {
          console.log(product);
          this.setState({
            product: product,
            values: product,
            isLoaded: true,
            touched: false
          });
        });
      })
      .then(() => {
        this.props.toggleToast("Product updated");
      })
      .catch(err => {
        console.log(err);
      });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  handleUpload = file => {
    this.setState({ photo: file });
  };

  handleCategoryChange = value => {
    this.setState({ category: value, touched: true });
  };

  render() {
    const { touched, values, selected, title, category, tags } = this.state;
    const { products } = this.props;
    const { price } = values;

    return (
      <Page
        breadcrumbs={[{ content: "Products", onAction: this.goBack }]}
        title="Add Product"
        primaryAction={{
          content: "Save",
          disabled: !touched,
          onAction: this.props.user.admin
            ? this.handleSubmitAdmin
            : this.handleSubmit
        }}
      >
        <Layout>
          <Layout.Section>
            {this.props.user.admin ? (
              <AddProductAdmin
                title={values.title}
                category={category}
                tags={tags}
                handleChangeTextField={this.handleChangeTextField}
                handleCategoryChange={this.handleCategoryChange}
                handleAddTag={this.handleAddTag}
                handleRemoveTag={this.handleRemoveTag}
              />
            ) : (
              <AddProduct
                products={products}
                title={title}
                selected={selected}
                description={values.description}
                price={price}
                unit={selected !== "" ? products[selected].unit : ""}
                units={this.state.units}
                handleProductChoice={this.handleProductChoice}
                handleChangeTextField={this.handleChangeTextField}
                handleSelectChange={this.handleSelectChange}
                handleFocus={this.handleFocus}
                handleCurrencyBlur={this.handleCurrencyBlur}
                handleChangeUnit={this.handleChangeUnit}
                handleAddUnit={this.handleAddUnit}
                handleRemoveUnit={this.handleRemoveUnit}
              />
            )}
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <Image>
                {this.props.user.admin ? (
                  <ProductPhotoUpload onChange={this.handleUpload} />
                ) : (
                  <>
                    {selected !== "" ? (
                      <img
                        src={products[selected].image}
                        alt={products[selected].title}
                      />
                    ) : null}
                  </>
                )}
              </Image>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

AddSingleProduct.propTypes = {
  user: PropTypes.object.isRequired,
  toggleToast: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    (state, ownProps) => ({
      user: state.user,
      products: state.products
    }),
    { toggleToast, fetchAllProducts }
  )(AddSingleProduct)
);
