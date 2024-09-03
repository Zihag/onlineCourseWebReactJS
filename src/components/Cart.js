// src/components/Cart.js
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { Button, Table, Container, Alert, Spinner } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../App";

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [user, dispatch] = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const nav = useNavigate();

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        const enrollmentRequest = {
            userId: user.id, // Giả sử user có trường id
            courseIds: cart.map(course => course.id)
        };

        try {
            setLoading(true);
            const res = await authApi().post(endpoints['enroll-multiple'], enrollmentRequest);
            if (res.status === 200) {
                setMessage({ type: 'success', text: 'Thanh toán thành công!' });
                clearCart();
            } else {
                setMessage({ type: 'danger', text: 'Thanh toán thất bại!' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'danger', text: 'Bạn đã tham gia một hoặc các khoá học này rồi!' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Bạn cần đăng nhập để xem giỏ hàng. <Button variant="link" onClick={() => nav("/login")}>Đăng nhập</Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2>Giỏ Hàng</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            {cart.length === 0 ? (
                <Alert variant="info">Giỏ hàng của bạn đang trống.</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ảnh</th>
                                <th>Tên Khóa Học</th>
                                <th>Giá</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((course, index) => (
                                <tr key={course.id}>
                                    <td>{index + 1}</td>
                                    <td><img src={course.coverImg} alt={course.title} style={{ width: '100px' }} /></td>
                                    <td>{course.title}</td>
                                    <td>{course.price} vnD</td>
                                    <td>
                                        <Button variant="danger" onClick={() => removeFromCart(course.id)}>Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <h4>Tổng cộng: {cart.reduce((total, course) => total + course.price, 0)} vnD</h4>
                    <Button variant="success" onClick={handleCheckout} disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Thanh Toán'}
                    </Button>
                </>
            )}
        </Container>
    );
};

export default Cart;

