import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import car from "../assets/car.jpg";
import { updateUser } from "../feature/userSlice";
import {
  fetchVehiclesService,
  addVehicleService,
  updateVehicleService,
  deleteVehicleService,
} from "../services/user.service";

const ManageVehicle = () => {
  const dispatch = useDispatch();
  const { currentUser, token, error } = useSelector((state) => state.user);

  const [vehicles, setVehicles] = useState([]);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` },
  });

  const validationSchema = Yup.object({
    no: Yup.string()
      .matches(/^[A-Z]{2}\/\d{1,2}\/[A-Z]{1,2}\/\d{4}$/, "Invalid vehicle number format")
      .required("Vehicle number is required"),
  });

  useEffect(() => {
    if (currentUser?.vehicles) {
      setVehicles(currentUser.vehicles);
    }
  }, [currentUser]);

  const refreshVehicles = async () => {
  try {
    const vehicles = await fetchVehiclesService(token, currentUser._id);
    setVehicles(vehicles);
    dispatch(updateUser({ user: { ...currentUser, vehicles } }));
  } catch (error) {
    alert(error.message);
    console.error("Refresh Vehicles Error:", error.message);
  }
};

const handleAddOrUpdate = async (values, { resetForm }) => {
  if (!values.no.trim()) return;
  try {
    if (!editingVehicleId) {
      const data = await addVehicleService(token, currentUser._id, values.no);
      dispatch(updateUser({ user: data }));
    } else {
      const data = await updateVehicleService(token, currentUser._id, editingVehicleId, values.no);
      dispatch(updateUser({ user: data }));
      setEditingVehicleId(null);
    }
    resetForm();
    refreshVehicles();
  } catch (error) {
    alert(error.message);
    console.error("Add/Update Vehicle Error:", error.message);
  }
};

const handleDelete = async (vehicleId) => {
  try {
    const data = await deleteVehicleService(token, currentUser._id, vehicleId);
    dispatch(updateUser({ user: data }));
    refreshVehicles();
  } catch (error) {
    alert(error.message);
    console.error("Delete Vehicle Error:", error.message);
  }
};
  const handleEdit = (vehicle, setFieldValue) => {
    setFieldValue("no", vehicle.no);
    setEditingVehicleId(vehicle._id);
  };

  return (
    <div className="min-h-screen flex">
      {/* Right side - form */}
      <div className="flex flex-col w-full md:w-1/2 items-center justify-center bg-gray-100">
        <div className="text-start max-w-3xl mx-auto p-10">
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r p-2 from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Manage Vehicles
          </h2>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300 w-full max-w-lg">
          <Formik
            initialValues={{ no: "" }}
            validationSchema={validationSchema}
            onSubmit={handleAddOrUpdate}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-5">
                <div>
                  <Field
                    type="text"
                    name="no"
                    placeholder="Enter No:(eg:TN/07/AB/1234)"
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                  <ErrorMessage name="no" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-lg font-semibold shadow hover:opacity-90 transition"
                >
                  {editingVehicleId ? "Update Vehicle" : "Add Vehicle"}
                </button>

                {/* Table */}
                <div className="w-full mt-6">
                  <table className="w-full border-collapse shadow-lg bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-orange-200 via-orange-400 to-amber-500 text-white">
                      <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Vehicle Number</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((v, i) => (
                        <tr key={v._id} className="border-b hover:bg-orange-50">
                          <td className="p-3">{i + 1}</td>
                          <td className="p-3">{v.no}</td>
                          <td className="p-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(v, setFieldValue)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(v._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {vehicles.length === 0 && (
                        <tr>
                          <td colSpan="3" className="p-3 text-center text-gray-500">
                            No vehicles added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Left side - promo */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center text-white relative rounded-l-2xl shadow-lg"
        style={{ backgroundImage: `url(${car})` }}
      />
    </div>
  );
};

export default ManageVehicle;
