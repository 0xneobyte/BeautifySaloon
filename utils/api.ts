// API utility functions for making requests to the backend

// Generic fetch function with error handling
async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "An error occurred");
    }

    return response.json();
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
}

// User authentication and profile
export const userAPI = {
  // Get current user profile
  getProfile: () => fetchAPI("/api/me"),

  // Register a new user
  register: (userData: any) =>
    fetchAPI("/api/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

// Salon management
export const salonAPI = {
  // Get all salons with optional filters
  getSalons: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    return fetchAPI(`/api/salons?${params.toString()}`);
  },

  // Get a salon by ID
  getSalon: (id: string) => fetchAPI(`/api/salons/${id}`),

  // Create a new salon
  createSalon: (salonData: any) =>
    fetchAPI("/api/salons", {
      method: "POST",
      body: JSON.stringify(salonData),
    }),

  // Update a salon
  updateSalon: (id: string, salonData: any) =>
    fetchAPI(`/api/salons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(salonData),
    }),

  // Delete a salon
  deleteSalon: (id: string) =>
    fetchAPI(`/api/salons/${id}`, {
      method: "DELETE",
    }),
};

// Appointment management
export const appointmentAPI = {
  // Get all appointments with optional filters
  getAppointments: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    return fetchAPI(`/api/appointments?${params.toString()}`);
  },

  // Get an appointment by ID
  getAppointment: (id: string) => fetchAPI(`/api/appointments/${id}`),

  // Create a new appointment
  createAppointment: (appointmentData: any) =>
    fetchAPI("/api/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    }),

  // Update an appointment status
  updateAppointment: (id: string, status: string, notes?: string) =>
    fetchAPI(`/api/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    }),

  // Delete an appointment
  deleteAppointment: (id: string) =>
    fetchAPI(`/api/appointments/${id}`, {
      method: "DELETE",
    }),
};

// Review management
export const reviewAPI = {
  // Get all reviews with optional filters
  getReviews: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });

    return fetchAPI(`/api/reviews?${params.toString()}`);
  },

  // Submit a new review
  submitReview: (reviewData: any) =>
    fetchAPI("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
};

// File upload
export const uploadAPI = {
  // Upload an image
  uploadImage: async (file: File, type: "logo" | "gallery" | "profile") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload file");
    }

    return response.json();
  },
};
