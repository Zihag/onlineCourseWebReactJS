import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"

const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const login = (evt) => {
        evt.preventDefault(); //chặn xử lý mặc định lần đầu

        const process =  async() => {

        }

        process();
    }
    return <><h1 className="text-center">Login</h1>
        <Container>
            <Form onSubmit={login}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Username</Form.Label>
                    <Form.Control value={username} onChange={e => setUsername(e.target.value)} type="email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Button variant="info" type="submit">Login</Button>
                </Form.Group>
            </Form>
        </Container>

    </>
}

export default Login