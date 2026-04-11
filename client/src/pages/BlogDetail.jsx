import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import api from "../services/api";

const FALLBACK_BLOG_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Crect width='1600' height='900' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23e2e8f0' font-family='Arial,sans-serif' font-size='56'%3ENews Article%3C/text%3E%3C/svg%3E";

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
        {/** Prevent runtime 404s from demo URLs stored in DB. */}
        <img
          src={sanitizeBlogImageUrl(blog.featuredImage?.url) || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80"}
          alt={blog.featuredImage?.alt || blog.title}
          className="w-full h-full object-cover"
          onError={(event) => {
            if (event.currentTarget.src !== FALLBACK_BLOG_IMAGE) {
              event.currentTarget.src = FALLBACK_BLOG_IMAGE;
            }
          }}
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


          {/* Styled Title and Excerpt */}
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          <p className="text-xl text-neutral-700 mb-8 font-medium border-l-4 border-blue-400 pl-4 bg-blue-50 py-2">
            {blog.excerpt}
          </p>

          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Gallery Section */}
          {Array.isArray(blog.gallery) && blog.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {blog.gallery
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((img, idx) => (
                    <div key={img.publicId || idx} className="flex flex-col items-center">
                      <img
                        src={sanitizeBlogImageUrl(img.url) || FALLBACK_BLOG_IMAGE}
                        alt={img.caption || `Gallery image ${idx + 1}`}
                        className="w-full h-auto max-h-[420px] object-cover rounded shadow"
                        onError={(event) => {
                          if (event.currentTarget.src !== FALLBACK_BLOG_IMAGE) {
                            event.currentTarget.src = FALLBACK_BLOG_IMAGE;
                          }
                        }}
                      />
                      {img.caption && (
                        <p className="mt-2 text-gray-600 text-center text-sm">{img.caption}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
