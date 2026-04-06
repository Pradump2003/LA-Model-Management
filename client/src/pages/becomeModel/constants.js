export const euroMetricHeights = Array.from({ length: 71 }, (_, i) => 130 + i);

export const suitNumbers = {
  "usa-can": Array.from({ length: 21 }, (_, i) => 34 + i),
  "euro-metric": Array.from({ length: 21 }, (_, i) => 35 + i),
};

export const suitFits = ["S", "R", "R/L", "L", "T"];

export const dressOptions = {
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

export const cupOptions = {
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

export const shoeOptions = {
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

export const eyeOptions = [
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

export const hairOptions = [
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

export const usaCanMaleMeasurementRanges = {
  chest: Array.from({ length: 27 }, (_, i) => 25 + i),
  waist: Array.from({ length: 27 }, (_, i) => 25 + i),
  sleeve: Array.from({ length: 25 }, (_, i) => 18 + i),
  inseam: Array.from({ length: 27 }, (_, i) => 19 + i),
  neck: Array.from({ length: 10 }, (_, i) => 13 + i),
};

export const euroMetricMaleMeasurementRanges = {
  chest: Array.from({ length: 27 }, (_, i) => 64 + i),
  waist: Array.from({ length: 27 }, (_, i) => 48 + i),
  sleeve: Array.from({ length: 33 }, (_, i) => 46 + i),
  inseam: Array.from({ length: 27 }, (_, i) => 46 + i),
  neck: Array.from({ length: 24 }, (_, i) => 33 + i),
};

export const usaCanFemaleMeasurementRanges = {
  chest: Array.from({ length: 27 }, (_, i) => 25 + i),
  waist: Array.from({ length: 23 }, (_, i) => 20 + i),
  hips: Array.from({ length: 25 }, (_, i) => 30 + i),
};

export const euroMetricFemaleMeasurementRanges = {
  chest: Array.from({ length: 37 }, (_, i) => 64 + i),
  waist: Array.from({ length: 31 }, (_, i) => 54 + i),
  hips: Array.from({ length: 33 }, (_, i) => 80 + i),
};

export const usaCanHeights = Array.from({ length: 41 }, (_, i) => {
  const totalInches = 55 + i;
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

export const fractions = [
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

export const formatUsaCanHeight = (totalInches) => {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return `${formatHeightNumber(totalInches)}'' ( ${feet}' ${formatHeightNumber(inches)}'' )`;
};

export const createInitialFormData = () => ({
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
