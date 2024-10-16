export async function urlToFileList(url: string): Promise<FileList> {
  const response = await fetch(url);
  console.log('response url pdf', response)
  const blob = await response.blob();
  const file = new File([blob], 'licao.pdf', { type: 'application/pdf' });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
}
