// src/components/home/FeaturedModels.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { modelsAPI } from "../../services/api";

const FALLBACK =
  "https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=No+Image";

const safeImg = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return null;
};

const formatHeight = (height) => {
  if (!height) return null;
  if (height.feet && height.cm) return `${height.feet} · ${height.cm}CM`;
  if (height.feet) return height.feet;
  if (height.cm) return `${height.cm}CM`;
  return null;
};

const getFemaleStats = (stats) => {
  if (!stats) return [];
  const lines = [];
  const h = formatHeight(stats.height);
  if (h) lines.push({ label: "HEIGHT", value: h });
  if (stats.bust) lines.push({ label: "BUST", value: stats.bust });
  if (stats.cup) lines.push({ label: "CUP", value: stats.cup });
  if (stats.waist) lines.push({ label: "WAIST", value: stats.waist });
  if (stats.hips) lines.push({ label: "HIPS", value: stats.hips });
  if (stats.shoe) lines.push({ label: "SHOE", value: stats.shoe });
  if (stats.hairColor) lines.push({ label: "HAIR", value: stats.hairColor });
  if (stats.eyeColor) lines.push({ label: "EYES", value: stats.eyeColor });
  return lines;
};

const getMaleStats = (stats) => {
  if (!stats) return [];
  const lines = [];
  const h = formatHeight(stats.height);
  if (h) lines.push({ label: "HEIGHT", value: h });
  if (stats.chest) lines.push({ label: "CHEST", value: stats.chest });
  if (stats.waist) lines.push({ label: "WAIST", value: stats.waist });
  if (stats.inseam) lines.push({ label: "INSEAM", value: stats.inseam });
  if (stats.suit) lines.push({ label: "SUIT", value: stats.suit });
  if (stats.shoe) lines.push({ label: "SHOE", value: stats.shoe });
  if (stats.hairColor) lines.push({ label: "HAIR", value: stats.hairColor });
  if (stats.eyeColor) lines.push({ label: "EYES", value: stats.eyeColor });
  return lines;
};

const ModelCard = ({ model, index }) => {
  const primaryImg =
    safeImg(model.portfolio?.profileImage) ||
    safeImg(model.photos?.[0]?.url) ||
    FALLBACK;

  const hoverImg =
    safeImg(model.photos?.[1]?.url) ||
    safeImg(model.portfolio?.profileImage) ||
    safeImg(model.photos?.[0]?.url) ||
    FALLBACK;

  const hasDifferentHover = hoverImg !== primaryImg;

  const statsLines =
    model.gender === "male"
      ? getMaleStats(model.stats)
      : getFemaleStats(model.stats);

  const [hoveredModel, setHoveredModel] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link to={`/models/${model.slug}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
          {/* Primary Image */}
          <img
            src={primaryImg}
            alt={`${model.firstName} ${model.lastName}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK;
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              hasDifferentHover
                ? "group-hover:opacity-0"
                : "group-hover:scale-105"
            }`}
          />

          {/* Hover Image */}
          {hasDifferentHover && (
            <img
              src={hoverImg}
              alt={`${model.firstName} ${model.lastName}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK;
              }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stats Overlay */}
          {statsLines.length > 0 && (
            <div className="absolute inset-0 p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              {statsLines.map((line, i) => (
                <p
                  key={i}
                  className="text-white text-[11px] md:text-[13px] uppercase font-light leading-[1.7] tracking-wide whitespace-nowrap"
                >
                  <span className="font-semibold">{line.label}:</span>{" "}
                  {line.value}
                </p>
              ))}
            </div>
          )}

          {/* Name */}
          <h3 className="text-center text-[13px] md:text-[15px] uppercase tracking-[0.15em] font-light text-black group-hover:text-gray-500 transition-colors duration-200">
            {model.firstName} {model.lastName}
          </h3>
        </div>

        {/* Hovered Model Info */}
        {hoveredModel === model._id && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center">
            <p className="text-lg font-bold">{model.firstName} {model.lastName}</p>
            <p className="text-sm">{model.division}</p>
            <p className="text-sm">
              {typeof model.stats?.height === 'object' && model.stats?.height !== null
                ? `${model.stats.height.feet || 'N/A'}' ${model.stats.height.cm || 'N/A'} cm`
                : model.stats?.height || 'N/A'}
            </p>
          </div>
        )}
      </Link>
    </motion.div>
  );
};

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
        console.error("Error fetching models:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <p className="text-red-400 text-sm">Error loading models</p>
        </div>
      </section>
    );
  }

  if (models.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-3">
            Featured Models
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Discover our top talent
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {models.map((model, index) => (
            <ModelCard key={model._id} model={model} index={index} />
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            to="/models"
            className="inline-block px-10 py-3.5 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-light uppercase tracking-[0.2em]"
          >
            View All Models
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedModels;
