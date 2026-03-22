import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from './catalogSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
    reducer: {
        catalog: catalogReducer,
        product: productReducer,
        cart: cartReducer,
    },
});
