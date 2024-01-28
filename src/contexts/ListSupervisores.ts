export const ListSupervisores = (supervisao: string) => {
  const supervisores = {
    amarela: "Carlos e Thaísa",
    azul:"Zedequias",
    laranja: "Paulo e Patrícia",
    verde:"Alécio e Iraneide",
    vermelha:"Ana Ceila",
  } [supervisao] || "Falha ao carregar";
  return supervisores
}

export const CorSupervision = (corSupervisao: string) => {
  switch (corSupervisao) {
    case "amarela":
      return "w-full !bg-yellow-500 !dark:bg-yellow-500";
    case "azul":
      return "w-full bg-blue-500 dark:bg-blue-500";
    case "laranja":
      return "w-full bg-orange-500 dark:bg-orange-500";
    case "verde":
      return "w-full bg-green-500 dark:bg-green-500";
    case "vermelha":
      return "w-full bg-red-500 dark:bg-red-500";
    default:
      return "w-full bg-gray-400 dark:bg-gray-400";
  }
};


