import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { API_BASE_URL } from "../../../constant";

function UpdateServiceForm({ service, onClose, onSuccess, onUnpublish }) {
  // State from AddServiceForm
  const [currentView, setCurrentView] = useState("mainForm");
  const [countries, setCountries] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userLocation, setUserLocation] = useState(""); // Also from AddServiceForm
  const MAX_SERVICES = 10; // Constant from AddServiceForm
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Initialize formData from the 'service' prop when the component mounts
  const [formData, setFormData] = useState({
    selectedServices: service.selectedServices || [], // Array of {serviceId, name, categoryId}
    description: service.description || "",
    pricingType: service.pricingType || "starting_at",
    currency: service.currency || "USD", // Default if not set, or current value
    hourlyRate: service.hourlyRate || "",
    remote: service.remote || false,
    location: service.location || "", // Initialize with service's location
  });

  // useEffect to fetch categories, services, countries (copied from AddServiceForm)
  useEffect(() => {
    // Set userLocation from session storage
    const savedLocation =
      sessionStorage.getItem("userLocation") || "Location not available";
    setUserLocation(savedLocation || "Noida,UttarPradesh"); // Fallback

    const token = localStorage.getItem("token");

    const fetchServicesAndCountries = async () => {
      try {
        const [categoriesRes, servicesRes, countriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/categoryList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/admin/serviceList`, {
            headers: { Authorization: `Bearer ` + token }, // Ensure token is passed correctly
          }),
          axios.get(`${API_BASE_URL}/admin/countryList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const categoriesWithServices = categoriesRes.data.data.map(
          (category) => ({
            ...category,
            services: servicesRes.data.data.filter(
              (s) => s.category && s.category._id === category._id
            ),
          })
        );
        setCategories(categoriesWithServices);
        setCountries(countriesRes.data.data);

        // This part is mainly for AddForm's default, but if the current service
        // doesn't have a currency or if it's "contact", you might adjust.
        // For update, formData.currency should already be set from the 'service' prop.
        // This block is less critical for update if service prop is complete.
        if (
          countriesRes.data.data.length > 0 &&
          !formData.currency &&
          formData.pricingType === "starting_at"
        ) {
          const defaultCurrencyOption = countriesRes.data.data.find(
            (country) =>
              country.currency === "USD" || country.currency === "GBP"
          );
          if (defaultCurrencyOption && defaultCurrencyOption.currency) {
            setFormData((prev) => ({
              ...prev,
              currency: defaultCurrencyOption.currency,
            }));
          } else if (countriesRes.data.data[0]?.currency) {
            setFormData((prev) => ({
              ...prev,
              currency: countriesRes.data.data[0].currency,
            }));
          } else {
            // Fallback for when no specific currency is found and starting_at
            // is the pricing type, but no currency is set in initial service prop
            setFormData((prev) => ({ ...prev, currency: "USD" }));
          }
        }
      } catch (error) {
        toast.error("Failed to load services or countries.");
        console.error("Error fetching data:", error);
      }
    };

    fetchServicesAndCountries();
  }, []); // Empty dependency array means it runs once on mount

  // Functions copied from AddServiceForm
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleServiceSelect = (serviceToAdd) => {
    setFormData((prev) => {
      if (!serviceToAdd.category || !serviceToAdd.category._id) {
        console.error(
          "Service object missing category or category ID:",
          serviceToAdd
        );
        toast.error("Invalid service data. Please try again.");
        return prev;
      }

      const isAlreadySelected = prev.selectedServices.some(
        (s) => s.serviceId === serviceToAdd._id
      );

      if (isAlreadySelected) {
        toast.error("This service is already selected.");
        return prev;
      }

      if (prev.selectedServices.length >= MAX_SERVICES) {
        toast.error(`You can add up to ${MAX_SERVICES} services only.`);
        return prev;
      }

      const newServiceEntry = {
        serviceId: serviceToAdd._id,
        name: serviceToAdd.name,
        categoryId: serviceToAdd.category._id,
      };

      const updatedServices = [...prev.selectedServices, newServiceEntry];
      return { ...prev, selectedServices: updatedServices };
    });
  };

  const handleRemoveService = (serviceIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(
        (s) => s.serviceId !== serviceIdToRemove
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "hourlyRate") {
      const parsedValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(parsedValue) ? "" : value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePricingTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      pricingType: type,
      // Clear hourlyRate and currency if switching to 'contact'
      ...(type === "contact" && { hourlyRate: "", currency: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation (copied from AddServiceForm)
    if (
      !formData.remote &&
      (!formData.location || formData.location.trim() === "")
    ) {
      toast.error(
        "Please select a work location option (your location or remote)."
      );
      return;
    }

    if (formData.pricingType === "starting_at" && !formData.hourlyRate) {
      toast.error("Please enter hourly rate.");
      return;
    }

    // Prepare payload for backend (similar to AddServiceForm)
    const dataToSend = {
      selectedServices: formData.selectedServices, // Already in correct format
      description: formData.description,
      pricingType: formData.pricingType,
      ...(formData.pricingType === "starting_at" && {
        currency: formData.currency,
        hourlyRate: formData.hourlyRate,
      }),
      remote: formData.remote,
      ...(formData.location && { location: formData.location }), // Ensure location is sent if it has a value
    };


    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/user/updateService/${service._id}`,
        dataToSend, // Send the prepared data
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Service updated successfully!");
      onSuccess(response.data.data);
      onClose();
    } catch (error) {
      console.error(
        "Error updating service:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to update service. Please try again."
      );
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/user/deleteService/${service._id}`, // Use the correct DELETE endpoint and service._id
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Service unpublished successfully!");
      closeDeleteModal();
      onClose(); // Close the update form
      if (onUnpublish) {
        onUnpublish(service._id); // Notify parent component that service was deleted
      }
    } catch (error) {
      console.error(
        "Error unpublishing service:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to unpublish service. Please try again."
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
          <h2 className="text-xl font-bold text-gray-800">Update Service</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600"
          >
            ✖
          </button>
        </div>

        {currentView === "mainForm" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Services provided section (copied from AddServiceForm) */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Services provided
              </label>
              {formData.selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.selectedServices.map(
                    (
                      s // Use 's' for clarity here
                    ) => (
                      <div
                        key={s.serviceId}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {s.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveService(s.serviceId)}
                          className="ml-2 -mr-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                          aria-label={`Remove ${s.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
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
                  + Add/Remove Service
                </button>
              )}
              {formData.selectedServices.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  You can add up to {MAX_SERVICES} services.
                </p>
              )}
            </div>

            {/* Description Field */}
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

            {/* Work Location Section (copied from AddServiceForm, adapted for update) */}
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
                        id="updateLocationSelected" // Unique ID for this form
                        name="locationSelected" // Use locationSelected as boolean for checkbox
                        checked={formData.location} // Check if location has a value
                        onChange={(e) => {
                          // Manually handle checkbox based on location string
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.checked
                              ? userLocation || ""
                              : "", // Set to userLocation or clear
                          }));
                        }}
                        className="sr-only"
                      />
                      <div
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            location: !prev.location ? userLocation || "" : "",
                          }));
                        }}
                        className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center ${
                          formData.location
                            ? "bg-green-600 border-green-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {formData.location && (
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
                      htmlFor="updateLocationSelected"
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
                      id="updateRemote" // Unique ID
                      name="remote"
                      checked={formData.remote}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      onClick={() =>
                        handleChange({
                          target: {
                            name: "remote",
                            checked: !formData.remote,
                            type: "checkbox",
                          },
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
                    htmlFor="updateRemote"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    I am available to work remotely
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing Section (copied from AddServiceForm) */}
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
                      id="updateStartingAt" // Unique ID
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
                    htmlFor="updateStartingAt"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Starting at
                  </label>
                </div>

                {formData.pricingType === "starting_at" && (
                  <div className="ml-8 grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="updateCurrency" // Unique ID
                        className="block text-sm text-gray-600 mb-2"
                      >
                        Currency
                      </label>
                      <select
                        id="updateCurrency" // Unique ID
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="" disabled>
                          Select Currency
                        </option>
                        {countries.map(
                          (country) =>
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
                        htmlFor="updateHourlyRate" // Unique ID
                        className="block text-sm text-gray-600 mb-2"
                      >
                        Hourly rate
                      </label>
                      <input
                        type="number"
                        id="updateHourlyRate" // Unique ID
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
                    id="updateContactPricing" // Unique ID
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
                  htmlFor="updateContactPricing"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Contact for pricing
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={openDeleteModal} // Open confirmation modal
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Unpublish Service
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
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
                              onClick={() => handleServiceSelect(service)}
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
                onClick={() => setCurrentView("mainForm")}
              >
                Back
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setCurrentView("mainForm")}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to unpublish this service? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}

export default UpdateServiceForm;
