import { db, storage } from "../firebase";

export const FETCH_ALL_PRODUCTS = "fetch_all_products";
export const FETCH_USER_PRODUCTS = "fetch_user_products";
export const FETCH_TAGGED_PRODUCTS = "fetch_tagged_products";
export const FETCH_CATEGORY = "fetch_category";

export function fetchAllProducts(user) {
  return dispatch => {
    return db
      .collection("products")
      .orderBy("title", "desc")
      .get()
      .then(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
          products = [doc.data(), ...products];
        });

        console.log(products);

        return dispatch({
          type: FETCH_USER_PRODUCTS,
          payload: products
        });
      });
  };
}

export function fetchUserProducts(user) {
  return dispatch => {
    return db
      .collectionGroup("producers")
      .where(`uid`, "==", user)
      .get()
      .then(snapshot => {
        let products = [];
        console.log(snapshot.docs);
        snapshot.forEach(doc => {
          if (doc.data().product) {
            products = [doc.data(), ...products];
          }
        });

        console.log(products);

        return dispatch({
          type: FETCH_USER_PRODUCTS,
          payload: products
        });
      });
  };
}

export function fetchTaggedProducts(tag) {
  return dispatch => {
    return db
      .collection("products")
      .where("tags", "array-contains", tag)
      .get()
      .then(snapshot => {
        const products = {};

        snapshot.forEach(doc => {
          products[doc.id] = doc.data();
        });

        return products;
      });
  };
}

export function fetchCategory(cat) {
  return dispatch => {
    return db
      .collection("products")
      .where("category", "==", cat)
      .get()
      .then(snapshot => {
        const products = {};

        snapshot.forEach(doc => {
          products[doc.id] = doc.data();
        });

        return products;
      });
  };
}

export function fetchProductProducers(product) {
  return db
    .collection("products")
    .doc(product)
    .collection("producers")
    .get()
    .then(snapshot => {
      const producers = {};

      snapshot.forEach(doc => {
        producers[doc.id] = doc.data();
      });

      return producers;
    });
}

export function fetchSingleProduct(id) {
  return db
    .collection("products")
    .doc(id)
    .get()
    .then(doc => doc.data());
}

export function fetchSingleProducerProduct(id, uid) {
  return db
    .collection("products")
    .doc(id)
    .collection("producers")
    .doc(uid)
    .get()
    .then(doc => doc.data());
}

export function createProduct(title, category, tags, photo) {
  if (photo) {
    return storage
      .ref()
      .child(`producers/${photo.name}`)
      .put(photo)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })
      .then(photoURL => {
        return db.collection("products").add({
          title: title,
          image: photoURL,
          tags: tags,
          category: category
        });
      })
      .then(doc => doc.id);
  } else {
    return db
      .collection("products")
      .add({
        title: title,
        tags: tags,
        category: category
      })
      .then(doc => doc.id);
  }
}

export function editProduct(user, id, values, image, title, unit, units) {
  console.log("user", user);
  console.log("id", id);
  const name = `${user.displayName}`;
  const { photoURL, uid } = user;
  console.log(values);
  const { description, price } = values;
  return db
    .collection("products")
    .doc(id)
    .collection("producers")
    .doc(uid)
    .set(
      {
        [name !== "" && "name"]: name,
        [photoURL !== "" && "photo"]: photoURL,
        [price !== "" && "price"]: Number(price),
        [uid !== "" && "uid"]: uid,
        [description !== "" && "description"]: description,
        image: image,
        product: id,
        title: title,
        units: units
      },
      { merge: true }
    )
    .then(() => {
      console.log(id);
      return db
        .collection("products")
        .doc(id)
        .get();
    })
    .then(product => {
      console.log(product.data());
      if (
        product.data().producers &&
        typeof product.data().producers.user === "undefined"
      ) {
        const { producers } = product.data();

        return db
          .collection("products")
          .doc(id)
          .set(
            {
              producers: { [uid]: price, ...producers }
            },
            { merge: true }
          );
      } else {
        console.log("hey");
      }
    });
}
