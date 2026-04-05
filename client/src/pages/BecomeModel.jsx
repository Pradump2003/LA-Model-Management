import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Check,
  AlertCircle,
  Camera,
  Globe,
  Send,
  Phone,
  Upload,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { applicationsAPI } from "../services/api";
import { countries } from "../data/countries";
import * as flags from "country-flag-icons/react/3x2";

const euroMetricHeights = Array.from({ length: 71 }, (_, i) => 130 + i); // 130 to 200 cm

const suitNumbers = {
  "usa-can": Array.from({ length: 21 }, (_, i) => 34 + i), // 34 to 54
  "euro-metric": Array.from({ length: 21 }, (_, i) => 35 + i), // 35 to 55
};

const suitFits = ["S", "R", "R/L", "L", "T"];

const dressOptions = {
  "usa-can": [
    "0",
    "0 - 2",
    "2",
    "2 - 4",
    "4",
    "4 - 6",
    "6",
    "6 - 8",
    "8",
    "8 - 10",
    "10",
    "10 - 12",
    "12",
    "12 - 14",
    "14",
    "14 - 16",
    "16",
    "16 - 18",
    "18",
    "18 - 20",
    "20",
    "20 - 22",
    "22",
    "22 - 24",
    "24",
    "24 - 26",
    "26",
    "26 - 28",
    "28",
    "28 - 30",
    "30",
  ],
  "euro-metric": [
    "30",
    "30 - 32",
    "32",
    "32 - 34",
    "34",
    "34 - 36",
    "36",
    "36 - 38",
    "38",
    "38 - 40",
    "40",
    "40 - 42",
    "42",
    "42 - 44",
    "44",
    "44 - 46",
    "46",
    "46 - 48",
    "48",
    "48 - 50",
    "50",
    "50 - 52",
    "52",
    "52 - 54",
    "54",
    "54 - 56",
    "56",
    "56 - 58",
    "58",
    "58 - 60",
    "60",
  ],
};

const cupOptions = {
  "usa-can": [
    "AA",
    "A",
    "A/B",
    "B",
    "B/C",
    "C",
    "C/D",
    "D",
    "DD",
    "E",
    "E/F",
    "F",
    "FF",
    "G",
    "G/GG",
    "GG/H",
    "H",
    "HH",
    "J",
  ],
  "euro-metric": [
    "AA",
    "A",
    "A/B",
    "B",
    "B/C",
    "C",
    "C/D",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
  ],
};

const shoeOptions = {
  "euro-metric": [
    "34-35",
    "35",
    "35-36",
    "36",
    "36-37",
    "37",
    "37-38",
    "38",
    "38-39",
    "39",
    "39-40",
    "40",
    "40-41",
    "41",
    "41-42",
    "42",
    "42-43",
    "43",
    "43-44",
    "44",
    "44-45",
    "45",
    "45-46",
    "46",
  ],
  "usa-can": [
    "4.5",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "12.5",
    "13",
  ],
};

const eyeOptions = [
  "Blue",
  "Blue - Green",
  "Blue - Grey",
  "Black",
  "Brown",
  "Green",
  "Grey",
  "Hazel",
  "Hazel - Green",
  "Grey - Green",
];

const hairOptions = [
  "Auburn",
  "Blonde",
  "Black",
  "Brown",
  "Grey",
  "Red",
  "Salt and Pepper",
  "Shaved",
  "White",
  "Silver",
  "Strawberry",
];

const quarterFractions = [
  { label: "1/4", value: ".25" },
  { label: "1/2", value: ".5" },
  { label: "3/4", value: ".75" },
];

const usaCanFemaleMeasurementRanges = {
  chest: Array.from({ length: 27 }, (_, i) => 25 + i), // 25 to 51
  waist: Array.from({ length: 23 }, (_, i) => 20 + i), // 20 to 42
  hips: Array.from({ length: 25 }, (_, i) => 30 + i), // 30 to 54
};

const euroMetricFemaleMeasurementRanges = {
  chest: Array.from({ length: 37 }, (_, i) => 64 + i), // 64 to 100
  waist: Array.from({ length: 31 }, (_, i) => 54 + i), // 54 to 84
  hips: Array.from({ length: 33 }, (_, i) => 80 + i), // 80 to 112
};

const usaCanHeights = Array.from({ length: 41 }, (_, i) => {
  const totalInches = 55 + i; // 4'7 to 7'11 approx
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return {
    totalInches,
    feet,
    inches,
    display: `${feet}'${inches}"`,
    label: `${totalInches} (${feet}'${inches}")`,
  };
});

const fractions = [
  { label: "1/4", value: 0.25 },
  { label: "1/2", value: 0.5 },
  { label: "3/4", value: 0.75 },
];

const formatHeightNumber = (value) => {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return Number(value.toFixed(2)).toString();
};

const formatUsaCanHeight = (totalInches) => {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return `${formatHeightNumber(totalInches)}'' ( ${feet}' ${formatHeightNumber(
    inches,
  )}'' )`;
};

