import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { paymentConfirm, reset } from "../feature/parkingSlice";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaUniversity, FaGooglePay, FaPaypal } from "react-icons/fa";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";
import { insertReservation } from "../feature/userSlice";

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
    <div className="min-h-screen bg-orange-100 flex flex-col items-center px-4 py-10 ">
      {/* Heading */}
      <div className="text-start max-w-3xl mx-auto p-10">
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r p-2 from-teal-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          Payment Details
        </h2>
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">


        {/* Formik Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          {/* Reservation Summary */}

          <h3 className="text-lg font-semibold mb-3 text-center">Reservation Summary</h3>
          <div className="items-start gap-5 flex flex-col text-2xl">
            <p><strong>Amount: ₹</strong>{paymentAmount}</p>
            <p><strong>Plan: </strong> {reservationDetails?.plan}</p>
            <p><strong>Vechile No: </strong> {reservationDetails?.userVehicleNo}</p>
            <p><strong>Start Date: </strong> {reservationDetails?.startDate}</p>
            {reservationDetails?.plan == "longTerm" || reservationDetails?.plan == "monthly" && (
              <p><strong>End Date: </strong> {reservationDetails?.endDate}</p>
            )}
            {reservationDetails?.plan == "shortTerm" && (
              <>
                <p><strong>Start Time: </strong> {reservationDetails?.startTime}</p>
                <p><strong>End Time: </strong> {reservationDetails?.endTime}</p>
              </>
            )}
          </div>

        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 ">

          {/* Method Selector with Colored Icons */}
          <div className="flex gap-4 mb-6 justify-center flex-wrap">
            <button
              onClick={() => setMethod("card")}
              className={`flex items-center gap-2 px-4 py-2 rounded border hover:bg-orange-500 hover:text-white ${method === "card" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
            >
              <FaCreditCard className="text-yellow-500 hover:text-white" /> Card
            </button>

            <button
              onClick={() => setMethod("upi")}
              className={`flex items-center gap-2 px-4 py-2 rounded border hover:bg-orange-500 hover:text-white ${method === "upi" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
            >
              <SiGooglepay className="text-yellow-500 hover:text-white" /> UPI
            </button>

            <button
              onClick={() => setMethod("netbanking")}
              className={`flex items-center gap-2 px-4 py-2 rounded border hover:bg-orange-500 hover:text-white ${method === "netbanking" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
            >
              <FaUniversity className="text-yellow-500 hover:text-white" /> Net Banking
            </button>

            <button
              onClick={() => setMethod("wallet")}
              className={`flex items-center gap-2 px-4 py-2 rounded border hover:bg-orange-500 hover:text-white ${method === "wallet" ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
            >
              <SiPaytm className="text-yellow-500 hover:text-white" /> Wallets
            </button>
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
            onSubmit={() => {
              handelSubmit();
            }}
          >

            <Form className="space-y-4" >

              {/* Conditional Forms */}
              {method === "card" && (
                <>
                  <div>
                    <label className="block mb-1">Card Number</label>
                    <Field name="cardNumber" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none" 
                    placeholder="1234 5678 9012 3456" maxLength={19}/>
                    <ErrorMessage name="cardNumber" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="block mb-1">Expiry Date</label>
                    <Field name="expiryDate" placeholder="MM/YY or MMYY" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      maxLength={5}/>
                    <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="block mb-1">CVV</label>
                    <Field name="cvv" type="password" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none" placeholder="1234" maxLength={4} />
                    <ErrorMessage name="cvv" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <label className="block mb-1">Name on Card</label>
                    <Field name="nameOnCard" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none" maxLength={20} />
                    <ErrorMessage name="nameOnCard" component="div" className="text-red-500 text-sm" />
                  </div></>)}

              {method === "upi" && (
                <div>
                  <label className="block mb-1">UPI ID</label>
                  <Field name="upiId" placeholder="example@upi" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none" />
                  <ErrorMessage name="upiId" component="div" className="text-red-500 text-sm" />
                </div>
              )}

              {method === "netbanking" && (
                <div>
                  <label className="block mb-1">Select Bank</label>
                  <Field as="select" name="bank" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none">
                    <option value="">--Choose Bank--</option>
                    <option value="SBI">SBI</option>
                    <option value="HDFC">HDFC</option>
                    <option value="ICICI">ICICI</option>
                  </Field>
                  <ErrorMessage name="bank" component="div" className="text-red-500 text-sm" />
                </div>
              )}

              {method === "wallet" && (
                <div>
                  <label className="block mb-1">Select Wallet</label>
                  <Field as="select" name="wallet" className="border p-2 w-full rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-orange-400 focus:outline-none">
                    <option value="">--Choose Wallet--</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="PayPal">PayPal</option>
                  </Field>
                  <ErrorMessage name="wallet" component="div" className="text-red-500 text-sm" />
                </div>
              )}

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
                Confirm & Pay
              </button>

              <button type="button" onClick={handelCancel} className="bg-blue-600 text-white ms-2 px-4 py-2 rounded hover:bg-blue-500">
                Cancel Payment
              </button>
            </Form>


          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
