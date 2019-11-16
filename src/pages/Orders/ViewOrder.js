import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { fetchSingleTransaction } from '../../actions/TransactionActions'
import { Page, Card, Button, ResourceList, Thumbnail, TextStyle, Stack, Badge } from '@shopify/polaris'

const ViewOrder = ({ match }) => {

  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchSingleTransaction(match.params.id)
      console.log(result)
      setData(result)
    }

    fetchData()
  }, [])

  return (
    <div>
    {typeof data.id !== 'undefined' &&
      <Page
        title={`Order #${data.id.toUpperCase()}`}
        breadcrumbs={[{content: 'Orders', url: '/orders'}]}
        titleMetadata={<Badge status="success">Delivered</Badge>}
        secondaryActions={[
          {content: 'Print'},
          {content: 'Cancel order'},
        ]}
      >
        <br/><br/>
        <Card title='Items' sectioned>
          <ResourceList
            items={Object.values(data.items)}
            renderItem={item => {
              const { count, price, title, image, unit } = item;
              const media = <Thumbnail source={image} alt={title} />

              return (
                <ResourceList.Item
                  media={media}
                >
                <Stack distribution='fillEvenly' spacing='extraLoose'>
                  <h3><TextStyle variation="strong">{title}</TextStyle></h3>
                  <p>{count} x {unit}</p>
                  <p><TextStyle variation="strong">${(price * count).toFixed(2)}</TextStyle></p>
                </Stack>
                </ResourceList.Item>
              )
            }}
          />
          <Card.Section title='Total'>
            <p>Subtotal: ${data.total.toFixed(2)}</p>
            <p>Shipping: {data.total >= 40 ? 'FREE' : `$9.99` }</p>
            {data.total >= 40
              ? <p>Total: ${data.total.toFixed(2)}</p>
              : <p>Total: ${(data.total + 9.99)}</p>
            }
          </Card.Section>
        </Card>
      </Page>
    }
    </div>
  )
}

export default withRouter(ViewOrder);
