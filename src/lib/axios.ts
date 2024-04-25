import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
import axios from "axios"
import { getServerSession } from "next-auth"

const hostname = 'app-ibb.onrender.com'
// const hostname = 'backibb-production.up.railway.app'
const BASE_URL = `https://${hostname}`

// const Token = async () => {
//   const session = await getServerSession(authOptions)
//   const token = session?.user.token
//   if (!token) {
//     return null; // Or handle the missing token as needed
//   }
//   return token
// }

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// const tokenUser = Token()

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// export const api = async () => {
//   const session = await getServerSession(authOptions)
//   const token = session?.user.token
//   const axiosAuthToken = axios.create({
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     }
//   })
//   return axiosAuthToken
// }
export const axiosAuthToken = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})


