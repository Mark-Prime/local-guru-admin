import React, { useState, useEffect, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  FormLayout,
  Thumbnail,
  Select
} from "@shopify/polaris";
import ProductPhotoUpload from "../../components/ProductPhotoUpload";
import { TOGGLE_TOAST } from "../../actions/UIActions";
import { db, storage } from "../../firebase";
import { useDispatch } from "react-redux";

import styled from "styled-components";

const { Section } = Layout;

const BlockLayout = styled(Layout)`
  background: red;
  .Polaris-Layout__Section {
    display: flex;
  }
`;

const EditPageHome = () => {
  const dispatch = useDispatch();

  const [touched, setTouched] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState({});
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await db
          .collection("pages")
          .doc("home")
          .get();
        const { heroCTAtext, heroText, heroImage, blocks } = res.data();
        setValues({
          heroText: heroText,
          heroCTAtext: heroCTAtext,
          heroImage: heroImage
        });
        setBlocks(blocks);
        setLoaded(true);
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

  const handleBlockChange = useCallback(
    (value, id) => {
      const fieldInfo = id.split("-");

      const index = fieldInfo[1];
      const side = fieldInfo[2];
      const field = fieldInfo[3];

      const newArray = [...blocks];

      newArray[index] = {
        ...newArray[index],
        [side]: {
          ...newArray[index][side],
          [field]: value
        }
      };

      setBlocks(newArray);

      setTouched(true);
    },
    [blocks]
  );

  const handleSubmit = useCallback(async () => {
    try {
      console.log(blocks);
      db.collection(`pages`)
        .doc(`home`)
        .update({
          blocks: blocks,
          heroText: values.heroText,
          heroCTAtext: values.heroCTAtext
        });
      setTouched(false);
    } catch (e) {
      console.log(e);
    } finally {
      console.log("saved");
      dispatch({ type: TOGGLE_TOAST, payload: `Page saved` });
    }
  }, [blocks, dispatch, values.heroCTAtext, values.heroText]);

  const handleBlockTypeChange = useCallback(
    (value, id) => {
      const fieldInfo = id.split("-");

      const index = fieldInfo[1];
      const side = fieldInfo[2];

      const newArray = [...blocks];

      switch (value) {
        case "list":
          newArray[index] = {
            ...newArray[index],
            [side]: {
              ...newArray[index][side],
              items: [],
              type: "list"
            }
          };
          break;
        case "imageText":
          newArray[index] = {
            ...newArray[index],
            [side]: {
              ...newArray[index][side],
              type: "imageText"
            }
          };
          break;
        default:
          // Text Field
          newArray[index] = {
            ...newArray[index],
            [side]: {
              ...newArray[index][side],
              type: "text"
            }
          };
      }

      setBlocks(newArray);
      setTouched(true);
    },
    [blocks]
  );

  const handleAddListItem = useCallback(
    (side, index) => {
      const newArray = [...blocks];
      const newItems = [...newArray[index][side].items];
      newItems.push("");

      newArray[index] = {
        ...newArray[index],
        [side]: {
          ...newArray[index][side],
          items: newItems
        }
      };

      setBlocks(newArray);

      setTouched(true);
    },
    [blocks]
  );

  const handleChangeBlockList = useCallback(
    (value, id) => {
      const fieldInfo = id.split("-");

      const index = fieldInfo[1];
      const side = fieldInfo[2];
      const itemIndex = fieldInfo[4];

      console.log(`item index: ${itemIndex}`);

      const newArray = [...blocks];
      const newItems = [...newArray[index][side].items];
      newItems[itemIndex] = value;

      newArray[index] = {
        ...newArray[index],
        [side]: {
          ...newArray[index][side],
          items: newItems
        }
      };

      setBlocks(newArray);

      setTouched(true);
    },
    [blocks]
  );

  const handleRemoveImage = useCallback(
    (side, index) => {
      const newArray = [...blocks];
      newArray[index] = {
        ...newArray[index],
        [side]: {
          ...newArray[index][side],
          image: ""
        }
      };
      setBlocks(newArray);
      setTouched(true);
    },
    [blocks]
  );

  const handlePhoto = useCallback(
    async (side, index, file) => {
      console.log(`side: ${side}`);
      console.log(`index: ${index}`);
      console.log(`file: ${file}`);

      try {
        const res = await storage
          .ref()
          .child(`assets/${file.name}`)
          .put(file);

        if (res.state === "success") {
          console.log(res);
          const url = await storage
            .ref()
            .child(`assets/${file.name}`)
            .getDownloadURL();

          const newArray = [...blocks];
          console.log(url);
          newArray[index] = {
            ...newArray[index],
            [side]: {
              ...newArray[index][side],
              image: url
            }
          };
          console.log(newArray);
          setBlocks(newArray);
          setTouched(true);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [blocks]
  );

  const blockOptions = [
    { label: "Text", value: "text" },
    { label: "Image & Text", value: "imageText" },
    { label: "List", value: "list" }
  ];

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
      <br />
      {loaded &&
        blocks.length > 0 &&
        blocks.map((block, index) => {
          const { left, right } = block;
          return (
            <React.Fragment key={index}>
              <BlockLayout className="block-layout">
                <Section oneHalf title="Left">
                  <Card title="Left" sectioned>
                    {left.type === "list" ? (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.left.type}
                          id={`block-${index}-left`}
                          onChange={(value, id) =>
                            handleBlockTypeChange(value, id)
                          }
                        />
                        <TextField
                          label="Heading"
                          id={`block-${index}-left-heading`}
                          value={left.heading}
                          onChange={handleBlockChange}
                        />
                        <Card
                          title="List items"
                          sectioned
                          actions={[
                            {
                              content: "Add item",
                              onAction: () => handleAddListItem("left", index)
                            }
                          ]}
                        >
                          <FormLayout>
                            {block.left.items.map((item, listIndex) => (
                              <TextField
                                key={listIndex}
                                id={`block-${index}-left-listItem-${listIndex}`}
                                onChange={handleChangeBlockList}
                                label={`List Item #${listIndex + 1}`}
                                value={item}
                              />
                            ))}
                          </FormLayout>
                        </Card>
                      </FormLayout>
                    ) : left.type === "imageText" ? (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.left.type}
                          id={`block-${index}-left`}
                          onChange={handleBlockTypeChange}
                        />
                        {block.left.image !== "" ? (
                          <Card
                            sectioned
                            title="Image"
                            actions={[
                              {
                                content: "Remove image",
                                destructive: true,
                                onAction: () => handleRemoveImage("left", index)
                              }
                            ]}
                          >
                            <Thumbnail source={block.left.image} size="large" />
                          </Card>
                        ) : (
                          <ProductPhotoUpload
                            onChange={file => handlePhoto("left", index, file)}
                          />
                        )}
                        <TextField
                          label="Heading"
                          id={`block-${index}-left-heading`}
                          value={left.heading}
                          onChange={handleBlockChange}
                        />
                        <TextField
                          label="Body"
                          id={`block-${index}-left-body`}
                          onChange={handleBlockChange}
                          value={left.body}
                          multiline
                        />
                      </FormLayout>
                    ) : (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.left.type}
                          id={`block-${index}-left`}
                          onChange={handleBlockTypeChange}
                        />
                        <TextField
                          label="Heading"
                          id={`block-${index}-left-heading`}
                          value={left.heading}
                          onChange={handleBlockChange}
                        />
                        <TextField
                          label="Body"
                          id={`block-${index}-left-body`}
                          onChange={handleBlockChange}
                          value={left.body}
                          multiline
                        />
                      </FormLayout>
                    )}
                  </Card>
                </Section>
                <Section oneHalf title="Right">
                  <Card title="Right" sectioned>
                    {right.type === "list" ? (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.right.type}
                          id={`block-${index}-right`}
                          onChange={(value, id) =>
                            handleBlockTypeChange(value, id)
                          }
                        />
                        <TextField
                          label="Heading"
                          id={`block-${index}-right-heading`}
                          value={right.heading}
                          onChange={handleBlockChange}
                        />
                        <Card
                          title="List items"
                          sectioned
                          actions={[
                            {
                              content: "Add item",
                              onAction: () => handleAddListItem("right", index)
                            }
                          ]}
                        >
                          <FormLayout>
                            {block.right.items.map((item, listIndex) => (
                              <TextField
                                key={listIndex}
                                id={`block-${index}-right-listItem-${listIndex}`}
                                onChange={handleChangeBlockList}
                                label={`List Item #${listIndex + 1}`}
                                value={item}
                              />
                            ))}
                          </FormLayout>
                        </Card>
                      </FormLayout>
                    ) : left.type === "imageText" ? (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.right.type}
                          id={`block-${index}-right`}
                          onChange={(value, id) =>
                            handleBlockTypeChange(value, id)
                          }
                        />
                        {block.right.image !== "" ? (
                          <Card
                            sectioned
                            title="Image"
                            actions={[
                              {
                                content: "Remove image",
                                destructive: true,
                                onAction: () =>
                                  handleRemoveImage("right", index)
                              }
                            ]}
                          >
                            <Thumbnail
                              source={block.right.image}
                              size="large"
                            />
                          </Card>
                        ) : (
                          <ProductPhotoUpload
                            onChange={file => handlePhoto("right", index, file)}
                          />
                        )}
                        <TextField
                          label="Heading"
                          id={`block-${index}-right-heading`}
                          value={right.heading}
                          onChange={handleBlockChange}
                        />
                        <TextField
                          label="Body"
                          id={`block-${index}-right-body`}
                          onChange={handleBlockChange}
                          value={right.body}
                          multiline
                        />
                      </FormLayout>
                    ) : (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.right.type}
                          id={`block-${index}-right`}
                          onChange={(value, id) =>
                            handleBlockTypeChange(value, id)
                          }
                        />
                        <TextField
                          label="Heading"
                          id={`block-${index}-left-heading`}
                          value={right.heading}
                          onChange={handleBlockChange}
                        />
                        <TextField
                          label="Body"
                          id={`block-${index}-right-body`}
                          onChange={handleBlockChange}
                          value={right.body}
                          multiline
                        />
                      </FormLayout>
                    )}
                  </Card>
                </Section>
              </BlockLayout>
              <br />
            </React.Fragment>
          );
        })}
    </Page>
  );
};

export default EditPageHome;
