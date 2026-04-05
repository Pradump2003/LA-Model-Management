import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Blogs = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

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

	if (loading) {
		return (
			<section className="min-h-screen flex items-center justify-center">
				<p className="text-gray-600">Loading news...</p>
			</section>
		);
	}

	if (error) {
		return (
			<section className="min-h-screen flex items-center justify-center">
				<p className="text-red-600">{error}</p>
			</section>
		);
	}

	return (
		<section className="py-20 bg-white">
			<div className="container-custom">
				<h1 className="text-5xl font-bold mb-4">News</h1>
				<p className="text-gray-600 text-lg mb-10">
					Latest stories from the agency database.
				</p>

				{blogs.length === 0 ? (
					<p className="text-gray-500">No published news found.</p>
				) : (
					<div className="grid md:grid-cols-3 gap-8">
						{blogs.map((blog) => (
							<article key={blog._id} className="border border-gray-200 p-4">
								<img
									src={
										blog.featuredImage?.url ||
										"https://via.placeholder.com/800x600"
									}
									alt={blog.title}
									className="w-full h-48 object-cover mb-4"
								/>
								<p className="text-xs text-gray-500 mb-2">
									{blog.publishedAt
										? new Date(blog.publishedAt).toLocaleDateString("en-US")
										: "Unpublished"}
								</p>
								<h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
								<p className="text-gray-600 text-sm mb-4">{blog.excerpt}</p>
								<Link
									to={`/news/${blog.slug}`}
									className="text-sm font-medium underline"
								>
									Read more
								</Link>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default Blogs;
