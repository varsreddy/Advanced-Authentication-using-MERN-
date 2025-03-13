import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, setError } = useAuthStore();
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", email, password);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:underline mb-4"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          )}
          <motion.button
            className="mt-3 w-full py-3 px-4 
                    bg-gradient-to-r from-blue-500 to-indigo-600 
                    text-white font-bold rounded-lg shadow-lg 
                    hover:from-blue-600 hover:to-indigo-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Didn't have an account?{"  "}
          <Link to={"/signup"} className="text-blue-400 hover:underline">
            SignUp
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
