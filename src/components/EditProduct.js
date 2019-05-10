import React, { Component } from 'react';
import { Card, Form, FormLayout, TextField, Autocomplete, Icon } from '@shopify/polaris';
import PropTypes from 'prop-types';

class EditPhoto extends Component {

  state = {
    selected: ''
  }

  render() {

    const { edit, title, unit, products, price, description, selected, handleProductChoice, handleFocus, handleChangeTextField, handleCurrencyBlur } = this.props;

    const textField = (
      <Autocomplete.TextField
        onChange={this.props.handleChangeTextField}
        label="Product"
        value={title}
        prefix={<Icon source="search" color="inkLighter" />}
        placeholder="Search"
      />
    )

    let titleOptions = [];

    if(!edit){
      Object.keys(products).map((product, index) => {
        return titleOptions[index] = { value: product, label: products[product].title }
      })
    }

    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <Card.Section>
            <FormLayout>
              {!edit &&
                <Autocomplete
                  options={titleOptions}
                  selected={selected}
                  onSelect={handleProductChoice}
                  textField={textField}
                />
              }
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
  title: PropTypes.string
}

export default EditPhoto;
