'use strict';
const path = require("path")

console.log(process.env.NODE_PATH)
module.exports = {
  mode: 'development',
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules|web_modules/,
      //   use: [{
      //     loader: 'babel-loader'
      //   }]
      // },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      {
              test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
              loader: 'file-loader'
      }      
    ],
  },
  // output:{
  //   filename:"test.js",
  //   path:path.resolve(__dirname)
  // } ,
  // resolve: {
  //     modules: ["E:\\nodejs\\node_global\\node_modules"]
  // },
  // resolveLoader: {
  //     modules: ["E:\\nodejs\\node_global\\node_modules"]
  // } 

};