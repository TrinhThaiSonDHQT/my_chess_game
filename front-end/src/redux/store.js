import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './authSlice';
import gameReducer from './gameSlice';

const persistConfig = {
  key: 'root',
  storage,
};
const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export let persistor = persistStore(store);
