import { useEffect, useState, React } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import '../App.css'
import { useSearchParams } from "react-router-dom";

const Home = () => {
    const [courses, setCourses] = useState(null);
    const [q] = useSearchParams();

    const donvi = "vnD";
    useEffect(() => {
        const loadCourses = async () => {
            try {
                let e = endpoints['courses'];
                
                let kw = q.get("kw");
                if (kw !== null)
                    e = `${e}?kw=${kw}`;
                
                let res = await Apis.get(e);
                console.log("API Response:", res.data);
                setCourses(res.data);

            } catch (ex) {
                console.error(ex)
            }
        }
        loadCourses();
    }, [q]);

    if (courses === null)
        
        return < Spinner animation="grow" />;
                
            
    return (
        <>
            <Container>
                <h1 className="text-center pt-5">Course List</h1>
                <Row>
                    {courses.map(c => {
                        return <Col xs={15} md={3} className="mt-5">
                            <Card key={c.id} style={{ width: '18rem', height:'35rem'}}>
                                <Card.Img variant="top" src={c.coverImg} alt="img" style={{ height:'20rem'}}/>
                                <Card.Body>
                                    <Card.Title className="two-line-height">{c.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted"><span class="custom-subtitle shadow rounded">{c.price} {donvi}</span></Card.Subtitle>
                                    <Card.Text class="two-line-ellipsis">
                                        {c.description}
                                    </Card.Text>
                                    <Button variant="info" className="m-3 px-4 shadow" >Detail</Button>
                                    <Button variant="danger" className="m-3 shadow" >Purchase</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    })}
                </Row>
            </Container>




        </>
    )
}

export default Home