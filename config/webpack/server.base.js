const webpack = require('webpack')
// const HtmlwebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const os = require('os');

const nodeExternals = require('webpack-node-externals')
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
const config = require('../index')

module.exports = {
  name: 'server',
  target: 'node',

  entry: {
    app: [
      // '@babel/polyfill',
      './src/server/index'
    ]
  },

  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      whitelist: /\.css$/
    })
  ],

  output: {
    path: path.resolve(__dirname, '../../dist/server'),
    filename: 'server.js',
    publicPath: config.public_path + '/'
  },

  resolve: {
    alias: {
      '@': path.resolve('src'),
      Config: path.resolve('config/index')
    }
  },

  resolveLoader: {
    moduleExtensions: ['-loader']
  },

  module: {
    rules: [
      // js 文件解析
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        // loader: 'babel',
        loader: 'happypack/loader?id=happybabel',

      },

      // scss 文件解析
      {
        test: /\.scss$/,
        use: [{
            loader: `css/locals`,
            options: {
              modules: true,
              localIdentName: config.class_scoped_name
              // minimize: true,
              // sourceMap: true

              // camelCase: true,
              // importLoaders: 1,
              // modules: true,
              // localIdentName: config.class_scoped_name
            }
          },
          {
            loader: `sass`
          }
        ]
      },

      // css 解析
      {
        test: /\.css$/,
        use: [{
          loader: `css/locals`
        }]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: 'true',
      __CLIENT__: 'false'
    }),
    new HappyPack({
      id: 'happybabel',
      loaders: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
          ],
          plugins: [
            require.resolve('@babel/plugin-transform-async-to-generator'),
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-proposal-export-default-from'),
            require.resolve('@babel/plugin-transform-runtime'),
            require.resolve('@babel/plugin-transform-modules-commonjs'),
            require.resolve('babel-plugin-dynamic-import-webpack'),
          ]
        }
      }],
      threadPool: happyThreadPool,
      // cache: true,
      verbose: true
    }),

    // new CopyWebpackPlugin([
    //   { from: 'src/server/amp/views', to: 'views/' }
    // ])
  ]
}