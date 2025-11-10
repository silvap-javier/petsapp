module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "@pets/ui": "../../packages/ui/src",
            "@pets/sdk": "../../packages/sdk/src"
          }
        }
      ]
    ]
  };
};
