import { db } from '../firebase'

export const FETCH_TRANSACTIONS = 'fetch_transactions'

export function fetchTransactions(producer) {
  return dispatch => {
    return db.collection('transactions').where(`producers.${producer}`, '==', true).get()
    .then(snapshot => {

      let transactions = []

      snapshot.docs.map((doc, index) => {
        return transactions[index] = doc.data()
      })

      return dispatch({
        type: FETCH_TRANSACTIONS,
        payload: transactions
      })
    })
  }
}

export function fetchEachTransaction(producer) {
  return dispatch => {
    return db.collection('transactions').where(`producers.${producer}`, '==', true).get()
    .then(snapshot => {

      let transactions = [];
      let index = 0;
      snapshot.docs.map(doc => {
        const { created_at, items } = doc.data()

        return Object.keys(items).map(item => {
          const itemProducer = items[item].producer;
          index ++;

          if(itemProducer === producer){
            return transactions[index] = { created_at: created_at, ...items[item]};
          }
        })
      })

      return transactions
    })
  }
}
