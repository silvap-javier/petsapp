const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

const workspacePaths = [
  path.resolve(__dirname),
  path.resolve(__dirname, "../../packages/ui/src"),
  path.resolve(__dirname, "../../packages/sdk/src")
];

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "@pets/ui": workspacePaths[1],
    "@pets/sdk": workspacePaths[2]
  };
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify")
  };
  const babelRule = config.module.rules.find((rule) => Array.isArray(rule?.oneOf));
  babelRule?.oneOf?.forEach((loaderRule) => {
    if (loaderRule.use?.loader?.includes("babel-loader")) {
      const include = Array.isArray(loaderRule.include)
        ? loaderRule.include
        : loaderRule.include
        ? [loaderRule.include]
        : [];
      loaderRule.include = Array.from(new Set([...include, ...workspacePaths]));
    }
  });
  return config;
};
