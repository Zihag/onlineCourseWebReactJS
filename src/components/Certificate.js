import { useParams } from "react-router-dom";
import { MyUserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { Button } from "react-bootstrap";
import certificate from '../assets/certificate.png'
import html2pdf from "html2pdf.js";

const Certificate = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [user, dispatch] = useContext(MyUserContext);
    const [enrolled, setEnrolled] = useState({});
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const loadCourse = async () => {
            try {
                let { data } = await Apis.get(endpoints['detail'](courseId));
                setCourse(data);

                if (user?.id) {
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

    const savePDF = async () => {
        const element = document.querySelector('#pdf');
        
        if (element) {
            const opt = {
                margin: 0,
                filename: 'certificate.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            };
            
            html2pdf().from(element).set(opt).save();
        } else {
            console.error('Element with ID "pdf" not found.');
        }
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

    if (!course)
        return <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>

    return (
        <div className="text-center">
            <div id="pdf" className="container mt-5 text-center" style={{ position: 'relative', display: 'inline-block' }}>
                <img src={certificate} alt="Certificate" style={{ height: 800 }} />
                <div
                    className="content"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <h4 style={{ fontSize: '32px', fontWeight: 'bold' }}>
                        <i>{user.fullName}</i>
                    </h4>
                    <h3> Has completed the course {course.title} </h3>
                </div>
            </div>
            <Button variant="success" className="shadow" onClick={savePDF}>Save</Button>
        </div>
    )
}

export default Certificate;
