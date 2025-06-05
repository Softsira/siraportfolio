import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, X } from "lucide-react"; // Import Chevron and X (for close) icons

function AddServiceForm({ onClose, onSuccess }) {
  const [currentView, setCurrentView] = useState("mainForm"); // 'mainForm' or 'serviceSelection'
  const [countries, setCountries] = useState([]); // New state to store fetched countries
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    selectedServices: [], // Now an array to hold multiple service objects { _id, name }
    description: "",
    pricingType: "starting_at",
    currency: "",
    hourlyRate: "",
    remote: false,
    locationSelected: false,
  });

  const [userLocation, setUserLocation] = useState("");

  // Define the maximum number of services allowed
  const MAX_SERVICES = 10;

  useEffect(() => {
    const savedLocation =
      sessionStorage.getItem("userLocation") || "Location not available";
    setUserLocation(savedLocation || "Noida,UttarPradesh");

    const token = localStorage.getItem("token");
    // Fetch service categories and services
    const fetchServices = async () => {
      try {
        const [categoriesRes, servicesRes, countriesRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/v1/admin/categoryList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5001/api/v1/admin/serviceList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5001/api/v1/admin/countryList`, {
            // Fetch countries
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const categoriesWithServices = categoriesRes.data.data.map(
          (category) => ({
            ...category,
            services: servicesRes.data.data.filter(
              (service) =>
                service.category && service.category._id === category._id
            ),
          })
        );

        setCategories(categoriesWithServices);
        setCountries(countriesRes.data.data); // Set the fetched countries
        const firstWithCurrency = countriesRes.data.data.find(
          (c) => c.currency
        );
        if (firstWithCurrency && !formData.currency) {
          setFormData((prev) => ({
            ...prev,
            currency: firstWithCurrency.currency,
          }));
        }
      } catch (error) {
        console.log("Error:",error)
        toast.error("Failed to load services");
      }
    };

    fetchServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleServiceSelect = (service) => {
    // 'service' here should be an object like { _id, name }
    setFormData((prev) => {
      const isAlreadySelected = prev.selectedServices.some(
        (s) => s._id === service._id
      );

      if (isAlreadySelected) {
        toast.error("This service is already selected.");
        return prev; // Don't modify state if already selected
      }

      if (prev.selectedServices.length >= MAX_SERVICES) {
        toast.error(`You can add up to ${MAX_SERVICES} services only.`);
        return prev; // Don't add if limit reached
      }

      // Construct the object to store in selectedServices
      const newServiceEntry = {
        serviceId: service._id, // Renamed from _id to serviceId for clarity
        name: service.name, // Keep name for display purposes in the form
        categoryId: service.category._id, // Add the category ID
      };

      const updatedServices = [...prev.selectedServices, newServiceEntry];
      return { ...prev, selectedServices: updatedServices };
    });
    // User remains on service selection until Done/Back.
  };

  const handleRemoveService = (serviceIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(
        (service) => service.serviceId !== serviceIdToRemove // Filter by serviceId
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWorkLocationChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handlePricingTypeChange = (type) => {
    setFormData({
      ...formData,
      pricingType: type,
      // Clear hourly rate and currency if switching to contact pricing
      ...(type === "contact" && { hourlyRate: "", currency: "USD" }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: At least one work location option should be selected
    if (!formData.locationSelected && !formData.remote) {
      toast.error(
        "Please select a work location option (your location or remote)."
      );
      return;
    }

    // Validation: If "Starting at" is selected, hourly rate is required
    if (formData.pricingType === "starting_at" && !formData.hourlyRate) {
      toast.error("Please enter hourly rate.");
      return;
    }

    const servicesForBackend = formData.selectedServices.map((service) => ({
      serviceId: service.serviceId,
      name: service.name, 
      categoryId: service.categoryId,
    }));

    const dataToSend = {
      // Send the selectedServices array directly as expected by the backend schema.
      selectedServices: servicesForBackend, // Send the array of { _id, name } objects

      description: formData.description,
      pricingType: formData.pricingType,
      ...(formData.pricingType === "starting_at" && {
        currency: formData.currency,
        hourlyRate: formData.hourlyRate,
      }),
      remote: formData.remote,
      // Only include location if locationSelected is true
      ...(formData.locationSelected && { location: userLocation }),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/v1/user/addService",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Service added successfully!");
      onSuccess(response.data.data); // Notify parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error(
        "Error adding service:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to add service. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Service</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600"
          >
            ✖
          </button>
        </div>

        {/* Conditional Rendering based on currentView */}
        {currentView === "mainForm" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Services provided section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Services provided
              </label>
              {formData.selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.selectedServices.map((service) => (
                    <div
                      key={service._id}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {service.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveService(service.serviceId)}
                        className="ml-2 -mr-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                        aria-label={`Remove ${service.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.selectedServices.length < MAX_SERVICES && (
                <button
                  type="button"
                  className="mt-2 btn btn-sm bg-transparent border-2 border-blue-600 rounded-full py-0.5 px-2 text-blue-500
                   transform transition-all duration-300
                   hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg hover:border-blue-800"
                  onClick={() => setCurrentView("serviceSelection")}
                >
                  + Add Service
                </button>
              )}
              {formData.selectedServices.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  You can add up to {MAX_SERVICES} services.
                </p>
              )}
            </div>

            {/* Description Field (remains as is) */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
              ></textarea>
            </div>

            {/* Work Location Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Work location
              </label>
              <p className="text-xs text-gray-500">Select all that apply*</p>

              <div className="space-y-3">
                {/* User Location Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="locationSelected"
                        name="locationSelected"
                        checked={formData.locationSelected}
                        onChange={handleWorkLocationChange}
                        className="sr-only"
                      />
                      <div
                        onClick={() =>
                          handleWorkLocationChange({
                            target: {
                              name: "locationSelected",
                              checked: !formData.locationSelected,
                            },
                          })
                        }
                        className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center ${
                          formData.locationSelected
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {formData.locationSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor="locationSelected"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {userLocation}
                    </label>
                  </div>
                </div>

                {/* Remote Work Checkbox */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="remote"
                      name="remote"
                      checked={formData.remote}
                      onChange={handleWorkLocationChange}
                      className="sr-only"
                    />
                    <div
                      onClick={() =>
                        handleWorkLocationChange({
                          target: { name: "remote", checked: !formData.remote },
                        })
                      }
                      className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center ${
                        formData.remote
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {formData.remote && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="remote"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    I am available to work remotely
                  </label>
                </div>
              </div>
            </div>
            {/* Pricing Section - Updated Design */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Pricing
                </h3>
                <p className="text-sm text-gray-600 mb-3">Select one option*</p>
                <p className="text-sm text-gray-500 mb-4">
                  Choose how you'd like to display your page's pricing
                  information.{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Learn more
                  </a>
                </p>
              </div>

              {/* Starting at option */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="radio"
                      id="starting_at"
                      name="pricingType"
                      value="starting_at"
                      checked={formData.pricingType === "starting_at"}
                      onChange={() => handlePricingTypeChange("starting_at")}
                      className="sr-only"
                    />
                    <div
                      onClick={() => handlePricingTypeChange("starting_at")}
                      className={`w-5 h-5 border-2 rounded-full cursor-pointer flex items-center justify-center transition-colors ${
                        formData.pricingType === "starting_at"
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      {formData.pricingType === "starting_at" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="starting_at"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Starting at
                  </label>
                </div>

                {/* Currency and Hourly Rate inputs - only show when "Starting at" is selected */}
                {formData.pricingType === "starting_at" && (
                  <div className="ml-8 grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="currency"
                        className="block text-sm text-gray-600 mb-2"
                      >
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency} // Ensure this is bound correctly
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {/* Map over the fetched countries to populate options */}
                        {countries.map(
                          (country) =>
                            // Ensure country.currency exists before rendering
                            country.currency && (
                              <option
                                key={country._id}
                                value={country.currency}
                              >
                                {country.currency}
                              </option>
                            )
                        )}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="hourlyRate"
                        className="block text-sm text-gray-600 mb-2"
                      >
                        Hourly rate
                      </label>
                      <input
                        type="number"
                        id="hourlyRate"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="1"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Contact for pricing option */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="radio"
                    id="contact_pricing"
                    name="pricingType"
                    value="contact"
                    checked={formData.pricingType === "contact"}
                    onChange={() => handlePricingTypeChange("contact")}
                    className="sr-only"
                  />
                  <div
                    onClick={() => handlePricingTypeChange("contact")}
                    className={`w-5 h-5 border-2 rounded-full cursor-pointer flex items-center justify-center transition-colors ${
                      formData.pricingType === "contact"
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    {formData.pricingType === "contact" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="contact_pricing"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Contact for pricing
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Publish
            </button>
          </form>
        )}

        {currentView === "serviceSelection" && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">Select Services</h3>
              <p className="text-sm text-gray-600 mt-1">
                You can select up to {MAX_SERVICES} services.
                <br />
                Selected: {formData.selectedServices.length} / {MAX_SERVICES}
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {" "}
              {/* Increased max-h for more categories */}
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border-b border-gray-200 last:border-0"
                >
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <h4 className="font-medium text-gray-800">
                      {category.name}
                    </h4>
                    <button
                      type="button"
                      aria-expanded={expandedCategory === category._id}
                    >
                      {expandedCategory === category._id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {expandedCategory === category._id && (
                    <div className="pl-4 pr-2 pb-4">
                      <div className="grid grid-cols-1 gap-2">
                        {category.services.map((service) => {
                          const isSelected = formData.selectedServices.some(
                            (s) => s.serviceId === service._id
                          );
                          // Disable if already selected OR if max limit reached AND this service is not already selected
                          const isDisabled =
                            isSelected ||
                            (formData.selectedServices.length >= MAX_SERVICES &&
                              !isSelected);

                          return (
                            <button
                              key={service._id}
                              type="button"
                              className={`px-4 py-2 text-left border rounded transition-colors duration-200
                                          ${
                                            isSelected
                                              ? "bg-blue-200 border-blue-300 text-blue-900 cursor-not-allowed"
                                              : "hover:bg-blue-50 hover:border-blue-200"
                                          }
                                          ${
                                            isDisabled
                                              ? "opacity-70 cursor-not-allowed"
                                              : ""
                                          }`}
                              onClick={() => handleServiceSelect(service)} // Pass the full service object
                              disabled={isDisabled}
                            >
                              {service.name} {isSelected && " (Added)"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-center p-4 text-gray-500">
                  No services available.
                </p>
              )}
            </div>
            <div className="p-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setCurrentView("mainForm")} // Go back to main form
              >
                Back
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setCurrentView("mainForm")} // "Done" also goes back to main form
                // Optionally disable "Done" if no service is selected
                // disabled={formData.selectedServices.length === 0}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddServiceForm;
