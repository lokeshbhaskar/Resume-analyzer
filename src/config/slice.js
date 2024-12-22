import { createSlice } from '@reduxjs/toolkit';

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    result: '',
  },
  reducers: {
    setAnalyzedResult: (state, action) => {
      state.result = action.payload;
    },
  },
});

export const { setAnalyzedResult } = analysisSlice.actions;
export default analysisSlice.reducer;
