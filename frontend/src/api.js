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
  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
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

export const eventsAPI = {
  create: async (title, description, date, location, priv) => {
    return apiRequest('/event/create', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        date,
        location,
        priv
      })
    });
  },

  search: async () => {
    return apiRequest('/event/search', {
      method: 'GET',
    });
  },

  getById: async (eventId) => {
    return apiRequest(`/event/${eventId}`, {
      method: 'GET',
    });
  },

  getParticipants: async (eventId) => {
    return apiRequest(`/event/${eventId}/participants`, {
      method: 'GET',
    });
  },

  rsvp: async (eventId) => {
    return apiRequest(`/event/${eventId}/rsvp`, {
      method: 'POST',
    });
  },

  unrsvp: async (eventId) => {
    return apiRequest(`/event/${eventId}/rsvp`, {
      method: 'DELETE',
    });
  },
};

export const friendsAPI = {
  sendRequest: async (friendId) => {
    return apiRequest('/friend/send', {
      method: 'POST',
      body: JSON.stringify({ friendId })
    });
  },

  acceptRequest: async (friendId) => {
    return apiRequest('/friend/accept', {
      method: 'POST',
      body: JSON.stringify({ friendId })
    });
  },

  rejectRequest: async (friendId) => {
    return apiRequest('/friend/reject', {
      method: 'POST',
      body: JSON.stringify({ friendId })
    });
  },

  removeFriend: async (friendId) => {
    return apiRequest('/friend/remove', {
      method: 'POST',
      body: JSON.stringify({ friendId })
    });
  },

  getAllFriends: async () => {
    return apiRequest('/friend/friends', {
      method: 'GET'
    });
  },

  getRequests: async () => {
    return apiRequest('/friend/requests', {
      method: 'GET'
    });
  },

  searchByName: async (name) => {
    return apiRequest('/friend/search/name', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }
};
