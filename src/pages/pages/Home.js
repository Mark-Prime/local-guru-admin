import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Page, Layout, Card, TextField, FormLayout } from "@shopify/polaris";
import { db } from "../../firebase";
import emptyProducts from "../../assets/empty-products.svg";
import styled from "styled-components";

const { Section } = Layout;

const EditPageHome = () => {
  const [touched, setTouched] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await db
          .collection("pages")
          .doc("home")
          .get();
        setValues(res.data());
      } catch (e) {
        console.log(e);
      }
    };

    if (!loaded) {
      fetchData();
    }
  }, [loaded]);

  const handleChange = useCallback((value, id) => {
    setValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));
    setTouched(true);
  }, []);

  const handleSubmit = useCallback(() => {
    try {
      db.collection("pages")
        .doc("home")
        .update(values);
      setTouched(false);
    } catch (e) {}
  }, [values]);

  return (
    <Page
      title="Home"
      separator
      primaryAction={{
        content: "Save",
        disabled: !touched,
        onAction: () => handleSubmit()
      }}
    >
      <Layout>
        <Section>
          <Card title="Hero" sectioned>
            <FormLayout>
              <TextField
                label="Heading"
                id="heroText"
                placeholder="Hero text"
                value={values.heroText}
                onChange={handleChange}
              />
              <TextField
                label="Button text"
                id="heroCTAtext"
                placeholder="Hero button text"
                value={values.heroCTAtext}
                onChange={handleChange}
              />
            </FormLayout>
          </Card>
        </Section>
      </Layout>
    </Page>
  );
};

export default EditPageHome;
