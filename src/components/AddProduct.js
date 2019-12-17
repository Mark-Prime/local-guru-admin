import React, { Component } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Select,
  TextStyle,
  TextContainer
} from "@shopify/polaris";
import PropTypes from "prop-types";
import ProductSearch from "./ProductSearch";

class AddProduct extends Component {
  state = {
    selected: ""
  };

  render() {
    const {
      edit,
      units,
      description,
      handleProductChoice,
      handleFocus,
      handleChangeTextField,
      handleCurrencyBlur,
      handleChangeUnit,
      handleAddUnit,
      handleRemoveUnit
    } = this.props;

    return (
      <Card
        secondaryFooterActions={[
          { content: "Add purchase option", onAction: handleAddUnit }
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <Card.Section title="Product">
            <FormLayout>
              {!edit && (
                <ProductSearch
                  selected={this.state.selected}
                  onSelect={handleProductChoice}
                />
              )}
              <TextField
                value={description}
                id="description"
                label="Description"
                onChange={handleChangeTextField}
              />
            </FormLayout>
          </Card.Section>
          <Card.Section title="Purchase options">
            <TextContainer>
              <TextStyle variation="subdued">
                <p>
                  Customers can choose between any units/options listed here
                </p>
              </TextStyle>
            </TextContainer>
            <br />
            <FormLayout>
              {units.map((item, index) => (
                <TextField
                  type="number"
                  id="price"
                  key={index}
                  onFocus={handleFocus}
                  label={`Option ${index + 1}`}
                  min={0}
                  labelAction={
                    index > 0
                      ? {
                          content: "Remove",
                          onAction: () => handleRemoveUnit(index)
                        }
                      : { content: "" }
                  }
                  onBlur={() => handleCurrencyBlur(index)}
                  value={item.price}
                  helpText={`You will receive $${(item.price * 0.8).toFixed(
                    2
                  )} per ${item.value} after fees`}
                  onChange={price => handleChangeUnit(index, item.value, price)}
                  connectedRight={
                    <Select
                      label="Weight unit"
                      labelHidden
                      onChange={value =>
                        handleChangeUnit(index, value, item.price)
                      }
                      value={item.value}
                      options={["oz", "lb", "bunch", "each"]}
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

AddProduct.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool,
  unit: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  handleProductChoice: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleChangeTextField: PropTypes.func.isRequired,
  handleCurrencyBlur: PropTypes.func.isRequired
};

export default AddProduct;
