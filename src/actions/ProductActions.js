import { db } from '../firebase.js';

export const FETCH_ALL_PRODUCTS = 'fetch_all_products';
export const FETCH_USER_PRODUCTS = 'fetch_user_products';
export const FETCH_TAGGED_PRODUCTS = 'fetch_tagged_products';
export const FETCH_CATEGORY = 'fetch_category';

export function fetchAllProducts() {
  return db.collection('products').get()
  .then(snapshot => {

    const products = {};

    snapshot.forEach((doc) => {
      products[doc.id] = doc.data();
    })

     return products;
  })
}

export function fetchUserProducts(user) {
  console.log('user', user)
  return dispatch => {
    return db.collection('products').where(`producers.${user}.price`, '>', 0).get()
    .then(snapshot => {
      console.log(snapshot)

      const products = {};

      snapshot.forEach((doc) => {
        products[doc.id] = doc.data();
      })

       return dispatch({
        type: FETCH_USER_PRODUCTS,
        payload: products
      })
    })
  }
}

export function fetchTaggedProducts(tag) {
  return dispatch => {
    return db.collection('products')
    .where('tags', 'array-contains', tag).get()
    .then(snapshot => {

      const products = {};

      snapshot.forEach((doc) => {
        products[doc.id] = doc.data();
      })

       return products;
    })
  }
}

export function fetchCategory(cat) {
  return dispatch => {
    return db.collection('products')
    .where('category', '==', cat).get()
    .then(snapshot => {

      const products = {};

      snapshot.forEach((doc) => {
        products[doc.id] = doc.data();
      })

       return products;
    })
  }
}

export function fetchProductProducers(product){
  return db.collection('products').doc(product).collection('producers').get()
  .then(snapshot => {
    const producers = {};

    snapshot.forEach((doc) => {
      producers[doc.id] = doc.data();
    })

     return producers;
  })
}

export function fetchSingleProduct(id) {
  return db.collection('products').doc(id).get()
  .then(doc => doc.data());
}

export function editProduct(user, id, values){
  console.log('user', user)
  console.log('id', id)
  const name = `${user.name.first} ${user.name.last}`
  console.log('name', name)
  const { photo,  uid} = user

  const { description, price } = values;
  return db.collection('products').doc(id).collection('producers').doc(uid).set({
    [(name !== '') && 'name']: name,
    [(photo !== '') && 'photo']: photo,
    [(price !== '') && 'price']: price,
    [(description !== '') && 'description']: description,
  },{ merge: true })
}
