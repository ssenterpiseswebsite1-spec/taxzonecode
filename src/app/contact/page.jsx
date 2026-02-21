"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiMessageSquare,
  FiCheckCircle,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",   
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/woocommerce/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://backend.taxzone.store/wp/wp-content/uploads/2026/02/cropped-WhatsApp-Image-2026-01-28-at-22.09.44-removebg-preview.png"
            alt="TaxZone Logo"
            width={170}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            CONTACT US
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Get in touch with us
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        {/* Main Section */}
        <div className="grid md:grid-cols-2 gap-12 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">

          {/* LEFT - FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div className="relative">
              <FiUser className="absolute left-4 top-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <FiMessageSquare className="absolute left-4 top-4 text-gray-400" />
              <textarea
                name="message"
                placeholder="Enter Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
            >
              {loading ? "Sending..." : "Send Your Request"}
            </button>

            {status === "success" && (
              <p className="text-green-600 text-sm flex items-center gap-2">
                <FiCheckCircle /> Message sent successfully!
              </p>
            )}

            {status === "error" && (
              <p className="text-red-600 text-sm">
                Something went wrong. Please try again.
              </p>
            )}
          </form>

          {/* RIGHT SIDE - INFO */}
          <div className="space-y-8">

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                With our services you can
              </h3>
              <ul className="space-y-4 text-gray-600 text-sm">
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="text-orange-500" />
                  Improve customer experience
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="text-orange-500" />
                  Increase sales conversions
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="text-orange-500" />
                  Fast doorstep delivery
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="text-orange-500" />
                  Live order tracking support
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <MdEmail className="text-orange-500 text-lg" />
                ssenterpiseswebsite1@gmail.com
              </div>

              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <FiPhone className="text-orange-500" />
                +91 87007 78622
              </div>

              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <FiMapPin className="text-orange-500" />
                Nangloi, Delhi, India
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
