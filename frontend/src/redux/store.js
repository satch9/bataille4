import { combineReducers, configureStore } from '@reduxjs/toolkit';
import gameReducer from './reducers/gameReducer'

const rootReducer = combineReducers({
  game: gameReducer,
})

const store = configureStore({
    reducer: rootReducer,
})

export default store