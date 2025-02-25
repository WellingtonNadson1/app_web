import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { plugins: ["@typescript-eslint", "simple-import-sort"] },
  { rules: { "simple-import-sort/imports": "error", "simple-import-sort/exports": "error" } },
  { settings: { "import/resolver": { node: { extensions: [".js", ".jsx", ".ts", ".tsx"] } } } },
];

export default eslintConfig;
