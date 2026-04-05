// src/components/home/FeaturedModels.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { modelsAPI } from '../../services/api';

const FeaturedModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await modelsAPI.getAll({
          isFeatured: true,
          limit: 8,
        });
        
        if (response.data.success) {
          setModels(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading models: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Featured Models</h2>
          <p className="text-gray-600 text-lg">Discover our top talent</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/models/${model.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={
                      model.portfolio?.profileImage || 
                      model.photos?.[0]?.url || 
                      'https://via.placeholder.com/400x600'
                    }
                    alt={`${model.firstName} ${model.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {model.firstName} {model.lastName}
                </h3>
                <p className="text-sm text-gray-500 uppercase">
                  {model.division}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/models"
            className="inline-block px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
          >
            View All Models
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedModels;