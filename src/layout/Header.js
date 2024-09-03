import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Nav, Navbar, NavDropdown, Row, Spinner } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import { MyUserContext } from "../App"

const Header = () => {
    const [categories, setCategories] = useState(null);
    const [kw, setKw] = useState("");
    const nav = useNavigate();
    const logout = () => {
        dispatch({
            type: "logout"
        })
    }

    const [user, dispatch] = useContext(MyUserContext);

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

    const handleCategorySelect = (id) => {
        nav(`/?cateId=${id}`);
    };

    if (categories === null)
        return <Spinner animation="grow" />;
    return (
        console.log(categories),
        <>

            <div class="shadow">
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand onClick={() => nav(`/`)} style={{
                            cursor: 'pointer'
                        }}><h2>N&N Course&#174;</h2></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link onClick={() => nav(`/`)} style={{
                                    cursor: 'pointer'
                                }}>Home</Nav.Link>
                                <NavDropdown title="Category" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => nav(`/`)} style={{
                                        cursor: 'pointer'
                                    }}>All</NavDropdown.Item>
                                    {categories.map(c =>
                                        <NavDropdown.Item
                                            key={c.id}
                                            onClick={() => handleCategorySelect(c.id)}
                                            style={{ cursor: 'pointer' }}>{c.name}
                                        </NavDropdown.Item>)}
                                </NavDropdown>
                                {user === null ? <>
                                    <Link className="nav-link text-danger" to="/login">Đăng nhập</Link>
                                    <Link className="nav-link text-danger" to="/register">Đăng kí</Link>
                                </> :
                                    <>
                                        <Link className="nav-link text-info" to="/">Chào {user.username}!</Link>
                                        <Button onClick={logout} variant="secondary">Đăng xuất</Button>
                                        <Button variant="warning" onClick={() => nav("/cart")}>Go to Cart</Button>
                                    </>}
                            </Nav>

                        </Navbar.Collapse>
                        <Form onSubmit={search} inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        value={kw}
                                        onChange={e => setKw(e.target.value)}
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