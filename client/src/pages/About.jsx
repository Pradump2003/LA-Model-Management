import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  animate,
} from "framer-motion";
import {
  Award,
  Users,
  Globe,
  Heart,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

/* ─── Design tokens ────────────────────────────────────────────────── */
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8D08A";
const OFF_WHITE = "#F5F2EC";
const INK = "#0E0E0E";

/* ─── Animation presets ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

const revealLine = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Animated Counter ──────────────────────────────────────────────── */
const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract numeric part
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const prefix = value.replace(/[0-9+,]/g, "").trim();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const controls = animate(0, numericValue, {
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setCount(Math.floor(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {value.includes("+") ? "+" : ""}
    </span>
  );
};

/* ─── Section Heading ───────────────────────────────────────────────── */
const SectionHeading = ({ label, title, light = false }) => (
  <div className="text-center mb-16">
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.7rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: GOLD,
        marginBottom: "0.75rem",
      }}
    >
      {label}
    </motion.p>
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0.5}
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(2.5rem, 5vw, 4rem)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: light ? "#fff" : INK,
        lineHeight: 1.1,
        marginBottom: "1rem",
      }}
    >
      {title}
    </motion.h2>
    <motion.div
      variants={revealLine}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        width: "120px",
        margin: "0 auto",
        transformOrigin: "center",
      }}
    />
  </div>
);

/* ─── Animated Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ stat, index }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={index}
    style={{
      textAlign: "center",
      padding: "1.5rem 1rem",
      position: "relative",
    }}
  >
    {/* Vertical divider */}
    {index !== 0 && (
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          height: "60%",
          width: "1px",
          background: `linear-gradient(to bottom, transparent, ${GOLD}44, transparent)`,
          transformOrigin: "top",
        }}
      />
    )}

    {/* Icon */}
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 + 0.3 }}
      style={{
        color: GOLD,
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {stat.icon}
    </motion.div>

    {/* Number with animation */}
    <div
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(3rem, 6vw, 5rem)",
        fontWeight: 700,
        color: GOLD,
        lineHeight: 1,
        marginBottom: "0.5rem",
      }}
    >
      <AnimatedCounter value={stat.value} />
    </div>

    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        marginBottom: "0.5rem",
      }}
    >
      {stat.label}
    </div>

    {stat.sub && (
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.25)",
          fontStyle: "italic",
        }}
      >
        {stat.sub}
      </div>
    )}
  </motion.div>
);

/* ─── Timeline item ──────────────────────────────────────────────────── */
const TimelineItem = ({ item, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 60px 1fr",
        gap: "0",
        marginBottom: "0",
        alignItems: "start",
      }}
    >
      {/* Left content */}
      <div style={{ padding: "0 2rem 3rem 0", textAlign: "right" }}>
        {isLeft ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index * 0.3}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: GOLD,
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              {item.year}
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: INK,
                marginBottom: "0.5rem",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                color: "#666",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ) : null}
      </div>

      {/* Center line + dot */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: GOLD,
            border: `2px solid ${GOLD}`,
            boxShadow: `0 0 0 4px ${GOLD}22`,
            zIndex: 2,
            marginTop: "4px",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            width: "1px",
            flex: 1,
            background: `linear-gradient(to bottom, ${GOLD}66, ${GOLD}11)`,
            minHeight: "80px",
          }}
        />
      </div>

      {/* Right content */}
      <div style={{ padding: "0 0 3rem 2rem" }}>
        {!isLeft ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index * 0.3}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: GOLD,
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              {item.year}
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: INK,
                marginBottom: "0.5rem",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                color: "#666",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

/* ─── Value card ─────────────────────────────────────────────────────── */
const ValueCard = ({ value, index }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={index}
    whileHover={{ y: -6, transition: { duration: 0.3 } }}
    style={{
      background: "#fff",
      border: `1px solid ${GOLD}22`,
      padding: "2.5rem 2rem",
      textAlign: "center",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "40px",
        height: "40px",
        borderTop: `2px solid ${GOLD}`,
        borderLeft: `2px solid ${GOLD}`,
      }}
    />
    <span
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "40px",
        height: "40px",
        borderBottom: `2px solid ${GOLD}`,
        borderRight: `2px solid ${GOLD}`,
      }}
    />

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.25rem",
        color: GOLD,
      }}
    >
      {value.icon}
    </div>
    <h3
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.35rem",
        fontWeight: 700,
        marginBottom: "0.75rem",
        color: INK,
      }}
    >
      {value.title}
    </h3>
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem",
        color: "#666",
        lineHeight: 1.7,
        margin: 0,
      }}
    >
      {value.description}
    </p>
  </motion.div>
);

