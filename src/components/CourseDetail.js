import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Apis, { endpoints } from '../configs/Apis';
import { Button, Card, Collapse, Container, Spinner } from 'react-bootstrap';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const donvi = 'vnD'
    const [openLectures, setOpenLectures] = useState({});
    const [openDocuments, setOpenDocuments] = useState({});


    //Theo dõi trạng thái đóng mở lecture
    const toggleLecture = (id) => {
        setOpenLectures(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Chuyển đổi trạng thái mở/đóng cho lecture có id tương ứng
        }));
    };
    const toggleDocument = (id) => {
        setOpenDocuments(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Chuyển đổi trạng thái mở/đóng cho lecture có id tương ứng
        }));
    };

    //Nhúng video
    const YouTubeVideo = ({ videoUrl, width = '560', height = '315' }) => {
        // Chuyển đổi URL thông thường thành URL nhúng
        const embedUrl = videoUrl.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/');
        return (
            <div>
                <iframe
                    width={width}
                    height={height}
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }
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
    }, [courseId]);


    if (!course)
        return < Spinner animation="grow" />;


    return (
        <div className='container'>
            <div className='row'>
                <div className='col col-lg-5 text-center' style={{ flexBasis: '40%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={course.coverImg} alt={course.title} style={{ width: '100%', borderRadius: '15px' }} />
                    <h2 className='mt-3' style={{ color: '#f5896b' }}>{course.price} {donvi}</h2>
                    <Button variant="info" className="m-3 shadow">Mua khóa học</Button>
                </div>
                <div className='col' style={{ flexBasis: '40%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <h2><b>{course.title}</b></h2>
                    <h6 className='mt-3'>{course.description}</h6>
                    <ul className='mt-3'>
                        {course.lectures.map((lecture, index) => (
                            <li key={lecture.id} onClick={() => toggleLecture(lecture.id)}
                                aria-controls={`collapse-${lecture.id}`}
                                aria-expanded={openLectures[lecture.id]}
                                style={{
                                    cursor: 'pointer', listStyleType: 'none',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    marginBottom: '5px',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'} // Màu nền khi hover
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            >
                                <h6>{index + 1}. {lecture.title}</h6>

                                <Collapse in={openLectures[lecture.id]}>
                                    <div id={`collapse-${lecture.id}`}>
                                        <p>{lecture.content}</p>
                                        Xem bài giảng
                                        <YouTubeVideo videoUrl={lecture.url} />
                                    </div>
                                </Collapse>
                            </li>
                        ))}
                    </ul>
                    <h6>Document</h6>
                    <ul className='mt-3'>
                        {course.documents.map((document, index) => (
                            <li key={document.id} onClick={() => toggleDocument(document.id)}
                                aria-controls={`collapse-${document.id}`}
                                aria-expanded={openDocuments[document.id]}
                                style={{
                                    cursor: 'pointer', listStyleType: 'none',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    marginBottom: '5px',
                                    transition: 'background-color 0.3s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'} // Màu nền khi hover
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            >
                                <h6>{index + 1}. {document.title}</h6>

                                <Collapse in={openDocuments[document.id]}>
                                    <div id={`collapse-${document.id}`}>
                                        <a onClick={() => window.open(document.url, '_blank', 'noopener,noreferrer')}
                                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{document.url}</a>

                                    </div>
                                </Collapse>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div >
    );
};

export default CourseDetail;
