// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import dataReducer from './dataSlice';
import optionChainReducer from './optionData';
import tcaReducer from './tcaSlice';



export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    data: dataReducer,
    optionChain: optionChainReducer,
    tca: tcaReducer,
  },
});

export default store;
