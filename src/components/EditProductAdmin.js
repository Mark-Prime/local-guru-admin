import React, { Component } from 'react';
import { Card, Form, FormLayout, TextField, Select, Stack, Tag } from '@shopify/polaris';
import PropTypes from 'prop-types';
import ProductSearch from './ProductSearch'

class EditProduct extends Component {

  state = {
    tag: ''
  }

  handleTag = value => {
    const lastChar = value.charAt(value.length - 1);
    if (lastChar === ',') {
      const newTag = this.state.tag.split(',')[0];
      this.props.handleAddTag(newTag)
      this.setState({ tag: '' })
    } else {
      this.setState({
        tag: value
      })
    }
  }

  handleKeyDown = e => {
    if(e.key === 'Enter'){
      const tag = e.target.value
      this.props.handleAddTag(tag)
      this.setState({ tag: '' })
    }
  }

  render() {

    const { title, handleFocus, handleChangeTextField, handleCategoryChange, category, tags, handleAddTag, handleRemoveTag } = this.props;

    const categories = [
      {label: 'Veggies', value: 'veggies'},
      {label: 'Fruit', value: 'fruit'},
      {label: 'Herbs', value: 'herbs'},
    ]

    return (
      <Card>
        <Form>
          <Card.Section title='Product'>
            <br/>
            <FormLayout>
              <TextField
                value={title}
                id='title'
                label='Title'
                onChange={handleChangeTextField}
              />
              <Select
                label='Category'
                options={categories}
                onChange={handleCategoryChange}
                value={category}
              />
            </FormLayout>
            </Card.Section>
            <Card.Section title='tags'>
              <FormLayout >
                <TextField
                  placeholder='Enter tags separated by commas'
                  id='tags'
                  value={this.state.tag}
                  onChange={value => this.handleTag(value)}
                />
                <Stack>
                  {tags.map((tag, index) => <Tag key={index} onRemove={() => handleRemoveTag(index)}>{tag}</Tag>)}
                </Stack>
              </FormLayout>
            </Card.Section>
        </Form>
      </Card>
    );
  }

}

EditProduct.propTypes = {
  title: PropTypes.string,
  edit: PropTypes.bool,
  handleChangeTextField: PropTypes.func.isRequired,
}

export default EditProduct;
