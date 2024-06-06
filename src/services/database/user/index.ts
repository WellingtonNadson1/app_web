// import { db } from "..";

// export const findUserById = async (id: string) => {
//   // const prisma = createPrismaInstance()

//   if (!db) {
//     throw new Error("Prisma instance is null");
//   }
//   const result = await db?.user.findUnique({
//     where: {
//       id: id,
//     },
//   });

//   await db.$disconnect();
//   return result;
// };

// export const findUserByEmail = async (email: string) => {
//   // const prisma = createPrismaInstance()

//   if (!db) {
//     throw new Error("Prisma instance is null");
//   }
//   const result = await db?.user.findUnique({
//     where: {
//       email: email,
//     },
//   });
//   await db.$disconnect();
//   return result;
// };
