import React, { Component } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Select,
  Stack,
  Tag
} from "@shopify/polaris";
import PropTypes from "prop-types";

class AddProduct extends Component {
  state = {
    tag: "",
    tags: []
  };

  handleTag = value => {
    const lastChar = value.charAt(value.length - 1);
    if (lastChar === ",") {
      const newTag = this.state.tag.split(",")[0];
      this.props.handleAddTag(newTag);
      this.setState({ tag: "" });
    } else {
      this.setState({
        tag: value
      });
    }
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      const tag = e.target.value;
      this.props.handleAddTag(tag);
      this.setState({ tag: "" });
    }
  };

  render() {
    const {
      category,
      title,
      handleChangeTextField,
      tags,
      handleRemoveTag
    } = this.props;

    const categories = [
      { label: "Veggies", value: "veggies" },
      { label: "Fruit", value: "fruit" },
      { label: "Herbs", value: "herbs" }
    ];

    return (
      <Card>
        <Form>
          <Card.Section title="Product">
            <br />
            <FormLayout>
              <TextField
                value={title}
                id="title"
                label="Title"
                onChange={handleChangeTextField}
              />
              <Select
                label="Category"
                options={categories}
                value={category}
                onChange={value => handleChangeTextField(value, "category")}
              />
            </FormLayout>
          </Card.Section>
          <Card.Section title="tags">
            <FormLayout>
              <TextField
                placeholder="Enter tags separated by commas"
                id="tags"
                value={this.state.tag}
                onChange={value => this.handleTag(value)}
              />
              <Stack>
                {tags &&
                  tags.map((tag, index) => (
                    <Tag key={index} onRemove={() => handleRemoveTag(index)}>
                      {tag}
                    </Tag>
                  ))}
              </Stack>
            </FormLayout>
          </Card.Section>
          <Card.Section title="Pricing">
            <TextField
              type="number"
              onChange={handleChangeTextField}
              placeholder="Maximum price"
              prefix="$"
              min={0}
            />
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
