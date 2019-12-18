import React from "react";
import {
  Card,
  Avatar,
  TextStyle,
  TextContainer,
  Heading,
  Badge,
  Stack
} from "@shopify/polaris";
import Moment from "react-moment";

const { Section } = Card;

const renderBadge = status => {
  switch (status) {
    case "resolved":
      return <Badge status="success">Resolved</Badge>;
    case "awaiting":
      return <Badge status="attention">Awaiting Response</Badge>;
    default:
      return <Badge status="info">Under Review</Badge>;
  }
};

const Dispute = ({ user, order, status }) => (
  <Card
    title={
      <Stack>
        <Heading>Dispute #104F84FBB03</Heading>
        {status && renderBadge(status)}
      </Stack>
    }
    actions={[]}
    sectioned
  >
    <Section>
      <Stack alignment="center">
        <Avatar size="large" source={user.photoURL} name={user.name} />
        <TextContainer spacing="tight">
          <p>
            <TextStyle variation="strong">{user.name}</TextStyle>
          </p>
          <p>
            <TextStyle variation="subdued">#{order.id}</TextStyle>
          </p>
          <p>${order.total.toFixed(2)}</p>
        </TextContainer>
      </Stack>
    </Section>
    <Section title="Message">
      <TextContainer>
        <TextStyle variation="subdued">Lorem ipsum dolor sit amet</TextStyle>
      </TextContainer>
    </Section>
  </Card>
);

export default Dispute;
