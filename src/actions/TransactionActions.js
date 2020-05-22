import { db } from "../firebase";

export const FETCH_TRANSACTIONS = "fetch_transactions";

export function fetchTransactionsAdmin() {
  return dispatch => {
    return db
      .collection("transactions")
      .orderBy(`created_at`, "desc")
      .get()
      .then(snapshot => {
        let transactions = [];

        snapshot.docs.map(doc => transactions.push(doc.data()));

        return dispatch({
          type: FETCH_TRANSACTIONS,
          payload: transactions
        });
      });
  };
}

export function fetchTransactions(producer) {
  return dispatch => {
    return db
      .collection("transactions")
      .where(`producers.${producer}`, "==", true)
      .get()
      .then(snapshot => {
        let transactions = [];

        snapshot.forEach(doc => {
          const order = doc.data();
          transactions.push(order);
        });

        return dispatch({
          type: FETCH_TRANSACTIONS,
          payload: transactions
        });
      });
  };
}

export function fetchUserProducerTransaction(user, producer) {
  return db
    .collection("transactions")
    .where(`producers.${producer}`, "==", true)
    .where(`user.uid`, "==", user)
    .get()
    .then(snapshot => {
      let compiledItems = [];

      snapshot.docs.map(doc => {
        const { items } = doc.data();
        return Object.values(items).map(item => {
          if (item.producer === producer) {
            return compiledItems.push(item);
          } else {
            return false;
          }
        });
      });

      return compiledItems;
    });
}

export function fetchSingleTransaction(id) {
  return db
    .collection("transactions")
    .doc(id)
    .get()
    .then(doc => {
      console.log(doc.data());
      return doc.data();
    });
}

export function fetchEachTransaction(producer) {
  return dispatch => {
    return db
      .collection("transactions")
      .where(`producers.${producer}`, "==", true)
      .get()
      .then(snapshot => {
        let transactions = [];
        let index = 0;
        snapshot.docs.map(doc => {
          const { created_at, items } = doc.data();

          return Object.keys(items).map(item => {
            const itemProducer = items[item].producer;
            index++;

            if (itemProducer === producer) {
              return (transactions[index] = {
                created_at: created_at,
                ...items[item]
              });
            } else {
              return false;
            }
          });
        });

        return transactions;
      });
  };
}
