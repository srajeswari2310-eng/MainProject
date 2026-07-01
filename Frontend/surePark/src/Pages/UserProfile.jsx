import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import avatar from "../assets/avatar.jpg";
import { updateUser } from "../feature/userSlice";
import { fetchUserService , updateUserService} from "../services/user.service";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchUser = async () => {
  try {
    const data = await fetchUserService(token, currentUser._id);
    setUser(data);
    dispatch(updateUser({ user: data }));
  } catch (error) {
    console.error("Fetch User Error:", error.message);
  }
};
  useEffect(() => {
    fetchUser();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    password: Yup.string()
      .min(6, "Min 6 chars")
      .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, "Must contain a special character"),
  });

  const handleUpdate = async (values) => {
  try {
    const payload = {};
    Object.keys(values).forEach((key) => {
      if (values[key] && values[key].trim() !== "") {
        payload[key] = values[key];
      }
    });

    await updateUserService(token, currentUser._id, payload);

    alert("Profile updated successfully!");
    fetchUser();
  } catch (error) {
    console.error("Update Error:", error.message);
    alert("Update failed");
  }
};

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-teal-100 px-6 py-10">
      {/* Banner */}
      <div className="relative max-w-6xl mx-auto mb-12">
        <div className="h-32 md:h-40 bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide drop-shadow-sm">
            User Profile
          </h2>
        </div>
        {/* Avatar */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>


      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Update Profile</h3>
          <Formik
            initialValues={{ name: user.name, password: "" }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block font-medium text-gray-700">Name</label>
                  <Field
                    name="name"
                    className="border p-2 w-full rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Email: <span className="text-gray-500">{user.email}</span>
                  </label>
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="border p-2 w-full rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Info Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-teal-600 border-b pb-2 mb-3">Vehicles</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {user.vehicles.map((v, i) => (
                  <li key={i}>{v.no}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-600 border-b pb-2 mb-3">Favorite Slots</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {user.favoriteSlot.map((slot, i) => (
                  <li key={i}>
                    {slot.location} — {slot.floor.name}, {slot.slot.slotName}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-600 border-b pb-2 mb-3">Reserved Slots</h3>
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
