// src/components/models/ModelGrid.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial,sans-serif' font-size='26'%3EModel%3C/text%3E%3C/svg%3E";

const isKnownBrokenDemoUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com/demo/");

const resolveImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    const trimmed = image.trim();
    return isKnownBrokenDemoUrl(trimmed) ? null : trimmed;
  }
  const url = image.url?.trim() || null;
  return isKnownBrokenDemoUrl(url) ? null : url;
};

const getModelImage = (model) =>
  resolveImageUrl(model.portfolio?.profileImage) ||
  resolveImageUrl(model.photos?.[0]) ||
  FALLBACK_IMAGE;

const ModelGrid = ({ models, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No models found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {models.map((model, index) => (
        <motion.div
          key={model._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link to={`/model/${model.slug}`} className="group block">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
              <img
                src={getModelImage(model)}
                alt={`${model.firstName} ${model.lastName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(event) => {
                  if (event.currentTarget.src !== FALLBACK_IMAGE) {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }
                }}
              />
            </div>
            <h3 className="text-base font-medium mb-1">
              {model.firstName} {model.lastName}
            </h3>
            {model.stats?.height?.cm && (
              <p className="text-xs text-gray-500">
                {model.stats.height.cm} cm
              </p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ModelGrid;
