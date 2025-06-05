import React, { useEffect, useState } from "react";
import StateList from "./States/StateList";
import CityList from "./Cities/CityList";
import { fetchCountries } from "../CountryMaster/Country";

export default function GeoManagement() {
  const [activeTab, setActiveTab] = useState("states");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true);
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getCountries();
  }, []);

 console.log("Countries",countries)
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Geographical Data Management</h1>
      <p className="text-lg text-gray-600 mb-6">
        Manage states and cities for countries in your application
      </p>

      {/* Country Selector and Tabs */}
      <div className="flex items-center mb-6">
        <div className="flex items-center mr-8">
          <svg
            className="w-6 h-6 text-gray-500 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12H22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-gray-700 font-medium">Countries</span>
        </div>
        <select
          className="border px-4 py-2 rounded w-96 mr-8"
          value={selectedCountry?.code || ""}
          onChange={e => {
            const country = countries.find(c => c.code === e.target.value);
            setSelectedCountry(country);
          }}
        >
          <option value="">Choose a country</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.code})
            </option>
          ))}
        </select>
        {/* Tab Buttons */}
        <div className="flex rounded-md overflow-hidden border border-gray-200 ml-auto">
          <button
            className={`px-4 py-2 transition ${
              activeTab === "states"
                ? "bg-gray-100 text-gray-800 font-semibold"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab("states")}
          >
            States
          </button>
          <button
            className={`px-4 py-2 transition ${
              activeTab === "cities"
                ? "bg-gray-100 text-gray-800 font-semibold"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab("cities")}
          >
            Cities
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder={`Search ${activeTab === "states" ? "states" : "cities"}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        {/* You can add filter buttons here if needed */}
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === "states" ? "States" : "Cities"}
          </h2>
          <p className="text-gray-600 mb-6">
            {activeTab === "states"
              ? `Manage states for ${selectedCountry?.name || "the selected country"}.`
              : `Manage cities for ${selectedCountry?.name || "the selected country"}.`}
          </p>
          <div className="mt-6">
            {activeTab === "states" && (
              <StateList selectedCountry={selectedCountry} searchTerm={searchTerm} />
            )}
            {activeTab === "cities" && (
              <CityList selectedCountry={selectedCountry} searchTerm={searchTerm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}