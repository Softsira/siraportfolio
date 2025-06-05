import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import About from "./About/About";
import Education from "./Education/Education";
import Experience from "./Experience/Experience";
import AddProfileSectionModal from "../../components/AddProfileSectionModal";
import AddEducationForm from "./Education/AddEducationForm";
import AddExperienceForm from "./Experience/AddExperienceForm";
import AddAboutForm from "./About/AddAboutForm"; // Import AddAboutForm
import AddServiceForm from "./Services/AddServiceForm";
import UpdateServiceForm from "./Services/UpdateServiceForm";
import Service from "./Services/Service";
import EditIntroForm from "./EditIntroForm"; // Import EditIntroForm
import { User } from "lucide-react";

function Profile() {
  const [serviceList, setServiceList] = useState([]);
  const [user, setUser] = useState(null);
  const [userIntro, setUserIntro] = useState(null);
  const [educationList, setEducationList] = useState([]); // State for education list
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // Track which form to show
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/user/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.data);
        console.log("User", response.data.data);
        const User = await JSON.stringify(response.data.data);
        sessionStorage.setItem("user", User);
        const educationResponse = await axios.get(
          "http://localhost:5001/api/v1/user/educationList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEducationList(educationResponse.data.data); // Set education list
      } catch (error) {
        console.error(error);
        navigate("/login"); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5001/api/v1/user/services",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServiceList(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error.message);
        toast.error("Failed to fetch services.");
      }
    };

    const fetchUserIntro = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/user/userIntro",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserIntro(response.data.data);
        console.log("UserIntro", response.data.data);
      } catch (error) {
        console.error(error);
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserIntro();

    fetchServices();
    fetchUserDetails();
  }, [navigate]);

  useEffect(() => {
    return () => {
      <Experience />;
    };
  }, [setExperienceList]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return null; // Prevent rendering if no user data
  }

  const handleAddSection = (section) => {
    setActiveForm(section); // Set the active form based on the selected section
    setIsModalOpen(false); // Close the modal
  };

  const handleCloseForm = () => {
    setActiveForm(null); // Close the active form
  };

  const handleUpdateServiceSuccess = (updatedService) => {
    setServiceList((prev) =>
      prev.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    );
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          {/* Banner Section */}
          <div className="relative bg-gray-300 h-40 rounded-t-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1746768934151-8c5cb84bcf11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <button className="absolute top-2 right-2 px-4 py-2 bg-white text-gray-600 rounded-lg shadow hover:bg-gray-100">
              Edit Banner
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center py-5 px-5 space-x-6  bg-white rounded-b-lg shadow-lg">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1746768934151-8c5cb84bcf11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100">
                <span role="img" aria-label="camera">
                  📷
                </span>
              </button>
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.username || "Username"}
              </h2>
              <p className="text-gray-600">
                {user.name || "Full Stack Developer"}
              </p>
              <button
                onClick={() => setActiveForm("editIntro")}
                className="text-gray-600 hover:text-blue-600"
              >
                <span role="img" aria-label="edit">
                  ✏️
                </span>
              </button>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <span>
                  {userIntro.city + ", " + userIntro.state ||
                    "Location not provided"}
                </span>
                {sessionStorage.setItem(
                  "userLocation",
                  userIntro.city + ", " + userIntro.state
                )}
                <span>{user.email || "Email not provided"}</span>
                <span>{user.company || "Company not provided"}</span>
                <span>{user.education || "Education not provided"}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="mt-2 btn btn-sm bg-transparent border-2 border-blue-600 rounded-4xl py-0.5 px-2 text-blue-500 
                transform transition-all duration-300 
               hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg hover:border-blue-800"
              >
                Add profile section
              </button>
            </div>
          </div>

          {/* Profile Strength
          <div className="mt-4">
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              Profile Strength: {user.profileStrength || "Not calculated"}
            </span>
          </div> */}

          {/* About Section */}
          <About aboutText={user?.about} />

          {/* Education */}
          <Education
            educationList={educationList} // Pass the education list from user data
          />

          {/* Experience */}
          <Experience experienceList={experienceList} />

          {/* Service Section */}
          <Service />
        </div>
      </div>
      {/* Add Profile Section Modal */}
      {isModalOpen && (
        <AddProfileSectionModal
          onClose={() => setIsModalOpen(false)}
          onSelect={handleAddSection}
        />
      )}

      {/* Render the active form */}
      {activeForm === "about" && (
        <AddAboutForm
          onClose={handleCloseForm}
          onSuccess={
            (newAboutText) =>
              setUser((prev) => ({ ...prev, about: newAboutText })) // Update the "about" field in the user state
          }
        />
      )}
      {activeForm === "education" && (
        <AddEducationForm
          onClose={handleCloseForm}
          onSuccess={(newEducation) =>
            setEducationList((prev) => [...prev, newEducation])
          }
        />
      )}
      {activeForm === "experience" && (
        <AddExperienceForm
          onClose={handleCloseForm}
          onSuccess={
            (newExperience) =>
              setExperienceList((prev) => [...prev, newExperience]) // Update the experience list
          }
        />
      )}
      {/* {activeForm === "services" && (
        <AddServiceForm
          onClose={handleCloseForm}
          onSuccess={(newService) =>
            setUser((prev) => ({
              ...prev,
              services: [...(prev.services || []), newService],
            }))
          }
        />
      )} */}
      {activeForm === "services" &&
        (serviceList && serviceList.length > 0 ? (
          <UpdateServiceForm
            service={serviceList[0]} // or the relevant service object
            onClose={handleCloseForm}
            onSuccess={handleUpdateServiceSuccess}
          />
        ) : (
          <AddServiceForm
            onClose={handleCloseForm}
            onSuccess={(newService) =>
              setUser((prev) => ({
                ...prev,
                services: [...(prev.services || []), newService],
              }))
            }
          />
        ))}
      {activeForm === "editIntro" && (
        <EditIntroForm
          onClose={handleCloseForm}
          onSuccess={(updatedData) => {
            // Update the user state with the new data
            setUserIntro((prev) => ({
              ...prev,
              name: `${updatedData.firstName} ${updatedData.lastName}`,
              firstName: updatedData.firstName,
              lastName: updatedData.lastName,
              location: `${updatedData.city ? updatedData.city + ", " : ""}${
                updatedData.state ? updatedData.state + ", " : ""
              }${updatedData.country}`,
              country: updatedData.country,
              city: updatedData.city,
              state: updatedData.state,
              postalCode: updatedData.postalCode,
            }));
          }}
          initialData={{
            firstName: userIntro.firstName || user.name?.split(" ")[0] || "",
            lastName:
              userIntro.lastName ||
              user.name?.split(" ").slice(1).join(" ") ||
              "",
            country: userIntro.country || "",
            city: userIntro.city || "",
            state: userIntro.state || "",
            postalCode: userIntro.postalCode || "",
          }}
        />
      )}
    </>
  );
}

export default Profile;