const QuarterMeasurementPicker = ({ label, value, onSelect, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md px-4 py-3 border border-gray-300 bg-white text-left flex items-center justify-between"
      >
        <span
          className={
            value ? "text-gray-700" : "text-gray-400 uppercase tracking-wide"
          }
        >
          {value || label}
        </span>

        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[330px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-md p-3">
          <div className="space-y-1.5">
            {options.map((num) => (
              <div
                key={num}
                className="grid grid-cols-[56px_14px_1fr] gap-2 items-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(String(num));
                    setOpen(false);
                  }}
                  className="border border-gray-400 rounded-md px-2 py-1 text-sm min-w-[56px] leading-none hover:bg-gray-100"
                >
                  {num}
                </button>

                <div className="text-sm text-center">+</div>

                <div className="flex gap-1 flex-nowrap overflow-x-auto">
                  {quarterFractions.map((fraction) => (
                    <button
                      key={fraction.label}
                      type="button"
                      onClick={() => {
                        onSelect(`${num}${fraction.value}`);
                        setOpen(false);
                      }}
                      className="border border-gray-400 rounded-md px-2 py-1 text-xs min-w-[42px] whitespace-nowrap leading-none hover:bg-gray-100"
                    >
                      {fraction.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HalfMeasurementPicker = ({ label, value, onSelect, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md px-4 py-3 border border-gray-300 bg-white text-left flex items-center justify-between"
      >
        <span
          className={
            value ? "text-gray-700" : "text-gray-400 uppercase tracking-wide"
          }
        >
          {value || label}
        </span>

        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[220px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-md p-3">
          <div className="space-y-1.5">
            {options.map((num) => (
              <div
                key={num}
                className="grid grid-cols-[1fr_56px] gap-2 items-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(String(num));
                    setOpen(false);
                  }}
                  className="border border-gray-400 rounded-md px-2 py-1 text-sm leading-none hover:bg-gray-100"
                >
                  {num}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelect(`${num}.5`);
                    setOpen(false);
                  }}
                  className="border border-gray-400 rounded-md px-2 py-1 text-sm leading-none hover:bg-gray-100"
                >
                  0.5
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SimplePopupSelect = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md px-4 py-3 border border-gray-300 bg-white text-left flex items-center justify-between"
      >
        <span
          className={
            value ? "text-gray-700" : "text-gray-400 uppercase tracking-wide"
          }
        >
          {value || label}
        </span>

        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[300px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-md p-3">
          <div className="space-y-1.5">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className="w-full border border-gray-400 rounded-md px-3 py-1.5 text-sm text-left hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BecomeModel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [measurementSystem, setMeasurementSystem] = useState("usa-can");
  const [showHeightDropdown, setShowHeightDropdown] = useState(false);
  const [showSuitDropdown, setShowSuitDropdown] = useState(false);
  const [showDressDropdown, setShowDressDropdown] = useState(false);
  const [showCupDropdown, setShowCupDropdown] = useState(false);
  const [showShoeDropdown, setShowShoeDropdown] = useState(false);
  const [selectedHeightBase, setSelectedHeightBase] = useState(null);
  const [selectedFraction, setSelectedFraction] = useState(null);
  const [selectedSuitNumber, setSelectedSuitNumber] = useState("");
  const [selectedSuitFit, setSelectedSuitFit] = useState("");
  const heightDropdownRef = useRef(null);
  const suitDropdownRef = useRef(null);
  const dressDropdownRef = useRef(null);
  const cupDropdownRef = useRef(null);
  const shoeDropdownRef = useRef(null);

  const inchesToCm = (inches) => Math.round(inches * 2.54);

  const handleUsaCanHeightSelect = (baseHeight, fraction = 0) => {
    const total = baseHeight.totalInches + fraction;

    setSelectedHeightBase(baseHeight);
    setSelectedFraction(fraction);
    setShowHeightDropdown(false);

    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        height: {
          feet: String(baseHeight.feet),
          inches: String(baseHeight.inches),
          cm: inchesToCm(total),
        },
      },
    }));
  };

  const handleSuitSelect = (number, fit) => {
    setSelectedSuitNumber(number);
    setSelectedSuitFit(fit);

    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        suit: `${number} ${fit}`,
      },
    }));

    setShowSuitDropdown(false);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    ethnicity: "",

    applyingFor: {
      division: "",
      categories: [],
    },

    stats: {
      height: {
        feet: "",
        inches: "",
        cm: "",
      },
      weight: {
        lbs: "",
        kg: "",
      },
      bust: "",
      cup: "",
      waist: "",
      hips: "",
      dress: "",
      chest: "",
      suit: "",
      neck: "",
      sleeve: "",
      inseam: "",
      shoe: "",
      hairColor: "",
      eyeColor: "",
    },

    location: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United State",
    },

    parent: {
      required: false,
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },

    experience: {
      level: "",
      description: "",
      previousAgencies: [],
      professionalPhotos: false,
      portfolio: {
        clients: [],
        campaigns: [],
        editorials: [],
      },
    },

    skills: {
      acting: false,
      dancing: false,
      singing: false,
      sports: [],
      languages: [],
      instruments: [],
      other: [],
    },

    social: {
      instagram: "",
      facebook: "",
      twitter: "",
      tiktok: "",
      youtube: "",
      website: "",
      followers: {
        instagram: "",
        facebook: "",
        twitter: "",
        tiktok: "",
        youtube: "",
      },
    },

    photos: [],

    introVideo: {
      url: "",
      publicId: "",
      thumbnail: "",
    },

    additionalInfo: {
      howDidYouHear: "",
      referredBy: "",
      availableToTravel: false,
      availableToRelocate: false,
      hasValidPassport: false,
      visaStatus: "",
      legalToWork: false,
    },

    agreements: {
      termsAccepted: false,
      photoReleaseAccepted: false,
      ageVerified: false,
      parentalConsent: false,
    },
  });

  // Get selected country code for flag
  const getSelectedCountryCode = () => {
    const selected = countries.find(
      (c) => c.name === formData.location.country,
    );
    return selected ? selected.code : "US";
  };

  // Get Flag Component
  const FlagComponent = flags[getSelectedCountryCode()];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        heightDropdownRef.current &&
        !heightDropdownRef.current.contains(event.target)
      ) {
        setShowHeightDropdown(false);
      }

      if (
        suitDropdownRef.current &&
        !suitDropdownRef.current.contains(event.target)
      ) {
        setShowSuitDropdown(false);
      }

      if (
        dressDropdownRef.current &&
        !dressDropdownRef.current.contains(event.target)
      ) {
        setShowDressDropdown(false);
      }

      if (
        cupDropdownRef.current &&
        !cupDropdownRef.current.contains(event.target)
      ) {
        setShowCupDropdown(false);
      }

      if (
        shoeDropdownRef.current &&
        !shoeDropdownRef.current.contains(event.target)
      ) {
        setShowShoeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        let temp = { ...prev };
        let current = temp;

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
        return temp;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const keys = field.split(".");

    setFormData((prev) => {
      let temp = { ...prev };
      let current = temp;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = items;
      return temp;
    });
  };

  // Handle photo uploads
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          url: event.target.result,
          publicId: `temp_${Date.now()}_${Math.random()}`,
          type: "other",
          file: file,
        };

        setUploadedPhotos((prev) => [...prev, newPhoto]);
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, newPhoto],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove photo
  const removePhoto = (publicId) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.publicId !== publicId));
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.publicId !== publicId),
    }));
  };

  // Handle video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const video = {
          url: event.target.result,
          publicId: `video_${Date.now()}`,
          thumbnail: event.target.result,
          file: file,
        };

        setUploadedVideo(video);
        setFormData((prev) => ({
          ...prev,
          introVideo: video,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove video
  const removeVideo = () => {
    setUploadedVideo(null);
    setFormData((prev) => ({
      ...prev,
      introVideo: {
        url: "",
        publicId: "",
        thumbnail: "",
      },
    }));
  };

  const calculateAge = (dob) => {
    const age = Math.floor((new Date() - new Date(dob)) / 31557600000);
    return age;
  };

  const isParentRequired = () => {
    if (!formData.dateOfBirth) return false;
    const age = calculateAge(formData.dateOfBirth);
    return age < 18 || formData.applyingFor.division === "juniors";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await applicationsAPI.submit(formData);

      if (response.data.success) {
        navigate("/application-success");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
          alt="Become a Model"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Join LA Models
            </h1>
            <p className="text-xl text-white/90">
              Start your modeling career today
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          {/* Important Notice Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gray-50 p-8 border-l-4 border-black"
          >
            <h2 className="text-2xl font-bold mb-4">Important Notice</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              LA Model Management is committed to protecting the safety,
              personal information, images, and well-being of models and those
              wanting to become a model. Please be aware that there are
              individuals who may try to prey on your modeling ambitions by
              impersonating representatives of our agency or other modeling
              organizations. Such imposters may contact you directly; you should
              follow certain precautions, including:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  Be cautious of interactions with individuals who contact you
                  online through social media or via email. LA Models will only
                  contact you through our official{" "}
                  <a
                    href="mailto:@lamodels.com"
                    className="font-semibold underline"
                  >
                    @lamodels.com
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://instagram.com/lamodels"
                    className="font-semibold underline"
                  >
                    @lamodels Instagram
                  </a>
                  .{" "}
                  <span className="font-semibold">
                    We will never ask you to provide payment.
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  You should always independently verify the identity of any
                  individual claiming to be a representative of LA Models or
                  verify the accuracy of any communication that you receive from
                  LAModels by calling us at{" "}
                  <a href="tel:+13234367700" className="font-semibold">
                    +1 323.436.7700
                  </a>
                  . If you believe you have been contacted by someone
                  impersonating an LA Models representative, please contact our
                  offices immediately as your first step before responding or
                  sharing any personal information.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submission Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 grid md:grid-cols-2 gap-8"
          >
            {/* Online Submission */}
            <div className="bg-white p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Online Submission</h3>
              <p className="text-gray-600 mb-6">
                Fill out our online application form below. This is the fastest
                way to submit your application.
              </p>
              <div className="bg-black text-white px-4 py-2 inline-block text-sm font-medium uppercase">
                Recommended
              </div>
            </div>

            {/* Mail Submission */}
            <div className="bg-gray-50 p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Mail Submission</h3>
              <p className="text-gray-600 mb-4">
                If you cannot meet with us in person or submit online, you may
                still submit photos. Photos should be current and natural and we
                prefer non-professional. They may be sent by mail to the address
                below. Submission & Photographs will not be returned.
              </p>

              <div className="mt-6 space-y-2 text-sm">
                <p className="font-semibold">
                  Women - Please submit via online submission
                </p>
                <p className="font-semibold">
                  Men - Please submit via online submission
                </p>
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
          </motion.div>

          {/* Photo Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 bg-white p-8 border border-gray-200"
          >
            <h3 className="text-2xl font-bold mb-6">Photo Guidelines</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-lg">
                  What You Should Take:
                </h4>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Headshot straight on</li>
                  <li>2. Full length body shot</li>
                  <li>3. 3/4 shot straight on</li>
                  <li>4. Headshot profiles</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-lg">
                  Things to Keep in Mind:
                </h4>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Do not smile</li>
                  <li>2. Do not pose</li>
                  <li>
                    3. Shoot with a plain wall or simple background behind you
                  </li>
                  <li>4. Wear a swimsuit</li>
                  <li>5. Digital photos are best</li>
                  <li>6. Keep your hair pulled back</li>
                  <li>7. Do not send large photo files</li>
                  <li>8. Be as natural as possible - NO MAKE UP!!!</li>
                  <li>
                    9. Make sure to include all your statistics including, age,
                    birth date, height and measurements
                  </li>
                </ol>
              </div>
            </div>

            {/* Sample Photos */}
            <div className="mt-8 pt-8 border-t">
              <h4 className="font-semibold mb-4 text-center">
                Sample Photo Layout
              </h4>
              <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div
                    key={num}
                    className="aspect-square bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
                  >
                    Photo {num}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Open Calls Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 bg-yellow-50 border-l-4 border-yellow-400 p-6"
          >
            <h3 className="text-xl font-bold mb-2">Open Calls</h3>
            <p className="text-gray-700">
              <span className="font-semibold">
                Be advised, our open call is currently CANCELLED until further
                notice.
              </span>{" "}
              We are only accepting online submissions at this time. Please
              revisit our website for future updates. Thank you.
            </p>
          </motion.div>

          {/* Application Form Starts Here */}
          <div className="bg-white p-8 md:p-12 border border-gray-200">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Online Application
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Complete all required fields below
            </p>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 ${
                      s <= step ? "bg-black" : "bg-gray-200"
                    } ${s !== 1 ? "ml-2" : ""}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className={step >= 1 ? "font-medium" : "text-gray-500"}>
                  Personal
                </span>
                <span className={step >= 2 ? "font-medium" : "text-gray-500"}>
                  Stats
                </span>
                <span className={step >= 3 ? "font-medium" : "text-gray-500"}>
                  Experience
                </span>
                <span className={step >= 4 ? "font-medium" : "text-gray-500"}>
                  Photos
                </span>
                <span className={step >= 5 ? "font-medium" : "text-gray-500"}>
                  Agreement
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="become-model-form">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold mb-6">
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-Binary</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ethnicity
                    </label>
                    <input
                      type="text"
                      name="ethnicity"
                      value={formData.ethnicity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Division *
                    </label>
                    <select
                      name="applyingFor.division"
                      value={formData.applyingFor.division}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    >
                      <option value="">Select Division...</option>
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="newFaces">New Faces</option>
                      <option value="direct">Direct</option>
                      <option value="special-booking">Special Booking</option>
                      <option value="juniors">Juniors</option>
                    </select>
                  </div>

                  {/* Location - With Flag Image */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold">Location</h4>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="location.street"
                        value={formData.location.street}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleChange}
                          required
                          placeholder="Los Angeles"
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          name="location.state"
                          value={formData.location.state}
                          onChange={handleChange}
                          required
                          placeholder="California"
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          name="location.zipCode"
                          value={formData.location.zipCode}
                          onChange={handleChange}
                          placeholder="90046"
                          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          {/* Flag Image - Left Corner */}
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                            {FlagComponent && (
                              <FlagComponent className="w-8 h-6 rounded shadow-sm border border-gray-200" />
                            )}
                          </div>

                          {/* Dropdown with padding for flag */}
                          <select
                            name="location.country"
                            value={formData.location.country}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md pl-16 pr-10 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none appearance-none bg-white cursor-pointer"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>

                          {/* Custom Dropdown Arrow */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent Info (if required) */}
                  {isParentRequired() && (
                    <div className="space-y-4 pt-4 border-t bg-yellow-50 p-6">
                      <h4 className="font-semibold text-yellow-800">
                        Parent/Guardian Information Required
                      </h4>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Parent Name *
                          </label>
                          <input
                            type="text"
                            name="parent.name"
                            value={formData.parent.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Parent Phone *
                          </label>
                          <input
                            type="tel"
                            name="parent.phone"
                            value={formData.parent.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full rounded-md px-8 py-4 bg-black text-white font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
                  >
                    Next Step
                  </button>
                </motion.div>
              )}

              {/* Step 2: Measurements & Stats */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold mb-6">Measurements</h3>

                  {/* Common Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-semibold">Height</h4>

                      {/* Radio buttons like screenshot */}
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="measurementSystem"
                            value="euro-metric"
                            checked={measurementSystem === "euro-metric"}
                            onChange={() => {
                              setMeasurementSystem("euro-metric");
                              setShowHeightDropdown(false);
                              setShowSuitDropdown(false);
                              setShowDressDropdown(false);
                              setShowCupDropdown(false);
                              setShowShoeDropdown(false);
                              setSelectedHeightBase(null);
                              setSelectedFraction(null);
                              setSelectedSuitNumber("");
                              setSelectedSuitFit("");
                              setFormData((prev) => ({
                                ...prev,
                                stats: {
                                  ...prev.stats,
                                  height: {
                                    feet: "",
                                    inches: "",
                                    cm: "",
                                  },
                                  dress: "",
                                  cup: "",
                                  shoe: "",
                                  suit: "",
                                },
                              }));
                            }}
                            className="w-5 h-5 accent-black"
                          />
                          <span className="text-sm font-medium tracking-wide">
                            EURO-METRIC
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="measurementSystem"
                            value="usa-can"
                            checked={measurementSystem === "usa-can"}
                            onChange={() => {
                              setMeasurementSystem("usa-can");
                              setShowHeightDropdown(false);
                              setShowSuitDropdown(false);
                              setShowDressDropdown(false);
                              setShowCupDropdown(false);
                              setShowShoeDropdown(false);
                              setSelectedHeightBase(null);
                              setSelectedFraction(null);
                              setSelectedSuitNumber("");
                              setSelectedSuitFit("");
                              setFormData((prev) => ({
                                ...prev,
                                stats: {
                                  ...prev.stats,
                                  height: {
                                    feet: "",
                                    inches: "",
                                    cm: "",
                                  },
                                  dress: "",
                                  cup: "",
                                  shoe: "",
                                  suit: "",
                                },
                              }));
                            }}
                            className="w-5 h-5 accent-black"
                          />
                          <span className="text-sm font-medium tracking-wide">
                            USA-CAN
                          </span>
                        </label>
                      </div>

                      {/* EURO-METRIC dropdown */}
                      {measurementSystem === "euro-metric" && (
                        <div>
                          <select
                            value={formData.stats.height.cm || ""}
                            onChange={(e) => {
                              const selectedCm = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                stats: {
                                  ...prev.stats,
                                  height: {
                                    feet: "",
                                    inches: "",
                                    cm: selectedCm,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-md px-4 py-3 border-2 border-gray-300 focus:border-black outline-none bg-white text-sm text-gray-700"
                          >
                            <option value="">HEIGHT</option>
                            {euroMetricHeights.map((cm) => (
                              <option key={cm} value={cm}>
                                {cm}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* USA-CAN dropdown */}
                      {measurementSystem === "usa-can" && (
                        <div className="relative" ref={heightDropdownRef}>
                          <button
                            type="button"
                            onClick={() =>
                              setShowHeightDropdown((prev) => !prev)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                          >
                            <span className="text-gray-700 text-sm font-medium tracking-wide">
                              {selectedHeightBase
                                ? formatUsaCanHeight(
                                    selectedHeightBase.totalInches +
                                      (selectedFraction || 0),
                                  )
                                : "HEIGHT"}
                            </span>
                            <svg
                              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                showHeightDropdown ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {showHeightDropdown && (
                            <div className="absolute z-50 mt-2 w-full max-w-[420px] max-h-[500px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
                              <div className="space-y-2">
                                {usaCanHeights.map((item) => (
                                  <div
                                    key={item.totalInches}
                                    className="flex items-center gap-2 flex-nowrap rounded-lg px-1 py-0.5"
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUsaCanHeightSelect(item, 0)
                                      }
                                      className={`min-w-[54px] rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none transition-colors ${
                                        selectedHeightBase?.totalInches ===
                                          item.totalInches &&
                                        (selectedFraction || 0) === 0
                                          ? "border-black bg-black text-white"
                                          : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {item.totalInches}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUsaCanHeightSelect(item, 0)
                                      }
                                      className={`min-w-[66px] rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none transition-colors ${
                                        selectedHeightBase?.totalInches ===
                                          item.totalInches &&
                                        (selectedFraction || 0) === 0
                                          ? "border-black bg-black text-white"
                                          : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {item.display}
                                    </button>

                                    <div className="w-4 text-center text-sm text-gray-400 flex-shrink-0">
                                      +
                                    </div>

                                    <div className="flex gap-1 flex-nowrap overflow-x-auto">
                                      {fractions.map((fraction) => (
                                        <button
                                          key={fraction.label}
                                          type="button"
                                          onClick={() =>
                                            handleUsaCanHeightSelect(
                                              item,
                                              fraction.value,
                                            )
                                          }
                                          className={`min-w-[48px] rounded-full border px-2.5 py-1.5 text-[11px] font-medium leading-none transition-colors ${
                                            selectedHeightBase?.totalInches ===
                                              item.totalInches &&
                                            selectedFraction === fraction.value
                                              ? "border-black bg-black text-white"
                                              : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                          }`}
                                        >
                                          {fraction.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium mb-2">
                        Height (Inches)
                      </label>
                      <input
                        type="text"
                        name="stats.height.inches"
                        value={formData.stats.height.inches}
                        onChange={handleChange}
                        placeholder="10"
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div> */}

                    {/* <div>
                      <label className="block text-sm font-medium mb-2">
                        Height (CM)
                      </label>
                      <input
                        type="number"
                        name="stats.height.cm"
                        value={formData.stats.height.cm}
                        onChange={handleChange}
                        placeholder="178"
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div> */}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        name="stats.weight.lbs"
                        value={formData.stats.weight.lbs}
                        onChange={handleChange}
                        placeholder="120"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="stats.weight.kg"
                        value={formData.stats.weight.kg}
                        onChange={handleChange}
                        placeholder="54"
                        className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                  </div>

                  {/* Female / Non-binary measurements */}
                  {(formData.gender === "female" ||
                    formData.gender === "non-binary") && (
                    <div className="space-y-6 pt-4 border-t">
                      <h4 className="font-semibold text-lg">
                        Body Measurements
                      </h4>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Dress
                          </label>
                          <div className="relative" ref={dressDropdownRef}>
                            <button
                              type="button"
                              onClick={() =>
                                setShowDressDropdown((prev) => !prev)
                              }
                              className="w-full rounded-md px-4 py-2.5 border border-gray-300 bg-white text-left flex items-center justify-between"
                            >
                              <span
                                className={
                                  formData.stats.dress
                                    ? "text-gray-700"
                                    : "text-gray-400 uppercase tracking-wide"
                                }
                              >
                                {formData.stats.dress || "DRESS"}
                              </span>

                              <svg
                                className={`w-5 h-5 transition-transform ${showDressDropdown ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {showDressDropdown && (
                              <div className="absolute z-50 mt-2 w-[220px] max-h-[500px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-md p-3">
                                <div className="space-y-1.5">
                                  {dressOptions[measurementSystem].map(
                                    (option) => (
                                      <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            stats: {
                                              ...prev.stats,
                                              dress: option,
                                            },
                                          }));
                                          setShowDressDropdown(false);
                                        }}
                                          className={`w-full border rounded-md px-3 py-1.5 text-sm text-left ${formData.stats.dress === option ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                                      >
                                        {option}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Chest
                          </label>
                          {formData.gender === "female" &&
                          measurementSystem === "usa-can" ? (
                            <QuarterMeasurementPicker
                              label="CHEST"
                              value={formData.stats.bust}
                              options={usaCanFemaleMeasurementRanges.chest}
                              onSelect={(selectedValue) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    bust: selectedValue,
                                  },
                                }))
                              }
                            />
                          ) : formData.gender === "female" &&
                            measurementSystem === "euro-metric" ? (
                            <HalfMeasurementPicker
                              label="CHEST"
                              value={formData.stats.bust}
                              options={euroMetricFemaleMeasurementRanges.chest}
                              onSelect={(selectedValue) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    bust: selectedValue,
                                  },
                                }))
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              name="stats.chest"
                              value={formData.stats.chest}
                              onChange={handleChange}
                              placeholder="34"
                              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                            />
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Cup
                          </label>
                          <div className="relative" ref={cupDropdownRef}>
                            <button
                              type="button"
                              onClick={() => setShowCupDropdown((prev) => !prev)}
                              className="w-full rounded-md px-4 py-2.5 border border-gray-300 bg-white text-left flex items-center justify-between"
                            >
                              <span
                                className={
                                  formData.stats.cup
                                    ? "text-gray-700"
                                    : "text-gray-400 uppercase tracking-wide"
                                }
                              >
                                {formData.stats.cup || "CUP"}
                              </span>

                              <svg
                                className={`w-5 h-5 transition-transform ${showCupDropdown ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {showCupDropdown && (
                              <div className="absolute z-50 mt-2 w-[190px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-md p-3">
                                <div className="space-y-1.5">
                                  {cupOptions[measurementSystem].map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          stats: {
                                            ...prev.stats,
                                            cup: option,
                                          },
                                        }));
                                        setShowCupDropdown(false);
                                      }}
                                      className={`w-full border rounded-md px-3 py-1.5 text-sm text-left ${formData.stats.cup === option ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Waist
                          </label>
                          {formData.gender === "female" &&
                          measurementSystem === "usa-can" ? (
                            <QuarterMeasurementPicker
                              label="WAIST"
                              value={formData.stats.waist}
                              options={usaCanFemaleMeasurementRanges.waist}
                              onSelect={(selectedValue) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    waist: selectedValue,
                                  },
                                }))
                              }
                            />
                          ) : formData.gender === "female" &&
                            measurementSystem === "euro-metric" ? (
                            <HalfMeasurementPicker
                              label="WAIST"
                              value={formData.stats.waist}
                              options={euroMetricFemaleMeasurementRanges.waist}
                              onSelect={(selectedValue) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    waist: selectedValue,
                                  },
                                }))
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              name="stats.waist"
                              value={formData.stats.waist}
                              onChange={handleChange}
                              placeholder="24"
                              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Hips
                          </label>
                          {formData.gender === "female" &&
                          measurementSystem === "usa-can" ? (
                            <QuarterMeasurementPicker
                              label="HIPS"
                              value={formData.stats.hips}
                              options={usaCanFemaleMeasurementRanges.hips}
                              onSelect={(selectedValue) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    hips: selectedValue,
                                  },
                                }))
                              }
                            />
                          ) : formData.gender === "female" &&
                            measurementSystem === "euro-metric" ? (
                            <HalfMeasurementPicker
                              label="HIPS"
                              value={formData.stats.hips}
                              options={euroMetricFemaleMeasurementRanges.hips}
                              onSelect={(selectedValue) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  stats: {
                                    ...prev.stats,
                                    hips: selectedValue,
                                  },
                                }))
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              name="stats.hips"
                              value={formData.stats.hips}
                              onChange={handleChange}
                              placeholder="35"
                              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                            />
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Shoe
                          </label>
                          <div className="relative" ref={shoeDropdownRef}>
                            <button
                              type="button"
                              onClick={() => setShowShoeDropdown((prev) => !prev)}
                              className="w-full rounded-md px-4 py-2.5 border border-gray-300 bg-white text-left flex items-center justify-between"
                            >
                              <span
                                className={
                                  formData.stats.shoe
                                    ? "text-gray-700"
                                    : "text-gray-400 uppercase tracking-wide"
                                }
                              >
                                {formData.stats.shoe || "SHOE"}
                              </span>

                              <svg
                                className={`w-5 h-5 transition-transform ${showShoeDropdown ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {showShoeDropdown && (
                              <div className="absolute z-50 mt-2 w-[210px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-md p-3">
                                <div className="space-y-1.5">
                                  {shoeOptions[measurementSystem].map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          stats: {
                                            ...prev.stats,
                                            shoe: option,
                                          },
                                        }));
                                        setShowShoeDropdown(false);
                                      }}
                                      className={`w-full border rounded-md px-3 py-1.5 text-sm text-left ${formData.stats.shoe === option ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Male measurements */}
                  {formData.gender === "male" && (
                    <div className="space-y-6 pt-4 border-t">
                      <h4 className="font-semibold text-lg">
                        Body Measurements
                      </h4>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Chest
                          </label>
                          <input
                            type="text"
                            name="stats.chest"
                            value={formData.stats.chest}
                            onChange={handleChange}
                            placeholder="40"
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Waist
                          </label>
                          <input
                            type="text"
                            name="stats.waist"
                            value={formData.stats.waist}
                            onChange={handleChange}
                            placeholder="32"
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Suit
                          </label>
                          <div className="relative" ref={suitDropdownRef}>
                            <button
                              type="button"
                              onClick={() =>
                                setShowSuitDropdown((prev) => !prev)
                              }
                              className="w-full px-6 py-3 border border-gray-300 bg-white text-left flex items-center justify-between"
                            >
                              <span
                                className={
                                  formData.stats.suit
                                    ? "text-gray-700"
                                    : "text-gray-400 uppercase tracking-wide"
                                }
                              >
                                {formData.stats.suit || "SUIT"}
                              </span>

                              <svg
                                className={`w-5 h-5 transition-transform ${showSuitDropdown ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {showSuitDropdown && (
                              <div className="absolute z-50 mt-2 w-full max-h-[500px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-sm p-4">
                                <div className="space-y-2">
                                  {suitNumbers[measurementSystem].map((num) => (
                                    <div
                                      key={num}
                                      className="grid grid-cols-[56px_14px_1fr] gap-2 items-center"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSuitSelect(num, "R")
                                        }
                                        className={`border rounded px-2 py-1 text-sm min-w-[56px] leading-none ${selectedSuitNumber === num && selectedSuitFit === "R" ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                                      >
                                        {num}
                                      </button>

                                      <div className="text-sm text-center">
                                        •
                                      </div>

                                      <div className="flex gap-1 flex-nowrap overflow-x-auto">
                                        {suitFits.map((fit) => (
                                          <button
                                            key={fit}
                                            type="button"
                                            onClick={() =>
                                              handleSuitSelect(num, fit)
                                            }
                                            className={`border rounded px-2 py-1 text-xs min-w-[42px] whitespace-nowrap leading-none ${selectedSuitNumber === num && selectedSuitFit === fit ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                                          >
                                            {fit}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Neck
                          </label>
                          <input
                            type="text"
                            name="stats.neck"
                            value={formData.stats.neck}
                            onChange={handleChange}
                            placeholder="15.5"
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Sleeve
                          </label>
                          <input
                            type="text"
                            name="stats.sleeve"
                            value={formData.stats.sleeve}
                            onChange={handleChange}
                            placeholder="34"
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Inseam
                          </label>
                          <input
                            type="text"
                            name="stats.inseam"
                            value={formData.stats.inseam}
                            onChange={handleChange}
                            placeholder="32"
                            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Shoe
                          </label>
                          <div className="relative" ref={shoeDropdownRef}>
                            <button
                              type="button"
                              onClick={() => setShowShoeDropdown((prev) => !prev)}
                              className="w-full px-6 py-3 border border-gray-300 bg-white text-left flex items-center justify-between"
                            >
                              <span
                                className={
                                  formData.stats.shoe
                                    ? "text-gray-700"
                                    : "text-gray-400 uppercase tracking-wide"
                                }
                              >
                                {formData.stats.shoe || "SHOE"}
                              </span>

                              <svg
                                className={`w-5 h-5 transition-transform ${showShoeDropdown ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            {showShoeDropdown && (
                              <div className="absolute z-50 mt-2 w-[210px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-sm p-3">
                                <div className="space-y-1.5">
                                  {shoeOptions[measurementSystem].map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          stats: {
                                            ...prev.stats,
                                            shoe: option,
                                          },
                                        }));
                                        setShowShoeDropdown(false);
                                      }}
                                      className={`w-full border rounded px-3 py-1.5 text-sm text-left ${formData.stats.shoe === option ? "border-black bg-black text-white" : "border-gray-400 hover:bg-gray-100"}`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common appearance fields */}
                  <div className="space-y-6 pt-4 border-t">
                    <h4 className="font-semibold text-lg">Appearance</h4>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Hair Color
                        </label>
                        <SimplePopupSelect
                          label="HAIR"
                          value={formData.stats.hairColor}
                          options={hairOptions}
                          onSelect={(selectedValue) =>
                            setFormData((prev) => ({
                              ...prev,
                              stats: {
                                ...prev.stats,
                                hairColor: selectedValue,
                              },
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Eye Color
                        </label>
                        <SimplePopupSelect
                          label="EYES"
                          value={formData.stats.eyeColor}
                          options={eyeOptions}
                          onSelect={(selectedValue) =>
                            setFormData((prev) => ({
                              ...prev,
                              stats: {
                                ...prev.stats,
                                eyeColor: selectedValue,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t mt-10">
                    <h3 className="text-2xl font-light uppercase tracking-wide mb-6">
                      Social Media{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-0 border border-gray-200">
                        <div className="flex items-center px-4 py-3 gap-2.5 border-b md:border-b-0 md:border-r border-gray-200">
                          <Camera className="w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            name="social.instagram"
                            value={formData.social.instagram}
                            onChange={handleChange}
                            placeholder="INSTAGRAM"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                        <div className="px-4 py-3">
                          <input
                            type="number"
                            name="social.followers.instagram"
                            value={formData.social.followers.instagram}
                            onChange={handleChange}
                            placeholder="# FOLLOWERS"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-0 border border-gray-200">
                        <div className="flex items-center px-4 py-3 gap-2.5 border-b md:border-b-0 md:border-r border-gray-200">
                          <Globe className="w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            name="social.facebook"
                            value={formData.social.facebook}
                            onChange={handleChange}
                            placeholder="FACEBOOK"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                        <div className="px-4 py-3">
                          <input
                            type="number"
                            name="social.followers.facebook"
                            value={formData.social.followers.facebook}
                            onChange={handleChange}
                            placeholder="# FOLLOWERS"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-0 border border-gray-200">
                        <div className="flex items-center px-4 py-3 gap-2.5 border-b md:border-b-0 md:border-r border-gray-200">
                          <Send className="w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            name="social.twitter"
                            value={formData.social.twitter}
                            onChange={handleChange}
                            placeholder="TWITTER"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                        <div className="px-4 py-3">
                          <input
                            type="number"
                            name="social.followers.twitter"
                            value={formData.social.followers.twitter}
                            onChange={handleChange}
                            placeholder="# FOLLOWERS"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                      </div>

                      <div className="border border-gray-200">
                        <div className="flex items-center px-4 py-3 gap-2.5">
                          <Globe className="w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            name="social.website"
                            value={formData.social.website}
                            onChange={handleChange}
                            placeholder="PORTFOLIO / WEBSITE"
                            className="w-full outline-none bg-transparent text-sm placeholder:text-gray-300 uppercase tracking-wide"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-md px-8 py-4 border-2 border-black text-black font-medium uppercase tracking-wide hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 rounded-md px-8 py-4 bg-black text-white font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Experience */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold mb-6">Experience</h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experience.level"
                      value={formData.experience.level}
                      onChange={handleChange}
                      className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="no-experience">No Experience</option>
                      <option value="some-experience">Some Experience</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="experience.description"
                      value={formData.experience.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us about your modeling experience..."
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="English, Spanish, French"
                      onChange={(e) =>
                        handleArrayInput("skills.languages", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sports/Activities (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Swimming, Dancing, Yoga"
                      onChange={(e) =>
                        handleArrayInput("skills.sports", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="skills.acting"
                        checked={formData.skills.acting}
                        onChange={handleChange}
                        className="w-5 h-5"
                      />
                      <span>Acting</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="skills.dancing"
                        checked={formData.skills.dancing}
                        onChange={handleChange}
                        className="w-5 h-5"
                      />
                      <span>Dancing</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="skills.singing"
                        checked={formData.skills.singing}
                        onChange={handleChange}
                        className="w-5 h-5"
                      />
                      <span>Singing</span>
                    </label>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold">Additional Information</h4>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        name="additionalInfo.howDidYouHear"
                        value={formData.additionalInfo.howDidYouHear}
                        onChange={handleChange}
                        className="w-full rounded-md px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="">Select...</option>
                        <option value="instagram">Instagram</option>
                        <option value="google">Google</option>
                        <option value="referral">Referral</option>
                        <option value="scout">Scout</option>
                        <option value="tiktok">TikTok</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="additionalInfo.availableToTravel"
                          checked={formData.additionalInfo.availableToTravel}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <span>Available to travel</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="additionalInfo.hasValidPassport"
                          checked={formData.additionalInfo.hasValidPassport}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <span>Has valid passport</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-md px-8 py-4 border-2 border-black text-black font-medium uppercase tracking-wide hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="flex-1 rounded-md px-8 py-4 bg-black text-white font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Photos & Video Upload */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold mb-6">
                    Upload Photos & Video
                  </h3>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Photos (4-8 recommended)
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Headshot, full body, profiles - natural lighting, minimal
                      makeup
                    </p>

                    <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <span className="text-sm font-medium mb-2">
                          Click to upload photos
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG up to 10MB each
                        </span>
                      </label>
                    </div>

                    {/* Uploaded Photos Preview */}
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {uploadedPhotos.map((photo) => (
                          <div key={photo.publicId} className="relative group">
                            <img
                              src={photo.url}
                              alt="Upload preview"
                              className="w-full aspect-square object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.publicId)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="pt-6 border-t">
                    <label className="block text-sm font-medium mb-2">
                      Introduction Video (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Brief introduction video (max 1 minute)
                    </p>

                    {!uploadedVideo ? (
                      <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer inline-flex flex-col items-center"
                        >
                          <Video className="w-12 h-12 text-gray-400 mb-4" />
                          <span className="text-sm font-medium mb-2">
                            Click to upload video
                          </span>
                          <span className="text-xs text-gray-500">
                            MP4, MOV up to 50MB
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border border-gray-300 p-4">
                        <div className="flex items-center gap-4">
                          <Video className="w-8 h-8 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Video uploaded
                            </p>
                            <p className="text-xs text-gray-500">
                              {uploadedVideo.file?.name}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 rounded-md px-8 py-4 border-2 border-black text-black font-medium uppercase tracking-wide hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="flex-1 rounded-md px-8 py-4 bg-black text-white font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Agreement */}
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold mb-6">
                    Terms & Conditions
                  </h3>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreements.termsAccepted"
                        checked={formData.agreements.termsAccepted}
                        onChange={handleChange}
                        required
                        className="mt-1 w-5 h-5"
                      />
                      <span className="text-sm">
                        I agree to the Terms of Service and Privacy Policy *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreements.photoReleaseAccepted"
                        checked={formData.agreements.photoReleaseAccepted}
                        onChange={handleChange}
                        required
                        className="mt-1 w-5 h-5"
                      />
                      <span className="text-sm">
                        I grant LA Models the right to use submitted photos for
                        evaluation *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreements.ageVerified"
                        checked={formData.agreements.ageVerified}
                        onChange={handleChange}
                        required
                        className="mt-1 w-5 h-5"
                      />
                      <span className="text-sm">
                        I confirm the information provided is accurate *
                      </span>
                    </label>

                    {isParentRequired() && (
                      <label className="flex items-start gap-3 cursor-pointer bg-yellow-50 p-3">
                        <input
                          type="checkbox"
                          name="agreements.parentalConsent"
                          checked={formData.agreements.parentalConsent}
                          onChange={handleChange}
                          required
                          className="mt-1 w-5 h-5"
                        />
                        <span className="text-sm">
                          Parent/Guardian consent provided *
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="flex-1 rounded-md px-8 py-4 border-2 border-black text-black font-medium uppercase tracking-wide hover:bg-gray-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-md px-8 py-4 bg-black text-white font-medium uppercase tracking-wide hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeModel;
