import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Navigation } from "@shopify/polaris";
import PropTypes from "prop-types";

const Section = Navigation.Section;

class Nav extends Component {
  render() {
    return (
      <Navigation location={this.props.location.pathname}>
        <Section
          title="Admin"
          items={[
            {
              url: "/",
              label: "Home",
              icon: "home"
            },
            {
              url: "/orders",
              label: "Orders",
              icon: "orders"
            },
            {
              url: "/products",
              label: "Products",
              icon: "products",
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
              icon: "view"
            }
          ]}
        />
        <Section
          title="Content"
          separator
          items={[
            {
              label: "Home Page",
              url: "/pages/edit/home",
              icon: "notes"
            },
            {
              label: "About Page",
              icon: "notes"
            }
          ]}
        />
        <Section
          title="Settings"
          separator
          items={[
            {
              label: "Sign Out",
              icon: "logOut",
              onClick: () => {
                this.props.logout();
                this.props.history.push("/");
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
