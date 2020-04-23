import React, { useState, useCallback } from "react";
import useAnalytics from "../../hooks/useAnalytics";
import { Page, Heading, Layout, Tabs } from "@shopify/polaris";
import AnalyticBlock from "./AnalyticBlock";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";

const { Section } = Layout;

const Analytics = () => {
  const [selected, setSelected] = useState(0);
  const [range, setRange] = useState("week");

  const user = useSelector(state => state.user);

  const { loaded, products, sales, orders, views, followers } = useAnalytics(
    user.uid,
    selected
  );

  const tabs = [
    {
      id: "Week",
      content: "This Week",
      accessibilityLabel: "This Week",
      panelID: "week",
      onSelect: index => setSelected(index)
    },
    {
      id: "Month",
      content: "This Month",
      accessibilityLabel: "This Month",
      panelID: "month",
      onSelect: index => setSelected(index)
    },
    {
      id: "Year",
      content: "This Year",
      accessibilityLabel: "This Year",
      panelID: "year",
      onSelect: index => setSelected(index)
    }
  ];

  const handleTabChange = useCallback(
    selectedTabIndex => {
      setSelected(selectedTabIndex);
      setRange(tabs[selectedTabIndex].panelID);
    },

    [tabs]
  );

  return (
    <Page title="Analytics">
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      <br />
      <br />
      <Heading>Overview</Heading>
      <br />
      {loaded && (
        <>
          <Layout>
            <Section oneThird>
              <AnalyticBlock
                currency
                data={sales.current}
                range={range}
                change={
                  sales.past
                    ? Math.round(
                        ((sales.current - sales.past) / sales.past) * 100
                      )
                    : null
                }
                title={`This ${tabs[selected].id}'s Sales`}
              />
            </Section>
            <Section oneThird>
              <AnalyticBlock
                data={orders.current}
                range={range}
                change={
                  orders.past
                    ? Math.round(
                        ((orders.current - orders.past) / orders.past) * 100
                      )
                    : null
                }
                title={`This ${tabs[selected].id}'s Orders`}
              />
            </Section>
            <Section oneThird>
              <AnalyticBlock
                data={views.current}
                range={range}
                change={
                  views.past
                    ? Math.round(
                        ((views.current - views.past) / views.past) * 100
                      )
                    : null
                }
                title={`This ${tabs[selected].id}'s Views`}
              />
            </Section>
            <Section oneThird>
              <AnalyticBlock
                data={followers.current}
                range={range}
                change={
                  followers.past
                    ? Math.round(
                        ((followers.current - followers.past) /
                          followers.past) *
                          100
                      )
                    : null
                }
                title={`This ${tabs[selected].id}'s Followers`}
              />
            </Section>
          </Layout>
          <br />
          <br />
          <Heading>Most Popular Products</Heading>
          <br />
          <Layout>
            {products.slice(0, 3).map(product => {
              const { title, image, sales } = product;
              return (
                <Section oneThird>
                  <ProductCard title={title} sales={sales} image={image} />
                </Section>
              );
            })}
          </Layout>
        </>
      )}
    </Page>
  );
};

export default Analytics;
