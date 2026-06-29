import React from 'react'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import {  useSelector } from "react-redux";
import './App.css'
import './style.css'

import RootLayout from './Layouts/RootLayout'
import AdminRoute from './Routes/AdminRoute'
import UserRoute from './Routes/UserRoute'

import LoginPage from './Pages/LoginPage';
import ForgotPassword from './Pages/ForgotPassword';
import SignupPage from './Pages/SignupPage';
import ErrorPage from './Pages/ErrorPage';
import Home from './Pages/Home';
import Contact from './Pages/Contact'
import UserDetails from './Pages/UserDetails';
import UserProfile from './Pages/UserProfile';
import ManageVehicle from './Pages/ManageVehicle';
import { User } from 'lucide-react';
import ManageLot from './Pages/ManageLot';
import ParkingLot from './Pages/ParkingLot';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement:<ErrorPage/>,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPassword />,
      },
      ,
      {
        path: "/singup",
        element: <SignupPage />,
      },
      {
        path: "/home",
        element: <UserRoute>
          <Home/>
        </UserRoute>
      },
      ,
      {
        path: "/contact",
        element: <UserRoute>
          <Contact/>
        </UserRoute>
      }
       ,
      {
        path: "/user",
        element: <AdminRoute>
          <UserDetails/>
        </AdminRoute>

      },
      {
        path: "/profile",
        element: <UserRoute>
          <UserProfile/>
        </UserRoute>

      },
        {
        path: "/vehicles",
        element: <UserRoute>
          <ManageVehicle/>
        </UserRoute>

      }
      ,
        {
        path: "/manageSlot",
        element: <AdminRoute>
          <ManageLot/>
        </AdminRoute>

      },
        {
        path: "/parking",
        element: <UserRoute>
          <ParkingLot/>
        </UserRoute>

      }
    ],
  }
]);

const App = () => {
 
  return (
   <RouterProvider router={router} />
  )
}

export default App
