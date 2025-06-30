import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../constant";

export default function EditIntroForm({
  onClose,
  onSuccess,
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    postalCode: "",
    city: "",
    state: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const countryInputRef = useRef(null);
  const suggestionRefs = useRef([]);

  // 1. ADD THESE STATE VARIABLES (after existing city-related state)
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const cityInputRef = useRef(null);
  const citySuggestionRefs = useRef([]);

  useEffect(() => {
    // If initialData is provided, update the form
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    // Fetch countries when component mounts
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const token = localStorage?.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/admin/countryList`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Filter only active countries
        const activeCountries = result.data.filter((country) => country.active);
        setCountries(activeCountries);
      } else {
        console.error("Failed to fetch countries:", result.message);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchCities = async (countryId) => {
    if (!countryId) return;

    try {
      setLoadingCities(true);
      const token = localStorage?.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/admin/cityList?country=${countryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Filter only active cities
        const activeCities = result.data.filter((city) => city.active);
        setCities(activeCities);
      } else {
        console.error("Failed to fetch cities:", result.message);
        setCities([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Handle country input specifically
    if (name === "country") {
      handleCountryInput(value);
    }

    // Handle city input specifically
    if (name === "city") {
    // Only show suggestions if country is selected
    if (selectedCountryId) {
      handleCityInput(value);
    }
  }
  };

  const handleCityInput = (value) => {
    if (value.trim() && cities.length > 0) {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.state.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  };

  const selectCity = (city) => {
    setFormData((prev) => ({
      ...prev,
      city: city.name,
      state: city.state.name,
    }));
    setShowCitySuggestions(false);
    setFilteredCities([]);

    // Clear error if it exists
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleCountryInput = (value) => {
    if (value.trim()) {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(value.toLowerCase()) ||
          country.shortname.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowCountrySuggestions(true);
    } else {
      setFilteredCountries([]);
      setShowCountrySuggestions(false);
    }
  };

  const selectCountry = (country) => {
    setFormData((prev) => ({ ...prev, country: country.name, city: initialData.city || "" })); // Clear city when country changes
    setSelectedCountryId(country._id);
    setShowCountrySuggestions(false);
    setFilteredCountries([]);

    // Clear city suggestions when country changes
    setCities([]);
    setFilteredCities([]);
    setShowCitySuggestions(false);

    // Clear error if it exists
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }

    // Fetch cities for selected country
    fetchCities(country._id);
  };

  const handleCountryKeyDown = (e) => {
    if (!showCountrySuggestions || filteredCountries.length === 0) return;

    const currentIndex = filteredCountries.findIndex(
      (country) => country.name === formData.country
    );

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const nextIndex =
          currentIndex < filteredCountries.length - 1 ? currentIndex + 1 : 0;
        setFormData((prev) => ({
          ...prev,
          country: filteredCountries[nextIndex].name,
        }));
        suggestionRefs.current[nextIndex]?.scrollIntoView({ block: "nearest" });
        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : filteredCountries.length - 1;
        setFormData((prev) => ({
          ...prev,
          country: filteredCountries[prevIndex].name,
        }));
        suggestionRefs.current[prevIndex]?.scrollIntoView({ block: "nearest" });
        break;
      }

      case "Enter":
        e.preventDefault();
        if (currentIndex >= 0) {
          selectCountry(filteredCountries[currentIndex]);
        }
        break;

      case "Escape":
        setShowCountrySuggestions(false);
        break;
    }
  };

  const handleCityKeyDown = (e) => {
    if (!showCitySuggestions || filteredCities.length === 0) return;

    const currentIndex = filteredCities.findIndex(
      (city) => city.name === formData.city
    );

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const nextIndex =
          currentIndex < filteredCities.length - 1 ? currentIndex + 1 : 0;
        setFormData((prev) => ({
          ...prev,
          city: filteredCities[nextIndex].name,
        }));
        citySuggestionRefs.current[nextIndex]?.scrollIntoView({
          block: "nearest",
        });
        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : filteredCities.length - 1;
        setFormData((prev) => ({
          ...prev,
          city: filteredCities[prevIndex].name,
        }));
        citySuggestionRefs.current[prevIndex]?.scrollIntoView({
          block: "nearest",
        });
        break;
      }

      case "Enter":
        e.preventDefault();
        if (currentIndex >= 0) {
          selectCity(filteredCities[currentIndex]);
        }
        break;

      case "Escape":
        setShowCitySuggestions(false);
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country/Region is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/user/updateUserIntro`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.success) {
        if (onSuccess) onSuccess(result.data);
        toast.success("User details updated successfully")
        onClose();
      }
    } catch (error) {
      console.error("Error updating user details:", error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryInputRef.current &&
        !countryInputRef.current.contains(event.target)
      ) {
        setShowCountrySuggestions(false);
      }
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target)
      ) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  // Find country ID when initial data exists
  if (initialData.country && countries.length > 0) {
    const foundCountry = countries.find(
      country => 
        country.name === initialData.country || 
        country.shortname === initialData.country
    );
    
    if (foundCountry) {
      setSelectedCountryId(foundCountry._id);
      fetchCities(foundCountry._id);
    }
  }
}, [countries, initialData.country]);


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit intro</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ✖
          </button>
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name*
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name*
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Location</h3>

            {/* Country/Region */}
            <div className="relative" ref={countryInputRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country/Region*
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onKeyDown={handleCountryKeyDown}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  loadingCountries
                    ? "Loading countries..."
                    : "Start typing your country"
                }
                disabled={loadingCountries}
                autoComplete="off"
              />

              {/* Country Suggestions Dropdown */}
              {showCountrySuggestions && filteredCountries.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCountries.map((country, index) => (
                    <div
                      key={country._id}
                      ref={(el) => (suggestionRefs.current[index] = el)}
                      onClick={() => selectCountry(country)}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0 ${
                        formData.country === country.name ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {country.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {country.shortname}
                        </span>
                      </div>
                      {country.currency && (
                        <div className="text-xs text-gray-400 mt-1">
                          Currency: {country.currency}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            {/* City and State */}
            {/* City */}
            <div className="relative" ref={cityInputRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onKeyDown={handleCityKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder={
                  !selectedCountryId
                    ? "Please select a country first"
                    : loadingCities
                    ? "Loading cities..."
                    : "Start typing your city"
                }
                disabled={!selectedCountryId || loadingCities}
                autoComplete="off"
              />

              {/* City Suggestions Dropdown */}
              {showCitySuggestions && filteredCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.map((city, index) => (
                    <div
                      key={city._id}
                      ref={(el) => (citySuggestionRefs.current[index] = el)}
                      onClick={() => selectCity(city)}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0 ${
                        formData.city === city.name ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {city.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {city.state.name}
                        </span>
                      </div>
                      {city.pincode && (
                        <div className="text-xs text-gray-400 mt-1">
                          Pincode: {city.pincode}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Show message when no country is selected
              {!selectedCountryId && (
                <p className="text-amber-600 text-sm mt-1">
                  Please select a country first to load cities
                </p>
              )} */}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
