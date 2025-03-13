import { motion } from "framer-motion";
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-blue-200 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
