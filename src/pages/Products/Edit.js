import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Page, Layout, Card } from '@shopify/polaris'
import { editProduct, fetchSingleProducerProduct, fetchSingleProduct, createProduct } from '../../actions/ProductActions'
import { toggleToast } from '../../actions/UIActions'
import { withRouter } from 'react-router-dom'
import EditProduct from '../../components/EditProduct'
import EditProductAdmin from '../../components/EditProductAdmin'
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
    category: '',
    unit: 'oz',
    units: [],
    tags: []
  }

  componentDidMount(){
    const { id } = this.props.match.params;

    if(this.props.user.admin){
      fetchSingleProduct(id)
      .then(product => {
        this.setState({ product: product, tags: product.tags, category: product.category, isLoaded: true })
      })
    } else {
      fetchSingleProducerProduct(id, this.props.user.uid)
      .then(product => {
        console.log(product.unit)
        this.setState({ product: product, unit: product.unit, units: product.units, isLoaded: true })
      })
    }
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

  handleCategoryChange = (value) => {
    console.log(value)
    this.setState({ category: value, touched: true })
  }

  handleCurrencyBlur = (index) => {
    console.log(index)
    const price = Number(this.state.units[index].price).toFixed(2)
    console.log(price)

    let units = this.state.units.slice()

    units[index] = { ...units[index], price: price}

    console.log(units[index].price)

    this.setState({
      units: units
    })
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

  handleUpload = (file) => {
    this.setState({ photo: file })
  }

  handleSelectChange = (value) => {
    this.setState({ category: value })
  }

  handleAddTag = (tag) => {
    const newTags = [...this.state.tags, tag]
    this.setState({ tags: newTags, touched: true })
  }

  handleRemoveTag = (index) => {
    const tags = [...this.state.tags];
    const newTags = tags.splice(index, 1)
    console.log(newTags)
    this.setState({ tags: newTags, touched: true })
  }

  handleSubmitAdmin = () => {
    const { tags, category, values } = this.state;
    const { title } = this.state.product;

    createProduct(title, category, tags)
    .then(id => {
      fetchSingleProduct(id).then(product => {
        this.setState({
          isLoaded: true,
          touched: false
        })
      })
    })
    .then(() => {
      this.props.toggleToast('Product updated')
    })
  }

  render() {

    const { touched, unit, units } = this.state;
    const { title, description, image, price, category, tags } = this.state.product;

    return (
      <Page
        breadcrumbs={[{content: 'Products', onAction: this.goBack}]}
        title={title}
        primaryAction={{ content: 'Save', disabled: !touched, onAction: this.props.user.admin ? this.handleSubmitAdmin : this.handleSubmit }}
      >
        <Layout>
          {this.state.isLoaded &&
            <>
          <Layout.Section>
            {this.props.user.admin
              ?
                <EditProductAdmin
                  title={title}
                  handleChangeTextField={this.handleChangeTextField}
                  category={this.state.category}
                  tags={this.state.tags}
                  handleChangeTextField={this.handleChangeTextField}
                  handleCategoryChange={this.handleCategoryChange}
                  handleAddTag={this.handleAddTag}
                  handleRemoveTag={this.handleRemoveTag}
                />
              :
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
            }
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <Image>
                <img src={image} alt={title} />
              </Image>
            </Card>
          </Layout.Section>
          </>
        }
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
