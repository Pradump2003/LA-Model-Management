// src/components/common/Footer.jsx
import { Link } from "react-router-dom";
import { Camera, Globe, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">LA MODELS</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Los Angeles' premier modeling agency, representing the world's top
              talent since 1985.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">
              Divisions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/models/women"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/models/men"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/models/new-faces"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  New Faces
                </Link>
              </li>
              <li>
                <Link
                  to="/models/direct"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Direct
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Become a Model
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Camera className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Send className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 LA Models. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
