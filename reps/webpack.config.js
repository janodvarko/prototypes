/* See license.txt for terms of usage */

"use strict";

var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js"
  },
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: [
          "node_modules",
           path.join(__dirname, "../../../../mozilla.org/")
        ],
        query: {
          presets: ['es2015', 'react']
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ],
  },
  externals: {
    "devtools/client/shared/vendor/react": "React",
    "devtools/client/shared/vendor/react-dom": "ReactDOM"
  },
  resolve: {
    alias: {
      "devtools": path.join(__dirname, "../../../../mozilla.org/fx-team/devtools"),
      //"devtools": path.join(__dirname, "./node_modules/debugger.html/public/js/lib/devtools"),
      "devtools-sham": path.join(__dirname, "./node_modules/debugger.html/public/js/lib/devtools-sham"),
      "sdk": path.join(__dirname, "./node_modules/debugger.html/public/js/lib/devtools-sham/sdk")

    },
    // This is required to allow ff-devtools-libs to resolve modules
    // to itself (all of its requires are absolute)
    root: path.join(__dirname, "node_modules")
  },
};
