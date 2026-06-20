import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const { currentUser, token } = useSelector((state) => state.user);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/user/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 // Validation schema with conditional password
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .when([], {
      is: () => !editingUser, // if editingUser exists
      then: (schema) =>
        schema.required("Password is required while creating"),
      otherwise: (schema) => schema.notRequired(),
    }),
  role: Yup.string().oneOf(["user", "admin"], "Invalid role").required("Role is required"),
});

  // Submit handler
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (editingUser) {
          // Build payload with only non-empty values
    const payload = {};
    Object.keys(values).forEach((key) => {
      if (values[key] && values[key].trim() !== "") {
        payload[key] = values[key];
      }
    });
        await axiosInstance.put(`/user/${editingUser._id}`, payload);
      } else {
        await axiosInstance.post("/user", values);
      }
      resetForm();
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Formik Form */}
      <Formik
  initialValues={{
    name: editingUser?.name || "",
    email: editingUser?.email || "",
    password: "",
    role: editingUser?.role || "user",
  }}
  enableReinitialize
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ isSubmitting, resetForm }) => (
    <Form className="mb-6 space-y-4 bg-orange-100 p-4 rounded-lg shadow">
      <div>
        <label className="block font-medium">Name</label>
        <Field name="name" className="w-full p-2 border rounded" />
        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <Field type="email" name="email" className="w-full p-2 border rounded" />
        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
      </div>

      <div>
        <label className="block font-medium">Password</label>
        <Field type="password" name="password" className="w-full p-2 border rounded" />
        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
      </div>

      <div>
        <label className="block font-medium">Role</label>
        <Field as="select" name="role" className="w-full p-2 border rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Field>
        <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          {editingUser ? "Update User" : "Create User"}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditingUser(null); // exit edit mode
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Reset
          </button>
        )}
      </div>
    </Form>
  )}
</Formik>


      {/* User Table */}
      <table className="w-full border-collapse shadow-lg">
        <thead className="bg-gradient-to-r from-orange-200 via-orange-400 to-amber-500 text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-orange-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 capitalize">{user.role}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
