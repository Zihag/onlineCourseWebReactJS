import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { MyUserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user] = useContext(MyUserContext);
    const [courses, setCourses] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const loadCoursesByUser = async () => {
            try {
                let url = endpoints['enrolled-courses'](user.id);
                let response = await authApi().get(url);
                setCourses(response.data);
            } catch (ex) {
                console.error("Failed to fetch courses:", ex);
            }
        };

        if (user && user.id) {
            loadCoursesByUser();
        }
    }, [user]);

    if (user === null) {
        return <h1>Bạn đã đăng xuất</h1>;
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col md={4}>
                    <Card>
                        <Card.Header as="h5">Thông Tin Người Dùng</Card.Header>
                        <Card.Body>
                            <Card.Title>Username: {user.username}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Fullname: {user.fullName}</Card.Subtitle>
                            <Card.Text>
                                <strong>Phone: {user.phone}</strong>
                                <br />
                                <strong>Email: {user.email}</strong>
                                <br />
                                {user.role === "ROLE_ADMIN" ? (
                                    <p className="text-success">Bạn là quản trị viên</p>
                                ) : user.role === "ROLE_STUDENT" ? (
                                    <p className="text-success">Bạn là học sinh</p>
                                ) : (
                                    <p className="text-success">Bạn là giáo viên</p>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">Khóa Học Đã Đăng Ký</Card.Header>
                        <Card.Body>
                            <ListGroup>
                                {courses.length > 0 ? (
                                    courses.map((c) => (
                                        <ListGroup.Item key={c.id}>
                                            <img
                                                src={c.coverImg}
                                                alt={c.title}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                            />
                                            {c.title}
                                            <Button variant="success"
                                                className="m-3 px-4 shadow"
                                                onClick={() => nav(`/courses/${c.id}`)}>Join</Button>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>Không có khóa học nào.</ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
