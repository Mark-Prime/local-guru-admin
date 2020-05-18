import React, { useState, useEffect } from "react";
import {
  Page,
  Card,
  ResourceList,
  ResourceItem,
  TextStyle
} from "@shopify/polaris";
import { db } from "../../firebase";

const Categories = () => {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await db.collection(`categories`).get();

      res.docs.map(doc => {
        return setData(prevValues => [
          ...prevValues,
          { id: doc.id, ...doc.data() }
        ]);
      });
      setLoaded(true);
    };

    if (!loaded) {
      fetchData();
    }
  }, [loaded]);

  return (
    <Page title="Categories">
      <Card sectioned>
        {loaded && (
          <ResourceList
            resourceName={{ singular: "customer", plural: "customers" }}
            items={data}
            renderItem={item => {
              const { title, productCount, id } = item;

              return (
                <ResourceItem
                  id={id}
                  url={`/products/categories/${id}`}
                  accessibilityLabel={`View details for ${title}`}
                >
                  <h3>
                    <TextStyle variation="strong">{title}</TextStyle>
                  </h3>
                  <div>{productCount} products</div>
                </ResourceItem>
              );
            }}
          />
        )}
      </Card>
    </Page>
  );
};

export default Categories;
