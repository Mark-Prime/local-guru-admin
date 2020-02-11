import React, { useEffect, useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  ButtonGroup,
  TextContainer,
  Modal,
  Button
} from "@shopify/polaris";
import AddProduct from "../../components/AddProduct";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

const Image = styled.div`
  img {
    width: 100%;
  }
`;

const AddSingleProduct = () => {
  const defaultValues = {
    description: "",
    title: "",
    category: "veggies",
    photo: "",
    tags: []
  };
  const [touched, setTouched] = useState(false);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState({ title: "", index: null });
  const [values, setValues] = useState(defaultValues);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [seasons, setSeasons] = useState([
    "spring",
    "summer",
    "fall",
    "winter"
  ]);
  const [units, setUnits] = useState([
    {
      value: "lb",
      price: "0",
      max: ""
    }
  ]);

  const history = useHistory();
  const user = useSelector(state => state.user);
  const productId = useParams().id;

  useEffect(() => {
    const fetchProducts = async () => {
      const array = [];

      const docs = await db.collection("products").get();

      docs.forEach(doc => {
        array.push(doc.data());
      });

      console.log(array);

      setProducts(array);
    };

    const fetchSingleProduct = async () => {
      const doc = await db
        .collection("products")
        .doc(productId)
        .collection("producers")
        .doc(user.uid)
        .get();

      console.log(products);

      if (products.title) {
        setValues({
          title: doc.data().title,
          description: doc.data().description,
          category: "veggies",
          tags: doc.data().tags,
          photo: doc.data().photo
        });
      }

      const index = products.findIndex(p => p.title === doc.data().title);

      if (index > -1) {
        setSelected({
          title: doc.data().title,
          index: index
        });
        setUnits(doc.data().units);
        setLoaded(true);
      }
    };

    if (products.length < 1) {
      console.log("length zero");
      fetchProducts();
    }

    if (selected.title === "") {
      fetchSingleProduct();
    }
  }, [productId, products, selected.title, user.uid]);

  const handleFocus = e => {
    e.target.select();
  };

  const handleProductChoice = useCallback(
    selected => {
      const index = products.findIndex(p => p.title === selected[0]);

      setSelected({
        index: index,
        id: products[index].id,
        title: selected[0]
      });
      setTouched(true);
    },
    [products]
  );

  const handleChangeTextField = useCallback((value, id) => {
    setValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));
  }, []);

  const handleAddUnit = useCallback(() => {
    // check length
    let updatedUnits = [...units, { value: "lb", price: 0 }];
    // set state with new array
    setUnits(updatedUnits);
  }, [units]);

  const handleRemoveUnit = useCallback(
    index => {
      // copy array
      let updatedUnits = [...units];
      // remove item
      updatedUnits.splice(index, 1);
      // set state with new array
      setUnits(updatedUnits);
    },
    [units]
  );

  const handleChangeUnit = useCallback(
    (index, value, price, max) => {
      // copy array
      const updatedUnits = units.slice();
      // edit array
      updatedUnits[index] = { price: price, value: value, max: max };
      // set state with new array
      setUnits(updatedUnits);
      setTouched(true);
    },
    [units]
  );

  const handleSubmit = useCallback(async () => {
    const { image, title, id, producers } = products[selected.index];
    db.collection("products")
      .doc(id)
      .set(
        {
          producers: [...producers, { [user.uid]: true }]
        },
        { merge: true }
      );

    db.collection("products")
      .doc(id)
      .collection("producers")
      .doc(user.uid)
      .set(
        {
          title: title,
          description: values.description,
          name: user.displayName,
          uid: user.uid,
          image: image,
          product: productId,
          photo: user.photoURL ? user.photoURL : "",
          units: units,
          seasons: seasons
        },
        { merge: true }
      );
  }, [
    products,
    selected.index,
    user.uid,
    user.displayName,
    user.photoURL,
    values.description,
    productId,
    units,
    seasons
  ]);

  const goBack = () => {
    history.goBack();
  };

  const handleCurrencyBlur = useCallback(value => {
    return value;
  }, []);

  const handleDelete = useCallback(() => {
    const { id } = products[selected.index];
    db.collection("products")
      .doc(id)
      .collection("producers")
      .doc(user.uid)
      .delete();
    history.push("/products");
  }, [history, products, selected.index, user.uid]);

  const handleSeason = useCallback(value => {
    setSeasons(value);
    setTouched(true);
  }, []);

  const { title, description } = values;

  return (
    <Page
      breadcrumbs={[{ content: "Products", onAction: goBack }]}
      title="Add Product"
      primaryAction={{
        content: "Save",
        disabled: !touched,
        onAction: handleSubmit
      }}
    >
      <Layout>
        <Layout.Section>
          {loaded && (
            <AddProduct
              products={products}
              title={title}
              selected={selected}
              description={description}
              units={units}
              seasons={seasons}
              handleSeason={handleSeason}
              handleProductChoice={handleProductChoice}
              handleChangeTextField={handleChangeTextField}
              handleSelectChange={handleChangeTextField}
              handleFocus={handleFocus}
              handleCurrencyBlur={handleCurrencyBlur}
              handleChangeUnit={handleChangeUnit}
              handleAddUnit={handleAddUnit}
              handleRemoveUnit={handleRemoveUnit}
            />
          )}
          <br />
          <ButtonGroup>
            <Button destructive onClick={() => setModal(true)}>
              Delete Product
            </Button>
          </ButtonGroup>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Image>
              <>
                {selected.index && (
                  <img
                    src={products[selected.index].image}
                    alt={products[selected.index].title}
                  />
                )}
              </>
            </Image>
          </Card>
        </Layout.Section>
      </Layout>
      <Modal
        open={modal}
        sectioned
        onClose={() => setModal(false)}
        title="Delete product?"
        primaryAction={{
          content: "Delete product",
          destructive: true,
          onAction: handleDelete
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setModal(false)
          }
        ]}
      >
        <TextContainer>
          <p>Are you sure you want to delete this product?</p>
        </TextContainer>
      </Modal>
    </Page>
  );
};

export default AddSingleProduct;
