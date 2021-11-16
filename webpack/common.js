const { merge } = require('webpack-merge');
const path = require('path');

const publicPath = '/';

const returnPath = (pathStr) => `${path.resolve(__dirname, pathStr)}`;
// const returnSrcPath = (pathStr) => returnPath(`../src/${pathStr}`);
const returnSrcPath = (pathStr) => {
  console.log(`${pathStr} -> ${returnPath(`../src/${pathStr}`)}`);
  return returnPath(`../src/${pathStr}`);
};

const webpackConfig = [
  {
    entry: {
      background: [returnSrcPath('background.js')],
    },
  },
  {
    entry: {
      demo: [returnSrcPath('demo.js')],
    },
  },
  {
    entry: {
      popup: [returnSrcPath('popup.js')],
    },
  },
];

let arr = [];

for (let i = 0; i < webpackConfig.length; i++) {
  arr.push(
    merge(webpackConfig[i], {
      resolve: {
        alias: {
          '@Components': returnSrcPath('components/'),
          '@Models': returnSrcPath('models/'),
          '@Utils': returnSrcPath('utils/'),
        },
        extensions: ['.js', '.jsx'],
      },

      output: {
        filename: '[name].bundle.min.js',
        path: returnPath('../dist/js'),
        publicPath,
      },

      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            include: returnSrcPath(''),
          },
        ],
      },
    })
  );
}

module.exports = arr;
