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
import AddAboutForm from "./About/AddAboutForm";
import AddServiceForm from "./Services/AddServiceForm";
import UpdateServiceForm from "./Services/UpdateServiceForm";
import Service from "./Services/Service";
import EditIntroForm from "./EditIntroForm";
import AddCareerBreakForm from "./CareerBreak/AddCareerBreakForm";
import AddSkillForm from "./Skills/AddSkillForm";
import Skilll from "./Skills/Skilll";
import ImageUpload from "../../components/ImageUpload"; // Import the ImageUpload component
import { getDefaultAvatar, getDefaultBanner } from "../../utils/imageUtils"; // Import default images
import { User } from "lucide-react";

function Profile() {
  const [serviceList, setServiceList] = useState([]);
  const [user, setUser] = useState(null);
  const [userIntro, setUserIntro] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
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
        setEducationList(educationResponse.data.data);
      } catch (error) {
        console.error(error);
        navigate("/login");
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
      } 
      // finally {
      //   setLoading(false);
      // }
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

  // Handle profile picture upload
  const handleProfilePictureUpload = async (base64Image) => {
    setImageUploading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5001/api/v1/user/updateProfilePicture",
        { profilePicture: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update userIntro state
      setUserIntro(prev => ({
        ...prev,
        profilePicture: base64Image
      }));
      if(response.data.success) {
      toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setImageUploading(false);
    }
  };

  // Handle banner upload
  const handleBannerUpload = async (base64Image) => {
    setImageUploading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5001/api/v1/user/updateBannerImage",
        { bannerImage: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update userIntro state
      setUserIntro(prev => ({
        ...prev,
        bannerImage: base64Image
      }));

      if(response.data.success) {
      toast.success("Banner updated successfully!");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleAddSection = (section) => {
    setActiveForm(section);
    setIsModalOpen(false);
  };

  const handleCloseForm = () => {
    setActiveForm(null);
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
          {/* Banner Section with Image Upload */}
          <div className="relative">
            <ImageUpload
              currentImage={userIntro?.bannerImage || getDefaultBanner()}
              onImageSelect={handleBannerUpload}
              type="banner"
              className="w-full"
              disabled={imageUploading}
            />
          </div>

          {/* Profile Section */}
          <div className="flex items-center py-5 px-5 space-x-6 bg-white rounded-b-lg shadow-lg">
            {/* Profile Picture with Upload */}
            <ImageUpload
              currentImage={userIntro?.profilePicture || getDefaultAvatar()}
              onImageSelect={handleProfilePictureUpload}
              type="avatar"
              disabled={imageUploading}
            />

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
                  {userIntro?.city && userIntro?.state 
                    ? `${userIntro.city}, ${userIntro.state}` 
                    : "Location not provided"}
                </span>
                {userIntro?.city && userIntro?.state && 
                  sessionStorage.setItem(
                    "userLocation",
                    `${userIntro.city}, ${userIntro.state}`
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

          {/* About Section */}
          <About aboutText={user?.about} />

          {/* Education */}
          <Education educationList={educationList} />

          {/* Experience */}
          <Experience experienceList={experienceList} />

          {/* Skills Section */}
          <Skilll />
          
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

      {/* Render the active forms */}
      {activeForm === "about" && (
        <AddAboutForm
          onClose={handleCloseForm}
          onSuccess={(newAboutText) =>
            setUser((prev) => ({ ...prev, about: newAboutText }))
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
          onSuccess={(newExperience) =>
            setExperienceList((prev) => [...prev, newExperience])
          }
        />
      )}
      {activeForm === "career-break" && (
        <AddCareerBreakForm
          onClose={handleCloseForm}
          onSuccess={(newExperience) =>
            setExperienceList((prev) => [...prev, newExperience])
          }
        />
      )}
      {activeForm === "skills" && (
        <AddSkillForm
          onClose={handleCloseForm}
          onSuccess={(newAboutText) =>
            setUser((prev) => ({ ...prev, about: newAboutText }))
          }
        />
      )}
      {activeForm === "services" &&
        (serviceList && serviceList.length > 0 ? (
          <UpdateServiceForm
            service={serviceList[0]}
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
            firstName: userIntro?.firstName || user.name?.split(" ")[0] || "",
            lastName:
              userIntro?.lastName ||
              user.name?.split(" ").slice(1).join(" ") ||
              "",
            country: userIntro?.country || "",
            city: userIntro?.city || "",
            state: userIntro?.state || "",
            postalCode: userIntro?.postalCode || "",
          }}
        />
      )}
    </>
  );
}

export default Profile;