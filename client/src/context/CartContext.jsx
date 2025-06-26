// client/src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM': {
            const newItem = action.payload;
            const existItem = state.cartItems.find((item) => item._id === newItem._id);
            const cartItems = existItem
                ? state.cartItems.map((item) =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cartItems, newItem];
            return { ...state, cartItems };
        }
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            return { ...state, cartItems };
        }
        case 'CART_CLEAR': {
            return { ...state, cartItems: [] };
        }
        default:
            return state;
    }
}

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    const addToCart = (product, quantity) => {
        const existItem = state.cartItems.find((item) => item._id === product._id);
        const qty = existItem ? existItem.qty + quantity : quantity;

        if (product.stockQuantity < qty) {
            alert('Xin lỗi, sản phẩm không đủ số lượng trong kho.');
            return;
        }

        dispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, qty },
        });
    };

    const removeFromCart = (product) => {
        dispatch({
            type: 'CART_REMOVE_ITEM',
            payload: product,
        });
    };

    const value = {
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};