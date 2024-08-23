/** @type {import('@lingui/conf').LinguiConfig} */
const config = {
  locales: ["it", "en"],
  sourceLocale: "it",
  catalogs: [
    {
      path: "src/locales/{locale}",
      include: ["src"],
    },
  ],
  format: "po",
  compileNamespace: "es",
};

export default config;
