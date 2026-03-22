import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedProductId: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        selectProduct(state, action) {
            // Can accept the whole object or just the ID
            state.selectedProductId = action.payload.id || action.payload;
        },
        closeOverlay(state) {
            state.selectedProductId = null;
        },
    },
});

export const { selectProduct, closeOverlay } = productSlice.actions;
export default productSlice.reducer;
