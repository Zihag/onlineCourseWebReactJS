import { useEffect, useState, React, useContext } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import '../App.css';
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { MyUserContext } from "../App";

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState({});
    const [q, setQ] = useSearchParams();
    const nav = useNavigate();
    const donvi = "vnD";
    const [sortBy, setSortBy] = useState('price'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
    const { addToCart } = useContext(CartContext);
    const [user, dispatch] = useContext(MyUserContext);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                let e = endpoints['courses'];

                // Search, filter, and sort
                let kw = q.get("kw");
                if (kw !== null)
                    e += `${e.includes('?') ? '&' : '?'}kw=${kw}`;

                let cateId = q.get("cateId");
                if (cateId !== null)
                    e += `${e.includes('?') ? '&' : '?'}cateId=${cateId}`;

                let fromPrice = q.get("fromPrice");
                if (fromPrice !== null)
                    e += `${e.includes('?') ? '&' : '?'}fromPrice=${fromPrice}`;

                let toPrice = q.get("toPrice");
                if (toPrice !== null)
                    e += `${e.includes('?') ? '&' : '?'}toPrice=${toPrice}`;

                e += `${e.includes('?') ? '&' : '?'}sortBy=${sortBy}&sortOrder=${sortOrder}`;

                let res = await Apis.get(e);
                setCourses(res.data);

                // Check enrollment status
                if (user?.id) {
                    const enrollmentRequests = res.data.map(course =>
                        Apis.get(endpoints['enroll-check'](user.id, course.id)));
                    const enrollmentResponses = await Promise.all(enrollmentRequests);
                    const enrollmentStatus = {};
                    enrollmentResponses.forEach((response, index) => {
                        enrollmentStatus[res.data[index].id] = response.data;
                    });
                    setEnrollments(enrollmentStatus);
                }
            } catch (ex) {
                console.error(ex);
            }
        }
        loadCourses();
    }, [q, sortBy, sortOrder, user]);

    const handleSort = (field, order) => {
        setSortBy(field);
        setSortOrder(order);
        setQ(prevParams => {
            const newParams = new URLSearchParams(prevParams.toString());
            newParams.set('sortBy', field);
            newParams.set('sortOrder', order);
            return newParams;
        });
    };

    if (courses.length === 0) return <Spinner animation="grow" />;

    return (
        <>
            <div className="mt-5">
                <h1 className="text-center pt-5">Course List</h1>
                <div className="row"></div>
                <div className="row">
                    <div className="col-2 mt-5">
                        <div className="row text-center">
                            <h4>Price</h4>
                        </div>
                        <div className="row">
                            <div className="col text-center">
                                <button type="button" className="btn btn-info"
                                    onClick={() => handleSort('price', 'asc')}>
                                    <i className="bi bi-sort-up"> Sort up</i>
                                </button>
                            </div>
                            <div className="col text-center">
                                <button type="button" className="btn btn-info"
                                    onClick={() => handleSort('price', 'desc')}>
                                    <i className="bi bi-sort-down"> Sort down</i>
                                </button>
                            </div>
                        </div>
                        <div className="row text-center mt-5">
                            <h4>Date</h4>
                        </div>
                        <div className="row">
                            <div className="col text-center">
                                <button type="button" className="btn btn-info">
                                    <i className="bi bi-sort-up"> Sort up</i>
                                </button>
                            </div>
                            <div className="col text-center">
                                <button type="button" className="btn btn-info">
                                    <i className="bi bi-sort-down"> Sort down</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 container">
                        <Row>
                            {courses.map(course => (
                                <Col xs={15} md={3} className="mt-5" key={course.id}>
                                    <Card style={{ width: '18rem', height: '35rem', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            borderRadius: '8px',
                                            padding: '5px 10px',
                                            zIndex: '1'
                                        }}>
                                            <span style={{ fontWeight: 'bold' }}>Professor: {course.teacher.fullName}</span>
                                        </div>
                                        <Card.Img variant="top" src={course.coverImg} alt="img" style={{ height: '20rem' }} />
                                        <Card.Body>
                                            <Card.Title className="two-line-height">{course.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                <span className="custom-subtitle shadow rounded">{course.price} {donvi}</span>
                                            </Card.Subtitle>
                                            <Card.Text className="two-line-ellipsis">
                                                {course.description}
                                            </Card.Text>
                                            {enrollments[course.id] ? (
                                                <div>
                                                    <Button variant="success"
                                                        className="m-3 px-4 shadow"
                                                        onClick={() => nav(`/courses/${course.id}`)}>Join</Button>
                                                </div>

                                            ) : (
                                                <div>
                                                    <Button
                                                        variant="info"
                                                        className="m-3 px-4 shadow"
                                                        onClick={() => nav(`/courses/${course.id}`)}>Detail</Button>
                                                    <Button variant="danger" onClick={() => addToCart(course)}>
                                                        Add to Cart
                                                    </Button>
                                                </div>

                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
