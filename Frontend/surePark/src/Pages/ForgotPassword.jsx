import React from 'react'
import logo from '../assets/logo.png'
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect } from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom'

//calling slice
import { confirmOtp,setForgotState,
  forgotPwdStart,
  forgotPwdFailure,
  forgotPwdSuccess,
  changePwdStart,
  changePwdSuccess,
  changesPwdFailure,
 } from '../feature/userSlice';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const { generatedOtp, step, error, success, userChange } = useSelector((state) => state.user);

  // Validation schemas for each step
  const forgotSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
  });

  const confirmSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 8 digits")
      .required("OTP is required"),
  });

  const changeSchema = Yup.object({
    newPwd: Yup.string().min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one special character"
    ).
    required("Required"),
    confirmNewPwd: Yup.string()
      .oneOf([Yup.ref("newPwd"), null], "Passwords must match")
      .required("Required"),
  });

  // Forgot Password (send OTP)
const handleForgotSubmit = async (values, { setSubmitting }) => {
  dispatch(forgotPwdStart());
  try {
    const res = await axios.post("http://localhost:4000/forgot-password", { email: values.email });
    if (res.data.success) {
      dispatch(forgotPwdSuccess({ user: res.data.changeUser, otp: res.data.otp }));
     // alert(res.data.message);
    } else {
      dispatch(forgotPwdFailure(res.data.message || "Failed to send OTP"));
      alert(res.data.message || "Failed to send OTP");
    }
  } catch (err) {
    dispatch(forgotPwdFailure(err.message || "Failed to send OTP"));
    alert(err.message || "Failed to send OTP");
  } finally {
    setSubmitting(false);
  }
};

//Confirm Otp
  const handleConfirmSubmit = (values, { setSubmitting }) => {
    console.log("Confirm OTP:", values.otp);
    dispatch(confirmOtp({otp: values.otp}));
    setSubmitting(false);
  };

// Change Password
const handleChangeSubmit = async (values, { setSubmitting }) => {
  dispatch(changePwdStart());
  try {
    console.log(userChange)
    const res = await axios.post("http://localhost:4000/reset-password", { email: userChange.email , newPassword: values.newPwd  });
    if (res.data.success) {
      dispatch(changePwdSuccess(res.data));
      //alert(res.data.message);
    } else {
      dispatch(changesPwdFailure(res.data.message || "Password change failed"));
      alert(res.data.message || "Password change failed");
    }
  } catch (err) {
    dispatch(changesPwdFailure(err.message || "Password change failed"));
    alert(err.message || "Password change failed");
  } finally {
    setSubmitting(false);
  }
};

  const handleLogin = (e) =>{
     e.preventDefault();
     dispatch(setForgotState());
        navigate("/"); // navigate programmatically
  }

  useEffect(() => {
    console.log(success);
    if(success){
       dispatch(setForgotState());
        navigate("/"); // navigate programmatically
    }
  }, [generatedOtp, error, success, step]);


    return (
         <div className="min-h-screen flex items-center justify-center bg-radial from-orange-300 from-20% to-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Forgot Password Step */}
        {step === "forgot" && (
          <>
            <div className="flex justify-center mb-6">
              <img src={logo} alt="SurePark Logo" className="h-16 w-auto object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Forgot Password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Lost your password? Enter your email. An OTP will be sent to reset your password.
            </p>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotSchema}
              onSubmit={handleForgotSubmit}
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
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-500 transition"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-center text-sm text-gray-600">
              Remembered your password?{" "}
              <button onClick={handleLogin} className="text-blue-600 hover:underline">
                Back to Login
              </button>
            </p>
          </>
        )}

        {/* Confirm OTP Step */}
        {step === "confirm" && (
          <>
          <div className="flex justify-center mb-6">
              <img src={logo} alt="SurePark Logo" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Confirm OTP</h1>

              <p className="text-sm text-gray-600 mb-4">
                            Your OTP: <span className="font-semibold">{generatedOtp}</span>
                            </p>
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={confirmSchema}
              onSubmit={handleConfirmSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                
                  <Field
                    type="text"
                    name="otp"
                    placeholder="Enter 8 digit OTP"
                    className="w-full px-4 py-2 border rounded-lg"
                    maxLength={6}
                  />
                  <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-1" />

                  {error && <div className="text-red-500 text-sm">{error}</div>}


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-orange-500 transition"
                  >
                    {isSubmitting ? "Verifying..." : "Confirm OTP"}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-center text-sm text-gray-600">
              Remembered your password?{" "}
              <button onClick={handleLogin} className="text-blue-600 hover:underline">
                Back to Login
              </button>
            </p>
          </>
        )}

        {/* Change Password Step */}
        {step === "change" && (
          <>
          <div className="flex justify-center mb-6">
              <img src={logo} alt="SurePark Logo" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Change Password</h1>
            <Formik
              initialValues={{ newPwd: "", confirmNewPwd: "" }}
              validationSchema={changeSchema}
              onSubmit={handleChangeSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <Field
                    type="password"
                    name="newPwd"
                    placeholder="Enter New Password"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="newPwd" component="div" className="text-red-500 text-sm mt-1" />

                  <Field
                    type="password"
                    name="confirmNewPwd"
                    placeholder="Re-enter New Password"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <ErrorMessage
                    name="confirmNewPwd"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-orange-500 transition"
                  >
                    {isSubmitting ? "Updating..." : "Change Password"}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-center text-sm text-gray-600">
              Remembered your password?{" "}
              <button onClick={handleLogin} className="text-blue-600 hover:underline">
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
    );



}

export default ForgotPassword