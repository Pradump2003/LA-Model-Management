// src/pages/About.jsx
import { motion } from "framer-motion";
import { Award, Users, Globe, Heart } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Years of Excellence", value: "40+" },
    { label: "Models Represented", value: "500+" },
    { label: "Global Campaigns", value: "1000+" },
    { label: "Fashion Weeks", value: "50+" },
  ];

  const values = [
    {
      icon: <Award className="w-12 h-12" />,
      title: "Excellence",
      description: "We represent only the finest talent in the industry",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Diversity",
      description: "Celebrating beauty in all its forms and backgrounds",
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Global Reach",
      description: "Connecting talent with opportunities worldwide",
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Integrity",
      description: "Built on trust, transparency, and professionalism",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
          alt="About LA Models"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4">About Us</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Shaping the Future of Fashion Since 1985
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-8 text-center">Our Story</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 1985, LA Models has become one of the most
                  prestigious modeling agencies in the world. Based in Los
                  Angeles, we've built our reputation on discovering and
                  developing exceptional talent who have gone on to grace the
                  covers of major magazines, walk the runways of top designers,
                  and star in global campaigns.
                </p>
                <p>
                  Our success stems from our unwavering commitment to
                  excellence, our deep industry relationships, and our
                  dedication to treating every model as a unique individual with
                  their own story to tell. We don't just manage careers—we build
                  lasting partnerships.
                </p>
                <p>
                  Today, LA Models represents a diverse roster of talent across
                  multiple divisions, from high fashion runway models to
                  commercial faces, new discoveries to established icons. Our
                  team of experienced agents works tirelessly to ensure each
                  model receives the guidance, support, and opportunities they
                  deserve.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">What drives us every day</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 text-center"
              >
                <div className="flex justify-center mb-4 text-black">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 text-lg">
              Meet the experts behind LA Models' success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah Mitchell",
                role: "CEO & Founder",
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
              },
              {
                name: "Michael Chen",
                role: "Head of Women's Division",
                image:
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Men's Division",
                image:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
