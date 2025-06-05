import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddServiceForm from "./AddServiceForm";
import UpdateServiceForm from "./UpdateServiceForm";
import { useNavigate } from "react-router-dom";

function Service() {
  const navigate = useNavigate();
  const [serviceList, setServiceList] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
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

    fetchServices();
  }, []);

  const handleAddServiceSuccess = (newService) => {
    setServiceList((prev) => [...prev, newService]);
  };

  const handleUpdateServiceSuccess = (updatedService) => {
    setServiceList((prev) =>
      prev.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Services</h2>
        <button
          className="text-gray-600 hover:text-blue-600"
          onClick={() => setIsAddFormOpen(true)}
        >
          ➕
        </button>
      </div>
      <div className="mt-4">
        {serviceList.length > 0 ? (
          serviceList.map((service) => (
            <div
              key={service._id}
              className="flex items-start space-x-4 border-b border-gray-200 pb-4 mb-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {service.selectedServices?.length > 0
                    ? service.selectedServices.map((s) => s.name).join(" • ")
                    : "Service Name"}
                </h3>
                <p className="text-sm text-gray-600">
                  {service.description || "No description"}
                </p>
                <p className="text-sm text-gray-500">
                  {service.pricingType === "starting_at"
                    ? `${service.hourlyRate || ""} ${service.currency || ""}`
                    : "Contact for Pricing"}
                </p>
              </div>
              <button
                className="ml-auto text-gray-600 hover:text-blue-600"
                onClick={() => {
                  setSelectedService(service);
                  setIsUpdateFormOpen(true);
                }}
              >
                ✏️
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No services available.</p>
        )}
      </div>
      {serviceList && serviceList.length > 0 && (
        <button
          className="text-blue-600 hover:underline mt-4"
          onClick={() => navigate("/serviceList", { state: { serviceList } })}
        >
          Show all services →
        </button>
      )}
      {isAddFormOpen && (
        <AddServiceForm
          onClose={() => setIsAddFormOpen(false)}
          onSuccess={handleAddServiceSuccess}
        />
      )}
      {isUpdateFormOpen && selectedService && (
        <UpdateServiceForm
          service={selectedService}
          onClose={() => setIsUpdateFormOpen(false)}
          onSuccess={handleUpdateServiceSuccess}
        />
      )}
    </div>
  );
}

export default Service;
