import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      // Handle pasting a full code
      const pastedCode = value.slice(0, 6).split("");
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);

      // Auto-submit if fully filled
      if (pastedCode.length === 6) {
        setTimeout(() => handleSubmit(), 100);
      }
      return;
    }

    // Normal digit entry
    newCode[index] = value;
    setCode(newCode);

    // Move focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission

    const verificationCode = code.join("");

    if (!/^\d{6}$/.test(verificationCode)) {
      setLocalError("Invalid code! Please enter a 6-digit number.");
      return;
    }

    try {
      const response = await verifyEmail(verificationCode);
      if (response?.user) {
        toast.success("Email verified successfully!");
        navigate("/");
      } else {
        setLocalError("Verification failed! Please check your code.");
      }
    } catch (err) {
      setLocalError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Enter the 6-digit code sent to your email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-500 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>
            {(error || localError) && (
              <p className="text-red-500 font-semibold mt-2">
                {localError || error}
              </p>
            )}
            <motion.button
              className="mt-5 w-full py-3 px-4 
                      bg-gradient-to-r from-blue-500 to-indigo-600 
                      text-white font-bold rounded-lg shadow-lg 
                      hover:from-blue-600 hover:to-indigo-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || code.includes("")}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
