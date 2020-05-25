const baseConfig = require('./client.base')
const webpack = require('webpack')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
// const ManifestPlugin = require('webpack-manifest-plugin');

const config = {
  ...baseConfig,
  plugins: [
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new ManifestPlugin({ fileName: 'manifest.json' }),
    ...baseConfig.plugins
  ],
  mode: 'development',
  devtool: 'cheap-module-inline-source-map',
  devServer: {
    // contentBase: "",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    proxy: {
      '/api': {
        target: 'https://cnodejs.org',
        changeOrigin: true,     // target是域名的话，需要这个参数，
        secure: false,          // 设置支持https协议的代理
      },

    }
  } 
}

module.exports = config
