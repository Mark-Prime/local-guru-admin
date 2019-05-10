import React from 'react'
import { Page, DisplayText, TextStyle, Layout, CalloutCard } from '@shopify/polaris'
import OrderPreview from '../components/OrderPreview'

const { Section } = Layout

const Home = ({ transactions }) => (
  <div>
    <Page title='Welcome, Jermaine'>
      <TextStyle variation="subdued"><DisplayText>Here's what's happening with your products today</DisplayText></TextStyle>
      <br/><br/>
      <Layout>
        <OrderPreview />
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
