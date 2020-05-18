import React, { useState, useCallback } from "react";
import { Card, TextField, FormLayout, Badge } from "@shopify/polaris";
import { db } from "../../firebase";
import styled from "styled-components";
import Autocomplete from "react-google-autocomplete";

const { Group } = FormLayout;

const Wrapper = styled.div``;

const StyledField = styled.div`
  span {
    margin-bottom: 0.5rem;
    display: block;
  }

  div {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      z-index: 10;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #fff;
      border: 0.1rem solid var(--p-border, #c4cdd5);
      border-radius: 3px;
      box-shadow: inset 0 1px 0 0 rgba(99, 115, 129, 0.05);
      pointer-events: none;
    }

    .autocomplete {
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 2.4rem;
      text-transform: none;
      letter-spacing: normal;
      position: relative;
      z-index: 20;
      display: block;
      flex: 1 1;
      width: 100%;
      min-width: 0;
      min-height: 3.6rem;
      margin: 0;
      padding: 0.5rem 1.2rem;
      background: none;
      border: 0.1rem solid transparent;
    }
  }
`;

const Business = ({ user }) => {
  const defaultValues = {
    businessName: "",
    fullName: "",
    street: "",
    zip: "",
    phone: "",
    apt: "",
    city: "Minneapolis"
  };

  const [values, setValues] = useState(user.businessDetails || defaultValues);
  const [error, setError] = useState(false);
  const [valid, setValid] = useState(false);
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

  const deliveryCounties = ["Ramsey County", "Hennepin County"];

  const { businessName, fullName, street, zip, apt, city, phone } = values;

  return (
    <Wrapper>
      <Card
        sectioned
        primaryFooterAction={{
          content: "Update Business details",
          onAction: () => valid && handleSubmit(),
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
            <TextField
              label="Phone number"
              id="phone"
              value={phone}
              maxLength={10}
              type="tel"
              onChange={handleTextField}
            />
          </Group>
          <StyledField>
            <span>Address</span>
            <div>
              <Autocomplete
                className="autocomplete"
                placeholder="Enter your address"
                onPlaceSelected={place => {
                  const { address_components } = place;
                  const county = address_components[4].long_name;
                  if (deliveryCounties.indexOf(county) > -1) {
                    setValues(prevValues => ({
                      ...prevValues,
                      street: `${address_components[0].short_name} ${address_components[1].short_name}`,
                      city: address_components[3].short_name,
                      zip: address_components[7].short_name
                    }));
                    setValid(true);
                  } else {
                    setError(true);
                    setValues(prevValues => ({
                      ...prevValues,
                      street: "",
                      city: "",
                      apartment: "",
                      zip: ""
                    }));
                  }
                }}
                types={["address"]}
                componentRestrictions={{ country: "us" }}
              />
            </div>
          </StyledField>
          {error && (
            <Badge status="warning">
              Your address must be in the Twin Cities area.
            </Badge>
          )}

          <TextField
            label="Street"
            id="street"
            value={street}
            onChange={handleTextField}
            disabled
          />
          <Group>
            <TextField
              label="Apartment"
              id="apt"
              value={apt}
              onChange={handleTextField}
              disabled
            />
            <TextField
              label="ZIP code"
              id="zip"
              value={zip}
              onChange={handleTextField}
              disabled
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
    </Wrapper>
  );
};

export default Business;
