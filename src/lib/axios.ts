import axios from "axios"

const hostname = 'app-ibb.onrender.com'
const BASE_URL = `https://${hostname}`

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

