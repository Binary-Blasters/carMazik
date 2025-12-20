import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth.slice";
import profileReducer from "../slice/profile.slice";
import wishlistReducer from "../slice/wishlistSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        wishlist: wishlistReducer,
    }
})

export default store;