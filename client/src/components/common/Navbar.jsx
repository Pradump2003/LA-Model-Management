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
        isSolidNavbar ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom px-4">
        <div className="flex items-center justify-between gap-2">
          {/* ✅ Logo - nowrap fix */}
          <Link to="/" className="flex-shrink-0">
            <h1
              className={`text-xl xl:text-3xl font-bold tracking-wider whitespace-nowrap transition-colors ${
                isSolidNavbar ? "text-black" : "text-white"
              }`}
            >
              LA MODELS
            </h1>
          </Link>

          {/* ✅ Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 flex-1 justify-end">
            {/* Models Dropdown */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setModelsDropdown(true)}
              onMouseLeave={() => setModelsDropdown(false)}
            >
              <button
                className={`flex items-center space-x-1 text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors whitespace-nowrap ${
                  isSolidNavbar
                    ? "text-black hover:text-gray-600"
                    : "text-white hover:text-gray-200"
                }`}
              >
                <span>Models</span>
                <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4" />
              </button>

              <AnimatePresence>
                {modelsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg z-50"
                  >
                    {divisions.map((division) => (
                      <Link
                        key={division.path}
                        to={division.path}
                        className="block px-5 py-2.5 text-xs text-black hover:bg-gray-100 transition-colors"
                      >
                        {division.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links */}
            {[
              { label: "About", path: "/about" },
              { label: "News", path: "/news" },
              { label: "Press", path: "/press" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 text-xs xl:text-sm font-medium uppercase tracking-wide transition-colors whitespace-nowrap ${
                  isSolidNavbar
                    ? "text-black hover:text-gray-600"
                    : "text-white hover:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* ✅ Become a Model Button - fixed size */}
            <Link
              to="/apply"
              className="flex-shrink-0 px-3 xl:px-5 py-2 bg-black text-white text-xs font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Become a Model
            </Link>

            {/* ✅ Search - smaller on small laptops */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-shrink-0"
            >
              <Search
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                  isSolidNavbar ? "text-gray-500" : "text-white/80"
                }`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className={`w-32 xl:w-48 rounded-full border pl-8 pr-3 py-2 text-xs uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 ${
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
            className={`lg:hidden flex-shrink-0 ${
              isSolidNavbar ? "text-black" : "text-white"
            }`}
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
              className="lg:hidden mt-4 bg-white overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="px-4 pb-3">
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

                {/* Divisions */}
                <div className="border-b pb-3">
                  <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-1">
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

                {/* Other Links */}
                {[
                  { label: "About", path: "/about" },
                  { label: "News", path: "/news" },
                  { label: "Press", path: "/press" },
                  { label: "Contact", path: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Become a Model */}
                <div className="px-4 pt-2">
                  <Link
                    to="/apply"
                    className="block px-6 py-2.5 bg-black text-white text-sm font-medium text-center uppercase hover:bg-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Become a Model
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
