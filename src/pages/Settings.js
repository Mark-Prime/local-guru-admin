import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { addBankAccount, addPayoutCard } from '../actions/UserActions'
import { toggleToast } from '../actions/UIActions'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { Page, Layout, Card, TextField, FormLayout, Button, SkeletonDisplayText } from '@shopify/polaris'

const { Section } = Layout

const Form = styled.form`

`;

class Settings extends Component {

  state = {
    routing: '',
    account: '',
    formOpen: false
  }

  handleAddBank = () => {
    const { user, stripe } = this.props;
    console.log(user)
    const { routing, account } = this.state;

    stripe.createToken('bank_account', {
      country: 'US',
      currency: 'usd',
      routing_number: routing,
      account_number: account,
      account_holder_name: user.displayName,
      account_holder_type: 'individual',
    })
    .then(res => {
      this.props.toggleToast('Bank account added')
    })
    .catch(err => {
      this.props.toggleToast(err.message)
    })
  }

  handleAddCard = e => {

    e.preventDefault()

    const { user, stripe } = this.props;
    const { routing, account } = this.state;

    stripe.createToken({type: 'card', name: this.props.user.displayName, currency: 'usd'})
    .then(({error, token}) => {
      if(error){
        throw new Error(error.message)
      }
      this.props.addPayoutCard(user, token)
    })
    .then(res => {
      this.props.toggleToast('Card added')
    })
    .catch(err => {
      this.props.toggleToast(err.message)
    })
  }

  handleChange = (value, id) => {
    this.setState({ [id]: value })
  }

  handleOpenForm = () => {
    this.setState({ formOpen: !this.state.formOpen })
  }

  render(){
    return (
      <div>
        <Page title='Account Settings'>
          <Layout>
            <Section>
            <Card title='Profile' sectioned>
            </Card>
            <Card title='Password' sectioned>
            </Card>
            <Card title='Debit Card for Payout' sectioned>
            {this.props.user.bankAccount
              &&

                <Card title={this.props.user.card.brand} sectioned>
                   •••• {this.props.user.card.last4}
                </Card>

            }
              <br/>
              <Form onSubmit={this.handleAddCard}>
                <CardElement
                  style={{
                    base: {
                      fontSize: '16px',
                    }
                  }}
                />
                <br/>
                <Button submit type='primary'>Add Card</Button>
              </Form>
            </Card>
            <Card
              title='Bank'
              sectioned primaryFooterAction={
                this.state.formOpen
                ?
                  {
                    content: 'Add bank account',
                    onAction: () => this.handleAddBank()
                  }
                :
                  {
                    content: 'Change bank acccount',
                    onAction: () => this.handleOpenForm()
                  }
              }
              >
              {this.props.user.bankAccount
                ?
                  <Card title={this.props.user.bankAccount.bank_name} sectioned>
                     •••• {this.props.user.bankAccount.last4}
                  </Card>
                :
                  <FormLayout>
                    <TextField type='number' id='routing' value={this.state.routing} placeholder='Routing Number' onChange={this.handleChange} />
                    <TextField type='number' id='account' value={this.state.account} placeholder='Account Number' onChange={this.handleChange} />
                  </FormLayout>
              }
              {this.state.formOpen
                ?
                  <p>
                    <br/>
                    <FormLayout>
                      <TextField type='number' id='routing' value={this.state.routing} placeholder='Routing Number' onChange={this.handleChange} />
                      <TextField type='number' id='account' value={this.state.account} placeholder='Account Number' onChange={this.handleChange} />
                    </FormLayout>
                  </p>
                : null
              }
            </Card>
            </Section>
          </Layout>
        </Page>
      </div>
    )
  }
}

export default injectStripe(connect((state, ownProps) => ({
  user: state.user
}), { addBankAccount, addPayoutCard, toggleToast })(Settings));
