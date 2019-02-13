require("@babel/polyfill");
require("es6-promise").polyfill();
require("isomorphic-fetch");
require("@babel/register")({
  ignore: [/\/(build|node_modules)\//],
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-syntax-dynamic-import", "dynamic-import-node"]
});

require("./server");
