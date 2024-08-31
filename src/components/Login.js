import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import cookie from 'react-cookies';
import APIs, { authApi, endpoints } from "../configs/Apis";
import {MyUserContext } from "../App";
import { Navigate } from "react-router-dom";



const Login = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    // const nav = useNavigate();

    const login = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let res = await APIs.post(endpoints['login'], {
                    "username": username,
                    "password": password
                });

                cookie.save("token", res.data);
                console.log(cookie.load("token"));

                let user = await authApi().get(endpoints["current-user"]);
                cookie.save("user", user.data);
                console.log(user.data);

                dispatch({
                    "type": "login",
                    "payload": user.data
                });
            } catch (ex) {
                console.error(ex)
            }
        }

        process();
    }
    if (user !== null)
        return <Navigate to="/" />

    return (
        <Container>
            <h1 className="text-center text-info mt-1">USER LOGIN</h1>
            <Form method="post" onSubmit={login}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        value={username} onChange={e => setUsername(e.target.value)}
                        type="text"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password} onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                    <Button variant="success" type="submit">Login</Button>
                </Form.Group>
            </Form>
        </Container>
    );
}

export default Login;
