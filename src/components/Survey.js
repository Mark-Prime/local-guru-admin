import React, { Component } from 'react'
import { Card, FormLayout, TextField, ChoiceList } from '@shopify/polaris'

class Survey extends Component {

  state = {
    goals: '',
    expectations: '',
    problems: 'I cant seem to sell all my product',
    problemsText: '',
    grow: 'Yes',
    sell: 'My own website or other third party site',
    source: 'Social Media',
  }

  handleChange = (value, id) => {
    const { answers } = this.state;
    let index = id;
    if(id === 'TextField1'){
      index = 0;
    }
    this.setState({ [index]: value })
  }

  render() {

    const questions = [
      "What are your goals on the site?",
      "What are your expectations?"
    ];

    const { back, handleSubmit } = this.props;
    const { selected } = this.state;

    return (
      <Card
        title='Survey'
        sectioned
        primaryFooterAction={{content: 'Next', onAction: () => handleSubmit(this.state.answers)}}
        secondaryFooterAction={{ content: 'Back', onAction: () => back() }}
      >
        <FormLayout>
          <TextField value={this.state.goals} id='goals' label={'What are your goals on the site?'} onChange={this.handleChange} />
          <ChoiceList
            title={'What problems have you been facing?'}
            choices={[
              {label: 'I cant seem to sell all my product', value: 'I cant seem to sell all my product'},
              {label: 'I need help promoting myself', value: 'I need help promoting myself'},
              {label: 'I need a new market', value: 'I need a new market'},
              {
                label: 'Other:',
                value: 'Other:',
                renderChildren: () => (
                  <TextField
                    label="Other"
                    labelHidden
                    id='problemsText'
                    onChange={this.handleChange}
                    value={this.state.problemsText}
                  />
                )
              }
            ]}
            name={'problems'}
            selected={this.state.problems}
            onChange={this.handleChange}
          />
          <ChoiceList
            title={'How did you find us?'}
            choices={[
              {label: 'Social Media', value: 'Social Media'},
              {label: 'Word of Mouth', value: 'Word of Mouth'},
              {label: 'I know a seller', value: 'I know a seller'},
              {label: 'I know a buyer', value: 'I know a buyer'},
            ]}
            name={'source'}
            selected={this.state.source}
            onChange={this.handleChange}
          />
          <ChoiceList
            title={'Where do you sell the majority of your product?'}
            choices={[
              {label: 'My own website or other third party site', value: 'My own website or other third party site'},
              {label: 'Farmers Market', value: 'Farmers Market'},
              {label: 'Grocer', value: 'Grocer'},
              {label: 'Wholesaler', value: 'Wholesaler'}
            ]}
            name={'sell'}
            selected={this.state.sell}
            onChange={this.handleChange}
          />
          <ChoiceList
            title={'Do you grow year round?'}
            choices={[
              {label: 'Yes', value: 'Yes'},
              {label: 'No', value: 'No'}
            ]}
            name={'grow'}
            selected={this.state.grow}
            onChange={this.handleChange}
          />
          <TextField value={this.state.expectations} id='expectations' label={'What are your expectations?'} onChange={this.handleChange} />
        </FormLayout>
      </Card>
    );
  }

}

export default Survey;
