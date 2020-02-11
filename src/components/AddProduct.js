import React from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Select,
  TextStyle,
  ChoiceList,
  TextContainer
} from "@shopify/polaris";
import PropTypes from "prop-types";
import ProductSearch from "./ProductSearch";

const AddProduct = ({
  edit,
  selected,
  units,
  seasons,
  description,
  handleProductChoice,
  handleFocus,
  handleChangeTextField,
  handleCurrencyBlur,
  handleChangeUnit,
  handleAddUnit,
  handleSeason,
  handleSubmit,
  handleRemoveUnit
}) => {
  return (
    <Card>
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
        <Card.Section
          title="Purchase options"
          actions={[
            { content: "Add purchase option", onAction: handleAddUnit }
          ]}
        >
          <TextContainer>
            <TextStyle variation="subdued">
              <p>Customers can choose between any units/options listed here</p>
            </TextStyle>
          </TextContainer>
          <br />
          <FormLayout>
            {units.map((item, index) => {
              return (
                <Card
                  key={index}
                  sectioned
                  title={`Option ${index + 1}`}
                  actions={
                    index > 0 && [
                      {
                        content: "Delete option",
                        destructive: true,
                        onAction: () => handleRemoveUnit(index)
                      }
                    ]
                  }
                >
                  <FormLayout.Group>
                    <TextField
                      type="number"
                      id="price"
                      label="Price"
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
                    <TextField
                      type="number"
                      id="max"
                      value={item.max}
                      min={0}
                      onChange={value =>
                        handleChangeUnit(index, item.value, item.price, value)
                      }
                      suffix={item.value}
                      label="Maximum order"
                    />
                  </FormLayout.Group>
                </Card>
              );
            })}
          </FormLayout>
        </Card.Section>
        <Card.Section title="Availability">
          <FormLayout>
            <ChoiceList
              allowMultiple
              title="Season(s) product is available"
              choices={[
                { label: "Spring", value: "spring" },
                { label: "Summer", value: "summer" },
                { label: "Fall", value: "fall" },
                { label: "Winter", value: "winter" }
              ]}
              selected={seasons}
              onChange={handleSeason}
            />
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
