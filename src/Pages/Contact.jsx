import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData, contactForm: true }; // Mark this as a contact form request

    try {
      const response = await fetch("https://thecontractornow.com/proxy.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setStatusMessage(result.success || result.error);
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form after submission
    } catch (error) {
      setStatusMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-10">
      <div className="bg-gradient-to-tr from-amber-500 to-[#1f2020] text-black text-center py-16 px-6 w-full hover">
        <h1 className="text-4xl font-bold pt-5 cursor-pointer">Contact Us</h1>
      </div>
      <div className="w-full max-w-4xl p-8 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-[#1f2020] mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#1f2020] mb-1"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm text-[#1f2020] mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary"
              placeholder="Enter the subject"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-sm text-[#1f2020] mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border-b-2 border-[#1f2020] rounded-md focus:outline-none focus:ring focus:primary resize-none"
              placeholder="Write your message"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-[#ffb000] text-black font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:[#ffb000]"
            >
              Send Message
            </button>
          </div>

          {statusMessage && (
            <p className="mt-4 text-center text-[#1f2020]">{statusMessage}</p>
          )}
        </form>
      </div>
      {/* Get Started Section */}
      <div className="bg-gradient-to-bl from-amber-500 to-[#1f2020] text-black py-16 px-6 w-full">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg mb-6">
            Let us connect you with the right professionals to make your project
            a success.
          </p>
          <button
            className="btn px-6 py-3 bg-[#ffb000] text-black font-semibold rounded-lg shadow-md hover:bg-gray-100"
            onClick={() => navigate("/services")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
