import { db } from '../firebase'

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

export function fetchUserProducts(user){
  return dispatch => {
    return db.collectionGroup('producers').where(`uid`, '==', user).get()
    .then(snapshot => {
      console.log(snapshot)

      let products = [];

      snapshot.forEach((doc) => {
        if(doc.data().price){
          products = [doc.data(), ...products]
        }
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

export function editProduct(user, id, values, image, title){
  const name = `${user.displayName}`
  const { photoURL,  uid} = user
  console.log(values)
  const { description, price } = values;
  return db.collection('products').doc(id).collection('producers').doc(uid).set({
    [(name !== '') && 'name']: name,
    [(photoURL !== '') && 'photo']: photoURL,
    [(price !== '') && 'price']: Number(price),
    [(uid) !== '' && 'uid']: uid,
    [(description !== '') && 'description']: description,
    image: image,
    product: id,
    title: title
  },{ merge: true })
  .then(() => {
    return db.collection('products').doc(id).get()
  })
  .then(product => {
    if(product.data().producers && typeof product.data().producers.user === 'undefined'){
      const { producers } = product.data()

      return db.collection('products').doc(id).set({
        producers: { [uid]: price, ...producers }
      }, { merge: true } )
    }
  })
}
