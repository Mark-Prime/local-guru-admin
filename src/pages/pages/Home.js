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
import { TOGGLE_TOAST } from "../../actions/UIActions";
import { db } from "../../firebase";
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
  const [blocks, setBlocks] = useState([
    {
      left: {
        heading: "Local Guru",
        body:
          "Local Guru is a food hub and curator offering all the best goods from local farms and producers. We partner directly at the source to offer consumers a curated sourced selection of produce and grab-and-go options. Our mission is to make locally grown food easily accessible for the community to enjoy. We believe in the power of healthy eating and that food grown without harsh chemicals is best for our bodies and the environment. Choosing food from farms close to your home minimizes the exposure of toxins in travel-time, translating into fresher food.",
        type: "text"
      },
      right: {
        heading: "Our Mission",
        type: "list",
        items: [
          "Foster a network of thriving local farms, Urban Farms and Community Gardens",
          "Provide access to healthy high-quality food",
          "Support sustainable humane growing practices",
          "Build a network of new and local economies and ecosystems"
        ]
      }
    },
    {
      left: {
        type: "imageText",
        image:
          "https://local-guru-aeac9.firebaseapp.com/static/media/lemons.5d90e5f1.jpg",
        heading: "Our Goal",
        body:
          "We're out to jumpstart the food system. We want to reconnect people with where their food comes from by finding local produce and artisan goods near the city. Partnering up with hundreds of farmers and food makers, providing it all to you through our online market."
      },
      right: {
        type: "imageText",
        image:
          "https://local-guru-aeac9.firebaseapp.com/static/media/soil.0d5686b4.jpg",
        heading: "We Curate, You Customize",
        body:
          "As a subscriber, adding or removing whatever you want - minimum order is $20. Your basket is bi-weekly by default, but you can make it weekly or suspend it with one click in your account settings, or suspend deliveries if you’re out of town. You can cancel anytime."
      }
    },
    {
      left: {
        type: "imageText",
        image:
          "https://local-guru-aeac9.firebaseapp.com/static/media/salad.32dee24e.jpg",
        heading:
          "An Online Farmer’s Market: Home to the Freshest Foods in Town",
        body:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam blandit ultricies euismod. Proin id ultricies eros. Cras mi diam, rhoncus vel nunc ut, aliquam ultrices leo. Cras vitae lectus posuere, luctus dui vitae, placerat puru."
      },
      right: {
        type: "imageText",
        image:
          "https://local-guru-aeac9.firebaseapp.com/static/media/produce.56137697.jpg",
        heading: "We Curate, You Customize",
        body:
          "We deliver directly to you. Deliveries are between 10 am and 5pm on Saturdays. Delivery is a flat rate at $9.99. However, if your order is over $40.00, we will waive the fee."
      }
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await db
          .collection("pages")
          .doc("home")
          .get();
        setValues(res.data());
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

  const handleSubmit = async () => {
    try {
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
  };

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
                        />
                        <TextField
                          label="Heading"
                          id={`block-${index}-left-heading`}
                          value={left.heading}
                          onChange={handleBlockChange}
                        />
                        {block.left.items.map(item => (
                          <TextField />
                        ))}
                      </FormLayout>
                    ) : left.type === "imageText" ? (
                      <FormLayout>
                        <Select
                          options={blockOptions}
                          value={block.left.type}
                        />
                        <Thumbnail source={block.left.image} size="large" />
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
                          actions={[{ content: "Add item" }]}
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
                        />
                        <Thumbnail source={block.right.image} size="large" />
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
