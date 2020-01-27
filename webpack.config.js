'use strict';
const path = require("path")

console.log(process.env.NODE_PATH)
module.exports = {
  mode: 'development',
  module: {
    rules: [

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


};