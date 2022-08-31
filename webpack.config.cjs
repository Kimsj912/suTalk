const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: "./public/scripts/index.js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
  devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/, // css로 끝나는 모든 파일(scss, sass, css순으로 적용)에
        use: ["style-loader", "css-loader",'postcss-loader','sass-loader'],// css loader를 적용한다.
      },
    ],
  },
  stats: {
    children: true,
},
}