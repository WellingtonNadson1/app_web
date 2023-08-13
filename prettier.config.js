module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  // Usa aspas simples em vez de duplas
  singleQuote: true,
  // Usa ponto e vírgula no final das linhas
  semi: true,
  // Usa espaços em vez de tabs para indentação
  useTabs: false,
  // Usa 2 espaços por nível de indentação
  tabWidth: 2,
  // Quebra as linhas com mais de 80 caracteres
  printWidth: 80,
  // Coloca uma vírgula no final dos objetos e arrays
  trailingComma: 'none',
  // Coloca parênteses em volta dos parâmetros das arrow functions
  arrowParens: 'always',
}
