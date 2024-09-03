import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useReducer, useState } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import CourseDetail from "./components/CourseDetail";
import cookie from "react-cookies"
import Cart from "./components/Cart";
import { CartProvider } from './contexts/CartContext';

export const MyUserContext = createContext();
// export const CartContext = createContext();


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null); //check

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </MyUserContext.Provider>
  )
}

export default App;
