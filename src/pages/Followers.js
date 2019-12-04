import React from "react";
import {
  Page,
  Avatar,
  Card,
  ResourceItem,
  ResourceList,
  TextStyle,
  EmptyState
} from "@shopify/polaris";
import emptyFollowers from "../assets/empty-followers.svg";
import { useSelector } from "react-redux";
import useFollowers from "../hooks/useFollowers";

const Followers = () => {
  const user = useSelector(state => state.user);
  const userFollowers = user.followers;

  console.log(user);

  const { loading, followers } = useFollowers(userFollowers);

  return (
    <Page title={followers.length > 0 ? "Followers" : null}>
      {!loading && (
        <>
          {followers.length > 0 ? (
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
                          <TextStyle variation="strong">
                            {displayName}
                          </TextStyle>
                        </h3>
                      </ResourceItem>
                    );
                  }}
                />
              </Card>
            </>
          ) : (
            <EmptyState
              heading="Followers"
              image={emptyFollowers}
              action={{ content: "Action here?" }}
            >
              Looks like you don't have any followers yet. Check back soon!
            </EmptyState>
          )}
        </>
      )}
    </Page>
  );
};

export default Followers;
