import React from "react";
import {
  Card,
  Thumbnail,
  Stack,
  TextContainer,
  TextStyle
} from "@shopify/polaris";

const ProductCard = ({ title, image, sales }) => (
  <Card sectioned title={title}>
    <Stack>
      <Thumbnail size="medium" source={image} alt={title} />
      <TextStyle variation="subdued">
        <TextContainer>
          <p>{`${sales} sold this week`}</p>
        </TextContainer>
      </TextStyle>
    </Stack>
  </Card>
);

export default ProductCard;
