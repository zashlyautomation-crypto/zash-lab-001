import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [
        { id: 1, name: 'Aurora Silver Reflective Puffer', price: 999.99, colors: ['white', 'blue'], image: '/images/product1.png' },
        { id: 2, name: 'Direct Silver High-Gloss Puffer', price: 1299.99, colors: ['silver'], image: '/images/product2.png' },
        { id: 3, name: 'Stealth Black Heavy Puffer', price: 1199.99, colors: ['black', 'white'], image: '/images/product3.png' },
        { id: 4, name: 'Glacier White Insulated', price: 1299.99, colors: ['grey', 'white'], image: '/images/product4.png' },
        { id: 5, name: 'Polar Blue Gloss', price: 899.99, colors: ['blue', 'gloss'], image: '/images/product5.png' },
        { id: 6, name: 'Stealth Navy Heavy', price: 1199.99, colors: ['navy', 'black'], image: '/images/product6.png' },
    ],
    activeFilter: 'All', // 'All', 'Color', 'Price', 'Collection', 'Newest'
};

const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        setFilter(state, action) {
            state.activeFilter = action.payload;
        },
    },
});

export const { setFilter } = catalogSlice.actions;
export default catalogSlice.reducer;
