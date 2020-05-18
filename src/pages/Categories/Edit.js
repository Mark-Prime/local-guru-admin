import React, { useState, useEffect, useCallback } from "react";
import { Page, Card, TextInput, FormLayout, TextField } from "@shopify/polaris";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { TOGGLE_TOAST } from "../../actions/UIActions";
import { useDispatch } from "react-redux";

const EditCategory = () => {
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState({});
  const [touched, setTouched] = useState(false);

  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const doc = await db
        .collection(`categories`)
        .doc(id)
        .get();
      console.log(doc);
      setValues(doc.data());
      setLoaded(true);
    };

    if (!loaded) {
      fetchData();
    }
  }, [id, loaded]);

  const { title, fee, description } = values;

  const handleTextFieldChange = useCallback(
    (value, id) => {
      setValues(prevValues => ({
        ...values,
        [id]: value
      }));
      setTouched(true);
    },
    [values]
  );

  const handleSubmit = useCallback(() => {
    try {
      db.collection(`categories`)
        .doc(id)
        .update(values);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: TOGGLE_TOAST, payload: `Category saved` });
    }
  }, [dispatch, id, values]);

  return (
    <Page
      title="Edit Category"
      breadcrumbs={[{ content: "Categories", url: "/products/categories" }]}
      primaryAction={{
        content: "Save",
        disabled: !touched,
        onAction: () => handleSubmit()
      }}
    >
      <Card sectioned>
        <FormLayout>
          <FormLayout.Group>
            <TextField
              label="Title"
              value={title}
              id="title"
              onChange={(value, id) => handleTextFieldChange(value, id)}
            />
            <TextField
              label="Fee"
              type="number"
              value={`${fee}`}
              id="fee"
              onChange={(value, id) => handleTextFieldChange(value, id)}
              prefix="$"
            />
          </FormLayout.Group>

          <TextField
            label="Description"
            id="description"
            value={description}
            onChange={(value, id) => handleTextFieldChange(value, id)}
          />
        </FormLayout>
      </Card>
    </Page>
  );
};

export default EditCategory;
