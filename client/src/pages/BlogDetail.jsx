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
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Article not found."}</p>
          <Link to="/news" className="underline">
            Back to news
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom max-w-3xl">
        <Link to="/news" className="text-sm underline mb-6 inline-block">
          Back to news
        </Link>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Unpublished"}
        </p>

        {blog.featuredImage?.url && (
          <img
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt || blog.title}
            className="w-full h-auto mb-8"
          />
        )}

        <p className="text-lg text-gray-700 mb-8">{blog.excerpt}</p>

        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </section>
  );
};

export default BlogDetail;
