import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import CourseDetail from "./components/CourseDetail";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/courses/:courseId" element={<CourseDetail/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App;
