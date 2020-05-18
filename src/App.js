import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import styled from "styled-components";
import { Frame, Layout, Toast } from "@shopify/polaris";
import Nav from "./components/Nav";
import ViewOrder from "./pages/Orders/ViewOrder";
import NavAdmin from "./components/NavAdmin";
import { Switch, Route, withRouter } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./components/Login";
import Help from "./pages/Help";
import Register from "./pages/Register";
import OpenHouse from "./pages/OpenHouse";
import Orders from "./pages/Orders";
import Disputes from "./pages/Orders/Disputes";
import Analytics from "./pages/Analytics";
import Followers from "./pages/Followers";
import OrdersAdmin from "./pages/Orders/OrdersAdmin";
import EditSingleProduct from "./pages/Products/Edit";
import AddSingleProduct from "./pages/Products/AddSingleProduct";
import EditPageHome from "./pages/pages/Home";
import Categories from "./pages/Categories";
import EditCategory from "./pages/Categories/Edit";
import { toggleToast } from "./actions/UIActions";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { getProducer, logoutUser } from "./actions/UserActions";
import {
  fetchTransactions,
  fetchTransactionsAdmin
} from "./actions/TransactionActions";

const { Section } = Layout;

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

class App extends Component {
  componentDidMount() {
    this.props.getProducer();
    this.props.fetchTransactions(this.props.user.uid);
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.authenticated !== prevProps.user.authenticated) {
      this.props.getProducer();
      if (this.props.user.admin) {
        this.props.fetchTransactionsAdmin();
      } else {
        this.props.fetchTransactions(this.props.user.uid);
      }
    }
  }

  render() {
    return (
      <Frame>
        {this.props.user.uid ? (
          <Wrapper>
            {this.props.user.admin ? (
              <NavAdmin logout={this.props.logoutUser} />
            ) : (
              <Nav logout={this.props.logoutUser} />
            )}

            <Layout>
              <Section>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route
                    path="/product/edit/:id"
                    component={EditSingleProduct}
                  />
                  <Route path="/order/view/:id" component={ViewOrder} />
                  <Route
                    path="/orders"
                    component={this.props.user.admin ? OrdersAdmin : Orders}
                  />
                  <Route path="/disputes" component={Disputes} />
                  <Route path="/analytics" component={Analytics} />
                  <Route path="/followers" component={Followers} />
                  <Route path="/products/add" component={AddSingleProduct} />
                  <Route exact path="/products" component={Products} />
                  <Route path="/account" component={Settings} />
                  <Route path="/create-account" component={Register} />
                  <Route path="/open-house" component={OpenHouse} />
                  <Route path="/terms" component={Terms} />
                  <Route
                    exact
                    path="/products/categories"
                    component={Categories}
                  />
                  <Route
                    path="/products/categories/:id"
                    component={EditCategory}
                  />
                  <Route path="/privacy-policy" component={PrivacyPolicy} />
                  <Route path="/help" component={Help} />
                  <Route path="/pages/edit/home" component={EditPageHome} />
                </Switch>
              </Section>
            </Layout>
          </Wrapper>
        ) : (
          <Layout>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/create-account" component={Register} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
            </Switch>
          </Layout>
        )}
        {this.props.ui.showToast ? (
          <Toast
            content={this.props.ui.toastText}
            onDismiss={this.props.toggleToast}
          />
        ) : null}
      </Frame>
    );
  }
}

export default withRouter(
  connect(
    (state, ownProps) => ({
      ui: state.ui,
      user: state.user,
      transactions: state.transactions
    }),
    {
      toggleToast,
      fetchTransactions,
      fetchTransactionsAdmin,
      getProducer,
      logoutUser
    }
  )(App)
);
