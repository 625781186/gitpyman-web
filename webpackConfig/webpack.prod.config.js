'use strict';
const path = require("path");


const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin    = require('terser-webpack-plugin');


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

console.log(process.env.NODE_PATH)
module.exports = {
    mode   : "production",
    module : {
        rules: [
            {
                test   : /\.js$/,
                loader : 'babel-loader',
                query  : {
                    presets: [
                        "es2015"
                    ]
                },
                exclude: /node_modules/
            },
            {
                test  : /\.vue$/,
                loader: 'vue-loader',

            },
            {
                test: /\.css$/,
                use : ['style-loader',
                       'css-loader'
                ]
            },
            {
                test  : /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test  : /\.styl$/,
                loader: ['style-loader',
                         'css-loader',
                         'stylus-loader'
                ]
            },

        ],
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin(),
        new TerserPlugin({
            terserOptions: {
                warnings: false,
                compress: {
                    drop_console : false,
                    drop_debugger: true,
                    pure_funcs   : ['console.log'] // 移除console
                }
            }
        }),
    ],
    resolve: {
        extensions: ['.js',
                     '.vue',
                     '.json'
        ],
        alias     : {
            'vue$': 'vue/dist/vue.esm.js',
            '@'   : resolve('src'),
        }
    },

};