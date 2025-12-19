import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  items: [],        // wishlist cars (array of car objects)
  loading: false,
  error: null,
};

/* =========================
   ASYNC THUNKS
========================= */

// 1️⃣ GET wishlist (GET /wishlist)
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // backend response: ApiResponse -> data = cars array
      return res.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// 2️⃣ ADD to wishlist (POST /wishlist/add)
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (carId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      await axios.post(
        "/wishlist/add",
        { carId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

// 3️⃣ REMOVE from wishlist (DELETE /wishlist/remove)
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (carId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      await axios.delete("/wishlist/remove", {
        data: { carId }, // DELETE body goes inside `data`
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return carId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

/* =========================
   SLICE
========================= */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---- FETCH ---- */
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- ADD ---- */
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Optimistic add: backend already saved
        // Car object will be refetched later if needed
        state.items.push({ _id: action.payload });
      })

      /* ---- REMOVE ---- */
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (car) => (car._id || car.id) !== action.payload
        );
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
