import { Alert, Button, Container, Form } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { useState } from "react";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullname] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState(null);

    const [message, setMessage] = useState(null);
    const [variant, setVariant] = useState("success");

    const registerSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!");
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("fullName", fullName);
        formData.append("gender", gender);
        formData.append("dob", dob);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("avatar", avatar);
        try {
            const response = await Apis.post(endpoints["register"], formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("User registered successfully:", response.data);
            setMessage("Success! Now you can login to learn something new! ^^");
            setVariant("success");
        } catch (error) {
            console.error("There was an error registering the user:", error);
            setMessage("Error registering!!!");
            setVariant("danger");
        }
    }

    return (
        <>
            <Container>
                <h1 className="text-center text-info mt-1">USER REGISTER</h1>

                {message && <Alert variant={variant}>{message}</Alert>} {/*Thong bao */}

                <Form method="post" onSubmit={registerSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Fullname</Form.Label>
                        <Form.Control value={fullName} onChange={(e) => setFullname(e.target.value)} type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>DOB</Form.Label>
                        <Form.Control value={dob} onChange={(e) => setDob(e.target.value)} type="date" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control value={gender} onChange={(e) => setGender(e.target.value)} type="text" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formImageUpload">
                        <Form.Label>Upload Avatar</Form.Label>
                        <Form.Control type="file" onChange={(e) => setAvatar(e.target.files[0])} accept="image/*" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
                        <Button variant="success" type="submit">Register</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
};

export default Register;