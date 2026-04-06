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

        if (searchQuery) {
          params.search = searchQuery;
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
  }, [division, page, category, searchQuery]);

  const categories =
    division === "women" || division === "men"
      ? ["main-board", "new-faces"]
      : division === "direct"
        ? ["direct", "classic"]
        : division === "juniors"
          ? ["girls", "boys", "family"]
          : [];

  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      ...(category && { category }),
      ...(searchQuery && { q: searchQuery }),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() =>
                setSearchParams({ page: 1, ...(searchQuery && { q: searchQuery }) })
              }
              className={`px-6 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                !category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSearchParams({
                    page: 1,
                    category: cat,
                    ...(searchQuery && { q: searchQuery }),
                  })
                }
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

        {searchQuery && (
          <div className="mb-6 flex items-center gap-3 text-sm">
            <span className="text-gray-500">Search:</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-black">
              {searchQuery}
            </span>
            <button
              type="button"
              onClick={() =>
                setSearchParams({ page: 1, ...(category && { category }) })
              }
              className="text-gray-600 underline hover:text-black"
            >
              Clear
            </button>
          </div>
        )}

        {/* Models Grid */}
        <ModelGrid models={models} loading={loading} />

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
        <div className="text-center mt-6 text-sm text-gray-600">
          Showing {models.length} of {pagination.total} models
        </div>
      </div>
    </div>
  );
};

export default ModelPageLayout;
