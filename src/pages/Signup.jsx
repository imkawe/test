import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserModel from "../model/userModel";

const SignUp = () => {
  const [formValues, setFormValues] = useState(new UserModel({}));
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formValues.name) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z0-9_]{3,15}$/.test(formValues.name)) {
      errors.name =
        "Name should be 3-15 characters long and can only contain letters, numbers, and underscores.";
    }

    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formValues.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/register`,
          formValues
        );
        if (response.data.success) {
          toast.success(response.data.message || "Registration successful!");
          setFormValues({ name: "", email: "", password: "" });
          setFormErrors({});
        } else {
          toast.error(response.data.message || "Registration failed!");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again later."
        );
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formValues.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.name && (
              <span className="text-sm text-red-500">{formErrors.name}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.email && (
              <span className="text-sm text-red-500">{formErrors.email}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {formErrors.password && (
              <span className="text-sm text-red-500">{formErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;