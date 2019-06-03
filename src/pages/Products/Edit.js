import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Page, Layout, Card } from '@shopify/polaris'
import { editProduct, fetchSingleProduct } from '../../actions/ProductActions'
import { toggleToast } from '../../actions/UIActions'
import { withRouter } from 'react-router-dom'
import EditProduct from '../../components/EditProduct'
import styled from 'styled-components'

const Image = styled.div`
  img {
    width: 100%;
  }
`;

class EditSingleProduct extends Component {

  state = {
    isLoaded: false,
    values: {
      description: '',
      price: 0,
      unit: ''
    },
    inputText: '',
    touched: false,
  }

  componentDidMount(){
    const { id } = this.props.match.params;
    fetchSingleProduct(id)
    .then(product => {
      const { description, image, price, unit, title } = product;
      this.setState({ values: {
        description: description,
        price: price,
        unit: unit,
        image: image,
        title: title
      } })
    })
  }

  handleChangeTextField = (value, id) => {
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
    this.setState({ values: { ... this.state.values, price: price } })
  }

  handleSubmit = () => {
    const { values } = this.state;
    const { user } = this.props;
    const { id } = this.props.match.params;

    editProduct(user, id, values)
    .then(() => {
      fetchSingleProduct(id).then(photo => {
        this.setState({ photo: photo, values: photo, isLoaded: true, touched: false })
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

    const { isLoaded, photo, touched, values, selected, products } = this.state;
    const { price, description } = values;

    return (
      <Page
        breadcrumbs={[{content: 'Products', onAction: this.goBack}]}
        title='Add Product'
        primaryAction={{ content: 'Save', disabled: !touched, onAction: this.handleSubmit }}
      >
        <Layout>
          <Layout.Section>
            <EditProduct
              edit
              products={products}
              title={this.state.values.title}
              selected={selected}
              description={values.description}
              price={price}
              unit={this.state.values.unit}
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
                    <img src={this.state.values.image} alt={this.state.title} />
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

export default withRouter(connect((state, ownProps) => ({
  user: state.user
}), { toggleToast })(EditSingleProduct));
