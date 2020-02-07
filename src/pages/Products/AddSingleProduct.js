import React, { useEffect, useState, useCallback } from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import AddProduct from "../../components/AddProduct";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";

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
  const [selected, setSelected] = useState({ title: "", index: null });
  const [values, setValues] = useState(defaultValues);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([
    {
      value: "lb",
      price: "0",
      max: ""
    }
  ]);

  const history = useHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      const array = [];

      const docs = await db.collection("products").get();

      docs.forEach(doc => {
        array.push(doc.data());
      });

      console.log(array);

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
      console.log(selected[0]);

      setSelected({
        index: index,
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
    },
    [units]
  );

  const handleSubmit = useCallback(() => {
    const { selected } = values;
    const { image, title, unit, id } = products[selected];
    console.log(image, title, unit, id);
  }, [products, values]);

  const goBack = () => {
    history.goBack();
  };

  const handleCurrencyBlur = useCallback(value => {
    return value;
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
    </Page>
  );
};

export default AddSingleProduct;
