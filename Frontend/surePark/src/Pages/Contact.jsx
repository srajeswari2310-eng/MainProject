import React from 'react'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import contact from '../assets/contact-us.jpg'

const Contact = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10 bg-cover bg-center" style={{ backgroundImage: `url(${contact})` }}>

            

                {/* Heading */}
                <div className="text-start max-w-3xl mx-auto p-10 text-white">
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Contact Us
                    </h2>

                </div>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Contact Form */}
                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Send us a message</h2>
                        <form className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                            <textarea
                                placeholder="Your Message"
                                rows="5"
                                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            ></textarea>
                            <button
                                type="button"
                                onClick={()=>{alert("Message Sent")}}
                                className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-6">
                        <h2 className="text-xl font-semibold text-gray-700">Get in touch</h2>
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaPhoneAlt className="text-orange-500" />
                            <span>+91 98765 XXXXX</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaEnvelope className="text-orange-500" />
                            <span>support@surePark.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaMapMarkerAlt className="text-orange-500" />
                            <span>123, Main Street, Chennai, TN</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact