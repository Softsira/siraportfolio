import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MessageSquare,
  User,
  Briefcase,
  Book,
  FileText,
  Map,
  DollarSign,
  Image,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import UpdateServiceForm from "./UpdateServiceForm";
import { API_BASE_URL } from "../../../constant";

export default function ServiceList() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [serviceList, setServiceList] = useState([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("services");
  const [activeServiceTab, setActiveServiceTab] = useState("overview");
  const receivedServiceList = location.state?.serviceList || [];
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  // const [servicesToUpdate, setServicesToUpdate] = useState([]);

  // Mock service requests
  const [requests] = useState([
    {
      name: "Manish Singh",
      title: "Accounting",
      time: "5h ago",
      location: "New Delhi, Delhi",
      premium: true,
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Chief of Staff",
      title:
        "Dubuddy Making Super App for College Students Tackling Undefined Challenges",
      subtitle: "Accounting",
      time: "10h ago",
      premium: false,
      avatar: "/api/placeholder/40/40",
    },
  ]);
      const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/user/services`,
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


  useEffect(() => {
    // if (receivedServiceList) {
    //   setServicesToUpdate(receivedServiceList);
    // }
    
    fetchServices();
  }, [receivedServiceList]);

  // Function to handle opening the update form
  const handleEditServicesClick = () => {
    setIsUpdateFormOpen(true);
  };

  // Function to handle success after updating services in the form
  // You would typically refetch or update the state here to reflect changes
  const handleUpdateServiceSuccess = (updatedServices) => {
    // For now, let's just log and close the form.
    // In a real application, you'd likely update receivedServiceList or refetch it.
    console.log("Services updated successfully:", updatedServices);
    setIsUpdateFormOpen(false);
    // If you need to update the displayed list immediately without a full page refresh:
    // This assumes updatedServices is the new complete list.
    // setReceivedServiceList(updatedServices); // You'd need a useState for receivedServiceList
  };

  const renderSidebar = () => (
    <div className="bg-white rounded-lg shadow-md p-6 min-w-64">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
          {user.username?.charAt(0)?.toUpperCase()}
        </div>
        <h2 className="text-xl font-bold">{user.name}'s Services</h2>
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mt-2">
          Private to you
        </span>
      </div>

      <nav className="mt-6 space-y-4">
        <button
          onClick={() => setActiveTab("services")}
          className={`w-full flex items-center py-2 px-3 text-left ${
            activeTab === "services"
              ? "border-l-4 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          <FileText size={20} className="mr-3" />
          <span className={activeTab === "services" ? "font-medium" : ""}>
            Services
          </span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`w-full flex items-center py-2 px-3 text-left ${
            activeTab === "requests"
              ? "border-l-4 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          <MessageSquare size={20} className="mr-3" />
          <span className={activeTab === "requests" ? "font-medium" : ""}>
            Requests
          </span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`w-full flex items-center py-2 px-3 text-left ${
            activeTab === "projects"
              ? "border-l-4 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          <Briefcase size={20} className="mr-3" />
          <span className={activeTab === "projects" ? "font-medium" : ""}>
            Projects
          </span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`w-full flex items-center py-2 px-3 text-left ${
            activeTab === "reviews"
              ? "border-l-4 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          <User size={20} className="mr-3" />
          <span className={activeTab === "reviews" ? "font-medium" : ""}>
            Reviews
          </span>
        </button>
      </nav>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <p className="text-gray-600">Learn more about providing services</p>
      </div>
    </div>
  );

  const renderServicesContent = () => {
    if (activeServiceTab === "overview") {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-600 mb-6">sales accounting</p>

          <div className="flex items-center mb-4">
            <span className="text-gray-400 mr-2">★</span>
            <span>No reviews yet</span>
            <a href="#" className="text-blue-600 ml-2">
              Invite past clients to leave review
            </a>
          </div>

          <div className="flex items-center mb-4">
            <Map size={20} className="text-gray-600 mr-2" />
            <div>
              <h3 className="font-medium">Availability</h3>
              <p className="text-gray-600">{user.location}</p>
            </div>
          </div>

          <div className="flex items-center mb-8">
            <DollarSign size={20} className="text-gray-600 mr-2" />
            <div>
              <h3 className="font-medium">Pricing</h3>
              <p className="text-gray-600">Starting at {serviceList.length > 0 ? `${serviceList[0].hourlyRate} ${serviceList[0].currency}/hr` : 'N/A'}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Services provided</h2>
          <div className="mb-8">
            {receivedServiceList.flatMap((service) =>
              service.selectedServices ? service.selectedServices : []
            ).length > 0 ? (
              receivedServiceList
                .flatMap((service) =>
                  service.selectedServices ? service.selectedServices : []
                )
                .map((selectedService) => (
                  <span
                    key={selectedService._id}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg mr-2"
                  >
                    {selectedService.name}
                  </span>
                ))
            ) : (
              <span className="text-gray-500">No services selected</span>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4">Media</h2>
          <p className="text-gray-600 mb-4">
            Add up to 8 media formats to showcase your work and experience.
          </p>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full flex items-center">
            <span className="mr-1">+</span> Add media
          </button>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {user.username?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">{user.name}'s Services</h2>
          <p className="text-gray-600 mb-4">
            Response time and rate not currently available{" "}
            <HelpCircle size={16} className="inline ml-1" />
          </p>

          <div className="flex space-x-4 mb-10">
            <button
             onClick={handleEditServicesClick} 
             className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center">
              <Edit size={16} className="mr-2" /> Edit services
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full">
              More
            </button>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Set up your services</h2>
            <p className="text-gray-600 mb-8">
              Add more details about your services to showcase your skills and
              attract more clients.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">
                      Get more potential clients with Premium
                    </h3>
                    <p className="text-gray-600">
                      Get up to 30 requests for your services per month with
                      Premium
                    </p>
                  </div>
                </div>
                <button className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-full w-full">
                  Try Premium for ₹0
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 9H4M20 9v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9M20 9V7a2 2 0 00-2-2M4 9V7a2 2 0 012-2m0 0h12m-12 0V3m12 2V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Request reviews</h3>
                    <p className="text-gray-600">
                      Invite up to 20 past clients to review your services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderRequestsContent = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Requests</h2>
        <HelpCircle size={20} className="ml-2 text-gray-500" />
      </div>

      <div className="mb-8">
        <div className="border-b pb-2 mb-4">
          <div className="flex items-center mb-2">
            <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium rounded mr-2">
              Premium requests
            </div>
          </div>

          {requests.map((request, index) => (
            <div key={index} className="flex items-center py-4 border-t">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{request.name}</h3>
                <p className="text-gray-600">{request.title}</p>
                {request.subtitle && (
                  <p className="text-gray-600 text-sm">{request.subtitle}</p>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                {request.time}
              </div>
            </div>
          ))}

          <button className="w-full text-center py-3 text-gray-600 hover:text-gray-800">
            Show all
          </button>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Direct requests</h3>
          <p className="text-gray-600">
            No direct requests. Requests for your services will appear here when
            a client reaches out from your service page.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="mb-4">
          <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium rounded inline-block mb-1">
            PREMIUM
          </div>
          <h3 className="font-bold text-lg">Accounting</h3>
          <p className="text-gray-600">{requests[0].location}</p>
          <p className="text-gray-600 text-sm">{requests[0].time}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">
            Unlock this request and get up to 30 more potential clients with
            Premium
          </h3>
          <p className="text-gray-600 mb-4">
            Get up to 30 potential clients per month with project requests
            available only to Premium Business members.
          </p>
          <button className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-full mb-2">
            Try Premium for ₹0
          </button>
          <p className="text-gray-500 text-sm">
            1-month free trial. Cancel whenever. We'll remind you 7 days before
            your trial ends.
          </p>
        </div>
      </div>
    </div>
  );

  const renderProjectsContent = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Client projects</h2>
        <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
          Active
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-12">
        <img
          src="/api/placeholder/300/200"
          alt="No projects"
          className="mb-6"
        />
        <h3 className="text-xl font-bold mb-2">
          Client projects will appear here.
        </h3>
      </div>
    </div>
  );

  const renderReviewsContent = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">Reviews</h2>
      <p className="text-gray-600 mb-8">
        You haven't received enough reviews to display an overall rating
      </p>

      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 9H4M20 9v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9M20 9V7a2 2 0 00-2-2M4 9V7a2 2 0 012-2m0 0h12m-12 0V3m12 2V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">Invite past clients to review</h3>
            <p className="text-gray-600">
              Consider past clients who can best speak to your abilities
            </p>
            <p className="text-gray-600 mt-1">20/20 credits available</p>
          </div>
        </div>
        <div className="text-right">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full">
            Invite to review
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-12">
        <img src="/api/placeholder/300/200" alt="No reviews" className="mb-6" />
        <h3 className="text-xl font-bold mb-2">You have no clients yet</h3>
        <p className="text-gray-600 text-center">
          Clients will appear here after your invitation to review is confirmed
          or you complete a new project
        </p>
        <button className="text-blue-600 mt-4">
          Invite past clients to review
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "services":
        return (
          <div>
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveServiceTab("overview")}
                className={`px-4 py-2 ${
                  activeServiceTab === "overview"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveServiceTab("services")}
                className={`px-4 py-2 ${
                  activeServiceTab === "services"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Services
              </button>
            </div>
            {renderServicesContent()}
          </div>
        );
      case "requests":
        return renderRequestsContent();
      case "projects":
        return renderProjectsContent();
      case "reviews":
        return renderReviewsContent();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">{renderSidebar()}</div>
          <div className="md:w-3/4">{renderContent()}</div>
        </div>
      </div>
     {/* Conditionally render the UpdateServiceForm */}
      {isUpdateFormOpen && (
        <UpdateServiceForm
          user={user} // Pass user data to the form
          service={serviceList[0]} // Pass the current service list
          onClose={() => setIsUpdateFormOpen(false)}
          onSuccess={handleUpdateServiceSuccess}
        />
      )}
    </div>
  );
}
