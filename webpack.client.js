const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  let outputPath = env.mode === 'development' ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'build');
  return {
    mode: env.mode,
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      path: outputPath
    },
    watch: env.mode === 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(jpeg|png|gif|svg)$/i,
          use: [
              'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|ttc)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'template.html'
      })
    ]
  }
};