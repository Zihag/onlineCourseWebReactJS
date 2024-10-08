import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Apis, { authApi, endpoints } from '../configs/Apis';
import { Button, Card, Collapse, Container, Spinner } from 'react-bootstrap';
import { MyUserContext } from '../App';
import { CartContext } from '../contexts/CartContext';
import Moment from 'react-moment';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [openLectures, setOpenLectures] = useState({});
    const donvi = 'VnD';
    const [openDocuments, setOpenDocuments] = useState({});
    const [user, dispatch] = useContext(MyUserContext);
    const [enrolled, setEnrolled] = useState({}); // Thêm trạng thái cho việc đăng ký
    const [progress, setProgress] = useState({});
    const { addToCart } = useContext(CartContext);
    const [content, setContent] = useState();
    const [score, setScore] = useState();
    const nav = useNavigate();

    // const ratingNum = course.ratings.length

    // Theo dõi trạng thái đóng mở lecture
    const toggleLecture = (id) => {
        setOpenLectures(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Chuyển đổi trạng thái mở/đóng cho lecture có id tương ứng
        }));
    };

    const toggleDocument = (id) => {
        setOpenDocuments(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Chuyển đổi trạng thái mở/đóng cho document có id tương ứng
        }));
    };

    // Nhúng video
    const YouTubeVideo = ({ videoUrl, width = '560', height = '315' }) => {
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
    };

    useEffect(() => {
        const loadCourse = async () => {
            try {
                let { data } = await Apis.get(endpoints['detail'](courseId));
                setCourse(data);

                if (user?.id) {
                    // Kiểm tra trạng thái đăng ký
                    const [enrollmentData, progressData] = await Promise.all([
                        Apis.get(endpoints['enroll-check'](user.id, courseId)),
                        Apis.get(endpoints['enroll-progress'](user.id, courseId)),
                    ]);

                    setEnrolled(enrollmentData);
                    setProgress(progressData);

                    console.log('Enrollment Data:', enrollmentData);
                    console.log('Progress Data:', progressData);

                }
            } catch (ex) {
                console.error(ex);
            }
        };
        loadCourse();
    }, [courseId, user]);


    
    const addRating = () => {
        const process = async () => {
            let { data } = await authApi().post(endpoints['add-rating'], {
                "courseId": courseId,
                "userId": user.id,
                "feedback": content,
                "score": score
            });

            setCourse({
                ...course,
                ratings: [...course.ratings, data]
            });
        }
        process();
    }
    useEffect(() => {
        console.log('Enrolled State (after update):', enrolled);
    }, [enrolled]);

    useEffect(() => {
        console.log('Progress State (after update):', progress);
    }, [progress]);
    
    useEffect(() => {
        console.log('User info:', user);
    }, [user]);
    
    useEffect(() => {
        // Logic cập nhật trạng thái khi enrolled hoặc progress thay đổi
    }, [enrolled, progress]);

    const viewExercises = (courseId) => {
        nav(`/exercises/${courseId}`);
    };

    if (!course)
        return <Spinner animation="grow" />;

    return (
        <div className='container' style={{ marginTop: '100px' }}>
            {enrolled.data ? (
                <div className='text-center'><b className='text-success'>Progress</b>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped  bg-success progress-bar-animated" role="progressbar" style={{ width: `${progress.data}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{progress.data}</div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
            <div className='row'>
                <div className='col col-lg-5 text-center' style={{ flexBasis: '40%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={course.coverImg} alt={course.title} style={{ width: '100%', borderRadius: '15px' }} />
                    <h2 className='mt-3' style={{ color: '#f5896b' }}>{course.price} {donvi}</h2>

                    {enrolled.data ? (
                        <>
                            <Button variant="success" className="m-3 shadow" disabled>Paid</Button>
                            <Button variant="btn-primary" className="m-3 shadow"
                                    onClick={() => viewExercises(courseId)}>
                                See List Exercise
                            </Button>
                        </>
                    ) : (
                        <Button variant="danger" className="m-3 shadow" onClick={() => addToCart(course)}>Add to cart</Button>
                    )}
                    {progress.data === 100 ? (
                        <Button variant="success" className="m-3 shadow" onClick={() => nav(`/certificate/${courseId}`)} >Get certificate</Button>
                    ):(
                        <div></div>
                    )}
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
                                {enrolled.data ? (
                                    <div>
                                        <Collapse in={openLectures[lecture.id]}>
                                            <div id={`collapse-${lecture.id}`}>
                                                <p>{lecture.content}</p>
                                                Xem bài giảng
                                                <YouTubeVideo videoUrl={lecture.url} />
                                            </div>
                                        </Collapse>
                                    </div>
                                ) : (<div></div>)}

                            </li>
                        ))}
                    </ul>
                    {enrolled.data ? (
                        <h6>Document</h6>) : (
                        <div></div>
                    )}
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

                                {enrolled.data ? (
                                    <Collapse in={openDocuments[document.id]}>
                                        <div id={`collapse-${document.id}`}>
                                            <a onClick={() => window.open(document.url, '_blank', 'noopener,noreferrer')}
                                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{document.url}</a>

                                        </div>
                                    </Collapse>
                                ) : (<div></div>)}

                            </li>
                        ))}
                    </ul>
                    

                </div>
                <div className='row'>
                    <div class="container mt-5">
                        <div class="row  d-flex justify-content-center">
                            <div class="col-md-8">
                                <div class="headings d-flex justify-content-between align-items-center mb-3">
                                </div>
                                <h4 className='text-center'>Rating</h4>
                                {progress.data === 100 ? (
                                    <div class="bg-light p-2">
                                        <div class=" d-flex flex-row align-items-start"><img class="rounded-circle" src="https://i.imgur.com/RpzrMR2.jpg" width="40" />
                                            <textarea value={content} onChange={e => setContent(e.target.value)} class="form-control ml-1 shadow-none textarea" placeholder='Enter rating'></textarea>



                                        </div>
                                        <div className=' mt-3 text-center'><select value={score} onChange={e => setScore(e.target.value)}>
                                            <option value="1">☆</option>
                                            <option value="2">☆☆</option>
                                            <option value="3">☆☆☆</option>
                                            <option value="4">☆☆☆☆</option>
                                            <option value="5">☆☆☆☆☆</option>
                                        </select></div>
                                        <div class="mt-3 text-right text-center">

                                            <button class="btn btn-primary btn-sm shadow-none" type="button" onClick={addRating}>Post rating</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                <ul>
                                    {course.ratings.map((rating, index) => (
                                        <div class="card p-3 mt-3">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="user d-flex flex-row align-items-center">
                                                    <img src="https://i.imgur.com/hczKIze.jpg" width="30" class="user-img rounded-circle mr-2" />
                                                    <span><small class="font-weight-bold text-primary">{rating.userId.fullName}</small> <small class="font-weight-bold">{rating.feedback}</small></span>
                                                </div>


                                                <small><Moment locale='vi' fromNow>{rating.createdDate}</Moment></small>

                                            </div>
                                            <div class="action d-flex justify-content-between mt-2 align-items-center">

                                                <div class="reply px-4">
                                                    <small>Remove</small>
                                                    <span class="dots"> </span>
                                                    <small>Reply</small>
                                                    <span class="dots"> </span>
                                                    <small>Translate</small>

                                                </div>

                                                <div class="icons align-items-center">
                                                    {rating.score}
                                                    <i class="fa fa-star text-warning"></i>
                                                    <i class="fa fa-check-circle-o check-icon"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CourseDetail;
