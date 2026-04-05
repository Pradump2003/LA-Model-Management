// src/pages/Models.jsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { modelsAPI } from "../services/api";

const Models = () => {
  const { division } = useParams();
  const [searchParams] = useSearchParams();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 20,
        };

        if (division) {
          params.division = division;
        }

        const response = await modelsAPI.getAll(params);

        if (response.data.success) {
          setModels(response.data.data);
          setPagination(response.data.meta);
        }
      } catch (err) {
        console.error("Error fetching models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [division, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container-custom py-16">
        <h1 className="text-5xl font-bold mb-8 capitalize">
          {division ? `${division} Models` : "All Models"}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/models/${model.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={
                      model.portfolio?.profileImage ||
                      model.photos?.[0]?.url ||
                      "https://via.placeholder.com/400x600"
                    }
                    alt={`${model.firstName} ${model.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {model.firstName} {model.lastName}
                </h3>
                <p className="text-sm text-gray-500">{model.division}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  to={`?page=${pageNum}`}
                  className={`px-4 py-2 border ${
                    pageNum === pagination.currentPage
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
