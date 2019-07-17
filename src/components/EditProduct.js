import React, { Component } from 'react'
import { Card, Form, FormLayout, TextField, Select } from '@shopify/polaris'
import PropTypes from 'prop-types'

class EditPhoto extends Component {

  state = {
    selected: ''
  }

  render() {

    const { unit, units, price, description, handleFocus, handleChangeTextField, handleCurrencyBlur, handleAddUnit, handleRemoveUnit, handleChangeUnit } = this.props;

    return (
      <Card secondaryFooterActions={[{content: 'Add purchase option', onAction: handleAddUnit}]}>
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
          <Card.Section title='Purchase options'>
          <FormLayout>
            {units.map((item, index) => (
              <TextField
                type="number"
                id="price"
                key={index}
                onFocus={handleFocus}
                label={`Option ${index + 1}`}
                labelAction={
                  index > 0
                    ? {content: 'Remove', onAction: () => handleRemoveUnit(index)}
                    : {content: ''}
                }
                onBlur={handleCurrencyBlur}
                value={item.price}
                min={1}
                helpText={`You will receive $${(item.price*.8).toFixed(2)} per ${item.value} after fees`}
                onChange={price => handleChangeUnit(index, item.value, price)}
                connectedRight={
                  <Select
                    label="Weight unit"
                    labelHidden
                    onChange={value => handleChangeUnit(index, value, item.price)}
                    value={item.value}
                    options={['oz', 'lb', 'bunch', 'each']}
                  />
                }
                prefix="$"
              />
            ))}
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
