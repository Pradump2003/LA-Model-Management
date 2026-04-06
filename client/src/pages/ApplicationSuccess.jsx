// src/pages/ApplicationSuccess.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ApplicationSuccess = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464863979621-258859e62245?w=1920&q=80"
          alt="Application submitted"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-6">
            Thank You For Applying
          </h1>
        </div>
      </div>

      <div className="py-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Application Submitted!</h2>
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
    </div>
  );
};

export default ApplicationSuccess;
