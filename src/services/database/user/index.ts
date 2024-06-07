import { BASE_URL, BASE_URL_LOCAL } from "@/functions/functions";
import axios from "axios";

export const findUserById = async (id: string) => {
  const result = await axios.get(`${BASE_URL}/users/${id}`);
  console.log('resultFindUserByID', result);
  return result.data; // Acessar a propriedade 'data' para obter o resultado
};

const axiosAuth = axios.create({
  baseURL: `${BASE_URL_LOCAL}/users`,
});

export const findUserByEmail = async (email: string) => {
  "use server"
  console.log('email', email)
  const result = await axiosAuth.post(email); // Enviar o email em um objeto
  console.log('resultFindUserByEmail', result);
  return result.data; // Acessar a propriedade 'data' para obter o resultado
};
