import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheckCircle, // Added for success message
} from "react-icons/fa";
import "../index.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" }); // To show success/error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being typed into
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    // Phone number is optional for mailto, but keeping validation if you want it required.
    // If you want it optional, remove this line:
    if (!formData.number.trim()) newErrors.number = "Phone number is required";
    // Message can be optional, no validation needed unless specified

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage({ type: "", text: "" }); // Clear previous messages

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitMessage({ type: "error", text: "Please correct the errors in the form." });
      return;
    }

    // --- Constructing the mailto link ---
    const recipientEmail = "victorachede@gmail.com";
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.number}\n\n` +
      `Message:\n${formData.message}`
    );

    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    try {
      window.open(mailtoLink, "_blank"); // Open email client in a new tab/window
      setSubmitMessage({ type: "success", text: "Your email client will open with the message. Please send it from there!" });
      setFormData({ name: "", email: "", number: "", message: "" }); // Reset form
      setErrors({}); // Clear errors
    } catch (error) {
      console.error("Mailto error:", error);
      setSubmitMessage({ type: "error", text: "Could not open email client. Please check your system settings or email victorachede@gmail.com directly." });
    }
  };

  const inputStyles = (field) =>
    `w-full bg-transparent text-black placeholder-gray-400 pl-10 pr-4 py-3 border ${
      errors[field] ? "border-red-500 shake" : "border-cyan-500"
    } rounded-md focus:outline-none focus:ring-2 ${
      errors[field] ? "focus:ring-red-400" : "focus:ring-cyan-400"
    }`;

  return (
    <div className="bg-white min-h-screen p-6 transition-colors duration-500">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl mx-auto text p-6 rounded-lg shadow-xl bg-white text-black"
        noValidate
      >
        <h2 className="text-3xl font-bold  text-center mb-6">Get in Touch</h2>

        {/* Submission Message */}
        {submitMessage.text && (
          <div className={`p-3 rounded-md text-center flex items-center justify-center gap-2 ${
            submitMessage.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}>
            {submitMessage.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            {submitMessage.text}
          </div>
        )}

        {/* Name Field */}
        <div className="relative">
          <FaUser className="absolute top-3.5 left-3" />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className={inputStyles("name")}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <div className="text-red-500 mt-1 text-sm flex items-center gap-1">
              <FaExclamationCircle /> {errors.name}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="relative">
          <FaEnvelope className="absolute top-3.5 left-3 " />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={inputStyles("email")}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="text-red-500 mt-1 text-sm flex items-center gap-1">
              <FaExclamationCircle /> {errors.email}
            </div>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="relative">
          <FaPhone className="absolute top-3.5 left-3" />
          <input
            type="tel"
            name="number"
            placeholder="Your Phone Number"
            className={inputStyles("number")}
            value={formData.number}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {errors.number && (
            <div className="text-red-500 mt-1 text-sm flex items-center gap-1">
              <FaExclamationCircle /> {errors.number}
            </div>
          )}
        </div>

        {/* Message Field */}
        <textarea
          name="message"
          rows="5"
          placeholder="Your Message"
          className="w-full bg-transparent placeholder-gray-400 p-4 border border-cyan-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={formData.message}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 cursor-pointer text-white py-3 px-6 rounded-md flex items-center justify-center gap-3 font-semibold transition"
        >
          Open Email Client <FaPaperPlane />
        </button>

        {/* Buy Me a Coffee Button (Uncomment if you want to use it) */}
        {/*
        <a
          href="https://www.buymeacoffee.com/victor"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-md font-semibold transition flex items-center justify-center gap-2"
        >
          <FaCoffee /> Buy Me a Coffee
        </a>
        */}
      </form>
    </div>
  );
};

export default ContactForm;
