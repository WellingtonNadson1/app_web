export function normalizeFolderName(folderName: string): string {
  // Remove acentos e caracteres especiais
  const normalizedFolderName = folderName
    .normalize('NFD') // Normaliza para separar os acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
    .replace(/[^a-zA-Z0-9]/g, ''); // Remove caracteres especiais (mantém letras e números)

  // Garante que termina com '/'
  const folderKey = normalizedFolderName.endsWith('/') ? normalizedFolderName : `${normalizedFolderName}/`;

  return folderKey;
}

// Exemplo de uso
const folderName = 'Santificação';
const folderKey = normalizeFolderName(folderName);

console.log(folderKey); // Resultado: 'santificacao/'
