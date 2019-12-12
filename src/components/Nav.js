import React from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@shopify/polaris";
import PropTypes from "prop-types";
import {
  HomeMajorMonotone,
  ProductsMajorMonotone,
  OrdersMajorMonotone,
  AnalyticsMajorMonotone,
  CustomersMajorMonotone,
  ViewMajorMonotone,
  SettingsMajorMonotone,
  InventoryMajorMonotone,
  DisputeMinor,
  QuestionMarkMajorMonotone,
  LogOutMinor
} from "@shopify/polaris-icons";
import { useSelector } from "react-redux";

const Section = Navigation.Section;

const Nav = ({ logout }) => {
  const user = useSelector(state => state.user);
  const { pathname } = useLocation();

  return (
    <Navigation location={pathname}>
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
            icon: OrdersMajorMonotone,
            subNavigationItems: [
              {
                url: "/disputes",
                icom: DisputeMinor,
                label: "Disputes"
              }
            ]
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
            url: `https://local-guru-aeac9.firebaseapp.com/producer/${user.uid}`,
            label: "View your profile",
            icon: ViewMajorMonotone,
            external: true
          },
          {
            url: "/help",
            label: "Help",
            icon: QuestionMarkMajorMonotone
          },
          {
            label: "Sign Out",
            icon: LogOutMinor,
            onClick: () => {
              logout();
            }
          }
        ]}
      />
    </Navigation>
  );
};

Nav.propTypes = {
  location: PropTypes.object.isRequired
};

export default Nav;
