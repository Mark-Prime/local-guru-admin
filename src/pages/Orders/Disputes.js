import React from "react";
import {
  Page,
  Stack,
  Heading,
  TextContainer,
  TextStyle,
  Badge,
  Link
} from "@shopify/polaris";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import Dispute from "../../components/Dispute";

const Wrapper = styled.div`
  .Polaris-Card {
    max-width: 800px;
  }
`;

const Disputes = () => {
  const { pathname } = useLocation();
  const { push } = useHistory();

  return (
    <Page title="Disputes">
      <Wrapper>
        <TextContainer>
          <Stack>
            <Link onClick={() => push("/disputes")}>
              <Heading>
                <TextStyle variation="subdued">
                  All <Badge>3</Badge>
                </TextStyle>
              </Heading>
            </Link>
            <Link onClick={() => push("/disputes/under-review")}>
              <Heading>
                <TextStyle variation="subdued">
                  Under Review <Badge status="info">1</Badge>
                </TextStyle>
              </Heading>
            </Link>
            <Link onClick={() => push("/disputes/awaiting-response")}>
              <Heading>
                <TextStyle variation="subdued">
                  Awaiting Response <Badge status="attention">1</Badge>
                </TextStyle>
              </Heading>
            </Link>
            <Link onClick={() => push("/disputes/resolved")}>
              <Heading>
                <TextStyle variation="subdued">
                  Resolved <Badge status="success">1</Badge>
                </TextStyle>
              </Heading>
            </Link>
          </Stack>
        </TextContainer>
        <br />
        {(pathname === "/disputes" ||
          pathname === "/disputes/awaiting-response") && (
          <Dispute
            status="awaiting"
            user={{
              name: `Test User`,
              photoURL: `https://yt3.ggpht.com/a-/AAuE7mBPGLg7nB_q2ZKwk3Tp7xF35lHojY_w0Dogm8DT6A=s88-c-k-c0xffffffff-no-rj-mo`
            }}
            order={{
              total: 23,
              id: "AF57676JH",
              date: Date.now(),
              items: [
                {
                  title: `Bananas`,
                  photo: `https://firebasestorage.googleapis.com/v0/b/local-guru-aeac9.appspot.com/o/products%2Fbananas.jpg?alt=media&token=d12239e3-4377-4d2d-a79f-1d47e453c9f0`
                }
              ]
            }}
          />
        )}
        {(pathname === "/disputes" ||
          pathname === "/disputes/under-review") && (
          <Dispute
            status="review"
            user={{
              name: `Test User`,
              photoURL: `https://yt3.ggpht.com/a-/AAuE7mBPGLg7nB_q2ZKwk3Tp7xF35lHojY_w0Dogm8DT6A=s88-c-k-c0xffffffff-no-rj-mo`
            }}
            order={{
              total: 80,
              id: "AF57676JH",
              date: new Date(new Date().setDate(new Date().getDate() - 3)),
              items: [
                {
                  title: `Bananas`,
                  photo: `https://firebasestorage.googleapis.com/v0/b/local-guru-aeac9.appspot.com/o/products%2Fbananas.jpg?alt=media&token=d12239e3-4377-4d2d-a79f-1d47e453c9f0`
                }
              ]
            }}
          />
        )}
        {(pathname === "/disputes" || pathname === "/disputes/resolved") && (
          <Dispute
            status="resolved"
            user={{
              name: `Test User`,
              photoURL: `https://yt3.ggpht.com/a-/AAuE7mBPGLg7nB_q2ZKwk3Tp7xF35lHojY_w0Dogm8DT6A=s88-c-k-c0xffffffff-no-rj-mo`
            }}
            order={{
              total: 23,
              id: "AF57676JH",
              date: new Date(new Date().setDate(new Date().getDate() - 4)),
              items: [
                {
                  title: `Bananas`,
                  photo: `https://firebasestorage.googleapis.com/v0/b/local-guru-aeac9.appspot.com/o/products%2Fbananas.jpg?alt=media&token=d12239e3-4377-4d2d-a79f-1d47e453c9f0`
                }
              ]
            }}
          />
        )}
      </Wrapper>
    </Page>
  );
};

export default Disputes;
