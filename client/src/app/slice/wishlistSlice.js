import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState = {
  items: [],          // carIds
  loading: false,
  error: null,
  loadingIds: [],     // 👈 per car loading
};

/* ---------------- FETCH ---------------- */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/user/wishlist`, {
        withCredentials: true,
      });

      const cars = res.data.data || [];
      return cars.map((car) => car._id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

/* ---------------- ADD ---------------- */
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (carId, { rejectWithValue }) => {
    try {
      await axios.post(
        `${BASE_URL}/user/wishlist/add`,
        { carId },
        { withCredentials: true }
      );
      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

/* ---------------- REMOVE ---------------- */
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (carId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/user/wishlist/remove`, {
        data: { carId },
        withCredentials: true,
      });
      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.loadingIds = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      /* ADD */
      .addCase(addToWishlist.pending, (state, action) => {
        state.loadingIds.push(action.meta.arg);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.payload
        );
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.meta.arg
        );
      })

      /* REMOVE */
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.loadingIds.push(action.meta.arg);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.payload
        );
        state.items = state.items.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.meta.arg
        );
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
