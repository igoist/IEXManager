const { merge } = require('webpack-merge');
const common = require('./common.js');
const webpack = require('webpack');
const path = require('path');

let arr = [];
let bundle;

const mode = process.env.NODE_ENV || 'development';

console.log('here dev - mode:', mode, process.env.NODE_ENV);

for (let i = 0; i < common.length; i++) {
  let plugins = [];

  // 非 background 页面应该都是有 react 参与
  if (i === 1 || i === 2) {
    try {
      bundle = path.resolve(__dirname, `../dist/dll/react-map.json`);
    } catch (e) {
      bundle = '';
    }

    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: bundle,
      })
    );
  }

  arr.push(
    merge(common[i], {
      mode,
      devtool: 'inline-source-map',
      plugins,
    })
  );
}

module.exports = arr;
