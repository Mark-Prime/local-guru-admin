import React, { useState, useCallback } from "react";
import { Page, Heading, Layout, Tabs } from "@shopify/polaris";
import AnalyticBlock from "./AnalyticBlock";
import ProductCard from "../../components/ProductCard";

const { Section } = Layout;

const Analytics = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "weekly",
      content: "This Week",
      accessibilityLabel: "This Week",
      panelID: "weekly"
    },
    {
      id: "monthly",
      content: "This Month",
      accessibilityLabel: "This Month",
      panelID: "monthly"
    },
    {
      id: "yearly",
      content: "This Year",
      accessibilityLabel: "This Year",
      panelID: "yearly"
    }
  ];

  return (
    <Page title="Analytics">
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      <br />
      <br />
      <Heading>Overview</Heading>
      <br />
      <Layout>
        <Section oneThird>
          <AnalyticBlock
            currency
            data={123}
            title="This Week's Sales"
            change={-2}
          />
        </Section>
        <Section oneThird>
          <AnalyticBlock data={12} change={-3} title="This Week's Orders" />
        </Section>
        <Section oneThird>
          <AnalyticBlock change={+30} data={140} title="This Week's View" />
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
    </Page>
  );
};

export default Analytics;
