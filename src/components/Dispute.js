import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  Avatar,
  TextStyle,
  TextField,
  TextContainer,
  Heading,
  Badge,
  Stack
} from "@shopify/polaris";
import { TOGGLE_TOAST } from "../actions/UIActions";
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

const Dispute = ({ user, order, status }) => {
  const [response, setResponse] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = () => {
    setResponse("");
    dispatch({ type: TOGGLE_TOAST, payload: `Response submitted` });
  };

  return (
    <Card
      primaryFooterAction={
        status === "awaiting" && {
          content: "Submit response",
          disabled: response === "",
          onAction: () => handleSubmit()
        }
      }
      title={
        <Stack>
          <TextContainer spacing="loose">
            <Heading>Dispute #104F84FBB03</Heading>
            <TextStyle variation="subdued">
              <Moment format="LLL">{order.date}</Moment>
            </TextStyle>
          </TextContainer>

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
      {status === "awaiting" && (
        <Section title="Response">
          <TextField
            style={{ maxWidth: 400 }}
            onChange={value => setResponse(value)}
            multiline={3}
            value={response}
            maxLength="300"
          />
          <br />
          <p>
            <TextStyle
              variation={response.length < 250 ? `subdued` : `negative`}
            >
              {300 - response.length} characters remaining
            </TextStyle>
          </p>
        </Section>
      )}
    </Card>
  );
};

export default Dispute;
