import React, { useState, useEffect, useCallback } from "react";
import { Card, TextField, FormLayout } from "@shopify/polaris";
import { db } from "../../firebase";

const { Group } = FormLayout;

const Business = ({ user }) => {
  const defaultValues = {
    businessName: "",
    fullName: "",
    street: "",
    zip: "",
    apt: "",
    city: "Minneapolis"
  };

  const [values, setValues] = useState(user.businessDetails || defaultValues);
  const [touched, setTouched] = useState(false);

  const handleTextField = useCallback((value, id) => {
    setValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));
    setTouched(true);
  }, []);

  const handleSubmit = useCallback(() => {
    db.collection("producers")
      .doc(user.uid)
      .update({
        businessDetails: values
      });
    setTouched(false);
  }, [user.uid, values]);

  const { businessName, fullName, street, zip, apt, city } = values;

  return (
    <Card
      sectioned
      primaryFooterAction={{
        content: "Update Business details",
        onAction: () => handleSubmit(),
        disabled: !touched
      }}
    >
      <FormLayout>
        <Group>
          <TextField
            label="Legal business name"
            id="businessName"
            value={businessName}
            onChange={handleTextField}
          />
          <TextField
            label="Your full name"
            id="fullName"
            value={fullName}
            onChange={handleTextField}
          />
        </Group>
        <TextField
          label="Street"
          id="street"
          value={street}
          onChange={handleTextField}
        />
        <Group>
          <TextField
            label="Apartment"
            id="apt"
            value={apt}
            onChange={handleTextField}
          />
          <TextField
            label="ZIP code"
            id="zip"
            value={zip}
            onChange={handleTextField}
          />
          <TextField
            label="City"
            id="city"
            value={city}
            disabled
            onChange={handleTextField}
          />
        </Group>
      </FormLayout>
    </Card>
  );
};

export default Business;
