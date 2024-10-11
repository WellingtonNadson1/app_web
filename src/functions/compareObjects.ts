interface FolderData {
  folderName: string;
  tema: string;
  versiculo_chave: string;
  data_inicio: string | Date;
  data_termino: string | Date;
  link_folder_aws?: string;
}

// Função para verificar se dois objetos são equivalentes
export function deepEqual(getFolderNameTema: FolderData, formData: FormData): boolean {
  // Extraindo os dados do formData
  const id = formData.get('id') as string;
  const folderName = formData.get('folderName') as string;
  const tema = formData.get('tema') as string;
  const versiculo_chave = formData.get('versiculo_chave') as string;
  const data_inicio = formData.get('date[from]') as string;
  const data_termino = formData.get('date[to]') as string;

  // Comparando os campos (exceto `link_folder_aws`, que pode ser ignorado)
  return (
    getFolderNameTema.folderName === folderName &&
    getFolderNameTema.tema === tema &&
    getFolderNameTema.versiculo_chave === versiculo_chave &&
    new Date(getFolderNameTema.data_inicio).getTime() === new Date(data_inicio).getTime() &&
    new Date(getFolderNameTema.data_termino).getTime() === new Date(data_termino).getTime()
  );
}
