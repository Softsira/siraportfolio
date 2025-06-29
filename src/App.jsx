import "./App.css";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/profile/profile";
import EducationList from "./pages/profile/Education/EducationList";
import ExperienceList from "./pages/profile/Experience/ExperienceList";
import About from "./pages/profile/About/About";
import AdminLanding from "./pages/Admin/AdminLanding";
import ServiceList from "./pages/profile/Services/ServiceList";
import CareerBreakCategory from "./pages/Admin/CareerBreakCategory/CareerBreakCategory";
import SkillsList from "./pages/profile/Skills/SkillsList";


function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
     <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/about" element= {<About />} />
          <Route path="/educations" element={<EducationList />} />
          <Route path="/experiences" element={<ExperienceList />} /> 
          <Route path="/serviceList" element= {<ServiceList />} />
          <Route path="/careerBreakCategory" element= {<CareerBreakCategory />} />
          
          <Route path="/skills" element={<SkillsList />} />
        </Routes>
     </BrowserRouter> 
    </>
  );
}

export default App;
