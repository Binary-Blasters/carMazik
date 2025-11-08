import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth.slice";
import profileReducer from "../slice/profile.slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
    }
})

export default store;