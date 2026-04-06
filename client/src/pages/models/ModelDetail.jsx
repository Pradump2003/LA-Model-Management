// src/pages/models/ModelDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { modelsAPI } from "../../services/api";
import { Play, X } from "lucide-react";
import { FaInstagram } from 'react-icons/fa';

const FALLBACK =
  "https://via.placeholder.com/600x800/f3f4f6/9ca3af?text=No+Image";

const safeImg = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return null;
};

const ModelDetail = () => {
  const { slug } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [showDigitalMenu, setShowDigitalMenu] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);

  // Hide navbar
  useEffect(() => {
    const navbars = document.querySelectorAll("nav, header");
    navbars.forEach((el) => (el.style.display = "none"));
    const main = document.querySelector("main");
    if (main) {
      main.style.paddingTop = "0";
      main.style.marginTop = "0";
    }
    document.body.style.overflow = "hidden";

    return () => {
      navbars.forEach((el) => (el.style.display = ""));
      if (main) {
        main.style.paddingTop = "";
        main.style.marginTop = "";
      }
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        const response = await modelsAPI.getBySlug(slug);
        if (response.data.success) {
          setModel(response.data.data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black" />
      </div>
    );
  }

  if (!model) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "20px", marginBottom: "16px" }}>
            Model Not Found
          </p>
          <Link to="/models">Back to Models</Link>
        </div>
      </div>
    );
  }

  const images = (model.photos || [])
    .filter((p) => p && p.url && p.url.startsWith("http"))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const videos = (model.videos || []).filter(
    (v) => v && v.url && v.url.startsWith("http"),
  );

  const heroImage =
    safeImg(model.portfolio?.profileImage) ||
    safeImg(images[0]?.url) ||
    FALLBACK;

  const stats = model.stats || {};
  const portfolio = model.portfolio || {};
  const social = model.social || {};
  const metrics = model.metrics || {};

  const formatHeight = (h) => {
    if (!h) return null;
    if (h.feet) return h.feet;
    if (h.cm) return `${h.cm}CM`;
    return null;
  };

  const inlineParts = [];
  const ht = formatHeight(stats.height);
  if (ht) inlineParts.push(ht);
  if (stats.dress) inlineParts.push(`DR ${stats.dress} US`);
  if (stats.bust && stats.cup) inlineParts.push(`${stats.bust}${stats.cup}`);
  else if (stats.bust) inlineParts.push(stats.bust);
  if (stats.waist) inlineParts.push(`${stats.waist}"`);
  if (stats.hips) inlineParts.push(`${stats.hips}"`);
  if (stats.shoe) inlineParts.push(`${stats.shoe} US`);
  if (stats.eyeColor) inlineParts.push(stats.eyeColor.toUpperCase());
  if (stats.hairColor) inlineParts.push(stats.hairColor.toUpperCase());
  const inlineStats = inlineParts.join(" · ");

  const gridPhotos = images.length > 1 ? images.slice(1) : images;

  const statsRows = [
    {
      label: "Height",
      value:
        stats.height?.feet && stats.height?.cm
          ? `${stats.height.feet} · ${stats.height.cm}CM`
          : stats.height?.feet ||
            (stats.height?.cm ? `${stats.height.cm}CM` : null),
    },
    { label: "Bust", value: stats.bust },
    { label: "Cup", value: stats.cup },
    { label: "Waist", value: stats.waist },
    { label: "Hips", value: stats.hips },
    { label: "Dress", value: stats.dress },
    { label: "Shoe", value: stats.shoe },
    { label: "Hair", value: stats.hairColor },
    { label: "Eyes", value: stats.eyeColor },
    { label: "Weight", value: stats.weight },
  ].filter((s) => s.value);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* ===== FIXED BACKGROUND — only 100vh tall ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={heroImage}
          alt=""
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK;
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
      </div>

      {/* ===== MAIN SCROLL CONTAINER ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 10,
        }}
      >

        {/* ===== HERO SECTION — exactly 100vh ===== */}
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "20px",
            position: "relative",
          }}
        >

          {/* Name + Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: "rgba(255,255,255,0.82)",
              padding: "18px 36px",
              textAlign: "center",
              maxWidth: "700px",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(16px, 2.2vw, 26px)",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#000",
                margin: "0 0 6px 0",
                lineHeight: 1.2,
              }}
            >
              {model.firstName} {model.lastName}
            </h1>
            {inlineStats && (
              <p
                style={{
                  fontSize: "clamp(10px, 1.1vw, 13px)",
                  color: "#555",
                  letterSpacing: "0.04em",
                  fontWeight: "300",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {inlineStats}
              </p>
            )}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {/* Portfolio tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("portfolio");
                setShowDigitalMenu(false);
              }}
              style={{
                padding: "10px 36px",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: "300",
                border: "1px solid",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "portfolio"
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.65)",
                borderColor:
                  activeTab === "portfolio" ? "#bbb" : "rgba(200,200,200,0.5)",
                color: activeTab === "portfolio" ? "#000" : "#666",
              }}
            >
              Portfolio
            </button>

            {/* Digital tab */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("digital");
                  setShowDigitalMenu((p) => !p);
                }}
                style={{
                  padding: "10px 36px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: "300",
                  border: "1px solid",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === "digital"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.65)",
                  borderColor:
                    activeTab === "digital"
                      ? "#bbb"
                      : "rgba(200,200,200,0.5)",
                  color: activeTab === "digital" ? "#000" : "#666",
                }}
              >
                Digital
              </button>

              <AnimatePresence>
                {showDigitalMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      marginTop: "4px",
                      display: "flex",
                      flexDirection: "column",
                      zIndex: 50,
                      minWidth: "180px",
                    }}
                  >
                    {["DIGITAL 1", "DIGITAL 2", "PDF PORTFOLIO"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e5e5",
                          padding: "10px 20px",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#555",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Instagram */}
          {social.instagram && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              href={`https://instagram.com/${social.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#e1306c",
                textDecoration: "none",
              }}
            >
              <FaInstagram size={20} />
              <span
                style={{
                  fontSize: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: "300",
                  color: "#e1306c"
                }}
              >
                {social.instagram.replace("@", "").toUpperCase()}
              </span>
              {metrics.instagramFollowers && (
                <span style={{ fontSize: "20px", color: "#e1306c", fontWeight: 600 }}>
                  {metrics.instagramFollowers >= 1000000
                    ? `${(metrics.instagramFollowers / 1000000).toFixed(1)} M`
                    : `${(metrics.instagramFollowers / 1000).toFixed(1)} K`}
                </span>
              )}
            </motion.a>
          )}

          {/* HOME bottom left */}
          <div className="fixed bottom-6 left-6 z-[9999]">
            <Link
              to="/models"
              className="block text-white bg-gradient-to-r from-neutral-900 to-neutral-700 px-8 py-3 rounded-full font-semibold text-base uppercase tracking-widest shadow-lg hover:from-neutral-800 hover:to-neutral-600 transition-colors duration-200"
            >
              BACK
            </Link>
          </div>
        </div>

        {/* ===== PHOTO GRID — solid white bg covers fixed image ===== */}
        {gridPhotos.length > 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent:"center",
              alignItems:"center",
              flexWrap: "wrap",
              gap: "4px",
              marginBottom: "60px",
            }}
          >
            {gridPhotos.map((photo, index) => (
              <motion.div
                key={photo._id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                style={{
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  width: "calc(25% - 2px)",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <img
                  src={photo.url}
                  alt={`${model.firstName} ${model.lastName} ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK;
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                    transition: "transform 0.7s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* ===== VIDEOS ===== */}
        {videos.length > 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent:"center",
              alignItems:"center",
              flexWrap: "wrap",
              gap: "2px",
              marginBottom: "60px",
            }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video._id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setPlayingVideo(video)}
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "#111",
                }}
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title || `Video ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK;
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.88)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Play
                      size={20}
                      color="#000"
                      style={{ marginLeft: "3px" }}
                    />
                  </div>
                </div>

                {video.title && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                      padding: "10px 12px",
                    }}
                  >
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {video.title}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* ===== BOTTOM INFO ===== */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: "60px 40px",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

            {/* Name */}
            <div style={{ textAlign: "center", marginBottom: "44px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "300",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginBottom: "6px",
                  margin: "0 0 6px 0",
                }}
              >
                {model.firstName} {model.lastName}
              </h2>
              {inlineStats && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    letterSpacing: "0.04em",
                    margin: 0,
                  }}
                >
                  {inlineStats}
                </p>
              )}
            </div>

            {/* 4 columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "36px",
              }}
            >
              {/* Measurements */}
              {statsRows.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3em",
                      color: "#bbb",
                      marginBottom: "12px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    Measurements
                  </h3>
                  {statsRows.map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "7px 0",
                        borderBottom: "1px solid #f8f8f8",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#bbb",
                        }}
                      >
                        {stat.label}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "300",
                          color: "#222",
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Clients */}
              {portfolio.clients?.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3em",
                      color: "#bbb",
                      marginBottom: "12px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    Clients
                  </h3>
                  {portfolio.clients.map((c, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "12px",
                        fontWeight: "300",
                        color: "#555",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {c}
                    </p>
                  ))}
                </div>
              )}

              {/* Editorials */}
              {portfolio.editorials?.length > 0 && (
                <div>
                  <h3
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3em",
                      color: "#bbb",
                      marginBottom: "12px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    Editorials
                  </h3>
                  {portfolio.editorials.map((e, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "12px",
                        fontWeight: "300",
                        color: "#555",
                        margin: "0 0 6px 0",
                      }}
                    >
                      {e}
                    </p>
                  ))}
                </div>
              )}

              {/* Campaigns + Runway */}
              <div>
                {portfolio.campaigns?.length > 0 && (
                  <>
                    <h3
                      style={{
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.3em",
                        color: "#bbb",
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Campaigns
                    </h3>
                    {portfolio.campaigns.map((c, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: "12px",
                          fontWeight: "300",
                          color: "#555",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {c}
                      </p>
                    ))}
                  </>
                )}

                {portfolio.runwayShows?.length > 0 && (
                  <>
                    <h3
                      style={{
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.3em",
                        color: "#bbb",
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid #f0f0f0",
                        marginTop:
                          portfolio.campaigns?.length > 0 ? "24px" : "0",
                      }}
                    >
                      Runway
                    </h3>
                    {portfolio.runwayShows.map((r, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: "12px",
                          fontWeight: "300",
                          color: "#555",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {r}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Bottom */}
            <div
              style={{
                marginTop: "44px",
                paddingTop: "28px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              {social.instagram && (
                <a
                  href={`https://instagram.com/${social.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#666",
                    textDecoration: "none",
                  }}
                >
                  <FaInstagram size={14} />
                  {social.instagram}
                  {metrics.instagramFollowers && (
                    <span style={{ color: "#ccc" }}>
                      ·{" "}
                      {metrics.instagramFollowers >= 1000000
                        ? `${(metrics.instagramFollowers / 1000000).toFixed(1)}M`
                        : `${(metrics.instagramFollowers / 1000).toFixed(1)}K`}
                    </span>
                  )}
                </a>
              )}

              {model.location?.based && (
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#bbb",
                    margin: 0,
                  }}
                >
                  Based in {model.location.based}
                </p>
              )}

              <Link
                to="/contact"
                style={{
                  padding: "11px 36px",
                  backgroundColor: "#000",
                  color: "#fff",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  textDecoration: "none",
                }}
              >
                Book {model.firstName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== VIDEO MODAL ===== */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayingVideo(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              backgroundColor: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "960px",
                aspectRatio: "16/9",
                backgroundColor: "#000",
              }}
            >
              <video
                src={playingVideo.url}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", display: "block" }}
              />
              <button
                type="button"
                onClick={() => setPlayingVideo(null)}
                style={{
                  position: "absolute",
                  top: "-36px",
                  right: 0,
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                <X size={16} />
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModelDetail;