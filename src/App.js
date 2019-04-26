import React, { Component } from 'react'
import './App.css'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Frame, Layout, Toast } from '@shopify/polaris'
import Nav from './components/Nav'
import { Switch, Route, withRouter } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import AddProduct from './pages/Products/AddProduct'
import { toggleToast } from './actions/UIActions';

const { Section } = Layout;

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

class App extends Component {
  render() {
    return (
      <Frame>
        <Wrapper>
          <Nav />
          <Layout>
            <Section>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/products' component={Products} />
                <Route path='/products/add' component={AddProduct} />
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
  user: state.user
}), { toggleToast })(App));
