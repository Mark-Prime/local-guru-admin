import React from 'react'
import { Card, List, Thumbnail, Stack, TextContainer, TextStyle } from '@shopify/polaris'

const { Section } = Card;

const getOverview = (orders, user) => {
  let items = {}

  orders.map(order => {
    return Object.keys(order.items).map((item, index) => {
      const { count, price, title, image, producer, unit } = order.items[item]
      if(producer === user){
        if(items[item]){
          items[item] = {...items[item], count: count + items[item].count}
        } else {
          items[item] = {count: count, price: price, title: title, image: image, unit: unit}
        }
      }
    })
  })

  return Object.values(items)
}

const OrderOverview = ({ orders, user }) => (
  <Card sectioned title='Overview'>
      {orders.length > 0 &&
        getOverview(orders, user).map(item => (
        <Section key={item.title}>
          <Stack alignment='center'>
            <Thumbnail size='large' source={item.image} alt={item.title} />
            <TextContainer>
              {item.title}<br/>
              <TextStyle variation='subdued'>Amount: {item.count} {item.unit}s</TextStyle><br/>
              <TextStyle variation='subdued'>Total: ${(item.count * item.price).toFixed(2)}</TextStyle>
            </TextContainer>
          </Stack>
        </Section>
      ))}
  </Card>
);

export default OrderOverview
