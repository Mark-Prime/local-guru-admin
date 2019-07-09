import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Page, Layout, Card } from '@shopify/polaris'
import { fetchAllProducts, editProduct, fetchSingleProduct } from '../../actions/ProductActions'
import { toggleToast } from '../../actions/UIActions'
import { withRouter } from 'react-router-dom'
import AddProduct from '../../components/AddProduct'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Image = styled.div`
  img {
    width: 100%;
  }
`;

class AddSingleProduct extends Component {

  state = {
    isLoaded: false,
    values: {
      description: '',
      price: 0
    },
    units: [],
    title: '',
    selected: '',
    inputText: '',
    products: {},
    touched: false,
  }

  componentDidMount(){
    fetchAllProducts()
    .then(products => {
      console.log(products)
      this.setState({ products: products })
    })
  }

  handleProductChoice = (selected) => {
    let index = this.state.products.findIndex(p => p.title === selected)
    this.setState({ selected: index })
  }

  handleChangeTextField = (value, id) => {
    console.log(value, id)
    this.setState({ touched: true })
    this.setState({ values: { ...this.state.values, [id]: value }})
  }

  updateText = (newValue) => {
     this.setState({inputText: newValue});
     this.filterAndUpdateOptions(newValue);
   };

  handleSelectChange = (value, id) => {
    this.setState({ touched: true })
    this.setState({ values: { ...this.state.values, [id]: value} })
  }

  handleFocus = (e) => {
    e.target.select()
  }

  handleCurrencyBlur = () => {
    const price = Number(this.state.values.price).toFixed(2)
    this.setState({ values: { ...this.state.values, price: price } })
  }

  handleSubmit = () => {
    const { selected, values } = this.state;
    const { user } = this.props;
    const { image, title, unit, id } = this.state.products[selected];
    console.log(id)
    editProduct(user, id, values, image, title, unit)
    .then(() => {
      fetchSingleProduct(id).then(product => {
        this.setState({
          product: product,
          values: product,
          isLoaded: true,
          touched: false
        })
      })
    })
    .then(() => {
      this.props.toggleToast('Product updated')
    })
    .catch(err => {
      console.log(err)
    })
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {

    const { touched, values, selected, products, title } = this.state;
    const { price } = values;

    return (
      <Page
        breadcrumbs={[{content: 'Products', onAction: this.goBack}]}
        title='Add Product'
        primaryAction={{ content: 'Save', disabled: !touched, onAction: this.handleSubmit }}
      >
        <Layout>
          <Layout.Section>
            <AddProduct
              products={products}
              title={title}
              selected={selected}
              description={values.description}
              price={price}
              unit={selected !== '' ? products[selected].unit : ''}
              units={this.state.units}
              handleProductChoice={this.handleProductChoice}
              handleChangeTextField={this.handleChangeTextField}
              handleSelectChange={this.handleSelectChange}
              handleFocus={this.handleFocus}
              handleCurrencyBlur={this.handleCurrencyBlur}
            />
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <Image>
                {selected !== ''
                  ?
                    <img src={products[selected].image} alt={products[selected].title} />
                  :
                    null
                }
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
}

export default withRouter(connect((state, ownProps) => ({
  user: state.user
}), { toggleToast })(AddSingleProduct));
