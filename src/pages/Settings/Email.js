import React, { useState } from "react";
import { Card, TextField, FormLayout } from "@shopify/polaris";
import firebase from "firebase/app";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { TOGGLE_TOAST } from "../../actions/UIActions";

const Password = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const user = auth.currentUser;

    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      const reauth = await user.reauthenticateWithCredential(credential);
      console.log(reauth);
      await user.updateEmail(newEmail);
      setCurrentPassword("");
      setNewEmail("");
      dispatch({ type: TOGGLE_TOAST, payload: "Email updated" });
    } catch (err) {
      console.log(err);
      dispatch({ type: TOGGLE_TOAST, payload: err.message });
    }
  };

  return (
    <Card
      title="Email"
      sectioned
      primaryFooterAction={{
        content: "Change email",
        disabled: currentPassword === "" || newEmail === "",
        onAction: () => handleSubmit()
      }}
    >
      <FormLayout>
        <TextField
          type="password"
          placeholder="Current password"
          onChange={value => setCurrentPassword(value)}
          value={currentPassword}
        />
        <TextField
          type="password"
          placeholder="New email address"
          value={newEmail}
          onChange={value => setNewEmail(value)}
        />
      </FormLayout>
    </Card>
  );
};

export default Password;
