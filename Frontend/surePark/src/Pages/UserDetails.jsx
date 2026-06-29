import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import { fetchUsersService , createUserService, updateUserService } from "../services/user.service";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const { token, currentUser } = useSelector((state) => state.user);

  
  const fetchUsers = async () => {
    try {
      const data = await fetchUsersService(token);
      setUsers(data);
    } catch (error) {
      console.error("Fetch Users Error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .when([], {
        is: () => !editingUser,
        then: (schema) => schema.required("Password is required while creating"),
        otherwise: (schema) => schema.notRequired(),
      }),
    role: Yup.string().oneOf(["user", "admin"], "Invalid role").required("Role is required"),
  });

 const handleSubmit = async (values, { resetForm, setSubmitting }) => {
  try {
    if (editingUser) {
      const payload = {};
      Object.keys(values).forEach((key) => {
        if (values[key] && values[key].trim() !== "") {
          payload[key] = values[key];
        }
      });

      await updateUserService(token, editingUser._id, payload);
    } else {
      await createUserService(token, values);
    }

    resetForm();
    setEditingUser(null);
    fetchUsers();
  } catch (error) {
    console.error("User Submit Error:", error.message);
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-teal-100">
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-10">
        User Management
      </h1>

      {/* Side by Side Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingUser ? "Edit User" : "Create User"}
          </h2>
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
              <Form className="space-y-4">
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
                        setEditingUser(null);
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
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User List</h2>
          <table className="w-full border-collapse">
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
                    {currentUser._id != user._id && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default UserDetails;
