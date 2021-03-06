import React from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@shopify/polaris";
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

const { Section } = Navigation;

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
            url: "/disputes",
            label: "Disputes",
            badge: "2",
            icon: DisputeMinor
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
            label: "View your profile",
            icon: ViewMajorMonotone,
            onClick: () => {
              window.open(
                `https://local-guru-aeac9.firebaseapp.com/producer/${user.uid}`
              );
            }
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

export default Nav;
