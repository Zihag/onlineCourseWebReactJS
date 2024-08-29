import { useEffect, useState, React } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import '../App.css'
import { useNavigate, useSearchParams } from "react-router-dom";


const Home = () => {
    const [courses, setCourses] = useState(null);
    const [q] = useSearchParams();
    const nav = useNavigate();

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
            <h1 className="text-center pt-5">Course List</h1>
            <div className="row"></div>
            <div className="row">
                <div className="col-2 mt-5">
                    <div className="row text-center">
                        <h4>Giá</h4>
                    </div>

                    <div className="row">
                        <div className="col text-center">
                            <button type="button" className="btn btn-info">
                            <i class=" bi bi-sort-up"> Tăng</i>
                            </button>
                        </div>
                        <div className="col text-center">
                        <button type="button" className="btn btn-info">
                            <i class=" bi bi-sort-down"> Giảm</i>
                            </button>

                        </div>
                    </div>
                    <div className="row text-center mt-5">
                        <h4>Ngày</h4>
                    </div>

                    <div className="row">
                        <div className="col text-center">
                            <button type="button" className="btn btn-info">
                            <i class=" bi bi-sort-up"> Tăng</i>
                            </button>
                        </div>
                        <div className="col text-center">
                        <button type="button" className="btn btn-info">
                            <i class=" bi bi-sort-down"> Giảm</i>
                            </button>

                        </div>
                    </div>



                </div>
                <div className=" col-9 container">
                    <Row>
                        {courses.map(c => {
                            return <Col xs={15} md={3} className="mt-5">
                                <Card key={c.id} style={{ width: '18rem', height: '35rem' }}>
                                    <Card.Img variant="top" src={c.coverImg} alt="img" style={{ height: '20rem' }} />
                                    <Card.Body>
                                        <Card.Title className="two-line-height">{c.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted"><span class="custom-subtitle shadow rounded">{c.price} {donvi}</span></Card.Subtitle>
                                        <Card.Text class="two-line-ellipsis">
                                            {c.description}
                                        </Card.Text>
                                        <Button
                                            variant="info"
                                            className="m-3 px-4 shadow"
                                            onClick={() => nav(`/courses/${c.id}`)}>Detail</Button>
                                        <Button variant="danger" className="m-3 shadow" >Purchase</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        })}
                    </Row>
                </div>

            </div>





        </>
    )
}

export default Home