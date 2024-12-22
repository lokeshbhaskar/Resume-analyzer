import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from '../config/slice';

const store = configureStore({
  reducer: {
    analysis: analysisReducer,
  },
});

export default store;
