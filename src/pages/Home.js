import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Page,
  DisplayText,
  TextStyle,
  Layout,
  CalloutCard
} from "@shopify/polaris";
import OrderPreview from "../components/OrderPreview";
import styled from "styled-components";

const Wrapper = styled.div`
  .Polaris-DisplayText {
    text-transform: capitalize;
  }
`;

class Home extends Component {
  render() {
    return (
      <Wrapper>
        <Page title={`Welcome, ${this.props.user.displayName}`}>
          <TextStyle variation="subdued">
            <DisplayText>
              Here's what's happening with your products today
            </DisplayText>
          </TextStyle>
          <br />
          <CalloutCard
            title="Set up your profile"
            illustration="https://apps.shopify.com/assets/v2/category-images/marketing-addb6d46025cb3e65cac1fbf8a56c248739dc20d0606d8550b217d11574f44fe.svg"
            primaryAction={{
              content: "Edit profile",
              url: "/account"
            }}
          >
            <p>Tell us a bit about yourself</p>
          </CalloutCard>
          <CalloutCard
            title="Add new products to your shop"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: "Add new product",
              url: "/products/add"
            }}
          >
            <p>Add a new product for sale on your shop.</p>
          </CalloutCard>
        </Page>
      </Wrapper>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    user: state.user
  }),
  {}
)(Home);
