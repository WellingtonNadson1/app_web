export const ListSupervisores = (supervisao: string | null) => {
  let supervisores = ''

  switch (supervisao) {
    case "Vermelha":
      supervisores = "Ana Ceila"
      break;
    case "Azul":
      supervisores = "Zedequias"
      break;
    case "Verde":
      supervisores = "Alécio e Iraneide"
      break;
    case "Laranja":
      supervisores = "Paulo e Patrícia"
      break;
    case "Amarela":
      supervisores = "Carlos e Thaísa"
      break;
    default:
      break;
  }
  return supervisores
}

export const CorSupervision = (corSupervisao: string | null) => {
  let newCorSupervisao = ''

    switch (corSupervisao) {
      case "Vermelha":
        newCorSupervisao = "w-full bg-red-500 dark:bg-red-500 dark:text-gray-100"
        break;
      case "Azul":
        newCorSupervisao = "w-full bg-blue-500 dark:bg-blue-500 dark:text-gray-100"
        break;
      case "Verde":
        newCorSupervisao = "w-full bg-green-500 dark:bg-green-500 dark:text-gray-100"
        break;
      case "Laranja":
        newCorSupervisao = "w-full bg-orange-500 dark:bg-orange-500 dark:text-gray-100"
        break;
      case "Amarela":
        newCorSupervisao = "w-full bg-yellow-500 dark:bg-yellow-500 dark:text-gray-100"
        break;
      default:
        break;
    }
    return newCorSupervisao
}
