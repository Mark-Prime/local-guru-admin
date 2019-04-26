import { combineReducers } from 'redux'
import ProductReducer from './ProductReducer'
import UIReducer from './UIReducer'
import UserReducer from './UserReducer'

const rootReducer = combineReducers({
  ui: UIReducer,
  user: UserReducer,
  products: ProductReducer
})

export default rootReducer
