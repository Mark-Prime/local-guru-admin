import React from "react";
import {
  Page,
  Avatar,
  Card,
  ResourceItem,
  ResourceList,
  TextStyle
} from "@shopify/polaris";
import { useSelector } from "react-redux";
import useFollowers from "../hooks/useFollowers";

const Followers = () => {
  const user = useSelector(state => state.user);
  const userFollowers = user.followers;

  const { loading, followers } = useFollowers(userFollowers);

  return (
    <Page title="Followers">
      {!loading && (
        <>
          <h2>{followers.length} followers</h2>
          <br />
          <br />
          <Card>
            <ResourceList
              resourceName={{ singular: "follower", plural: "followers" }}
              items={followers}
              renderItem={item => {
                const { uid, displayName, photoURL } = item;
                return (
                  <ResourceItem
                    id={uid}
                    media={
                      <Avatar
                        source={photoURL}
                        customer
                        size="medium"
                        name={displayName}
                      />
                    }
                  >
                    <h3>
                      <TextStyle variation="strong">{displayName}</TextStyle>
                    </h3>
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </>
      )}
    </Page>
  );
};

export default Followers;
