import { useParams } from "react-router-dom";
import { authApi, endpoints } from "../configs/Apis";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../App";
import { Button, Modal, Form, Alert, Card, Container, Row, Col } from "react-bootstrap";

const DoExercise = () => {
    const { courseId } = useParams();
    const [exercises, setExercises] = useState([]);
    const [submissionContent, setSubmissionContent] = useState(""); // Nội dung bài nộp
    const [user] = useContext(MyUserContext);
    const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị của Modal
    const [selectedExerciseId, setSelectedExerciseId] = useState(null); // Lưu trữ exerciseId khi học sinh làm bài
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        const loadExercises = async () => {
            try {
                const res = await authApi().get(endpoints["get-exercises-by-courseId"](courseId));
                setExercises(res.data);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        };

        loadExercises();
    }, [courseId]);

    const openModal = (exerciseId) => { //mở modal
        setSelectedExerciseId(exerciseId);
        setShowModal(true);
    };

    const closeModal = () => { //đóng modal
        setShowModal(false);
        setSubmissionContent("");
        setSelectedExerciseId(null);
    };

    const submitExercise = async () => { //làm bài
        try {
            const submission = {
                content: submissionContent,
                studentId: user.id,
            };
            await authApi().post(endpoints["submit-exercise"](selectedExerciseId), submission);
            setAlertMessage("Thêm bài làm thành công!!!");
            closeModal();
        } catch (error) {
            console.error(error);
            setAlertMessage("Có thể bạn đã làm bài rồi ^^");
        }
    };

    return (
        <>
            <Container className="mt-5">
                <h1 className="text-center mb-4">Exercise List for this course</h1>

                {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

                <Row>
                    {exercises.map((ex) => (
                        <Col key={ex.id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{ex.title}</Card.Title>
                                    <Card.Text>{ex.description}</Card.Text>
                                    <Button variant="primary" onClick={() => openModal(ex.id)}>
                                        Do Exercise
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Modal cho học sinh làm bài tập */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Exercise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Write your submission</Form.Label>
                            <Form.Control as="textarea" rows={4} 
                            value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="primary" onClick={submitExercise}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DoExercise;
