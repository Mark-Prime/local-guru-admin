import React, { Component } from 'react'
import styled from 'styled-components'
import { CardElement } from 'react-stripe-elements'
import { Tabs, Page, TextField, Card, Form, FormLayout, Scrollable, Checkbox, InlineError } from '@shopify/polaris'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { injectStripe } from 'react-stripe-elements'
import { createAccount, loginUser } from '../actions/UserActions'
import Survey from '../components/Survey'
import { firebase } from '@firebase/app'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { auth } from '../firebase'

const Wrapper = styled.div`
  margin-top: 4rem;

  .Polaris-Page {
  }
`;

class Register extends Component {

  state = {
    currentTab: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    street: '',
    zip: '',
    city: '',
    token: '',
    agreed: false,
    disabled: true,
    surveyOne: 'one',
    surveyTwo: 'one',
    error: false,
    errorMessage: ''
  }

  handleChange = (value, id) => {
    this.setState({ [id]: value })
  }

  handleChoice = (value, name) => {
    this.setState({ [name]: value })
  }

  handleAgreement = (value) => {
    this.setState({ agreed: value })
  }

  handleTabChange = (selectedTabIndex) => {
    const { currentTab } = this.state;
    console.log('fired', currentTab)

    if(currentTab === 0){
      if(this.state.password === this.state.passwordConfirm){
        this.setState({currentTab: selectedTabIndex});
      } else {
        this.setState({ error: true, errorMessage: 'Passwords do not match' })
      }
    } else {
      this.setState({currentTab: selectedTabIndex});
    }
  };

