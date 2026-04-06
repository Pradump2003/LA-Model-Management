import { motion as Motion } from "framer-motion";
import { AlertCircle, Phone } from "lucide-react";

const samplePhotoUrls = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80",
  "https://images.unsplash.com/photo-1464863979621-258859e62245?w=900&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80",
];

const IntroSections = () => {
  return (
    <>
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
          alt="Become a Model"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Join LA Models</h1>
            <p className="text-xl text-white/90">Start your modeling career today</p>
          </Motion.div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gray-50 p-8 border-l-4 border-black"
          >
            <h2 className="text-2xl font-bold mb-4">Important Notice</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              LA Model Management is committed to protecting the safety, personal information,
              images, and well-being of models and those wanting to become a model. Please be
              aware that there are individuals who may try to prey on your modeling ambitions by
              impersonating representatives of our agency or other modeling organizations. Such
              imposters may contact you directly; you should follow certain precautions, including:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  Be cautious of interactions with individuals who contact you online through social
                  media or via email. LA Models will only contact you through our official{" "}
                  <a href="mailto:@lamodels.com" className="font-semibold underline">
                    @lamodels.com
                  </a>{" "}
                  or{" "}
                  <a href="https://instagram.com/lamodels" className="font-semibold underline">
                    @lamodels Instagram
                  </a>
                  .{" "}
                  <span className="font-semibold">We will never ask you to provide payment.</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  You should always independently verify the identity of any individual claiming to
                  be a representative of LA Models or verify the accuracy of any communication that
                  you receive from LAModels by calling us at{" "}
                  <a href="tel:+13234367700" className="font-semibold">
                    +1 323.436.7700
                  </a>
                  . If you believe you have been contacted by someone impersonating an LA Models
                  representative, please contact our offices immediately as your first step before
                  responding or sharing any personal information.
                </p>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Online Submission</h3>
              <p className="text-gray-600 mb-6">
                Fill out our online application form below. This is the fastest way to submit your
                application.
              </p>
              <div className="bg-black text-white px-4 py-2 inline-block text-sm font-medium uppercase">
                Recommended
              </div>
            </div>

            <div className="bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Mail Submission</h3>
              <p className="text-gray-600 mb-4">
                If you cannot meet with us in person or submit online, you may still submit photos.
                Photos should be current and natural and we prefer non-professional. They may be
                sent by mail to the address below. Submission & Photographs will not be returned.
              </p>

              <div className="mt-6 space-y-2 text-sm">
                <p className="font-semibold">Women - Please submit via online submission</p>
                <p className="font-semibold">Men - Please submit via online submission</p>
              </div>

              <div className="mt-6 p-4 bg-white">
                <p className="font-semibold mb-2">LA MODELS</p>
                <p className="text-sm text-gray-600">
                  7700 W. Sunset Boulevard
                  <br />
                  Los Angeles, CA 90046
                </p>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 bg-white p-8 border border-gray-200"
          >
            <h3 className="text-2xl font-bold mb-6">Photo Guidelines</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-lg">What You Should Take:</h4>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Headshot straight on</li>
                  <li>2. Full length body shot</li>
                  <li>3. 3/4 shot straight on</li>
                  <li>4. Headshot profiles</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-lg">Things to Keep in Mind:</h4>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Do not smile</li>
                  <li>2. Do not pose</li>
                  <li>3. Shoot with a plain wall or simple background behind you</li>
                  <li>4. Wear a swimsuit</li>
                  <li>5. Digital photos are best</li>
                  <li>6. Keep your hair pulled back</li>
                  <li>7. Do not send large photo files</li>
                  <li>8. Be as natural as possible - NO MAKE UP!!!</li>
                  <li>
                    9. Make sure to include all your statistics including, age, birth date, height
                    and measurements
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h4 className="font-semibold mb-4 text-center">Sample Photo Layout</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {samplePhotoUrls.map((src, index) => (
                  <div
                    key={src}
                    className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 aspect-[4/5]"
                  >
                    <img
                      src={src}
                      alt={`Sample photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 bg-yellow-50 border-l-4 border-yellow-400 p-6"
          >
            <h3 className="text-xl font-bold mb-2">Open Calls</h3>
            <p className="text-gray-700">
              <span className="font-semibold">
                Be advised, our open call is currently CANCELLED until further notice.
              </span>{" "}
              We are only accepting online submissions at this time. Please revisit our website
              for future updates. Thank you.
            </p>
          </Motion.div>
        </div>
      </div>
    </>
  );
};

export default IntroSections;

