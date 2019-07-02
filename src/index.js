import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { StripeProvider, Elements } from 'react-stripe-elements'
import { Provider } from 'react-redux'
import { AppProvider } from '@shopify/polaris'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom'

const searchClient = algoliasearch(
  'VLXSKNYQRF',
  '88d8816875da387bcb87952abcdc719f'
);

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk)
  )
)

ReactDOM.render(
  <Provider store={store}>
    <StripeProvider apiKey="pk_test_cYlKdbvRzgYVBKgtXVlg4UPE">
      <Elements>
      <AppProvider>
      <InstantSearch
        indexName="products"
        searchClient={searchClient}
      >
        <Router>
          <App />
        </Router>
      </InstantSearch>
      </AppProvider>
      </Elements>
    </StripeProvider>
  </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
