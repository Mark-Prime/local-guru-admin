import React, { useEffect, useState, useCallback } from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import AddProduct from "../../components/AddProduct";
import AddProductAdmin from "../../components/AddProductAdmin";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { db, storage } from "../../firebase";
import { useSelector } from "react-redux";
import ProductPhotoUpload from "../../components/ProductPhotoUpload";
import { TOGGLE_TOAST } from "../../actions/UIActions";
import { useDispatch } from "react-redux";

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
    image: {},
    maxPrice: 0,
    tags: []
  };
  const [touched, setTouched] = useState(false);
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

  const dispatch = useDispatch();

  const history = useHistory();
  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchProducts = async () => {
      const array = [];

      const docs = await db.collection("products").get();

      docs.forEach(doc => {
        array.push(doc.data());
      });

      setProducts(array);
      setLoaded(true);
    };

    fetchProducts();
  }, []);

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
    setTouched(true);
  }, []);

  const handleAddUnit = useCallback(() => {
    // check length
    let updatedUnits = [...units, { value: "lb", price: 0 }];
    // set state with new array
    setUnits(updatedUnits);
    setTouched(true);
  }, [units]);

  const handleRemoveUnit = useCallback(
    index => {
      // copy array
      let updatedUnits = [...units];
      // remove item
      updatedUnits.splice(index, 1);
      // set state with new array
      setUnits(updatedUnits);
      setTouched(true);
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
          product: selected.id,
          photo: user.photoURL ? user.photoURL : "",
          units: units,
          seasons: seasons
        },
        { merge: true }
      );
    history.push("/products");
  }, [
    products,
    history,
    selected.index,
    selected.id,
    user.uid,
    seasons,
    user.displayName,
    user.photoURL,
    values.description,
    units
  ]);

  const handleSubmitAdmin = useCallback(async () => {
    let id = "";
    try {
      const res = await db.collection("products").add({
        ...values,
        seasons: seasons
      });
      id = res.id;
      db.collection("products")
        .doc(id)
        .set(
          {
            id: id
          },
          { merge: true }
        );
    } catch (e) {
      console.log(e);
    } finally {
      dispatch({ type: TOGGLE_TOAST, payload: "Product created" });
      history.push(`/product/edit/${id}`);
    }
  }, [dispatch, history, seasons, values]);

  const goBack = () => {
    history.goBack();
  };

  const handlePhoto = useCallback(async file => {
    let url = "";
    try {
      const res = await storage
        .ref()
        .child(`products/${file.name}`)
        .put(file);

      if (res.state === "success") {
        url = await storage
          .ref()
          .child(`products/${file.name}`)
          .getDownloadURL();
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log(url);
      setValues(prevValues => ({
        ...prevValues,
        image: url
      }));
      setTouched(true);
    }

    setTouched(true);
  }, []);

  const handleSeason = useCallback(value => setSeasons(value), []);

  const handleCurrencyBlur = useCallback(value => {
    return value;
  }, []);

  const handleAddTag = useCallback(
    newTag => {
      setValues(prevValues => ({
        ...prevValues,
        tags: [...values.tags, newTag]
      }));
      setTouched(true);
    },
    [values.tags]
  );

  const handleRemoveTag = useCallback(
    tagIndex => {
      let updatedTags = [...values.tags];

      updatedTags.splice(tagIndex, 1);

      setValues(prevValues => ({
        ...prevValues,
        tags: updatedTags
      }));
      setTouched(true);
    },
    [values.tags]
  );

  const { title, description, category, maxPrice, tags } = values;

  return (
    <Page
      breadcrumbs={[{ content: "Products", onAction: goBack }]}
      title="Add Product"
      primaryAction={{
        content: "Save",
        disabled: !touched,
        onAction: user.admin ? handleSubmitAdmin : handleSubmit
      }}
    >
      <Layout>
        <Layout.Section>
          {loaded && user.admin ? (
            <AddProductAdmin
              products={products}
              title={title}
              selected={selected}
              description={description}
              units={units}
              category={category}
              seasons={seasons}
              tags={tags}
              maxPrice={maxPrice}
              handleSeason={handleSeason}
              handleProductChoice={handleProductChoice}
              handleChangeTextField={handleChangeTextField}
              handleSelectChange={handleChangeTextField}
              handleFocus={handleFocus}
              handleCurrencyBlur={handleCurrencyBlur}
              handleChangeUnit={handleChangeUnit}
              handleAddUnit={handleAddUnit}
              handleRemoveUnit={handleRemoveUnit}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
            />
          ) : (
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
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            {user.admin ? (
              <ProductPhotoUpload
                className="photo-upload"
                onChange={handlePhoto}
              />
            ) : (
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
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default AddSingleProduct;
