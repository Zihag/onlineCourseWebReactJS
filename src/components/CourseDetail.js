import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Apis, { endpoints } from '../configs/Apis';
import { Button, Card, Container, Spinner } from 'react-bootstrap';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const donvi ='vnD'


    useEffect(() => {
        const loadCourse = async () => {
            try {
                let { data } = await Apis.get(endpoints['detail'](courseId));
                setCourse(data)
            } catch (ex) {
                console.error(ex);
            }
        }
        loadCourse();
    }, []);

    if (!course)
        return < Spinner animation="grow" />;

    return (
        <div className='container'>
            <div className='row'>
                <div className='col col-lg-5 text-center' style={{ flexBasis: '40%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={course.coverImg} alt={course.title} style={{ width: '100%', borderRadius: '15px' }}/>
                    <h2 className='mt-3' style={{ color: '#f5896b' }}>{course.price} {donvi}</h2>
                    <Button variant="info" className="m-3 shadow">Mua khóa học</Button>
                </div>
                <div className='col' style={{ flexBasis: '40%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <h2><b>{course.title}</b></h2>
                    <h4 className='mt-3'>{course.description}</h4>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
