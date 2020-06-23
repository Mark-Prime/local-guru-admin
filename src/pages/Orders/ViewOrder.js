import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  fetchUserProducerTransaction,
  fetchSingleTransaction
} from "../../actions/TransactionActions";
import {
  Page,
  Card,
  ResourceList,
  Thumbnail,
  TextStyle,
  TextContainer,
  Layout,
  Stack,
  Badge
} from "@shopify/polaris";
import { useSelector } from "react-redux";

const { Section } = Layout;

const ViewOrder = ({ match }) => {
  const [data, setData] = useState({});

  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (user.admin) {
        const result = await fetchSingleTransaction(match.params.id);
        console.log(result);
        setData(result);
      } else {
        const result = await fetchUserProducerTransaction(
          match.params.id,
          user.uid
        );
        setData(result);
      }
    };

    fetchData();
  }, [match.params.id, user.admin, user.uid]);

  return (
    <div>
      {data.items?.length > 0 && (
        <Page
          title={`Order`}
          breadcrumbs={[{ content: "Orders", url: "/orders" }]}
          titleMetadata={<Badge status="success">Delivered</Badge>}
          secondaryActions={[{ content: "Print" }, { content: "Cancel order" }]}
        >
          <br />
          <br />
          <Layout>
            <Section>
              <Card title="Items" sectioned>
                <ResourceList
                  items={data.items}
                  renderItem={item => {
                    const { count, price, title, image, unit, producer } = item;

                    const media = <Thumbnail source={image} alt={title} />;

                    return (
                      <ResourceList.Item media={media}>
                        <Stack distribution="fillEvenly" spacing="extraLoose">
                          <h3>
                            <TextStyle variation="strong">{title}</TextStyle>
                            <br />
                            <TextStyle variation="subdued">
                              {producer.displayName}
                            </TextStyle>
                          </h3>
                          <p>
                            {count} x {unit}
                          </p>
                          <p>${(count * price).toFixed(2)}</p>
                        </Stack>
                      </ResourceList.Item>
                    );
                  }}
                />
              </Card>
            </Section>
            <Section secondary>
              <Card title="Details">
                <Card.Section>
                  <TextContainer spacing="tight">
                    <p>
                      <Stack distribution="fillEvenly">
                        <p>Subotal</p>
                        <p>
                          ${data.total >= 50 ? data.total - 9.99 : data.total}
                        </p>
                      </Stack>
                    </p>
                    <p>
                      <Stack distribution="fillEvenly">
                        <p>Delivery</p>
                        <p>{data.total >= 50 ? `FREE` : `$9.99`}</p>
                      </Stack>
                    </p>
                    <p>
                      <Stack distribution="fillEvenly">
                        <p>
                          <TextStyle variation="strong">Total</TextStyle>
                        </p>
                        <TextStyle variation="strong">
                          ${data.total.toFixed(2)}
                        </TextStyle>
                      </Stack>
                    </p>
                  </TextContainer>
                </Card.Section>
                <Card.Section>
                  <TextContainer>
                    <p>Jermaine Davis</p>
                    <p>123 Fake Street Apt. 14</p>
                    <p>Los Angeles, CA 90034</p>
                  </TextContainer>
                </Card.Section>
              </Card>
            </Section>
          </Layout>
        </Page>
      )}
    </div>
  );
};

export default withRouter(ViewOrder);
