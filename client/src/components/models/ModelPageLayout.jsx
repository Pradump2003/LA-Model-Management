// src/components/models/ModelPageLayout.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import ModelGrid from "./ModelGrid";
import { modelsAPI } from "../../services/api";

const ModelPageLayout = ({ division, title, description, heroImage }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";
  const letter = searchParams.get("letter") || "";

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 20,
          sort: "-createdAt",
        };

        if (division) {
          params.division = division;
        }

        if (category) {
          params.category = category;
        }

        // Letter takes priority over search
        if (letter) {
          params.letter = letter;
        } else if (searchQuery) {
          params.search = searchQuery;
        }

        console.log("Fetching models with params:", params); // Debug log

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
  }, [division, page, category, searchQuery, letter]);

  const categories =
    division === "women" || division === "men"
      ? ["main-board", "new-faces"]
      : division === "direct"
        ? ["direct", "classic"]
        : division === "juniors"
          ? ["girls", "boys", "family"]
          : [];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handlePageChange = (newPage) => {
    const params = { page: newPage };

    if (category) params.category = category;
    if (letter) {
      params.letter = letter;
    } else if (searchQuery) {
      params.q = searchQuery;
    }

    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLetterClick = (selectedLetter) => {
    const params = {
      page: 1,
      letter: selectedLetter,
    };

    if (category) params.category = category;
    // Don't include search query when letter is selected

    setSearchParams(params);
  };

  const handleCategoryClick = (selectedCategory) => {
    const params = { page: 1 };

    if (selectedCategory) params.category = selectedCategory;

    if (letter) {
      params.letter = letter;
    } else if (searchQuery) {
      params.q = searchQuery;
    }

    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({ page: 1 });
  };

  const removeFilter = (filterType) => {
    const params = { page: 1 };

    if (filterType !== "search" && searchQuery && !letter)
      params.q = searchQuery;
    if (filterType !== "category" && category) params.category = category;
    if (filterType !== "letter" && letter) params.letter = letter;

    setSearchParams(params);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-bold mb-4"
            >
              {title}
            </Motion.h1>
            {description && (
              <Motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/90"
              >
                {description}
              </Motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Alphabet Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <button
              onClick={clearAllFilters}
              className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                !letter && !category && !searchQuery
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              ALL
            </button>
            {alphabet.map((char) => (
              <button
                key={char}
                onClick={() => handleLetterClick(char)}
                className={`px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                  letter === char
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryClick("")}
              className={`px-6 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                !category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-6 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                  category === cat
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters */}
        {(searchQuery || category || letter) && (
          <div className="mb-6 flex items-center gap-3 text-sm flex-wrap">
            <span className="text-gray-500">Active Filters:</span>
            {searchQuery && !letter && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-black flex items-center gap-2">
                Search: {searchQuery}
                <button
                  type="button"
                  onClick={() => removeFilter("search")}
                  className="text-gray-600 hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
            {category && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-black flex items-center gap-2">
                Category: {category.replace("-", " ")}
                <button
                  type="button"
                  onClick={() => removeFilter("category")}
                  className="text-gray-600 hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
            {letter && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-black flex items-center gap-2">
                Letter: {letter}
                <button
                  type="button"
                  onClick={() => removeFilter("letter")}
                  className="text-gray-600 hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-gray-600 underline hover:text-black"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Models Grid */}
        <ModelGrid models={models} loading={loading} />

        {/* No Results Message */}
        {!loading && models.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No models found {letter && `starting with "${letter}"`}
              {category && ` in category "${category.replace("-", " ")}"`}
              {searchQuery && ` matching "${searchQuery}"`}.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 border ${
                page === 1
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-black text-black hover:bg-black hover:text-white"
              } transition-colors`}
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 border ${
                    pageNum === page
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black hover:bg-gray-100"
                  } transition-colors`}
                >
                  {pageNum}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className={`px-4 py-2 border ${
                page === pagination.totalPages
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-black text-black hover:bg-black hover:text-white"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        )}

        {/* Results info */}
        {pagination.total > 0 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            Showing {models.length} of {pagination.total} models
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelPageLayout;
