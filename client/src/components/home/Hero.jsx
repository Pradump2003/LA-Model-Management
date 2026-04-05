// src/components/home/Hero.jsx
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1920&q=80"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              LA MODELS
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              Representing Fashion's Finest
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black text-sm font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              View Our Models
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
