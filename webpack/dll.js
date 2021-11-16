const webpack = require('webpack');
const path = require('path');

const dllPath = path.join(path.resolve(__dirname, '../'), 'dist/dll');

const mode = process.env.NODE_ENV || 'development';

console.log('here dll - mode:', mode, process.env.NODE_ENV);

module.exports = {
  mode,

  entry: {
    react: ['react', 'react-dom'],
  },

  output: {
    path: dllPath,
    filename: '[name].dll.js',
    library: '[name]_[hash]',
  },

  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(dllPath, '[name]-map.json'),
    }),
  ],
};
