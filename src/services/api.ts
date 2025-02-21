import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// User interface
export interface User {
  id: number;
  name: string;
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