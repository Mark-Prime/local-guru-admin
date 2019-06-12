import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { addBankAccount, addPayoutCard, editProfile } from '../actions/UserActions'
import { toggleToast } from '../actions/UIActions'
import AvatarUpload from '../components/AvatarUpload'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { Thumbnail, Page, Layout, Card, TextField, FormLayout, Button } from '@shopify/polaris'

const { Section } = Layout

const Form = styled.form`

`;

class Settings extends Component {

  state = {
    routing: '',
    account: '',
    formOpen: false,
    bio: '',
    photo: '',
    dropzoneOpen: false
  }

  componentDidUpdate(prevProps){
    if(this.props.user !== prevProps.user){
      console.log(this.props.user.bio)
      if(this.props.user.bio){
        this.setState({
          bio: this.props.user.bio
        })
      }
    }
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

  handleEditProfile = () => {
    const user = this.props.user.uid;
    const { bio, photo } = this.state;
    this.props.editProfile(user, bio, photo)
    .then(res => {
      this.props.toggleToast('Profile updated')
    })
    .catch(err => {
      this.props.toggleToast(err.message)
    })
  }

  handleUpload = (file) => {
    this.setState({ photo: file })
  }

  render(){
    return (
      <div>
        <Page title='Account Settings'>
          <Layout>
            <Section>
            <Card title='Profile' sectioned primaryFooterAction={{ content: 'Update profile', onAction: () => this.handleEditProfile()}}>
              <FormLayout>
                <TextField id='bio' value={this.state.bio} label='Bio' onChange={this.handleChange} />
                {this.state.dropzoneOpen
                  ?
                    <div>
                      <p><AvatarUpload onChange={this.handleUpload}/></p><br/>
                      <p><Button plain onClick={() => this.setState({ dropzoneOpen: false })}>Cancel</Button></p>
                    </div>
                  :
                    <div>
                      <p><Thumbnail size='large' source={this.props.user.photoURL} /></p><br/>
                      <p><Button plain onClick={() => this.setState({ dropzoneOpen: true })}>Change image</Button></p>
                    </div>
                }
              </FormLayout>
            </Card>
            <Card title='Password' sectioned>
            </Card>
            <Card title='Debit Card for Payout' sectioned>
            {this.props.user.token
              &&

                <Card title={this.props.user.token.card.brand} sectioned>
                   •••• {this.props.user.token.card.last4}
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
}), { addBankAccount, addPayoutCard, toggleToast, editProfile })(Settings));
