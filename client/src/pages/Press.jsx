import { Link } from "react-router-dom";

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

const Press = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f6] via-white to-white">
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
          alt="Press"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/85 mb-4">
              MODELS.com - Agency Spotlight
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
              LA MODELS & NEW YORK MODELS
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/90">by Wayne Sterling</p>
          </div>
        </div>
      </div>

      <header className="pt-10 pb-12 border-b border-gray-200/80">
        <div className="container-custom max-w-6xl mx-auto px-4">
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
            <p>Editorial Interview</p>
            <span className="h-1 w-1 rounded-full bg-gray-400" />
            <p>Interview Feature</p>
            <span className="h-1 w-1 rounded-full bg-gray-400" />
            <p>Agency Strategy & Vision</p>
          </div>
        </div>
      </header>

      <div className="container-custom max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-[1fr_300px] gap-10">
        <article className="space-y-9 text-[17px] leading-8 text-gray-800">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
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
          </section>

          <blockquote className="border-l-4 border-black pl-6 py-2 text-xl leading-9 text-gray-900 font-medium italic">
            "We simply wanted to be different from other agencies and offer more
            choices and ideas to clients."
          </blockquote>

          <section>
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
          </section>

          <section>
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: What would you describe as NY Model's key aesthetic?
            </h2>
            <p>
              I think it's unusual, very editorial looks that clients are always looking
              for in the never ending quest to be the first to find and use someone new and
              trendsetting. We try to create that excitement of discovery when we offer new
              models to clients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: Is this similar or different for LA Models?
            </h2>
            <p>
              LA Models has the same philosophy and ideas as New York Models but in
              addition we are capable of catering to the requirements of commercial casting
              directors and advertising and catalogue clients casting and shooting on the
              West Coast.
            </p>
          </section>

          <section>
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Q: Your agencies are known for their revolutionary views on what a model
              should look like. What inspired you to take this path?
            </h2>
            <p>
              We simply wanted to be different from other agencies and offer more choices
              and ideas to clients as well as possibilities for models that do not exist in
              the larger, more traditional and commercial agencies.
            </p>
          </section>

          <section className="bg-[#f7f7f5] border border-gray-200 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Industry Context</h2>
            <p>
              The perspective in this interview remains highly relevant: global model
              careers now require flexible market positioning, cross-category opportunity,
              and strong representation that can bridge editorial credibility with
              commercial demand. The bi-coastal strategy described here anticipated this
              shift early, pairing New York's fashion intensity with Los Angeles' scale in
              entertainment and advertising.
            </p>
          </section>

          <footer className="pt-3 border-t border-gray-200">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              MODELS.com - Agency Spotlight
            </p>
          </footer>
        </article>

        <aside className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
            <h3 className="text-lg font-semibold text-black mb-4">Key Highlights</h3>
            <ul className="space-y-3 text-sm text-gray-700 leading-6">
              {highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
            <h3 className="text-lg font-semibold text-black mb-4">Agency Milestones</h3>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="border-l-2 border-gray-200 pl-4">
                  <p className="text-sm font-semibold text-black">{milestone.year}</p>
                  <p className="text-sm text-gray-700 leading-6">{milestone.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-black text-white rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3">Press & Editorial Inquiries</h3>
            <p className="text-sm text-white/85 leading-6 mb-4">
              For verified media requests, interview follow-ups, and brand partnership
              opportunities, please contact the agency through the official contact channel.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wide hover:bg-gray-200 transition-colors"
            >
              Contact LA Models
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Press;
