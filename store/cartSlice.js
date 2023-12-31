import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  refAmount: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addState(state, action) {
      state.cart = action.payload;
    },
    addItem(state, action) {
      const item = action.payload;
      const existingItem = state.cart.find((el) => el.id === item.id);
      if (!existingItem) {
        state.cart.push({ ...item });
      }
      //   else {
      //     existingItem.quantity++;
      //   }
    },
    removeItem(state, action) {
      const itemRemove = action.payload;
      state.cart = state.cart.filter((item) => item.id !== itemRemove.id);
    },
    increaseItem(state, action) {
      const existingItem = state.cart.find((el) => el.id === action.payload.id);
      existingItem.quantity = action.payload.quantity + 1;
    },
    decreaseItem(state, action) {
      const existingItem = state.cart.find((el) => el.id === action.payload.id);
      existingItem.quantity = action.payload.quantity - 1;
      if (existingItem.quantity === 0) {
        state.cart = state.cart.filter((item) => item.id !== existingItem.id);
      }
    },
    refAmountController(state, action) {
      state.refAmount = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
