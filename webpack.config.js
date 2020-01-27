'use strict';
const path = require("path")


const VueLoaderPlugin = require('vue-loader/lib/plugin');


function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
console.log(process.env.NODE_PATH)
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
    
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      { 
        test: /\.styl$/, 
        loader: ['style-loader', 'css-loader', 'stylus-loader'] 
      },
          
    ],
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },

};