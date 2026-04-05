// src/pages/ApplicationSuccess.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ApplicationSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for applying to LA Models. We've received your application
          and will review it shortly. You should receive a confirmation email
          within 24 hours.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-black text-white font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ApplicationSuccess;
