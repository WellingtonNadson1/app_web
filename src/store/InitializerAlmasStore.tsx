// "use client";

// import { useRef } from "react";
// import { useAlmasStore } from "./AlmasStorage";

// type InitializerStoreProps = {
//   almasGanhasNoMes: number;
// };

// export const InitializerStore = ({
//   almasGanhasNoMes,
// }: InitializerStoreProps) => {
//   const initializer = useRef(false);

//   if (!initializer.current) {
//     useAlmasStore.setState({
//       state: {
//         almasGanhasNoMes,
//       },
//     });
//   }
//   return null;
// };
