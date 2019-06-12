import React, { Component } from 'react'
import { Card, FormLayout, TextField } from '@shopify/polaris'

class Survey extends Component {

  state = {
    answers: {}
  }

  handleChange = (value, id) => {
    const { answers } = this.state;
    let index = id;
    if(id === 'TextField1'){
      index = 0;
    }
    this.setState({ answers: {...answers, [index]: value} })
  }

  render() {

    const questions = [
      "What are your goals on the site?",
      "What problems have you been facing?",
      "How did you find us?",
      "Where do you sell the majority of your produce?",
      "Do you grow year round?",
      "What are your expectations?"
    ];

    return (
      <Card
        title='Survey'
        sectioned
        primaryFooterAction={{content: 'Next', onAction: () => this.props.handleSubmit(this.state.answers)}}
        secondaryFooterAction={{ content: 'Back', onAction: () => this.props.back() }}
      >
        <FormLayout>
          {questions.map((question, index) => (
            <TextField key={index} value={this.state.answers[index]} id={index} label={question} onChange={this.handleChange} />
          ))}
        </FormLayout>
      </Card>
    );
  }

}

export default Survey;
