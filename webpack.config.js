const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  let isProduction = (env && env.production)

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'index.js'),
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    output: {
      path: path.resolve(__dirname, 'docs'), // Output to /docs for GitHub Pages
      filename: 'bundle.[hash].js'
    },

    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html')
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      })
    ],

    devServer: {
      hot: true, // Enable hot module replacement.
      overlay: true, // Show an overlay of any build errors in the browser.
      disableHostCheck: true, // Prevent an "invalid host header" error for glitch.com.
      stats: 'errors-only' // Only show that a compile is happening when developing. This hides the module build info spam.
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          use: 'eslint-loader'
        },
        {
          test: /\.styl(us)?$/,
          use: [(isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader'), 'css-loader', {
            loader: 'stylus-loader',
            options: {
              import: [path.resolve(__dirname, 'src', 'mixins.styl')]
            }
          }]
        },
        {
          test: /\.pug$/,
          use: 'pug-plain-loader'
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        }
      ]
    },

    resolve: {
      // Resolve default extensions plus .vue so that the extention can be omitted when importing files
      extensions: ['*', '.js', '.vue', '.json']
    }
  }
}
