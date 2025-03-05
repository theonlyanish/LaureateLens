import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://api.nobelprize.org/2.1';

// User interface
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

// Function to fetch users from the API
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
    throw new Error('An unexpected error occurred');
  }
};

export interface NobelPrize {
  awardYear: string;
  category: {
    en: string;
  };
  prizeAmount: number;
  dateAwarded: string;
  motivation: {
    en: string;
  };
}

export interface Affiliation {
  name: {
    en: string;
  };
  city: {
    en: string;
  };
  country: {
    en: string;
  };
}

export interface Laureate {
  id: string;
  knownName: {
    en: string;
  };
  givenName: {
    en: string;
  };
  familyName?: {
    en: string;
  };
  gender: string;
  birth: {
    date: string;
    place: {
      city: {
        en: string;
      };
      country: {
        en: string;
      };
    };
  };
  death?: {
    date: string;
    place?: {
      city?: {
        en: string;
      };
      country?: {
        en: string;
      };
    };
  };
  wikipedia: {
    english: string;
  };
  nobelPrizes: NobelPrize[];
  affiliations: Affiliation[];
}

interface NobelResponse {
  laureates: Laureate[];
  meta: {
    count: number;
    limit: number;
    offset: number;
    total: number;
  };
}

export const fetchLaureates = async (
  offset: number = 0,
  limit: number = 25
): Promise<NobelResponse> => {
  try {
    const response = await axios.get<NobelResponse>(
      `${API_BASE_URL}/laureates`,
      {
        params: {
          offset,
          limit,
          format: 'json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch laureates');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const fetchLaureateById = async (id: string): Promise<Laureate> => {
  try {
    const response = await axios.get<{ laureate: Laureate }>(
      `${API_BASE_URL}/laureate/${id}`
    );
    return response.data.laureate;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch laureate details');
    }
    throw new Error('An unexpected error occurred');
  }
}; 