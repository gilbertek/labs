const { resolve } = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env = {}) => {
  // Variables set by npm scripts in package.json
  // const isProduction = process.env.NODE_ENV === 'production';
  const platform = env.platform; // 'browser' by default
  const environment = env.environment;
  const isProduction = environment === 'production';

  /* eslint-disable no-console */
  console.log(`Running webpack in ${environment} mode on ${platform ? 'browser': 'server'}`);
  /* eslint-enable */

  return {
    context: resolve(__dirname, 'src'),
    devtool: 'inline-source-map',
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './index.js'
    ],
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'src'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [ 'babel-loader' ],
          exclude: /node_modules/
        },
        {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader?modules' },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => ([
                    autoprefixer({
                      browsers: ['last 2 versions'],
                      compress: true
                    })
                  ])
                }
              },
            ]
          })
        },
        {
          test:   /\.(ttf|otf|eot|svg|woff)$/,
          loader: "url-loader",
          options:  {
            limit: 10000,
            name: "[name].[ext]",
            mimetype: 'application/x-font-woff'
          }
        }
      ],
    },
    devServer: {
      hot: true,
      overlay: false,
      historyApiFallback: true,
      inline: true,
      publicPath: '/',
      contentBase: resolve(__dirname, 'src')
    },
    plugins: [
      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        ENVIRONMENT: JSON.stringify(environment),
        PLATFORM:    JSON.stringify(platform)
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, 'src', 'index.html')
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true,
        noInfo: true, // set to false to see a list of every file being bundled.
        options: {
          sassLoader: {
          includePaths: [resolve(__dirname, 'src', 'scss')]
          },
          context: '/',
          postcss: () => [autoprefixer],
        }
      }),
      new ExtractTextPlugin('styles.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: isProduction,
      })
    ]
  };
};
