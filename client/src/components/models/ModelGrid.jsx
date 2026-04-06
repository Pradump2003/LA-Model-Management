// src/components/models/ModelGrid.jsx
import { useState } from "react";
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

// ✅ Get Primary Image
const getPrimaryImage = (model) =>
  resolveImageUrl(model.portfolio?.profileImage) ||
  resolveImageUrl(model.photos?.[0]) ||
  FALLBACK_IMAGE;

// ✅ Get Hover Image (second photo)
const getHoverImage = (model) =>
  resolveImageUrl(model.photos?.[1]) ||
  resolveImageUrl(model.portfolio?.profileImage) ||
  resolveImageUrl(model.photos?.[0]) ||
  FALLBACK_IMAGE;

// ✅ Height formatter
const renderHeight = (stats) => {
  if (!stats?.height) return null;
  const { feet, inches, cm } = stats.height;
  if (feet && inches && cm) return `${feet}'${inches}" / ${cm}cm`;
  if (feet && inches) return `${feet}'${inches}"`;
  if (cm) return `${cm}cm`;
  return null;
};

// ✅ Female Stats
const getFemaleStats = (stats) => {
  if (!stats) return [];
  const lines = [];
  const h = renderHeight(stats);
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

// ✅ Male Stats
const getMaleStats = (stats) => {
  if (!stats) return [];
  const lines = [];
  const h = renderHeight(stats);
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

const getStatsLines = (model) =>
  model.gender === "male"
    ? getMaleStats(model.stats)
    : getFemaleStats(model.stats);

// ==============================================
// ✅ Single Model Card with Hover Functionality
// ==============================================
const ModelCard = ({ model, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImg = getPrimaryImage(model);
  const hoverImg = getHoverImage(model);
  const hasDifferentHover = hoverImg !== primaryImg;
  const statsLines = getStatsLines(model);

  const displayStats =
    statsLines.length > 0
      ? statsLines
      : [
          {
            label: "DIVISION",
            value: (model.division || "MODEL").toUpperCase(),
          },
        ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 1800)}
    >
      <Link to={`/models/${model.slug}`} className="block cursor-pointer">
        {/* ✅ Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
          {/* Primary Image */}
          <img
            src={primaryImg}
            alt={`${model.firstName} ${model.lastName}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              zIndex: 10,
              opacity: isHovered && hasDifferentHover ? 0 : 1,
              transform:
                isHovered && !hasDifferentHover ? "scale(1.06)" : "scale(1.0)",
              transition: "opacity 0.6s ease, transform 0.7s ease",
            }}
          />

          {/* ✅ Hover Image */}
          {hasDifferentHover && (
            <img
              src={hoverImg}
              alt={`${model.firstName} ${model.lastName}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                zIndex: 20,
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1.04)" : "scale(1.0)",
                transition: "opacity 0.6s ease, transform 0.7s ease",
              }}
            />
          )}

          {/* ✅ Dark Overlay */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 30,
              background: "rgba(0,0,0,0.52)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* ✅ Stats - Perfectly Centered */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-3"
            style={{
              zIndex: 40,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0px)" : "translateY(10px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: "none",
            }}
          >
            {/* Model Name */}
            <p
              className="text-white text-[11px] md:text-[13px] uppercase tracking-[0.2em] font-semibold text-center mb-2"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
            >
              {model.firstName} {model.lastName}
            </p>

            {/* ✅ Animated Divider */}
            <div
              className="bg-white/50 mb-3"
              style={{
                height: "1px",
                width: isHovered ? "32px" : "0px",
                transition: "width 0.5s ease 0.1s",
              }}
            />

            {/* ✅ Stats Lines - Centered with label · value */}
            <div className="flex flex-col items-center gap-[3px] w-full">
              {displayStats.map((line, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  {/* Label */}
                  <span
                    className="text-white/60 text-[8px] md:text-[10px] uppercase tracking-widest font-medium text-right"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                      minWidth: "48px",
                    }}
                  >
                    {line.label}
                  </span>

                  {/* Dot */}
                  <span className="text-white/30 text-[8px]">·</span>

                  {/* Value */}
                  <span
                    className="text-white text-[8px] md:text-[10px] uppercase tracking-wider font-light text-left"
                    style={{
                      textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                      minWidth: "48px",
                    }}
                  >
                    {line.value}
                  </span>
                </div>
              ))}
            </div>

            {/* ✅ View Profile CTA */}
            <div className="mt-4">
              <span
                className="text-white/70 text-[8px] md:text-[10px] uppercase tracking-[0.2em] border-b border-white/30 pb-px"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.7)" }}
              >
                View Profile
              </span>
            </div>
          </div>
        </div>

        {/* ✅ Model Name Below Card */}
        <h3
          className="text-[11px] md:text-[13px] uppercase tracking-[0.15em] font-light transition-colors duration-300 mb-0.5"
          style={{ color: isHovered ? "#9ca3af" : "#000000" }}
        >
          {model.firstName} {model.lastName}
        </h3>

        {/* ✅ Height Below Name */}
        {model.stats?.height?.cm && (
          <p className="text-[9px] md:text-[11px] text-gray-400 uppercase tracking-widest">
            {renderHeight(model.stats)}
          </p>
        )}
      </Link>
    </motion.div>
  );
};

// ==============================================
// ✅ MAIN ModelGrid Component
// ==============================================
const ModelGrid = ({ models, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black" />
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <p className="text-gray-200 text-7xl font-light mb-4">∅</p>
        <p className="text-gray-400 uppercase tracking-widest text-sm">
          No models found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
      {models.map((model, index) => (
        <ModelCard key={model._id} model={model} index={index} />
      ))}
    </div>
  );
};

export default ModelGrid;
