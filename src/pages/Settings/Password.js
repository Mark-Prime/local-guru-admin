import React, { useState } from "react";
import { Card, TextField, FormLayout } from "@shopify/polaris";
import firebase from "firebase/app";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { TOGGLE_TOAST } from "../../actions/UIActions";

const Password = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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
      await user.updatePassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirm("");
      dispatch({ type: TOGGLE_TOAST, payload: "Password updated" });
    } catch (err) {
      console.log(err);
      dispatch({ type: TOGGLE_TOAST, payload: err.message });
    }
  };

  return (
    <Card
      title="Password"
      sectioned
      primaryFooterAction={{
        content: "Change password",
        disabled:
          newPassword !== passwordConfirm ||
          currentPassword === "" ||
          newPassword === "" ||
          passwordConfirm === "",
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
          placeholder="New password"
          value={newPassword}
          onChange={value => setNewPassword(value)}
        />
        <TextField
          type="password"
          value={passwordConfirm}
          placeholder="Confirm new password"
          onChange={value => setPasswordConfirm(value)}
        />
      </FormLayout>
    </Card>
  );
};

export default Password;
