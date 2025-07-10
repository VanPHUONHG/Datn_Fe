import axios from 'axios';

const BASE_URL = 'http://localhost:8888/api/auth'; 
export interface SignupData {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
}
export interface LoginData {
  username: string;
  password: string;
}

export const resetPassword = async (data: {
  email: string;
  username: string;
  full_name: string;
  phone: string;
  newPassword: string;
}) => {
  return await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, data);
};

export const signup = async (data: SignupData) => {
  return await axios.post(`${BASE_URL}/signup`, data); 
};

export const login = async (data: LoginData) => {
  return await axios.post(`${BASE_URL}/login`, data); 
};
