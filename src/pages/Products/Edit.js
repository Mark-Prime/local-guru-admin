import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Page, Layout, Card } from '@shopify/polaris'
import { editProduct, fetchSingleProducerProduct } from '../../actions/ProductActions'
import { toggleToast } from '../../actions/UIActions'
import { withRouter } from 'react-router-dom'
import EditProduct from '../../components/EditProduct'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Image = styled.div`
  img {
    width: 100%;
  }
`;

class EditSingleProduct extends Component {

  state = {
    isLoaded: false,
    touched: false,
    product: {},
    unit: 'oz'
  }

  componentDidMount(){
    const { id } = this.props.match.params;
    fetchSingleProducerProduct(id, this.props.user.uid)
    .then(product => {
      console.log(product.unit)
      this.setState({ product: product, unit: product.unit })
    })
  }

  handleProductChoice = (selected) => {
    this.setState({ selected: selected[0] })
  }

  handleChangeTextField = (value, id) => {
    console.log(value)
    this.setState({ touched: true })
    this.setState({ product: {...this.state.product, [id]: value} })
  }

  updateText = (newValue) => {
     this.setState({inputText: newValue});
     this.filterAndUpdateOptions(newValue);
   };

  handleFocus = (e) => {
    e.target.select()
  }

  handleCurrencyBlur = () => {
    const price = Number(this.state.product.price).toFixed(2)
    this.setState({ product: {...this.state.product, price: price} })
  }

  handleUnitChange = (unit) => {
    this.setState({ unit: unit, touched: true })
  }

  handleSubmit = () => {
    const { product, unit } = this.state;
    const { user } = this.props;
    const { image, title, description, price } = product;
    const { id } = this.props.match.params;

    const values = {
      description: description,
      price: price
    }

    editProduct(user, id, values, image, title, unit)
    .then(() => {
      fetchSingleProducerProduct(id, this.props.user.uid).then(product => {
        this.setState({
            product: product,
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

    const { touched, unit } = this.state;
    const { title, description, image, price } = this.state.product;

    return (
      <Page
        breadcrumbs={[{content: 'Products', onAction: this.goBack}]}
        title={title}
        primaryAction={{ content: 'Save', disabled: !touched, onAction: this.handleSubmit }}
      >
        <Layout>
          <Layout.Section>
            <EditProduct
              title={title}
              description={description}
              price={price}
              unit={unit}
              handleUnitChange={this.handleUnitChange}
              handleChangeTextField={this.handleChangeTextField}
              handleFocus={this.handleFocus}
              handleCurrencyBlur={this.handleCurrencyBlur}
            />
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <Image>
                <img src={image} alt={title} />
              </Image>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

EditSingleProduct.propTypes = {
  user: PropTypes.object.isRequired,
  toggleToast: PropTypes.func.isRequired
}

export default withRouter(connect((state, ownProps) => ({
  user: state.user
}), { toggleToast })(EditSingleProduct));
