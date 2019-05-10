import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Frame, Layout, Toast } from '@shopify/polaris'
import Nav from './components/Nav'
import { Switch, Route, withRouter } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Orders from './pages/Orders'
import EditSingleProduct from './pages/Products/Edit'
import AddProduct from './pages/Products/AddProduct'
import { toggleToast } from './actions/UIActions'
import { fetchTransactions } from './actions/TransactionActions'

const { Section } = Layout;

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

class App extends Component {

  componentDidMount(){
    this.props.fetchTransactions(this.props.user.uid)
  }

  render() {
    return (
      <Frame>
        <Wrapper>
          <Nav />
          <Layout>
            <Section>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/products/edit/:id' component={EditSingleProduct} />
                <Route path='/orders' component={Orders} />
                <Route path='/products/add' component={AddProduct} />
                <Route exact path='/products' component={Products} />
              </Switch>
            </Section>
          </Layout>
        </Wrapper>
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
}), { toggleToast, fetchTransactions })(App));