/* ─── Team card ──────────────────────────────────────────────────────── */
const TeamCard = ({ member, index }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={index}
    style={{ position: "relative" }}
  >
    <motion.div
      whileHover="hover"
      style={{ overflow: "hidden", position: "relative" }}
    >
      <motion.div
        variants={{ hover: { scale: 1.07 } }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          aspectRatio: "3/4",
          overflow: "hidden",
          background: "#e8e4da",
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>

      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${INK}cc 0%, transparent 55%)`,
          display: "flex",
          alignItems: "flex-end",
          padding: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: GOLD_LIGHT,
            textTransform: "uppercase",
          }}
        >
          View Profile →
        </span>
      </motion.div>
    </motion.div>

    <div style={{ marginTop: "1.25rem" }}>
      <div
        style={{
          width: "32px",
          height: "1px",
          background: GOLD,
          marginBottom: "0.75rem",
        }}
      />
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: INK,
          marginBottom: "0.25rem",
        }}
      >
        {member.name}
      </h3>
      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          color: "#999",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {member.role}
      </p>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    {
      label: "Years of Excellence",
      value: "40+",
      icon: <Calendar className="w-8 h-8" />,
      sub: "Est. 1985",
    },
    {
      label: "Models Represented",
      value: "500+",
      icon: <Users className="w-8 h-8" />,
      sub: "Across all divisions",
    },
    {
      label: "Global Campaigns",
      value: "1000+",
      icon: <TrendingUp className="w-8 h-8" />,
      sub: "Worldwide reach",
    },
    {
      label: "Fashion Weeks",
      value: "50+",
      icon: <Star className="w-8 h-8" />,
      sub: "NYC · Paris · Milan · London",
    },
  ];

  const timeline = [
    {
      year: "1985",
      title: "The Beginning",
      description:
        "LA Models was founded in Los Angeles with a bold vision — to discover and develop world-class talent from the West Coast.",
    },
    {
      year: "1991",
      title: "First International Breakthrough",
      description:
        "Our talent began gracing the covers of Vogue, Elle, and Harper's Bazaar internationally, putting LA Models on the global map.",
    },
    {
      year: "1998",
      title: "Expanding Divisions",
      description:
        "We launched our Men's, New Faces, and Special Booking divisions — tripling our representation capacity.",
    },
    {
      year: "2005",
      title: "Digital Transformation",
      description:
        "Pioneering the use of digital portfolios and social media for model discovery, years ahead of the industry.",
    },
    {
      year: "2012",
      title: "Diversity Initiative",
      description:
        "Launched our diversity-first scouting program, celebrating beauty across every background, ethnicity, and body type.",
    },
    {
      year: "2024",
      title: "A New Era",
      description:
        "Entering our fifth decade with 500+ models, global offices, and an unwavering commitment to excellence and authenticity.",
    },
  ];

  const values = [
    {
      icon: <Award className="w-10 h-10" />,
      title: "Excellence",
      description:
        "We represent only the finest talent in the industry, with an unwavering eye for what extraordinary looks like.",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Diversity",
      description:
        "Celebrating beauty in all its forms — every background, every story, every face that deserves its moment.",
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Global Reach",
      description:
        "Four decades of relationships connecting talent with transformative opportunities across every major market.",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Integrity",
      description:
        "Built on trust, transparency, and professionalism. We protect our talent as fiercely as we champion them.",
    },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    },
    {
      name: "Michael Chen",
      role: "Head of Women's Division",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Men's Division",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400&family=DM+Mono:wght@400&display=swap');
        * { box-sizing: border-box; }
        .container-la { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        section { padding: 6rem 0; }
        @media (max-width: 768px) {
          section { padding: 4rem 0; }
          .timeline-grid { grid-template-columns: 20px 1fr !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{ position: "relative", height: "70vh", overflow: "hidden" }}
      >
        <motion.div
          style={{ y: heroY, position: "absolute", inset: "-10% 0", zIndex: 0 }}
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="About LA Models"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, ${INK}55 0%, ${INK}88 100%)`,
            zIndex: 1,
          }}
        />

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: heroOpacity,
          }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              color: GOLD_LIGHT,
              marginBottom: "1.25rem",
            }}
          >
            Est. 1985 · Los Angeles
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Our Story
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "80px",
              height: "1px",
              background: GOLD,
              transformOrigin: "center",
              marginBottom: "1.5rem",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            Shaping the future of fashion since 1985
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            style={{
              width: "1px",
              height: "48px",
              background: `linear-gradient(to bottom, ${GOLD}, transparent)`,
            }}
          />
        </motion.div>
      </div>

      {/* ── Our Story ────────────────────────────────────────────── */}
      <section style={{ background: OFF_WHITE }}>
        <div className="container-la">
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <SectionHeading label="Who We Are" title="Built on Legacy" />
            {[
              "Founded in 1985, LA Models has become one of the most prestigious modeling agencies in the world. Based in Los Angeles, we've built our reputation on discovering and developing exceptional talent who have gone on to grace the covers of major magazines, walk the runways of top designers, and star in global campaigns.",
              "Our success stems from an unwavering commitment to excellence, deep industry relationships built across four decades, and a belief that every model is a unique individual with their own story to tell. We don't just manage careers — we build lasting partnerships.",
              "Today, LA Models represents a diverse roster across multiple divisions, from high-fashion runway talent to commercial faces, emerging discoveries to established icons. Our experienced agents work tirelessly to ensure each model receives the guidance, support, and opportunities they deserve.",
            ].map((para, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  color: "#444",
                  marginBottom: i < 2 ? "1.75rem" : 0,
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats with animated counters ─────────────────────────── */}
      <section
        style={{ background: INK, position: "relative", overflow: "hidden" }}
      >
        {/* Grid bg */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${GOLD}0a 1px, transparent 1px), linear-gradient(90deg, ${GOLD}0a 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px",
            height: "300px",
            background: `radial-gradient(ellipse, ${GOLD}12 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          className="container-la"
          style={{ position: "relative", zIndex: 1 }}
        >
          <SectionHeading
            label="By the Numbers"
            title="Four Decades of Impact"
            light
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>

          {/* Extra content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            style={{
              marginTop: "5rem",
              padding: "3rem",
              border: `1px solid ${GOLD}22`,
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Corner accents */}
            {[
              {
                top: 0,
                left: 0,
                borderTop: `2px solid ${GOLD}`,
                borderLeft: `2px solid ${GOLD}`,
              },
              {
                top: 0,
                right: 0,
                borderTop: `2px solid ${GOLD}`,
                borderRight: `2px solid ${GOLD}`,
              },
              {
                bottom: 0,
                left: 0,
                borderBottom: `2px solid ${GOLD}`,
                borderLeft: `2px solid ${GOLD}`,
              },
              {
                bottom: 0,
                right: 0,
                borderBottom: `2px solid ${GOLD}`,
                borderRight: `2px solid ${GOLD}`,
              },
            ].map((style, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  width: "30px",
                  height: "30px",
                  ...style,
                }}
              />
            ))}

            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                color: GOLD,
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Our Global Presence
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "2rem",
              }}
            >
              {[
                { city: "Los Angeles", role: "Headquarters" },
                { city: "New York", role: "East Coast Hub" },
                { city: "Paris", role: "European Office" },
                { city: "Milan", role: "Italian Market" },
                { city: "London", role: "UK Office" },
                { city: "Tokyo", role: "Asia Pacific" },
              ].map((loc, i) => (
                <motion.div
                  key={loc.city}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      justifyContent: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <MapPin size={12} style={{ color: GOLD, flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1rem",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      {loc.city}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    {loc.role}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────── */}
      <section style={{ background: OFF_WHITE }}>
        <div className="container-la">
          <SectionHeading label="Our Journey" title="Four Decades of History" />

          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section style={{ background: "#fff" }}>
        <div className="container-la">
          <SectionHeading label="What Drives Us" title="Our Values" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {values.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards strip ─────────────────────────────────────────── */}
      <section
        style={{ background: INK, padding: "4rem 0", overflow: "hidden" }}
      >
        <div className="container-la">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: GOLD,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
            As Seen In & Worked With
          </motion.p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem 2.5rem",
            }}
          >
            {[
              "Vogue",
              "Harper's Bazaar",
              "Elle",
              "W Magazine",
              "V Magazine",
              "Dior",
              "Chanel",
              "Versace",
              "Givenchy",
              "Victoria's Secret",
              "Nike",
              "Louis Vuitton",
            ].map((brand, i) => (
              <motion.span
                key={brand}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                  fontStyle: "italic",
                  transition: "color 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.target.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.2)")
                }
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section style={{ background: OFF_WHITE }}>
        <div className="container-la">
          <SectionHeading
            label="The People Behind the Brand"
            title="Our Team"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "3rem",
              maxWidth: "960px",
              margin: "0 auto",
            }}
          >
            {team.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{ background: INK, padding: "5rem 2rem", textAlign: "center" }}
      >
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: "1rem",
          }}
        >
          Ready to Begin?
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.5}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
          }}
        >
          Join the LA Models Family
        </motion.h2>
        <motion.a
          href="/apply"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          whileHover={{ backgroundColor: GOLD, color: INK, borderColor: GOLD }}
          transition={{ duration: 0.25 }}
          style={{
            display: "inline-block",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            border: `1px solid ${GOLD}66`,
            padding: "1rem 2.5rem",
            textDecoration: "none",
          }}
        >
          Apply Now →
        </motion.a>
      </section>
    </>
  );
};

export default About;
