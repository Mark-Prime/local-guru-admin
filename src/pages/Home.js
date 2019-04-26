import React from 'react'
import { Page, DisplayText, TextStyle, Layout, CalloutCard } from '@shopify/polaris'

const { Section } = Layout

const Home = ({props}) => (
  <div>
    <Page title='Welcome, Jermaine'>
      <TextStyle variation="subdued"><DisplayText>Here's what's happening with your products today</DisplayText></TextStyle>
      <br/><br/>
      <Layout>
        <Section oneThird>
          <p>Today's total sales</p>
          <br/>
          <DisplayText size='large'>$89.34</DisplayText>
        </Section>
        <Section oneThird>
          <p>Today's visits</p>
          <br/>
          <DisplayText size='large'>120</DisplayText>
        </Section>
      </Layout>
      <br/><br/>
      <CalloutCard
        title="Add new products to your shop"
        illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
        primaryAction={{
          content: 'Add new product',
          url: '/products/add',
        }}
      >
        <p>Add a new product for sale on your shop.</p>
      </CalloutCard>
    </Page>
  </div>
);

export default Home;
