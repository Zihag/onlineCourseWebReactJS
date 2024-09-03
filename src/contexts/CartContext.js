import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (course) => {
        setCart((prevCart) => {
            const exists = prevCart.find(item => item.id === course.id);
            if (exists) {
                alert('Khóa học đã có trong giỏ hàng!');
                return prevCart;
            }
            return [...prevCart, course];
        });
        alert(`${course.title} đã được thêm vào giỏ hàng!`);
    };

    const removeFromCart = (courseId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== courseId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
