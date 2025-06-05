import { useState } from 'react';
import { CheckCircle, Settings, Database, UserCircle, Globe, BarChart2, DollarSign, LogOut, FileText, LocateIcon} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Country from './CountryMaster/Country';
import GeoManagement from './GeoManagement/GeoManagement';
import ServiceManagement from './ServiceManagement/ServiceManagement';

export default function AdminLanding() {
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', icon: <div className="w-6 h-6" /> },
    { name: 'User Management', icon: <UserCircle className="w-6 h-6" /> },
    { name: 'Services Management', icon: <DollarSign className="w-6 h-6" />},
    { name: 'Country Master', icon: <Globe className="w-6 h-6" /> },
    { name: 'Geo Management', icon: <LocateIcon className="w-6 h-6" /> },
    { name: 'System Settings', icon: <Settings className="w-6 h-6" /> },
    { name: 'Database Management', icon: <Database className="w-6 h-6" /> },
    { name: 'Analytics', icon: <BarChart2 className="w-6 h-6" /> },
  ];
   
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  // Function to render content based on selected item
  const renderContent = () => {
    if (selectedItem === "Dashboard") {
      return (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, Admin.<br />
              Here's what's happening with your application.
            </p>
          </div>

          <div className="flex justify-end space-x-4 mb-6">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FileText className="w-5 h-5 mr-2" />
              View Reports
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">
              <Settings className="w-5 h-5 mr-2" />
              System Settings
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">All Systems Operational</h3>
                <p className="text-gray-600">Last checked: Today at 10:45 AM</p>
              </div>
              <div className="bg-white border border-green-200 rounded-full px-4 py-1 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-700">Uptime: 99.98%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <UserCircle className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-4xl font-bold">1,284</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Active Currencies</h3>
                <DollarSign className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-4xl font-bold">38 / 42</div>
            </div>
          </div>
        </>
      );
    } else if (selectedItem === "User Management") {
      return (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
          <p className="text-gray-600 mb-4">Manage your application users, roles, and permissions.</p>
          {/* User Management content would go here */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-lg">User Management module is under development.</p>
          </div>
        </div>
      );
    } else if (selectedItem === "Services Management") {
      return (
        <ServiceManagement />
      );
    } else if (selectedItem === "Country Master") {
      return <Country />;
    } else if (selectedItem === "Geo Management") {
      return (
          <GeoManagement />
      );
    } else if (selectedItem === "System Settings") {
      return (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">System Settings</h1>
          <p className="text-gray-600 mb-4">Configure system-wide settings for your application.</p>
          {/* System Settings content would go here */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-lg">System Settings module is under development.</p>
          </div>
        </div>
      );
    } else if (selectedItem === "Database Management") {
      return (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Management</h1>
          <p className="text-gray-600 mb-4">Manage and monitor your database operations.</p>
          {/* Database Management content would go here */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-lg">Database Management module is under development.</p>
          </div>
        </div>
      );
    } else if (selectedItem === "Analytics") {
      return (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
          <p className="text-gray-600 mb-4">View reports and analytics for your application.</p>
          {/* Analytics content would go here */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-lg">Analytics module is under development.</p>
          </div>
        </div>
      );
    } else {
      // Default case if somehow selectedItem doesn't match any option
      return (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Unknown Section</h1>
          <p className="text-gray-600">The selected section could not be found.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed top-0 bottom-0 left-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-blue-600">PortfolioHub</h1>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href="#"
                onClick={() => setSelectedItem(item.name)}
                className={`flex items-center px-2 py-3 text-sm rounded-lg ${
                  selectedItem === item.name
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="font-medium">Super Admin</div>
              <div className="text-sm text-gray-500">admin@example.com</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-lg">
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}