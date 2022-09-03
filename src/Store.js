import { createContext, useReducer } from "react";


export const Store = createContext();

// Initial state
const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
    cart: {
        shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): [],
    },
};

// reducer
function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            const newItem = action.payload;
            // check if the new wanting add already exist
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cart.cartItems, newItem];
            // save cartItems in local storage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
            
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };
        }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: [],
                    shippingAddress: {},
                    // paymentMethod: '',
                },
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload,
                },
            };
        default:
            return state;
    }
}

// storeProvider serves as a wrapper for our react application and also to parse|passed global props to children
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch }; // contains the current and dispatch fnx to update that state
    return <Store.Provider value={value}>{props.children} </Store.Provider>
}