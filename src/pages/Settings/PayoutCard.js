import React, { useState, useEffect } from "react";
import { Card, Icon } from "@shopify/polaris";
import { injectStripe, CardElement } from "react-stripe-elements";
import { functions, db } from "../../firebase";
import { CreditCardMajorMonotone } from "@shopify/polaris-icons";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { LOGIN_USER } from "../../actions/UserActions";
import { TOGGLE_TOAST } from "../../actions/UIActions";

const UserCard = styled.div`
  display: flex;

  span {
    margin: inherit;
    margin-right: 1rem;
  }
`;

const PayoutCard = ({ user, stripe }) => {
  const [formOpen, setFormOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.token) {
      setFormOpen(false);
    }
  }, [user.token]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { error, token } = await stripe.createToken({
        type: "card",
        name: user.displayName,
        currency: "usd"
      });

      if (error) {
        throw new Error(error.message);
      }

      await db
        .collection("producers")
        .doc(user.uid)
        .update({
          token: token
        });

      const res = await functions.httpsCallable("addPayoutCard")({
        user: user,
        token: token.id
      });

      if (res.data.success) {
        setFormOpen(false);
        const updatedUser = await db
          .collection("producers")
          .doc(user.uid)
          .get();
        dispatch({ type: LOGIN_USER, payload: updatedUser.data() });
      }
      dispatch({ type: TOGGLE_TOAST, payload: res.data.message });
      setLoading(false);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      title="Debit Card for Payout"
      sectioned
      secondaryFooterActions={
        formOpen && [{ content: "Cancel", onAction: () => setFormOpen(false) }]
      }
      primaryFooterAction={
        formOpen
          ? {
              content: "Add card",
              onAction: () => handleSubmit(),
              loading: loading
            }
          : { content: "Change card", onAction: () => setFormOpen(true) }
      }
    >
      {formOpen ? (
        <CardElement
          style={{
            base: {
              fontSize: "16px"
            }
          }}
        />
      ) : (
        <UserCard>
          <Icon source={CreditCardMajorMonotone} />
          {user.token.card.brand} {user.token.card.last4}
        </UserCard>
      )}
    </Card>
  );
};

export default injectStripe(PayoutCard);
