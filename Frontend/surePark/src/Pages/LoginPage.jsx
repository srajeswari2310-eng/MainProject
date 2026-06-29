import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import loginParking from '../assets/loginParking.jpg'
import logo from '../assets/logo.png'


import { MapPin, Clock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";   // Google icon
import { FaApple } from "react-icons/fa";    // Apple icon
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../feature/userSlice";
import { resetUserError } from '../feature/userSlice';
import { loginApi } from '../services/auth.service';
import axios from "axios";


const LoginPage = () => {
    const YOUR_GOOGLE_CLIENT_ID = "1015281689846-1u3ntohgacm9op3b1pqo0vghd9u11m5s.apps.googleusercontent.com"


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { error, currentUser, isLoggedIn } = useSelector((state) => state.user);

     const handleGoogleSuccess = (credentialResponse) => {
        const decoded = jwt_decode(credentialResponse.credential);
        console.log("Google user:", decoded);
        // You can now send decoded info (email, name, etc.) to your backend
    };

    const handleGoogleError = () => {
        console.log("Google Sign-In failed");
    };


    const handleForgotPassword = (e) => {

        e.preventDefault();
        dispatch(resetUserError());
        navigate("/forgotPassword"); // navigate programmatically
    }

    const handleSingup = (e) => {
        e.preventDefault();
        dispatch(resetUserError());
        navigate("/singup"); // navigate programmatically
    }

    // Yup validation schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/,
                "Password must contain at least one special character"
            )
            .required("Password is required"),
    });

    const initialValues = {
        email: "",
        password: "",
        remember: false,
    };

    const onSubmit = async (values, { setSubmitting }) => {
        dispatch(loginStart());
        try {
            const data = await loginApi(values.email, values.password);

            if (data?.success) {
                dispatch(loginSuccess({ user: data.user, token: data.token }));
                alert(data.message || "Login successful");
                navigate("/home");
            } else {
                const errorMsg = data?.message || "Login failed";
                dispatch(loginFailure(errorMsg));
                alert(errorMsg);
            }
        } catch (error) {
            console.error("Login Error:", error.message);
            dispatch(loginFailure(error.message));
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };


    useEffect(() => {
        if (isLoggedIn == true) {
            console.log(currentUser);
            dispatch(resetUserError());
            navigate("/home"); // redirect after login

        }

    }, [error, isLoggedIn, currentUser])


    return (
         <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <div className="min-h-screen flex">
            {/* Left side - promo */}
            <div
                className="hidden md:flex w-1/2 bg-cover bg-center text-white relative"
                style={{ backgroundImage: `url(${loginParking})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-900 opacity-70"></div>

                {/* Content */}
                <div className="relative z-10 p-12 flex flex-col justify-between">
                    <div>
                        <img
                            src={logo}
                            alt="SurePark Logo"
                            className="h-30 w-40 object-contain"
                        />
                        <p className="text-4xl mb-2 max-w-md">
                            Find Your Perfect Parking Spot.
                        </p>
                        <p className='text-lg max-w-md'>
                            Book in advance, save time, and never worry about parking again.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            {/* Left side - locator icon */}
                            <div className="flex-shrink-0 bg-white p-2 rounded opacity-50">
                                <MapPin className="h-9 w-9 text-blue-600" />
                            </div>

                            {/* Right side - text */}
                            <div>
                                <h3 className="text-xl font-semibold">Find Nearby Spots</h3>
                                <p className="text-sm">
                                    Locate authorized parking areas closest to your destination
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            {/* Left side - clock icon */}
                            <div className="flex-shrink-0 bg-white p-2 rounded opacity-50">
                                <Clock className="h-9 w-9 text-blue-600" />
                            </div>

                            {/* Right side - text */}
                            <div>
                                <h3 className="text-xl font-semibold">Book in Advance</h3>
                                <p className="text-sm">
                                    Reserve your slot ahead of time and extend your parking duration
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="flex  flex-col w-full md:w-1/2 items-center justify-center bg-gray-100">

                <img
                    src={logo}
                    alt="SurePark Logo"
                    className="h-30 w-40 object-contain block md:hidden"
                />

                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Welcome back
                    </h2>


                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center">
                                        <Field type="checkbox" name="remember" className="mr-2" />
                                        Remember me
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
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
                                                <span>Singin in...</span>
                                            </div>
                                        </>
                                    ) : "Sign in"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="mt-6 text-center text-gray-500">OR CONTINUE WITH</div>
                    <div className="flex justify-center gap-4 mt-4">
                        <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                shape="rectangular"
                                theme="outline"
                                text="signin_with"
                                width="100%"
                            />
                         
                        <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-orange-500">
                            <FaApple className="h-5 w-5 text-black" />
                            <span>Apple</span>
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <button onClick={handleSingup} className="text-blue-600 hover:underline">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
        </GoogleOAuthProvider>
    )
}

export default LoginPage