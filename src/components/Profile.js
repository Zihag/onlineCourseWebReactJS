import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { MyUserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis";

const Profile = () => {
    const [user] = useContext(MyUserContext);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const loadCoursesByUser = async () => {
            try {
                let url = endpoints['enrolled-courses'](user.id);
                let response = await Apis.get(url);
                setCourses(response.data);
            } catch (ex) {
                console.error("Failed to fetch courses:", ex);
            }
        };

        if (user && user.id) {
            loadCoursesByUser();
        }
    }, [user]);

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
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">Khóa Học Đã Đăng Ký</Card.Header>
                        <Card.Body>
                            <ListGroup>
                                {courses && courses.length > 0 ? (
                                    courses.map((c) => (
                                        <ListGroup.Item key={c.id}>
                                            <img src={c.coverImg} 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                            />
                                            {c.title}
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
