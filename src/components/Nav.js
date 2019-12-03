import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Navigation } from "@shopify/polaris";
import PropTypes from "prop-types";
import {
  HomeMajorMonotone,
  ProductsMajorMonotone,
  OrdersMajorMonotone,
  AnalyticsMajorMonotone,
  CustomersMajorMonotone,
  SettingsMajorMonotone,
  InventoryMajorMonotone,
  LogOutMinor
} from "@shopify/polaris-icons";

const Section = Navigation.Section;

class Nav extends Component {
  render() {
    return (
      <Navigation location={this.props.location.pathname}>
        <Section
          items={[
            {
              url: "/",
              label: "Home",
              icon: HomeMajorMonotone
            },
            {
              url: "/orders",
              label: "Orders",
              icon: OrdersMajorMonotone
            },
            {
              url: "/followers",
              label: "Followers",
              icon: CustomersMajorMonotone
            },
            {
              url: "/products",
              label: "Products",
              icon: ProductsMajorMonotone,
              subNavigationItems: [
                {
                  url: "/products",
                  label: "All Products"
                },
                {
                  url: "/products/add",
                  label: "Add New Product"
                }
              ]
            },
            {
              url: "/analytics",
              label: "Analytics",
              icon: AnalyticsMajorMonotone
            },
            {
              url: "/open-house",
              label: "Open House",
              icon: InventoryMajorMonotone
            }
          ]}
        />
        <Section
          title="Settings"
          separator
          items={[
            {
              url: "/account",
              label: "Account",
              icon: SettingsMajorMonotone
            },
            {
              label: "Sign Out",
              icon: LogOutMinor,
              onClick: () => {
                this.props.logout();
              }
            }
          ]}
        />
      </Navigation>
    );
  }
}

Nav.propTypes = {
  location: PropTypes.object.isRequired
};

export default withRouter(Nav);
