require('dotenv').config()
const webpack = require('webpack')
const ejs = require('ejs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
// const ExtensionReloader = require('webpack-extension-reloader')
const { VueLoaderPlugin } = require('vue-loader')
const { version } = require('./package.json')
const path = require('path')

const argv = require('minimist')(process.argv.slice(2))
const browser = argv['build-browser'] || 'chrome'
const distDir = `/dist${browser === 'firefox' ? '-firefox' : ''}`

const config = {
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV,
  context: path.join(__dirname, 'src'),
  entry: {
    'popup/popup': './popup/popup.js',
    injected: './injected.js',
    background: './background/index.js',
    content: './content.js'
  },
  output: {
    path: path.join(__dirname, distDir),
    filename: '[name].js'
    // sourceMapFilename: '[name].js.map'
  },
  resolve: {
    extensions: ['.mjs', '.js', '.vue']
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        include: [
          /node_modules/
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/images/',
          emitFile: false
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          emitFile: false
        }
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: 'window'
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyPlugin([
      { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'images', to: 'images', ignore: ['icon.xcf'] },
      { from: 'fonts', to: 'fonts' },
      { from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
      {
        from: './popup/popup.css',
        to: path.join(__dirname, `${distDir}/popup/popup.css`)
      },
      {
        // firefox only support manifest V2
        from: `../${browser}/manifest.json`,
        to: 'manifest.json',
        transform: (content) => {
          const jsonContent = JSON.parse(content)
          jsonContent.version = version

          if (config.mode === 'development') {
            if (browser === 'firefox') {
              jsonContent.content_security_policy = "script-src 'self'; object-src 'self'"
            } else {
              jsonContent.content_security_policy = {
                extension_pages: "script-src 'self'; object-src 'self'"
              }
            }
          }

          return JSON.stringify(jsonContent, null, 2)
        }
      }
    ])
  ]
}

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}

if (config.mode === 'development') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        ICONS_URL: JSON.stringify(process.env.ICONS_URL)
      }
    })
  ])
}

if (process.env.HMR === 'true') {
  // https://github.com/rubenspgcavalcante/webpack-extension-reloader/issues/125
  // ExtensionReloader think `background.scripts` is must, but manifest V3 can use `service_worker`
  // config.plugins = (config.plugins || []).concat([
  //   new ExtensionReloader({
  //     manifest: path.join(__dirname, '/src/manifest.json')
  //   })
  // ])
}

function transformHtml (content) {
  return ejs.render(content.toString(), {
    ...process.env
  })
}

module.exports = config
