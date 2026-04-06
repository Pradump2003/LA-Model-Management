
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { modelsAPI } from "../../services/api";

const ModelDetail = () => {
  const { slug } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        const response = await modelsAPI.getBySlug(slug);

        if (response.data.success) {
          setModel(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching model:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-2xl">Model not found</p>
      </div>
    );
  }

  const images = [
    model.portfolio?.profileImage,
    ...(model.portfolio?.images || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen">
      <div className="relative h-[45vh] overflow-hidden">
        <img
          src={images[0] || "https://via.placeholder.com/1200x800"}
          alt={`${model.firstName} ${model.lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-3">
              {model.firstName} {model.lastName}
            </h1>
            <p className="text-base md:text-lg uppercase tracking-wide text-white/90">
              {model.division}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-gray-100 mb-4"
            >
              <img
                src={
                  images[selectedImage] || "https://via.placeholder.com/600x800"
                }
                alt={`${model.firstName} ${model.lastName}`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-[3/4] bg-gray-100 overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-black" : ""
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="text-5xl font-bold mb-4">
              {model.firstName} {model.lastName}
            </h2>
            <p className="text-xl text-gray-600 mb-8 uppercase">
              {model.division}
            </p>

            <div className="space-y-6">
              {/* Stats */}
              <div>
                <h3 className="font-semibold mb-3 uppercase text-sm">
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {model.stats?.height?.cm && (
                    <div>
                      <span className="text-gray-600">Height:</span>{" "}
                      <span className="font-medium">
                        {model.stats.height.cm} cm
                      </span>
                    </div>
                  )}
                  {model.stats?.chest && (
                    <div>
                      <span className="text-gray-600">Chest:</span>{" "}
                      <span className="font-medium">{model.stats.chest}</span>
                    </div>
                  )}
                  {model.stats?.waist && (
                    <div>
                      <span className="text-gray-600">Waist:</span>{" "}
                      <span className="font-medium">{model.stats.waist}</span>
                    </div>
                  )}
                  {model.stats?.hips && (
                    <div>
                      <span className="text-gray-600">Hips:</span>{" "}
                      <span className="font-medium">{model.stats.hips}</span>
                    </div>
                  )}
                  {model.stats?.hairColor && (
                    <div>
                      <span className="text-gray-600">Hair:</span>{" "}
                      <span className="font-medium">
                        {model.stats.hairColor}
                      </span>
                    </div>
                  )}
                  {model.stats?.eyeColor && (
                    <div>
                      <span className="text-gray-600">Eyes:</span>{" "}
                      <span className="font-medium">
                        {model.stats.eyeColor}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Clients */}
              {model.portfolio?.clients?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 uppercase text-sm">
                    Clients
                  </h3>
                  <p className="text-sm text-gray-700">
                    {model.portfolio.clients.join(", ")}
                  </p>
                </div>
              )}

              {/* Editorials */}
              {model.portfolio?.editorials?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 uppercase text-sm">
                    Editorials
                  </h3>
                  <p className="text-sm text-gray-700">
                    {model.portfolio.editorials.join(", ")}
                  </p>
                </div>
              )}

              {/* Social */}
              {model.social?.instagram && (
                <div>
                  <h3 className="font-semibold mb-3 uppercase text-sm">
                    Instagram
                  </h3>
                  <a
                    href={`https://instagram.com/${model.social.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {model.social.instagram}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
