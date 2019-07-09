import React, { Component } from 'react';
import { Card, Form, FormLayout, TextField, Select } from '@shopify/polaris';
import PropTypes from 'prop-types';
import ProductSearch from './ProductSearch'

class AddProduct extends Component {

  state = {
    selected: ''
  }

  render() {

    const { edit, unit, price, description, handleProductChoice, handleFocus, handleChangeTextField, handleCurrencyBlur } = this.props;

    return (
      <Card secondaryFooterActions={[{content: 'Add unit'}]}>
        <Form onSubmit={this.handleSubmit}>
          <Card.Section title='Product'>
            <FormLayout>
              {!edit &&
                <ProductSearch
                  selected={this.state.selected}
                  onSelect={handleProductChoice}
                />
              }
              <TextField
                value={description}
                id='description'
                label='Description'
                onChange={handleChangeTextField}
              />
            </FormLayout>
            </Card.Section>
            <Card.Section title='Prices'>
            <FormLayout>
              <TextField
                type="number"
                id="price"
                onFocus={handleFocus}
                onBlur={handleCurrencyBlur}
                value={price}
                helpText={`You will receive $${(price*.8).toFixed(2)} per ${unit} after fees`}
                onChange={handleChangeTextField}
                connectedRight={
                  <Select label="Weight unit" labelHidden value='lb' options={['oz', 'lb', 'bunch', 'each']} />
                }
                prefix="$"
              />
              <TextField
                type="number"
                id="price"
                onFocus={handleFocus}
                onBlur={handleCurrencyBlur}
                value='1.00'
                helpText={`You will receive $${(1*.8).toFixed(2)} per ${unit} after fees`}
                connectedRight={
                  <Select label="Weight unit" labelHidden value='each' options={['oz', 'lb', 'bunch', 'each']} />
                }
                prefix="$"
              />
            </FormLayout>
          </Card.Section>
        </Form>
      </Card>
    );
  }

}

AddProduct.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool,
  unit: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  handleProductChoice: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleChangeTextField: PropTypes.func.isRequired,
  handleCurrencyBlur: PropTypes.func.isRequired
}

export default AddProduct;
