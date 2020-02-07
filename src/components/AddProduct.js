import React from "react";
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

const AddProduct = ({
  edit,
  selected,
  units,
  description,
  handleProductChoice,
  handleFocus,
  handleChangeTextField,
  handleCurrencyBlur,
  handleChangeUnit,
  handleAddUnit,
  handleSubmit,
  handleRemoveUnit
}) => {
  return (
    <Card
      secondaryFooterActions={[
        { content: "Add purchase option", onAction: handleAddUnit }
      ]}
    >
      <Form onSubmit={handleSubmit}>
        <Card.Section title="Product">
          <FormLayout>
            {!edit && (
              <ProductSearch
                selected={selected}
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
              <p>Customers can choose between any units/options listed here</p>
            </TextStyle>
          </TextContainer>
          <br />
          <FormLayout>
            {units.map((item, index) => {
              return (
                <FormLayout.Group key={index}>
                  <TextField
                    type="number"
                    id="price"
                    label={`Option ${index + 1}`}
                    min={0}
                    onFocus={handleFocus}
                    value={item.price.toString()}
                    onChange={price =>
                      handleChangeUnit(index, item.value, price)
                    }
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
                  <TextField type="number" id="max" label="Maximum order" />
                </FormLayout.Group>
              );
            })}
          </FormLayout>
        </Card.Section>
      </Form>
    </Card>
  );
};

AddProduct.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool,
  description: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  handleProductChoice: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleChangeTextField: PropTypes.func.isRequired,
  handleCurrencyBlur: PropTypes.func.isRequired
};

export default AddProduct;
