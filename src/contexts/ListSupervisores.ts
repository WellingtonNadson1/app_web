export const ListSupervisores = (supervisao: string) => {
  const supervisores = {
    vermelha:"Ana Ceila",
    azul:"Zedequias",
    verde:"Alécio e Iraneide",
    laranja: "Paulo e Patrícia",
    amarela: "Carlos e Thaísa",
  } [supervisao] || "Falha ao carregar";
  return supervisores
}

export const CorSupervision = (corSupervisao: string) => {
  const newCorSupervisao = {
    // Mapeamento de cores para classes CSS
    vermelha: "w-full bg-red-500 dark:bg-red-500",
    azul: "w-full bg-blue-500 dark:bg-blue-500",
    amarela: "w-full bg-yellow-500 dark:bg-yellow-500",
    verde: "w-full bg-green-500 dark:bg-green-500",
    laranja: "w-full bg-orange-500 dark:bg-orange-500",
  }[corSupervisao] || "w-full bg-gray-400 dark:bg-gray-400"; // Valor padrão

  return newCorSupervisao;
};

