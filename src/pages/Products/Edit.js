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
    unit: 'oz',
    units: []
  }

  componentDidMount(){
    const { id } = this.props.match.params;
    fetchSingleProducerProduct(id, this.props.user.uid)
    .then(product => {
      console.log(product.unit)
      this.setState({ product: product, unit: product.unit, units: product.units })
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

  handleChangeUnit = (index, value, price) => {
    // copy array
    const units = this.state.units.slice()
    // edit array
    units[index] = { price: price, value: value }
    // set state with new array
    this.setState({
      units: units,
      touched: true
    })
  }

  handleAddUnit = () => {
    // copy array
    let units = this.state.units.slice()
    // check length
    units = [...units, { value: 'lb', price: 0}]
    // set state with new array
    this.setState({ units: units, touched: true })
  }

  handleRemoveUnit = (index) => {
    console.log(index)
    // copy array
    const units = this.state.units.slice()
    // remove item
    units.splice(index, 1)
    // set state with new array
    this.setState({ units: units, touched: true })
  }

  handleSubmit = () => {
    const { product, unit, units } = this.state;
    const { user } = this.props;
    const { image, title, description, price } = product;
    const { id } = this.props.match.params;

    const values = {
      description: description,
      price: price
    }

    editProduct(user, id, values, image, title, unit, units)
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

    const { touched, unit, units } = this.state;
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
              units={units}
              handleChangeTextField={this.handleChangeTextField}
              handleFocus={this.handleFocus}
              handleCurrencyBlur={this.handleCurrencyBlur}
              handleChangeUnit={this.handleChangeUnit}
              handleAddUnit={this.handleAddUnit}
              handleRemoveUnit={this.handleRemoveUnit}
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
