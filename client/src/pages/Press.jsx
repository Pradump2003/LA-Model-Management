import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const highlights = [
  "Bi-coastal model development with synchronized client exposure.",
  "Editorial-first scouting strategy supported by commercial opportunity.",
  "Early conviction that Los Angeles would become a global fashion production hub.",
  "Independent agency philosophy focused on long-term brand identity.",
];

const milestones = [
  { year: "1978", detail: "Acquired Booking One in Vancouver as part of a real estate investment." },
  { year: "1979", detail: "Secured Elite/John Casablancas franchise rights for Canada." },
  { year: "1979-1985", detail: "Expanded to ten agency and school franchises across Canada and California." },
  { year: "1985", detail: "Launched LA Models and transitioned away from franchise operations." },
  { year: "2001", detail: "Positioned LA and NY model boards to serve major global campaign production." },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

import { useEffect } from "react";

const Press = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [articleRef, articleInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [sidebarRef, sidebarInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f6] via-white to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
          alt="Press"
          className="w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-black/55 flex items-center justify-center"
        >
          <div className="text-center text-white px-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs uppercase tracking-[0.24em] text-white/85 mb-4"
            >
              MODELS.com - Agency Spotlight
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl"
            >
              LA MODELS & NEW YORK MODELS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 text-base md:text-lg text-white/90"
            >
              by Wayne Sterling
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <motion.header 
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="pt-10 pb-12 border-b border-gray-200/80"
      >
        <div className="container-custom max-w-6xl mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600"
          >
            <motion.p variants={fadeIn}>Editorial Interview</motion.p>
            <motion.span variants={fadeIn} className="h-1 w-1 rounded-full bg-gray-400" />
            <motion.p variants={fadeIn}>Interview Feature</motion.p>
            <motion.span variants={fadeIn} className="h-1 w-1 rounded-full bg-gray-400" />
            <motion.p variants={fadeIn}>Agency Strategy & Vision</motion.p>
          </motion.div>
        </div>
      </motion.header>

      <div className="container-custom max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-[1fr_300px] gap-10">
        {/* Main Article */}
        <motion.article 
          ref={articleRef}
          initial="hidden"
          animate={articleInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-9 text-[17px] leading-8 text-gray-800"
        >
          <motion.section 
            variants={scaleIn}
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500"
          >
            <h2 className="text-2xl font-semibold text-black mb-4">Feature Overview</h2>
            <p>
              In 1985 when Austrian born Heinz Holba made the then daring decision
              to base his modeling headquarters in Los Angeles, his prescient vision
              was to make the West Coast an important player in the international
              modeling community. And interestingly enough, at the time of this
              interview, right on the heels of the fashion frenzy of the Oscars,
              several of the critical Fall 2001 campaigns, specifically Gucci, YSL,
              Versace, and Versus, were being lensed in LA, an occurence that places
              Holba, founder of LA Models, LA Talent, and New York Models, in a
              pivotal position in the fashion industry. More than any other modeling
              impresario right this minute, Heinz is beautifully positioned to exploit
              the increasing power of LA as a major American fashion base. With his New
              York wing, NY Models, firing at full cylinder with a radical board that
              has essentially redefined the borders of the model ideal, Heinz's empire
              is poised to be one of the most powerful in the Zeroes. Here he sits down
              with MODELS.com's Wayne Sterling to outline the logic behind his aesthetic
              and his vision for the future.
            </p>
          </motion.section>

          <motion.blockquote 
            variants={slideInLeft}
            className="border-l-4 border-black pl-6 py-2 text-xl leading-9 text-gray-900 font-medium italic"
          >
            "We simply wanted to be different from other agencies and offer more
            choices and ideas to clients."
          </motion.blockquote>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: Could you please tell us how you became involved in the modeling industry?
            </h2>
            <p>
              I became involved by buying an existing agency in Vancouver, Canada called
              Booking One as part of a real estate investment in 1978. Subsequently, I
              bought the franchise rights to Elite/John Casablancas Modeling Schools and
              Agencies for Canada in 1979. Elite was then the largest agency at that time
              with head offices in New York. I then opened ten agencies and schools in
              Canada and California as franchises, found some top working models, and
              worked closely with Elite New York and Elite Paris. I began selling off
              those franchises in 1985 when I opened LA Models, because by this time I
              preferred to be independent as opposed to being a franchise.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: You are in a unique position in that you have NY Models and LA Models
              serving as bi-coastal powerhouses. What are the benefits of this positioning
              to a model?
            </h2>
            <p>
              The benefits are to be able to expose a model to top clients like the key
              photographers and casting directors around the country simultaneously. It's
              about being in close contact with Europe through New York and with Hollywood
              through Los Angeles. We're able to send new models on TV commercial auditions
              as well as print and to submit them to clients on both coasts. We feel like
              it gives our models an edge over other beginners as well as established models.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: What would you describe as NY Model's key aesthetic?
            </h2>
            <p>
              I think it's unusual, very editorial looks that clients are always looking
              for in the never ending quest to be the first to find and use someone new and
              trendsetting. We try to create that excitement of discovery when we offer new
              models to clients.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: Is this similar or different for LA Models?
            </h2>
            <p>
              LA Models has the same philosophy and ideas as New York Models but in
              addition we are capable of catering to the requirements of commercial casting
              directors and advertising and catalogue clients casting and shooting on the
              West Coast.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: What advantages or benefits would you say the LA market offers that the NY
              market does not?
            </h2>
            <p>
              Well following on my earlier thought, the LA market obviously offers more
              commercial and film work which gives a new model additional experience and
              additional opportunities to further their careers. The earning potential is
              also obviously also much higher in film than in print.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp}>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: Your agencies are known for their revolutionary views on what a model
              should look like. What inspired you to take this path?
            </h2>
            <p>
              We simply wanted to be different from other agencies and offer more choices
              and ideas to clients as well as possibilities for models that do not exist in
              the larger, more traditional and commercial agencies.
            </p>
          </motion.section>

          <motion.section 
            variants={scaleIn}
            className="bg-[#f7f7f5] border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-500"
          >
            <h2 className="text-2xl font-semibold text-black mb-4">Industry Context</h2>
            <p>
              The perspective in this interview remains highly relevant: global model
              careers now require flexible market positioning, cross-category opportunity,
              and strong representation that can bridge editorial credibility with
              commercial demand. The bi-coastal strategy described here anticipated this
              shift early, pairing New York's fashion intensity with Los Angeles' scale in
              entertainment and advertising.
            </p>
          </motion.section>

          <motion.footer variants={fadeInUp} className="pt-3 border-t border-gray-200">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              MODELS.com - Agency Spotlight
            </p>
          </motion.footer>
        </motion.article>

        {/* Sidebar */}
        <motion.aside 
          ref={sidebarRef}
          initial="hidden"
          animate={sidebarInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.section 
            variants={scaleIn}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.05)] transition-all duration-500"
          >
            <h3 className="text-lg font-semibold text-black mb-4">Key Highlights</h3>
            <motion.ul 
              variants={staggerContainer}
              className="space-y-3 text-sm text-gray-700 leading-6"
            >
              {highlights.map((item, index) => (
                <motion.li 
                  key={item} 
                  variants={fadeIn}
                  custom={index}
                  className="flex gap-2 group"
                >
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                    className="mt-2 h-1.5 w-1.5 rounded-full bg-black group-hover:scale-150 transition-transform duration-300" 
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>

          <motion.section 
            variants={scaleIn}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.05)] transition-all duration-500"
          >
            <h3 className="text-lg font-semibold text-black mb-4">Agency Milestones</h3>
            <motion.div 
              variants={staggerContainer}
              className="space-y-4"
            >
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={milestone.year} 
                  variants={fadeInUp}
                  custom={index}
                  className="border-l-2 border-gray-200 pl-4 hover:border-black transition-colors duration-300 group"
                >
                  <p className="text-sm font-semibold text-black group-hover:translate-x-1 transition-transform duration-300">
                    {milestone.year}
                  </p>
                  <p className="text-sm text-gray-700 leading-6 group-hover:translate-x-1 transition-transform duration-300">
                    {milestone.detail}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section 
            variants={scaleIn}
            className="bg-black text-white rounded-2xl p-6 overflow-hidden relative group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-3">Press & Editorial Inquiries</h3>
              <p className="text-sm text-white/85 leading-6 mb-4">
                For verified media requests, interview follow-ups, and brand partnership
                opportunities, please contact the agency through the official contact channel.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wide hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact LA Models
              </Link>
            </div>
          </motion.section>
        </motion.aside>
      </div>
    </div>
  );
};

export default Press;