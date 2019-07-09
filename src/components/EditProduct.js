import React, { Component } from 'react'
import { Card, Form, FormLayout, TextField, Select } from '@shopify/polaris'
import PropTypes from 'prop-types'

class EditPhoto extends Component {

  state = {
    selected: ''
  }

  render() {

    const { unit, price, description, handleFocus, handleChangeTextField, handleCurrencyBlur } = this.props;

    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <Card.Section>
            <FormLayout>
              <TextField
                value={description}
                id='description'
                label='Description'
                onChange={handleChangeTextField}
              />
              <TextField
                label="Price"
                type="number"
                id="price"
                onFocus={handleFocus}
                onBlur={handleCurrencyBlur}
                value={price}
                onChange={handleChangeTextField}
                prefix="$"
                helpText={`You will receive $${(price*.8).toFixed(2)} per ${unit} after fees`}
                connectedRight={
                  <Select label="Weight unit" value={unit} onChange={this.props.handleUnitChange} labelHidden options={['oz', 'lb']} />
                }
              />
            </FormLayout>
          </Card.Section>
          <Card.Section>
            <FormLayout>
              <TextField
                value={unit}
                id='unit'
                label='Unit'
                disabled
              />
            </FormLayout>
          </Card.Section>
        </Form>
      </Card>
    );
  }

}

EditPhoto.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool,
  price: PropTypes.number,
  description: PropTypes.string,
  handleFocus: PropTypes.func.isRequired,
  handleChangeTextField: PropTypes.func.isRequired,
  handleCurrencyBlur: PropTypes.func.isRequired
}

export default EditPhoto;
