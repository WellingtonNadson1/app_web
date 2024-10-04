interface FolderData {
  folderName: string;
  tema: string;
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
  const data_inicio = formData.get('date[from]') as string;
  const data_termino = formData.get('date[to]') as string;

  // Comparando os campos (exceto `link_folder_aws`, que pode ser ignorado)
  return (
    getFolderNameTema.folderName === folderName &&
    getFolderNameTema.tema === tema &&
    new Date(getFolderNameTema.data_inicio).getTime() === new Date(data_inicio).getTime() &&
    new Date(getFolderNameTema.data_termino).getTime() === new Date(data_termino).getTime()
  );
}

// Exemplo de uso:
const getFolderNameTema = {
  folderName: 'santificação-01-oct-24-26-oct-24',
  tema: 'Santificação',
  data_inicio: '2024-10-01T03:00:00.000Z',
  data_termino: '2024-10-26T03:00:00.000Z',
  link_folder_aws: 'https://licoes-celula-ibb-23.s3.sa-east-1.amazonaws.com/santificação-01-oct-24-26-oct-24/'
};
