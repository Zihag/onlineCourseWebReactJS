import React, { useEffect, useState } from "react";
import { Button, Card, Container, ListGroup, Modal, Row, Col, Form } from "react-bootstrap";
import { authApi, endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";

const Exercises = () => {
    const { courseId } = useParams();
    const [exercises, setExercises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");
    const [newExerciseTitle, setNewExerciseTitle] = useState("");
    const [newExerciseDescription, setNewExerciseDescription] = useState("");
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

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

    const handleViewSubmissions = (exercise) => {
        setSelectedExercise(exercise);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedExercise(null);
        setSelectedSubmission(null);
        setScore("");
        setFeedback("");
    };
    const handleShowScoreModal = (submission) => {
        setSelectedSubmission(submission);
        setShowScoreModal(true);
    };
    const handleCloseScoreModal = () => {
        setShowScoreModal(false);
        setSelectedSubmission(null);
        setScore("");
        setFeedback("");
    };

    const handleScoreSubmission = async () => {
        if (selectedSubmission) {
            try {
                const res = await authApi().put(
                    `${endpoints["score-feedback"](selectedSubmission.id)}?score=${score}&feedback=${encodeURIComponent(feedback)}`
                );
                // Reset lại exercises
                const res2 = await authApi().get(endpoints["get-exercises-by-courseId"](courseId));
                setExercises(res2.data);
                handleCloseScoreModal();
            } catch (error) {
                console.error("Error updating submission:", error);
            }
        }
    };
    

    const handleShowAddExerciseModal = () => setShowAddExerciseModal(true);
    const handleCloseAddExerciseModal =  () => {
        setShowAddExerciseModal(false);
        setNewExerciseTitle("");
        setNewExerciseDescription("");
    };

    const handleAddExercise = async () => {
        try {
            await authApi().post(endpoints["add-exercise"], {
                title: newExerciseTitle,
                description: newExerciseDescription,
                courseId: courseId
            });
            // Refresh exercises
            const res = await authApi().get(endpoints["get-exercises-by-courseId"](courseId));
            setExercises(res.data);
            handleCloseAddExerciseModal();
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Danh sách Bài Tập</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="success" onClick={handleShowAddExerciseModal}>
                        Tạo Bài Tập
                    </Button>
                </Col>
            </Row>
            <ListGroup>
                {exercises.map((exercise) => (
                    <ListGroup.Item key={exercise.id} className="mb-3">
                        <Card className="shadow-sm border-light">
                            <Card.Body>
                                <Card.Title>{exercise.title}</Card.Title>
                                <Card.Text>{exercise.description}</Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => handleViewSubmissions(exercise)}
                                >
                                    Xem Bài Làm của Học Sinh
                                </Button>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Modal for displaying submissions */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bài Làm của Học Sinh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedExercise && selectedExercise.submissionCollection.length > 0 ? (
                        <ListGroup>
                            {selectedExercise.submissionCollection.map(submission => (
                                <ListGroup.Item key={submission.id} className="mb-3">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Student ID: {submission.studentId}</Card.Title>
                                            <Card.Text>{submission.content}</Card.Text>
                                            {submission.feedback && (
                                                <Card.Text><strong>Feedback:</strong> {submission.feedback}</Card.Text>
                                            )}
                                            {submission.score !== null && (
                                                <Card.Text><strong>Score:</strong> {submission.score}</Card.Text>
                                            )}
                                            <Button
                                                variant="warning"
                                                className="mt-2"
                                                onClick={() => handleShowScoreModal(submission)}
                                            >
                                                Chấm Điểm
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No submissions available for this exercise.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Chấm điểm và phản hồi */}
            <Modal show={showScoreModal} onHide={handleCloseScoreModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chấm Điểm Bài Làm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formScore">
                            <Form.Label>Score</Form.Label>
                            <Form.Control
                                type="number"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                placeholder="Enter score"
                            />
                        </Form.Group>
                        <Form.Group controlId="formFeedback" className="mt-3">
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Enter feedback"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseScoreModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleScoreSubmission}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Thêm bài tập */}
            <Modal show={showAddExerciseModal} onHide={handleCloseAddExerciseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Bài Tập Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newExerciseTitle}
                                onChange={(e) => setNewExerciseTitle(e.target.value)}
                                placeholder="Enter title"
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newExerciseDescription}
                                onChange={(e) => setNewExerciseDescription(e.target.value)}
                                placeholder="Enter description"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddExerciseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddExercise}>
                        Add Exercise
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Exercises;
