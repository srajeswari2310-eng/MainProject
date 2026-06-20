import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from 'react-redux'
import * as Yup from "yup";
import avatar from "../assets/avatar.jpg";
import { updateUser } from "../feature/userSlice";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user); // Redux selector
    const dispatch = useDispatch();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch current user (dummy endpoint: adjust to your backend)
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get( `/user/${currentUser._id}`);
      setUser(res.data);
      dispatch(updateUser({user : res.data}));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    password: Yup.string().min(6, "Min 6 chars").matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one special character"),
  });

  // Update handler
  const handleUpdate = async (values) => {
    try {
      // Build payload with only non-empty values
    const payload = {};
    Object.keys(values).forEach((key) => {
      if (values[key] && values[key].trim() !== "") {
        payload[key] = values[key];
      }
    });

    console.log("Payload being sent:", payload);
      await axiosInstance.put(`/user/${currentUser._id}`, payload);
      alert("Profile updated successfully!");
      fetchUser(); // refresh
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-100 flex flex-col items-center px-4 py-10">
      {/* Profile Banner */}
      <div className="relative w-full max-w-6xl mb-10">
        <div className="h-48 md:h-64 bg-gradient-to-r from-orange-200 via-orange-400 to-amber-500 rounded-2xl shadow-lg flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            User Profile
          </h2>
        </div>
        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <Formik
            initialValues={{
              name: user.name,
              password: "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block font-semibold text-gray-700">Name</label>
                  <Field
                    name="name"
                    className="border p-2 w-full rounded focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    Email: <span className="text-gray-500">{user.email}</span>
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="border p-2 w-full rounded focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Extra Info Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="space-y-8">
            {/* Vehicles */}
            <div>
              <h3 className="text-xl font-semibold text-orange-600 border-b pb-2 mb-3">Vehicles</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {user.vehicles.map((v, i) => (
                  <li key={i}>{v.no}</li>
                ))}
              </ul>
            </div>

            {/* Favorites */}
            <div>
              <h3 className="text-xl font-semibold text-orange-600 border-b pb-2 mb-3">Favorite Slots</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {user.favoriteSlot.map((slot, i) => (
                  <li key={i}>
                    {slot.locationId} — Floor {slot.floorId}, Slot {slot.slotId}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reserved */}
            <div>
              <h3 className="text-xl font-semibold text-orange-600 border-b pb-2 mb-3">Reserved Slots</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {user.reservedSlot.map((reserve, i) => (
                  <li key={i}>
                    {reserve.userVehicleNo} — Plan: {reserve.plan}, Date: {reserve.startDate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
