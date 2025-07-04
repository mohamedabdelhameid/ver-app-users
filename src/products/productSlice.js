import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_BACKEND_URL from "../API/config";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    // const response = await axios.get("http://localhost:8000/api/mobiles");
    const response = await axios.get(`${BASE_BACKEND_URL}/mobiles`);
    return response.data.data || [];
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
