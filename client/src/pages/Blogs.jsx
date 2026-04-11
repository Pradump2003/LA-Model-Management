import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";

const FALLBACK_BLOG_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial,sans-serif' font-size='36'%3ENews Image%3C/text%3E%3C/svg%3E";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get("/blogs", {
          params: {
            limit: 24,
          },
        });

        setBlogs(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError("Unable to load news right now.");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const renderHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80"
        alt="News"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">News</h1>
          <p className="text-lg text-white/90">Latest stories from LA Models</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {renderHero()}
        <section className="py-20 bg-white">
          <div className="container-custom text-center">
            <p className="text-gray-600">Loading news...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {renderHero()}
        <section className="py-20 bg-white">
          <div className="container-custom text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {renderHero()}

      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-5xl font-bold mb-4">News</h2>
          <p className="text-gray-600 text-lg mb-10">
            Latest stories from the agency database.
          </p>

          {blogs.length === 0 ? (
            <p className="text-gray-500">No published news found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/news/${blog.slug}`}
                  className="border border-gray-200 p-4 block hover:shadow-lg transition-shadow duration-200 group"
                  tabIndex={0}
                >
                  <img
                    src={blog.featuredImage?.url || FALLBACK_BLOG_IMAGE}
                    alt={blog.title || "Blog Image"}
                    className="w-full h-96 object-cover mb-4 group-hover:opacity-90 transition-opacity duration-200"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_BLOG_IMAGE;
                    }}
                  />
                  <p className="text-xs text-gray-500 mb-2">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString("en-US")
                      : "Unpublished"}
                  </p>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-700 transition-colors duration-200">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{blog.excerpt}</p>
                  <span className="text-sm font-medium underline">Read more</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
