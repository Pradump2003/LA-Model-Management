// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:9000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Models API
export const modelsAPI = {
  // Get all models
  getAll: (params) => api.get("/models", { params }),

  // Get featured models
  getFeatured: () => api.get("/models?isFeatured=true"),

  // Get new faces
  getNewFaces: () => api.get("/models?isNewFace=true"),

  // Get by division
  getByDivision: (division, params) =>
    api.get(`/models?division=${division}`, { params }),

  // Get single model by slug
  getBySlug: (slug) => api.get(`/models/${slug}`),

  // Get single model by ID
  getById: (id) => api.get(`/models/id/${id}`),
};

// Blogs API
export const blogsAPI = {
  // Get all blogs
  getAll: (params) => api.get("/blogs", { params }),

  // Get single blog by slug
  getBySlug: (slug) => api.get(`/blogs/${slug}`),

  // Get by category
  getByCategory: (category, params) =>
    api.get(`/blogs?category=${category}`, { params }),
};

// Applications API
export const applicationsAPI = {
  // Submit application
  submit: (data) => api.post("/applications", data),

  // Get all applications (protected)
  getAll: (params, apiKey) =>
    api.get("/applications", {
      params,
      headers: { "x-api-key": apiKey },
    }),
};

// Contact API
export const contactAPI = {
  // Submit contact form
  submit: (data) => api.post("/contacts", data),
};

export default api;
