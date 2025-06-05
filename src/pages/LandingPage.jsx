import React from "react";
import { NavLink } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Navbar */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">PortfolioHub</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
            <NavLink to="/signUp" className="text-gray-600 hover:text-blue-600">
              Sign Up
            </NavLink>
            <NavLink to="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 sm:text-5xl">
          Showcase Your Work to the World
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Create your unique portfolio, connect with others, and grow your
          professional network.
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/signup"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/"
            className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
          >
            Explore Portfolios
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
              <span className="text-blue-600 text-2xl">$</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Create Your Portfolio
            </h3>
            <p className="mt-2 text-gray-600">
              Build a stunning portfolio that showcases your skills, projects,
              and achievements.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
              <span className="text-blue-600 text-2xl">👥</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Connect with Others
            </h3>
            <p className="mt-2 text-gray-600">
              Find and follow other professionals in your field to expand your
              network.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
              <span className="text-blue-600 text-2xl">🔍</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Get Discovered
            </h3>
            <p className="mt-2 text-gray-600">
              Make your work visible to potential clients, employers, and
              collaborators.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2025 PortfolioHub. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Terms of Service
            </a>
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;