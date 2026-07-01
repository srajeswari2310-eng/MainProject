import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { paymentConfirm, reset } from "../feature/parkingSlice";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaUniversity, FaGooglePay, FaPaypal } from "react-icons/fa";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";
import { insertReservation } from "../feature/userSlice";


// ✅ Reusable InputField
const InputField = ({ name, label, ...props }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <Field
      name={name}
      {...props}
      className="border p-2 w-full rounded-xl hover:bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

// ✅ Reusable SelectField
const SelectField = ({ name, label, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <Field
      as="select"
      name={name}
      className="border p-2 w-full rounded-xl hover:bg-gray-100 focus:ring-2 focus:ring-orange-400 focus:outline-none"
    >
      <option value="">--Choose--</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

const cardSchema = Yup.object({
  cardNumber: Yup.string()
    .matches(/^(\d{4}\s?){4}$/, "Card Number must be 16 digits (spaces allowed)")
    .required("Card number is required"),
  expiryDate: Yup.string()
   .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Format MMYY or MM/YY")
    .required("Expiry date is required"),
  cvv: Yup.string()
    .matches(/^[0-9]{4}$/, "CVV must be 3 digits")
    .required("CVV is required"),
  nameOnCard: Yup.string()
  .min(5,"Minimum 5 characters")
  .required("Name on card is required"),
});

const upiSchema = Yup.object({
  upiId: Yup.string()
    .matches(/^[\w.-]+@[\w.-]+$/, "Enter valid UPI ID")
    .required("UPI ID is required"),
});

const netBankingSchema = Yup.object({
  bank: Yup.string().required("Please select a bank"),
});

const walletSchema = Yup.object({
  wallet: Yup.string().required("Please select a wallet"),
});

const PaymentPage = () => {

  const { reservationDetails, paymentAmount, selectedLocation, selectedSlot } = useSelector((state) => state.parking);
  const { currentUser } = useSelector((state) => state.user)
  const [method, setMethod] = useState("card");

  // Pick schema dynamically
  const getSchema = () => {
    switch (method) {
      case "card":
        return cardSchema;
      case "upi":
        return upiSchema;
      case "netbanking":
        return netBankingSchema;
      case "wallet":
        return walletSchema;
      default:
        return Yup.object({});
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelCancel = () => {
    if (confirm("Are You sure to cancel booking")) {
      dispatch(reset({ currentUser }));
      navigate("/home/parking");
    }
  }

  const handelSubmit = () => {
    if (confirm("Confirm Booking")) {
      dispatch(paymentConfirm({ paymentMade: true, currentUser: currentUser }));
      console.log(reservationDetails.plan)
      dispatch(insertReservation({ details : reservationDetails, location: selectedLocation, floorId: selectedSlot.floorId, slotId: selectedSlot.slotId}));
      
      dispatch(reset({ currentUser }));
      navigate("/home");
    }
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex flex-col items-center px-6 py-12">
    {/* Heading */}
    <div className="w-full max-w-4xl text-center mb-10">
      <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
        Payment Details
      </h2>
      <p className="text-gray-600 mt-2 text-sm md:text-base">
        Review your reservation and complete payment securely
      </p>
    </div>

    {/* Grid Layout */}
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Reservation Summary */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Reservation Summary
        </h3>
        <div className="space-y-3 text-gray-700 text-lg">
          <p><strong>Amount: ₹</strong>{paymentAmount}</p>
          <p><strong>Plan: </strong>{reservationDetails?.plan}</p>
          <p><strong>Vehicle No: </strong>{reservationDetails?.userVehicleNo}</p>
          <p><strong>Start Date: </strong>{reservationDetails?.startDate}</p>
          {(reservationDetails?.plan === "longTerm" || reservationDetails?.plan === "monthly") && (
            <p><strong>End Date: </strong>{reservationDetails?.endDate}</p>
          )}
          {reservationDetails?.plan === "shortTerm" && (
            <>
              <p><strong>Start Time: </strong>{reservationDetails?.startTime}</p>
              <p><strong>End Time: </strong>{reservationDetails?.endTime}</p>
            </>
          )}
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        
        {/* Method Selector */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {[
            { key: "card", label: "Card", icon: <FaCreditCard /> },
            { key: "upi", label: "UPI", icon: <SiGooglepay /> },
            { key: "netbanking", label: "Net Banking", icon: <FaUniversity /> },
            { key: "wallet", label: "Wallets", icon: <SiPaytm /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg border transition-all duration-200 ${
                method === key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white"
              }`}
            >
              <span className="text-yellow-500">{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Payment Form */}
        <Formik
          initialValues={{
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            nameOnCard: "",
            upiId: "",
            bank: "",
            wallet: "",
          }}
          validationSchema={getSchema()}
          onSubmit={handelSubmit}
        >
          <Form className="space-y-5">
            {/* Conditional Inputs */}
            {method === "card" && (
              <>
                <InputField name="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19} />
                <InputField name="expiryDate" label="Expiry Date" placeholder="MM/YY" maxLength={5} />
                <InputField name="cvv" label="CVV" type="password" placeholder="123" maxLength={4} />
                <InputField name="nameOnCard" label="Name on Card" maxLength={20} />
              </>
            )}

            {method === "upi" && (
              <InputField name="upiId" label="UPI ID" placeholder="example@upi" />
            )}

            {method === "netbanking" && (
              <SelectField name="bank" label="Select Bank" options={["SBI", "HDFC", "ICICI"]} />
            )}

            {method === "wallet" && (
              <SelectField name="wallet" label="Select Wallet" options={["Paytm", "PhonePe", "PayPal"]} />
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition">
                Confirm & Pay
              </button>
              <button type="button" onClick={handelCancel} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  </div>
);

};

export default PaymentPage;
