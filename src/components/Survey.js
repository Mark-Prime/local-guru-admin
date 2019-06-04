import React, { Component } from 'react'
import { Card, ChoiceList, FormLayout, TextField } from '@shopify/polaris'

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
      "What are your short term goals on the site?",
      "What are your long term goals on the site?",
      "What is your companies greatest strength?",
      "What are unique things you make that you think will add to our community?",
      "What are you looking for in the companies you do business with?",
      "What problems are you facing?",
      "What does success look like for you?",
      "What would you like us to know about you?",
      "How did you find out about us?",
      "What are your expectations?",
      "Where do you sell the majority of your produce?",
      "How do you sell most of your produce?",
      "Are you interested in selling directly to the customers?",
      "Are you okay with customers coming directly to you monthly for a site view of your location?",
      "Could you cut the produce the day before shipping to us?",
      "Do you normally harvest the food before full maturity of the produce?",
      "Could you drop the food off in one general location in the city?",
      "What is the hardest to sell?",
      "What is the turn around Yield for your produce?",
      "Do you clean all the food before selling and can you?",
      "What challenges do you see in this industry?",
      "Do you grow year round?"
    ];

    return (
      <Card title='Survey' sectioned primaryFooterAction={{content: 'Next', onAction: () => this.props.handleSubmit(this.state.answers)}}>
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
