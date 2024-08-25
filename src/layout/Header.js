import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Nav, Navbar, NavDropdown, Row, Spinner } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [categories, setCategories] = useState(null);
    const [kw, setKw] = useState("");
    const nav = useNavigate();

    const loadCates = async () => {
        let res = await Apis.get(endpoints['categories'])
        setCategories(res.data);
    }

    useEffect(() => {
        loadCates();
    }, []);

    const search = (evt) => {
        evt.preventDefault();
        nav(`/?kw=${kw}`)
    }

    if (categories === null)
        return <Spinner animation="grow" />;
    return (
        console.log(categories),
        <>

            <div class="shadow">
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#home"><h2>Online Course</h2></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#home">Home</Nav.Link>
                                <NavDropdown title="Category" id="basic-nav-dropdown">
                                    {categories.map(c => <NavDropdown.Item href="#action/3.1" key={c.id}>{c.name}</NavDropdown.Item>)}
                                </NavDropdown>
                                <Link className="nav-link text-danger" to={"/login"}>Login</Link>

                            </Nav>
                            
                        </Navbar.Collapse>
                        <Form onSubmit={search} inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        value={kw}
                                        onChange={e=>setKw(e.target.value)}
                                        placeholder="Search"
                                        name="kw"
                                        className=" mr-sm-2"
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit">Submit</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </Navbar>
            </div>
        </>)

}
export default Header;