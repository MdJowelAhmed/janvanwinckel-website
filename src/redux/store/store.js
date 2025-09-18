import { configureStore } from "@reduxjs/toolkit";
import { api } from "../baseUrl/baseUrl";


const store = configureStore({ // Create the store
    reducer: {
        [api.reducerPath]: api.reducer, // Add the reducer
    },
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(api.middleware), // Add the middleware
});

export default store; // Export the store