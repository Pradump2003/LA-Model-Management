// src/components/common/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modelsDropdown, setModelsDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isSolidNavbar = scrolled;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      navigate("/models");
      return;
    }

    navigate(`/models?q=${encodeURIComponent(trimmed)}&page=1`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // src/components/common/Navbar.jsx (divisions array)
  const divisions = [
    { name: "All Models", path: "/models" },
    { name: "Women", path: "/models/women" },
    { name: "Men", path: "/models/men" },
    { name: "New Faces", path: "/models/new-faces" },
    { name: "Direct", path: "/models/direct" },
    { name: "Special Booking", path: "/models/special-booking" },
    { name: "Juniors", path: "/models/juniors" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isSolidNavbar ? "bg-white shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1
              className={`text-3xl font-bold tracking-wider transition-colors ${
                isSolidNavbar ? "text-black" : "text-white"
              }`}
            >
              LA MODELS
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {/* Models Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setModelsDropdown(true)}
              onMouseLeave={() => setModelsDropdown(false)}
            >
              <button
                className={`flex items-center space-x-1 text-sm font-medium uppercase tracking-wide transition-colors ${
                  isSolidNavbar
                    ? "text-black hover:text-gray-600"
                    : "text-white hover:text-gray-200"
                }`}
              >
                <span>Models</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {modelsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg"
                  >
                    {divisions.map((division) => (
                      <Link
                        key={division.path}
                        to={division.path}
                        className="block px-6 py-3 text-sm text-black hover:bg-gray-100 transition-colors"
                      >
                        {division.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/about"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isSolidNavbar
                  ? "text-black hover:text-gray-600"
                  : "text-white hover:text-gray-200"
              }`}
            >
              About
            </Link>

            <Link
              to="/news"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isSolidNavbar
                  ? "text-black hover:text-gray-600"
                  : "text-white hover:text-gray-200"
              }`}
            >
              News
            </Link>

            <Link
              to="/press"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isSolidNavbar
                  ? "text-black hover:text-gray-600"
                  : "text-white hover:text-gray-200"
              }`}
            >
              Press
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isSolidNavbar
                  ? "text-black hover:text-gray-600"
                  : "text-white hover:text-gray-200"
              }`}
            >
              Contact
            </Link>

            <Link
              to="/apply"
              className="px-6 py-2 bg-black text-white text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              Become a Model
            </Link>

            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isSolidNavbar ? "text-gray-500" : "text-white/80"
                }`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models"
                className={`w-52 rounded-full border pl-9 pr-4 py-2 text-xs uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 ${
                  isSolidNavbar
                    ? "border-gray-300 bg-white text-black placeholder:text-gray-400"
                    : "border-white/50 bg-white/10 text-white placeholder:text-white/70"
                }`}
              />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden ${isSolidNavbar ? "text-black" : "text-white"}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-white"
            >
              <div className="py-4 space-y-4">
                <form onSubmit={handleSearchSubmit} className="px-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search models"
                      className="w-full rounded-full border border-gray-300 pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </form>

                <div className="border-b pb-4">
                  <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
                    Divisions
                  </p>
                  {divisions.map((division) => (
                    <Link
                      key={division.path}
                      to={division.path}
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {division.name}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/about"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                <Link
                  to="/news"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  News
                </Link>

                <Link
                  to="/press"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Press
                </Link>

                <Link
                  to="/contact"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>

                <Link
                  to="/apply"
                  className="block mx-4 px-6 py-2 bg-black text-white text-sm font-medium text-center uppercase hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  Become a Model
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
