const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(response.statusText || 'Request failed');
    }
    
    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export const authAPI = {
  register: async (firstName, lastName, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        pass: password,
      }),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        pass: password,
      }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },
};
