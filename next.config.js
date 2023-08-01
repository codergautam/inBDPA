// next.config.js
// This code is a configuration file called "next.config.js" for a Next.js project. The purpose of this file is to configure the build process and customize behavior of the Next.js framework. This specific configuration file is using the "next-remove-imports" plugin to remove unnecessary imports from the codebase during the build process. The code exports the configuration after applying the plugin.
const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  // ✅  options...
});