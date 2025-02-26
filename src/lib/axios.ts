import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_HOSTNAME_URL;
export const BASE_URL_LOCAL = process.env.NEXT_PUBLIC_HOSTNAME_URL_LOCAL;

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
