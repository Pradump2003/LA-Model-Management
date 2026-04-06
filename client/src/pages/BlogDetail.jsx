import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data?.data || null);
      } catch (err) {
        setError("Unable to load this news article.");
        console.error("Error fetching blog by slug:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80"
            alt="News article"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold">News Article</h1>
          </div>
        </div>
        <section className="py-20 flex items-center justify-center">
          <p className="text-gray-600">Loading article...</p>
        </section>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80"
            alt="News article"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold">News Article</h1>
          </div>
        </div>
        <section className="py-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Article not found."}</p>
            <Link to="/news" className="underline">
              Back to news
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={blog.featuredImage?.url || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80"}
          alt={blog.featuredImage?.alt || blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-6">
            {blog.title}
          </h1>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <Link to="/news" className="text-sm underline mb-6 inline-block">
            Back to news
          </Link>
          <p className="text-sm text-gray-500 mb-6">
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unpublished"}
          </p>

          <p className="text-lg text-gray-700 mb-8">{blog.excerpt}</p>

          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
