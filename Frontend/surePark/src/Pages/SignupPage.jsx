import React from "react";
import logo from "../assets/logo.png";
import { FaApple, FaGoogle  } from "react-icons/fa";    // Apple icon
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../feature/userSlice";

const SignupPage = () => {
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().
      required("Full name is required"),
    email: Yup.string().
      email("Invalid email format").
      required("Email is required"),
    password: Yup.string().
      min(6, "Password must be at least 6 characters")
       .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, users, success } = useSelector((state) => state.user);

  const onSubmit = async (values, { setSubmitting }) => {
     dispatch(registerStart());
  try {
    console.log(values);
    const res = await axios.post("http://localhost:4000/register", {
       name: values.name,
      email: values.email,     
      password: values.password,
    });    

    if (res.data.success) {
      dispatch(registerSuccess(res.data));
      //resetForm();
      alert(res.data.message);
    } else {
      dispatch(registerFailure(res.data.message || "Registration failed"));
      alert(res.data.message || "Registration failed");
    }
  } catch (err) {
    dispatch(registerFailure(err.message || "Registration failed"));
    alert(err.message || "Registration failed");
  } finally {
    setSubmitting(false);
  }
  };

  const handleLogin = (e) =>{
     e.preventDefault();
        navigate("/"); // navigate programmatically
  }

  useEffect(()=>{
    console.log(users,error);
    if(success == true ){
      navigate('/');
    }
  },[users, error, success])

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-orange-300 from-20% to-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SurePark Logo" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

               {error && (
                                    <div className="text-red-500 text-sm">{error}</div>
                                )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-500 transition"
              >
                {isSubmitting ? (
                  <>
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <span>Singin up...</span>
                    </div>
                  </>
                )
                  : "Sign up"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-gray-500">OR CONTINUE WITH</div>
        <div className="flex justify-center gap-4 mt-4">
          <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white">
            <FaGoogle className="h-5 w-5" />
            <span>Google</span>
          </button>
          <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white">
            <FaApple className="h-5 w-5" />
            <span>Apple</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={handleLogin} className="text-blue-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
