import { combineReducers } from 'redux'
import ProductReducer from './ProductReducer'
import UIReducer from './UIReducer'
import UserReducer from './UserReducer'
import TransactionReducer from './TransactionReducer'

const rootReducer = combineReducers({
  ui: UIReducer,
  user: UserReducer,
  products: ProductReducer,
  transactions: TransactionReducer
})

export default rootReducer
