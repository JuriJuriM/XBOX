const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

let mode = 'development';
if (process.env.NODE_ENV == 'production') {
  mode = 'production';
}
console.log(mode + ' mode');

// тут получаем пути до js файлов и создаем entryPoints для каждой страницы
const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES = fs.readdirSync(path.resolve(__dirname, 'src/pages'));
const entryPoints = Object.assign(
  {},
  ...PAGES.map((page) => ({
    [page]: `${PAGES_DIR}/${page}/${page}.js`,
  }))
);

module.exports = {
  mode: mode,
  context: path.resolve(__dirname, 'src'),
  entry: entryPoints,
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    // тут нужно вместо index.html указать явно какую страницу открвыть напрмер page.html
    open: '/index.html',
    hot: false,
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // тут каждую страницу передаем в HtmlWebpackPlugin
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: `${PAGES_DIR}/${page}/${page}.pug`,
          chunks: [page],
          inject: 'body',
        })
    ),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      overrideBrowserslist: ['> 1%', 'last 2 versions'],
                    },
                    'postcss-preset-env',
                  ],
                ],
              },
            },
          },
          'resolve-url-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.ico/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/favicon/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'simple-pug-loader',
            options: {
              pretty: true,
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};