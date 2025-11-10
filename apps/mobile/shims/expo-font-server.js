const runtime = require("expo-font/build/index.js");

const shim = {
  ...runtime,
  resetServerContext: () => {},
  getServerResources: async () => ({
    fonts: [],
    linkTags: [],
    styleTags: []
  })
};

module.exports = shim;
module.exports.default = shim;
