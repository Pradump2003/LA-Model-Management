// src/pages/Models.jsx
import { useState, useEffect, useMemo } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { modelsAPI } from "../services/api";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial,sans-serif' font-size='26'%3ENo Image%3C/text%3E%3C/svg%3E";

const isKnownBrokenDemoUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com/demo/");

const extractImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image.trim();
  if (typeof image === "object") return image.url?.trim() || null;
  return null;
};

const isRenderableImage = (url) => {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/") ||
    url.startsWith("data:image")
  );
};

const getImageCandidates = (model) => {
  const urls = [
    extractImageUrl(model?.portfolio?.profileImage),
    ...(model?.photos || []).map((photo) => extractImageUrl(photo)),
    extractImageUrl(model?.photos?.[0]),
    extractImageUrl(model?.photos?.[1]),
  ].filter((url) => isRenderableImage(url) && !isKnownBrokenDemoUrl(url));

  return [...new Set(urls)];
};

const getPrimaryImage = (model) => {
  const images = getImageCandidates(model);
  return images[0] || FALLBACK_IMAGE;
};

const getHoverImage = (model) => {
  const images = getImageCandidates(model);
  return images[1] || images[0] || FALLBACK_IMAGE;
};

const Models = () => {
  const { division } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState("ALL");

  const page = parseInt(searchParams.get("page") || "1");
  const ITEMS_PER_PAGE = 20;

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);

        const params = { page: 1, limit: 1000 };
        if (division) params.division = division;

        const response = await modelsAPI.getAll(params);

        if (response.data.success) {
          setAllModels(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [division]);

  const filteredModels = useMemo(() => {
    if (selectedLetter === "ALL") return allModels;
    return allModels.filter((m) =>
      m.firstName?.toUpperCase().startsWith(selectedLetter),
    );
  }, [allModels, selectedLetter]);

  const paginatedModels = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredModels.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredModels, page]);

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE);

  const activeLetters = useMemo(() => {
    const set = new Set();
    allModels.forEach((m) => {
      const c = m.firstName?.charAt(0).toUpperCase();
      if (c) set.add(c);
    });
    return set;
  }, [allModels]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setSearchParams({ page: "1" });
  };

  const renderHeight = (stats) => {
    if (!stats?.height) return null;
    const { feet, inches, cm } = stats.height;
    if (feet && inches && cm) return `${feet}' ${inches}" · ${cm}CM`;
    if (feet && inches) return `${feet}' ${inches}"`;
    if (cm) return `${cm}CM`;
    return null;
  };

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

  const getMaleStats = (stats) => {
    if (!stats) return [];
    const lines = [];
    const h = renderHeight(stats);
    if (h) lines.push({ label: "HEIGHT", value: h });
    if (stats.chest) lines.push({ label: "CHEST", value: stats.chest });
    if (stats.waist) lines.push({ label: "WAIST", value: stats.waist });
    if (stats.inseam) lines.push({ label: "INSEAM", value: stats.inseam });
    if (stats.suit) lines.push({ label: "SUIT", value: stats.suit });
    if (stats.neck) lines.push({ label: "NECK", value: stats.neck });
    if (stats.sleeve) lines.push({ label: "SLEEVE", value: stats.sleeve });
    if (stats.shoe) lines.push({ label: "SHOE", value: stats.shoe });
    if (stats.hairColor) lines.push({ label: "HAIR", value: stats.hairColor });
    if (stats.eyeColor) lines.push({ label: "EYES", value: stats.eyeColor });
    return lines;
  };

  const getStatsLines = (model) =>
    model.gender === "male"
      ? getMaleStats(model.stats)
      : getFemaleStats(model.stats);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black" />
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
        {/* Title */}
        <Motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-10"
        >
          {division ? division.replace(/-/g, " ") : "All Models"}
        </Motion.h1>

        {/* Alphabet Filter */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 mb-10">
          <button
            type="button"
            onClick={() => handleLetterClick("ALL")}
            className={`text-sm md:text-base font-light px-1 transition-colors duration-200 ${
              selectedLetter === "ALL"
                ? "text-black font-medium"
                : "text-gray-400 hover:text-black"
            }`}
          >
            [ALL]
          </button>

          {alphabet.map((letter) => {
            const isActive = activeLetters.has(letter);
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => isActive && handleLetterClick(letter)}
                className={`text-sm md:text-base font-light px-1 transition-colors duration-200 ${
                  isSelected
                    ? "text-black font-medium"
                    : isActive
                      ? "text-gray-600 hover:text-black"
                      : "text-gray-200 cursor-default select-none"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-10">
          {filteredModels.length}{" "}
          {filteredModels.length === 1 ? "Model" : "Models"}
        </p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {paginatedModels.length > 0 ? (
            <Motion.div
              key={selectedLetter + "-" + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-12"
            >
              {paginatedModels.map((model, index) => {
                const statsLines = getStatsLines(model);
                const primaryImg = getPrimaryImage(model);
                const hoverImg = getHoverImage(model);
                const hasDifferentHover = hoverImg !== primaryImg;
                const hoverInfoLines =
                  statsLines.length > 0
                    ? statsLines
                    : [
                        {
                          label: "PROFILE",
                          value: (model.division || "MODEL").toUpperCase(),
                        },
                        { label: "INFO", value: "CLICK TO VIEW" },
                      ];

                return (
                  <Motion.div
                    key={model._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.35 }}
                  >
                    <Link to={`/models/${model.slug}`} className="group block">
                      {/* Card Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                        {/* Primary Image */}
                        <img
                          src={primaryImg}
                          alt={`${model.firstName} ${model.lastName}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          className={`absolute inset-0 z-10 w-full h-full object-cover transition-all duration-500 ${
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
                              e.target.src = FALLBACK_IMAGE;
                            }}
                            className="absolute inset-0 z-20 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                          />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 z-30 bg-gradient-to-b from-black/75 via-black/45 to-black/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100 transition-opacity duration-300" />

                        {/* Stats */}
                        <div className="absolute inset-0 z-40 p-4 md:p-5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100 transition-all duration-300 flex flex-col justify-start pointer-events-none translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0 group-active:translate-y-0">
                          {hoverInfoLines.map((line, i) => (
                            <p
                              key={i}
                              className="text-white text-[11px] md:text-[13px] uppercase font-light leading-6 tracking-wide whitespace-nowrap [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]"
                            >
                              <span className="font-semibold">
                                {line.label}:
                              </span>{" "}
                              {line.value}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="text-center text-[13px] md:text-[15px] uppercase tracking-[0.15em] font-light text-black group-hover:text-gray-500 transition-colors duration-200">
                        {model.firstName} {model.lastName}
                      </h3>
                    </Link>
                  </Motion.div>
                );
              })}
            </Motion.div>
          ) : (
            <Motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-28"
            >
              <p className="text-gray-200 text-7xl font-light mb-4">
                {selectedLetter !== "ALL" ? selectedLetter : "∅"}
              </p>
              <p className="text-gray-400 uppercase tracking-widest text-sm">
                No models found
                {selectedLetter !== "ALL" && ` for "${selectedLetter}"`}
              </p>
              {selectedLetter !== "ALL" && (
                <button
                  type="button"
                  onClick={() => handleLetterClick("ALL")}
                  className="mt-6 text-sm uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-gray-400 hover:border-gray-400 transition-colors"
                >
                  View All Models
                </button>
              )}
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 items-center gap-2 flex-wrap">
            {page > 1 && (
              <Link
                to={`?page=${page - 1}${selectedLetter !== "ALL" ? `&letter=${selectedLetter}` : ""}`}
                className="px-4 py-2 text-sm uppercase tracking-widest border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                ← Prev
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const show =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - page) <= 1;

                const ellipsisBefore = pageNum === page - 2 && page > 3;
                const ellipsisAfter =
                  pageNum === page + 2 && page < totalPages - 2;

                if (ellipsisBefore || ellipsisAfter) {
                  return (
                    <span key={`e-${pageNum}`} className="px-2 text-gray-300">
                      ...
                    </span>
                  );
                }

                if (!show) return null;

                return (
                  <Link
                    key={pageNum}
                    to={`?page=${pageNum}${selectedLetter !== "ALL" ? `&letter=${selectedLetter}` : ""}`}
                    className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                      pageNum === page
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              },
            )}

            {page < totalPages && (
              <Link
                to={`?page=${page + 1}${selectedLetter !== "ALL" ? `&letter=${selectedLetter}` : ""}`}
                className="px-4 py-2 text-sm uppercase tracking-widest border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