  handleCreateToken = (selectedTabIndex) => {
    const { stripe } = this.props;

    return stripe.createToken({type: 'card', name: this.state.name, currency: 'usd'})
    .then(token => {
      this.setState({ token: token, currentTab: selectedTabIndex })
    })
  }

  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    tosUrl: 'https://local-guru-admin.netlify/terms' ,
    privacyPolicyUrl: 'https://local-guru-admin.netlify/privacy-policy',
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: (res) => {
          const { email, displayName } = res.user;
          const firstName = displayName.split(' ')[0];
          const lastName = displayName.split(' ')[1]

          this.setState({
            firstName: firstName,
            lastName: lastName,
            email: email,
            currentTab: this.state.currentTab + 1
          })
        }
      }
  };

  handleSubmit = () => {
    const { name, email, password, token } = this.state;
    const address = {
      street: this.state.street,
      zip: this.state.zip,
      city: this.state.city
    }

    this.props.createAccount(name, email, password, address, token)
    .then(() => {
      this.props.loginUser()
      this.props.history.push('/')
    })
  }

  render() {

    const tabContent = [
      {
        id: 'account',
        content:
        <Card
          title='Account'
          sectioned
          primaryFooterAction={{content: 'Next', onAction: () => this.handleTabChange(this.state.currentTab + 1)}}
        >
            {this.state.error &&
              <InlineError message={this.state.errorMessage} fieldID="password" />
            }
            <Card.Section title='Signup with Email'>
              <FormLayout>
                <TextField id='firstName' type='text' value={this.state.firstName} placeholder='First name' onChange={this.handleChange} />
                <TextField id='lastName' type='text' value={this.state.lastName} placeholder='Last name' onChange={this.handleChange} />
                <TextField id='email' type='email' value={this.state.email} placeholder='Email' onChange={this.handleChange} />
                <TextField id='password' type='password' value={this.state.password} placeholder='Password' onChange={this.handleChange} />
                <TextField id='passwordConfirm' type='password' value={this.state.passwordConfirm} placeholder='Confirm password' onChange={this.handleChange} />
              </FormLayout>
            </Card.Section>
            <Card.Section title='or Signup with Google / Facebook'>
              <FormLayout>
                <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
              </FormLayout>
            </Card.Section>
        </Card>
      },
      {
        id: 'survey',
        content:
          <Survey
            handleSubmit={() => this.handleTabChange(2)}
            back={ () => this.handleTabChange(this.state.currentTab - 1) }
          />
      },
      {
        id: 'payment',
        content:
        <>
          <Card
            title='Payment'
            sectioned
            primaryFooterAction={{content: 'Next', onAction: () => this.handleCreateToken(this.state.currentTab + 1)}}
            secondaryFooterAction={{ content: 'Back', onAction: () => this.handleTabChange(this.state.currentTab - 1) }}
            >
            <Card.Section title='Address'>
            <FormLayout>
              <TextField id='name' type='text' value={this.state.name} placeholder='Name' onChange={this.handleChange} />
              <TextField id='street' type='text' value={this.state.street} placeholder='Street Address' onChange={this.handleChange} />
              <TextField id='city' type='text' value={this.state.city} placeholder='City' onChange={this.handleChange} />
              <TextField id='zip' type='text' value={this.state.zip} placeholder='ZIP' onChange={this.handleChange} />
            </FormLayout>
            </Card.Section>
            <Card.Section title='Card'>
              <CardElement />
            </Card.Section>
          </Card>
        </>
      },
      {
        id: 'terms',
        content:
        <Card
          title='Terms of Service'
          sectioned
          primaryFooterAction={{content: 'Create Account', onAction: () => this.handleSubmit() }}
          secondaryFooterAction={{ content: 'Back', onAction: () => this.handleTabChange(this.state.currentTab - 1) }}
        >
        <FormLayout>
           <Scrollable shadow style={{height: '100px'}}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum enim a nunc commodo egestas. Duis bibendum tellus et elit porta placerat. Maecenas eget ante semper, vulputate nulla non, pellentesque ligula. Quisque posuere quam neque, a gravida leo dignissim non. Suspendisse scelerisque venenatis ante, non elementum nibh. Fusce accumsan efficitur ex, id scelerisque metus porta ut. Suspendisse tincidunt augue non consequat fermentum. Vivamus magna augue, ornare at lectus ac, tristique laoreet est. Vivamus id nulla in elit suscipit elementum in sed nisl. Donec interdum vestibulum urna, sit amet porttitor dui malesuada et. Fusce eu nulla a tortor porta aliquam non vitae erat. Aliquam quis molestie ex, eget commodo ligula. Vivamus maximus lorem in elit auctor, eget hendrerit ipsum tincidunt. Nam sit amet mattis tortor, quis bibendum tellus. Morbi aliquam neque et augue sollicitudin ultricies.</p>
            <p>Praesent suscipit turpis ut elit laoreet, vitae pretium lorem efficitur. Donec luctus diam at sodales porttitor. Donec scelerisque faucibus tellus. Sed sit amet interdum leo. In congue et ligula id consectetur. Morbi vel sodales dui. Cras suscipit velit eros. Sed pharetra euismod lectus ac sagittis. Vivamus purus tellus, accumsan sit amet nisl molestie, vulputate pretium ex. Sed at ligula id risus egestas fermentum at vel ipsum. Aenean purus lorem, ullamcorper nec est eu, maximus tincidunt est. Integer faucibus placerat elit, sit amet dapibus orci mattis sit amet.</p>
            <p>Nullam rutrum non odio vitae efficitur. Aenean vitae tellus vel elit tempus facilisis vel non urna. Quisque tincidunt ligula vel ipsum porta varius. Pellentesque lorem lectus, ullamcorper et eros ut, tempus vehicula justo. Sed a elit facilisis, fringilla neque quis, tincidunt felis. Maecenas cursus rutrum erat id tincidunt. Mauris ac maximus metus. Quisque convallis est et lacinia gravida. Cras malesuada sapien eget mauris interdum, vitae elementum felis consectetur. Mauris vestibulum elementum ultrices. Donec eget sapien at lacus iaculis aliquam. Sed fermentum ligula in maximus dignissim. Suspendisse a augue diam. Vestibulum posuere condimentum velit, non facilisis arcu posuere in. Suspendisse pharetra eleifend tortor, id aliquet eros varius ac.</p>
            <p>In hendrerit pellentesque varius. Etiam ac neque posuere, elementum arcu condimentum, iaculis nulla. Pellentesque eget consequat metus. Fusce nibh orci, bibendum id consequat in, bibendum eget nisl. Mauris sed purus fringilla, aliquam dolor sit amet, pretium sem. Quisque mollis, leo maximus hendrerit maximus, magna magna mollis libero, vel dictum elit nibh in justo. Pellentesque sed dui sem. Sed congue leo nec augue vehicula semper. Phasellus sit amet magna sagittis, aliquam lacus a, posuere ante. Vestibulum sed scelerisque nisl, vel sodales tellus. Nullam sollicitudin sapien non magna rhoncus hendrerit. In congue tortor eros, vitae vestibulum nibh ultrices sit amet.</p>
            <p>Ut nulla felis, scelerisque at gravida at, tincidunt eu turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras fermentum in quam et semper. Morbi a dapibus mi. Proin elementum odio sed pellentesque interdum. Etiam erat neque, rutrum rhoncus arcu non, commodo iaculis quam. Sed ac vehicula ex. Aliquam tincidunt ullamcorper felis, sed gravida quam egestas a. Integer mollis ex et felis dapibus euismod. Phasellus rhoncus lectus felis, sit amet vulputate metus posuere eu. Sed ut dolor nec nulla tincidunt iaculis ut at libero.</p>
          </Scrollable>
          <Checkbox
            checked={this.state.agreed}
            label="I Agree"
            onChange={this.handleAgreement}
          />
          </FormLayout>
        </Card>
      }
    ]

    const tabs = [
      {
        id: 'account',
        content: 'Account'
      },
      {
        id: 'survey',
        content: 'Survey'
      },
      {
        id: 'payment',
        content: 'Payment'
      },
      {
        id: 'terms',
        content: 'Terms'
      }
    ]

    return (
      <Wrapper>
      <Page title='Create Account' style={{ width: 'auto!important' }}>
        <Form>
        <Tabs tabs={tabs} fitted selected={this.state.currentTab} onSelect={this.handleTabChange}>
          <br/>
          {tabContent[this.state.currentTab].content}
        </Tabs>
        </Form>
      </Page>
      </Wrapper>
    );
  }
}

export default injectStripe(withRouter(connect((state, ownProps) => ({
  ui: state.ui,
  user: state.user,
}), { createAccount, loginUser })(Register)));
