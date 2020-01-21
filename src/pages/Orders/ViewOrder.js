import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { fetchUserProducerTransaction } from "../../actions/TransactionActions";
import {
  Page,
  Card,
  ResourceList,
  Thumbnail,
  TextStyle,
  Stack,
  Badge
} from "@shopify/polaris";
import { useSelector } from "react-redux";

const ViewOrder = ({ match }) => {
  const [data, setData] = useState({});

  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchUserProducerTransaction(
        match.params.id,
        user.uid
      );
      setData(result);
    };

    fetchData();
  }, [match.params.id, user.uid]);

  return (
    <div>
      {data.length > 0 && (
        <Page
          title={`Order`}
          breadcrumbs={[{ content: "Orders", url: "/orders" }]}
          titleMetadata={<Badge status="success">Delivered</Badge>}
          secondaryActions={[{ content: "Print" }, { content: "Cancel order" }]}
        >
          <br />
          <br />
          <Card title="Items" sectioned>
            <ResourceList
              items={data}
              renderItem={item => {
                const { count, price, title, image, unit } = item;

                const media = <Thumbnail source={image} alt={title} />;

                return (
                  <ResourceList.Item media={media}>
                    <Stack distribution="fillEvenly" spacing="extraLoose">
                      <h3>
                        <TextStyle variation="strong">{title}</TextStyle>
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
        </Page>
      )}
    </div>
  );
};

export default withRouter(ViewOrder);
