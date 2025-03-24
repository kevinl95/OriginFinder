const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Other configurations...
  plugins: [
    // Other plugins...
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
    }),
  ],
};