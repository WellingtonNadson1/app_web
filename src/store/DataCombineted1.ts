// import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
// import { BASE_URL } from "@/functions/functions";
// // import { axiosAuth } from "@/lib/axios";
// import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
// import axios from "axios";
// import { getServerSession } from "next-auth";

// export const DataCombineted = async () => {
//   const session = await getServerSession(authOptions)
//   const token = session?.user.token
//   if (!token) {
//     return null; // Or handle the missing token as needed
// }
// console.log('Token User: ', token);

//   const URLCombinedData = `${BASE_URL}/users/all`
//   try {
//     const {data} = await axiosAuth.get(URLCombinedData)
//     console.log('Deu', data);

//     return data
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       console.error(error.response.data)
//     } else {
//       console.error(error)
//     }
//   }
// }
