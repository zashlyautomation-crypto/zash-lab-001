import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        openCart(state) {
            state.isOpen = true;
        },
        closeCart(state) {
            state.isOpen = false;
        },
        toggleCart(state) {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { openCart, closeCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
