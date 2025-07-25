import webpack from 'webpack';
import { merge } from 'webpack-merge';
import singleSpaDefaults from 'webpack-config-single-spa-react-ts';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webpackConfig = (webpackConfigEnv, argv) => {
  const orgName = 'murilo-nascimento';
  const projectName = 'frontend-tech-challenge';
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName,
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'pages': path.resolve(__dirname, 'pages'),
        'components': path.resolve(__dirname, 'components'),
      },
    },
    // Remove the module.rules override since single-spa config handles TypeScript

      plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'),
        'process.env.DOCKER_ENV': JSON.stringify(process.env.DOCKER_ENV || false),
        'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3001'),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  });

  // // Detecta modo standalone
  // const isStandalone = webpackConfigEnv && webpackConfigEnv.standalone;

  // return merge(defaultConfig, {
  //   entry: isStandalone
  //     ? path.resolve(__dirname, 'src/standalone.tsx')
  //     : path.resolve(__dirname, 'src/frontend-tech-challenge.tsx'),

  //   resolve: {
  //     alias: {
  //       '@': path.resolve(__dirname, 'src'),
  //       'app': path.resolve(__dirname, 'src/app'),
  //       'components': path.resolve(__dirname, 'src/components'),
  //     },
  //     extensions: ['.ts', '.tsx', '.js', '.jsx'],
  //     fallback: {
  //       "process": require.resolve("process/browser.js"),
  //       "buffer": require.resolve("buffer"),
  //     },
  //   },

  //   // Só aplica externals no modo single-spa
  //   ...(isStandalone
  //     ? {}
  //     : {
  //         externals: {
  //           react: 'React',
  //           'react-dom': 'ReactDOM',
  //           'single-spa': 'singleSpa',
  //         },
  //       }),

  //   module: {
  //     rules: [
  //       {
  //         test: /\.css$/,
  //         use: ['style-loader', 'css-loader'],
  //       },
  //       {
  //         test: /\.(png|jpe?g|gif|svg)$/i,
  //         type: 'asset/resource',
  //       },
  //     ],
  //   },

  //   plugins: [
  //     new webpack.DefinePlugin({
  //       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  //       'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'),
  //       'process.env.DOCKER_ENV': JSON.stringify(process.env.DOCKER_ENV || false),
  //       'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3001'),
  //     }),
  //     new webpack.ProvidePlugin({
  //       process: 'process/browser.js',
  //       Buffer: ['buffer', 'Buffer'],
  //     }),
  //   ],

  //   // Configuração para desenvolvimento
  //   devServer: {
  //     port: 8080,
  //     hot: true,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  //       'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  //     },
  //   },

  //   // Otimizações
  //   optimization: {
  //     splitChunks: false,
  //   },
  // });
};

export default webpackConfig;
