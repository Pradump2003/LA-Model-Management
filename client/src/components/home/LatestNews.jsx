const FALLBACK_BLOG_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial,sans-serif' font-size='32'%3ENews%20Image%3C/text%3E%3C/svg%3E";

const sanitizeBlogImageUrl = (url) => {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes("res.cloudinary.com/demo/")) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image")
  ) {
    return trimmed;
  }
  return null;
};
// src/components/home/LatestNews.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../../services/api';
import { Calendar } from 'lucide-react';

const LatestNews = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogsAPI.getAll({
          limit: 3,
          sort: '-publishedAt',
        });
        
        if (response.data.success) {
          setBlogs(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  if (loading) return null;

  if (error) {
    return (
      <div className="py-20 bg-white">
        <div className="container-custom text-center">
          <p className="text-red-500">Error loading news: {error}</p>
        </div>
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
          <h2 className="text-5xl font-bold mb-4">Latest News</h2>
          <p className="text-gray-600 text-lg">Stay updated with our latest stories</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/news/${blog.slug}`} className="group block">
                <div className="aspect-video overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={sanitizeBlogImageUrl(blog.featuredImage?.url) || FALLBACK_BLOG_IMAGE}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(event) => {
                      if (event.currentTarget.src !== FALLBACK_BLOG_IMAGE) {
                        event.currentTarget.src = FALLBACK_BLOG_IMAGE;
                      }
                    }}
                  />
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/news"
            className="inline-block px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;