import {createStore,applyMiddleware} from 'redux'
import rootReducer from './reducers'
 import thunk from 'redux-thunk'

const rootStore = createStore(rootReducer,applyMiddleware(thunk))

export default rootStore