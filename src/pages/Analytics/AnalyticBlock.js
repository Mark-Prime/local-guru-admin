import React from "react";
import { Card, TextContainer, DisplayText, TextStyle } from "@shopify/polaris";

const AnalyticBlock = ({ data, title, text, currency, change }) => (
  <Card sectioned title={title}>
    <TextContainer>
      <DisplayText size="large">
        {currency && <span>$</span>}
        {data}
      </DisplayText>
      <br />
      {change ? (
        <TextStyle variation={change > 0 ? "positive" : "negative"}>
          {change > 0
            ? `Up ${Math.abs(change)}% from last week`
            : `Down ${Math.abs(change)}% from last week`}
        </TextStyle>
      ) : (
        <TextStyle variation="subdued">
          This is your first week of data
        </TextStyle>
      )}
    </TextContainer>
  </Card>
);

export default AnalyticBlock;
