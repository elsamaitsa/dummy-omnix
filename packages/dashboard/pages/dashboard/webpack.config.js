const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "onx",
    projectName: "dashboard",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    plugins: [
      new WebpackObfuscator(
        {
          rotateUnicodeArray: true,
        },
        "[name].[hash].js"
      ),
    ],
    externals: {
      react: "react",
      "react-dom": "react-dom",
      "@mui/material": "@mui/material",
      "react-redux": "react-redux",
    },
  });
};
