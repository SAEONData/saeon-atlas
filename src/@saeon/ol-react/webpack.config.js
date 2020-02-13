const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

const outputConfig = ({mode, output}) =>
  mode === 'production'
    ? {
        filename: 'index.js',
        libraryTarget: 'commonjs',
        path: output
      }
    : {
        filename: 'index.js'
      }

const resolveConfig = mode =>
  mode === 'production'
    ? {
        extensions: ['.js', '.jsx'],
        alias: {
          react: path.resolve('./node_modules/react'),
          'react-dom': path.resolve('./node_modules/react-dom')
        }
      }
    : {
        extensions: ['.js', '.jsx']
      }

const externalsConfig = mode =>
  mode === 'production'
    ? {
        react: 'react',
        'react-dom': 'react-dom',
        'react-md': 'react-md'
      }
    : {}

const pluginsConfig = ({mode, output}) =>
  mode === 'production'
    ? [
      new HtmlWebPackPlugin({
        template: 'index.html',
        filename: path.join(__dirname, output, '/index.html')
      })
    ]
    : [
        new HtmlWebPackPlugin({
          template: 'index.html',
          filename: path.join(__dirname, output, '/index.html')
        })
      ]

module.exports = ({ mode, entry, output = '/dist', port }) => ({
  mode,
  entry: path.resolve(__dirname, entry),
  output: outputConfig(({mode, output: path.join(__dirname, output)})),
  resolve: resolveConfig(mode),
  externals: externalsConfig(mode),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: "upward",
          }
        }
      },
      {
        test: /\.*css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              name: '[name][md5:hash].[ext]',
              outputPath: 'assets/',
              publicPath: '/assets/'
            }
          }
        ]
      }
    ]
  },
  plugins: pluginsConfig(({mode, output})),
  devServer: {
    contentBase: path.join(__dirname, output),
    port: parseInt(port),
    historyApiFallback: true,
    compress: true,
    allowedHosts: ['.localhost'],
    headers: {
      'Access-Control-Allow-Headers': '*'
    }
  }
})