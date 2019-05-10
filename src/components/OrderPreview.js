import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleToast } from '../actions/UIActions'
import { fetchEachTransaction } from '../actions/TransactionActions'
import { Page, DisplayText, TextStyle, Layout, CalloutCard } from '@shopify/polaris'

const { Section } = Layout

class OrderPreview extends Component {

  state = {
    transactions: [],
    isLoaded: false
  }

  componentDidMount(){
    this.props.fetchEachTransaction(this.props.user.uid)
    .then(transactions => {
      this.setState({ transactions: transactions, isLoaded: true })
    })
  }

  render() {

    let amount = 0;

    if(this.state.transactions.length > 0){
      this.state.transactions.map(item => {
        const { created_at } = item;
        const today = Date.now();
        if(today - created_at <= 86400000 * 7 ){
          amount = amount + item.price * item.count
        }
      })
    }

    return (
      <>
        {this.state.isLoaded &&
          <>
            <Section oneThird>
              <p>This week's total sales</p>
              <br/>
              <DisplayText size='large'>${amount.toFixed(2)}</DisplayText>
            </Section>
            <Section oneThird>
              <p>This week's visits</p>
              <br/>
              <DisplayText size='large'>120</DisplayText>
            </Section>
          </>
        }
      </>
    );
  }

}

export default connect((state, ownProps) => ({
  ui: state.ui,
  user: state.user,
  transactions: state.transactions
}), { toggleToast, fetchEachTransaction })(OrderPreview);
