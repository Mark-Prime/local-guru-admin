import React, { useState, useCallback } from "react";
import useAnalytics from "../../hooks/useAnalytics";
import { Page, Heading, Layout, Tabs } from "@shopify/polaris";
import AnalyticBlock from "./AnalyticBlock";
import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";

const { Section } = Layout;

const Analytics = () => {
  const [selected, setSelected] = useState(0);

  const user = useSelector(state => state.user);

  const { loaded, error, sales, orders, views, followers } = useAnalytics(
    user.uid,
    selected
  );

  const handleTabChange = useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    []
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
                change={
                  sales.past
                    ? 0 && (sales.current - sales.past) / sales.past
                    : null
                }
                title={`This ${tabs[selected].id}'s Sales`}
              />
            </Section>
            <Section oneThird>
              <AnalyticBlock
                data={orders.current}
                change={
                  orders.past
                    ? 0 && (orders.current - orders.past) / orders.past
                    : null
                }
                title={`This ${tabs[selected].id}'s Orders`}
              />
            </Section>
            <Section oneThird>
              <AnalyticBlock
                data={views.current}
                change={
                  views.past
                    ? 0 && (views.current - views.past) / views.past
                    : null
                }
                title={`This ${tabs[selected].id}'s Views`}
              />
            </Section>
            <Section oneThird>
              <AnalyticBlock
                data={views.current}
                change={
                  followers.past
                    ? 0 && (followers.current - followers.past) / followers.past
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
            <Section oneThird>
              <ProductCard
                title="Bananas"
                sales={32}
                image="https://firebasestorage.googleapis.com/v0/b/local-guru-aeac9.appspot.com/o/products%2Fscott-webb-Ar0QYv-qtw4-unsplash.jpg?alt=media&token=caa4d65e-9673-40fe-970f-f6a16dccd187"
              />
            </Section>
            <Section oneThird>
              <ProductCard
                title="Apple Juice"
                sales={23}
                image="https://firebasestorage.googleapis.com/v0/b/local-guru-aeac9.appspot.com/o/producers%2Falexander-mils-U6dWj2nhPEA-unsplash.jpg?alt=media&token=4210e19b-664c-4c31-8acd-5779aa361a93"
              />
            </Section>
            <Section oneThird>
              <ProductCard
                title="Guava"
                sales={12}
                image="https://firebasestorage.googleapis.com/v0/b/local-guru-aeac9.appspot.com/o/products%2FGuava_ID.jpg?alt=media&token=13d4a37e-ca4a-424a-9d58-9df3cc954c9f"
              />
            </Section>
          </Layout>
        </>
      )}
    </Page>
  );
};

export default Analytics;
