import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Frame, Layout, Toast } from '@shopify/polaris'
import Nav from './components/Nav'
import { Switch, Route, withRouter } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './components/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import EditSingleProduct from './pages/Products/Edit'
import AddSingleProduct from './pages/Products/AddSingleProduct'
import { toggleToast } from './actions/UIActions'
import Settings from './pages/Settings'
import { getProducer, logoutUser } from './actions/UserActions'
import { fetchTransactions } from './actions/TransactionActions'

const { Section } = Layout;

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

class App extends Component {

  componentDidMount(){
    this.props.getProducer()
    this.props.fetchTransactions(this.props.user.uid)
  }

  componentDidUpdate(prevProps){
    if(this.props.user.authenticated !== prevProps.user.authenticated){
      this.props.getProducer()
      this.props.fetchTransactions(this.props.user.uid)
    }
  }

  render() {
    return (
      <Frame>
        {this.props.user.uid
          ?
            <Wrapper>
              <Nav logout={this.props.logoutUser} />
              <Layout>
                <Section>
                  <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/product/edit/:id' component={EditSingleProduct} />
                    <Route path='/orders' component={Orders} />
                    <Route path='/products/add' component={AddSingleProduct} />
                    <Route exact path='/products' component={Products} />
                    <Route path='/account' component={Settings} />
                    <Route path='/create-account' component={Register} />
                  </Switch>
                </Section>
              </Layout>
            </Wrapper>
          :
            <Layout>
              <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/create-account' component={Register} />
              </Switch>
            </Layout>
        }
        {this.props.ui.showToast
          ?
            <Toast content={this.props.ui.toastText} onDismiss={this.props.toggleToast} />
          :
            null
        }
      </Frame>
    );
  }
}

export default withRouter(connect((state, ownProps) => ({
  ui: state.ui,
  user: state.user,
  transactions: state.transactions
}), { toggleToast, fetchTransactions, getProducer, logoutUser })(App));
