// src/components/home/Divisions.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Divisions = () => {
  const divisions = [
    {
      name: "Women",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      path: "/models/women",
    },
    {
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
      path: "/models/men",
    },
    {
      name: "New Faces",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      path: "/models/new-faces",
    },
    {
      name: "Direct",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      path: "/models/direct",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Our Divisions</h2>
          <p className="text-gray-600 text-lg">Explore our model categories</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((division, index) => (
            <motion.div
              key={division.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={division.path} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={division.image}
                    alt={division.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-4xl font-bold text-white uppercase tracking-wider">
                      {division.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Divisions;
