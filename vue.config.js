const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const proxyObj = {}
proxyObj['/api'] = {
    ws: false,
    // target: 'http://47.101.183.5:8888',
    // target: 'http://10.242.192.160:8888',
    target: 'http://127.0.0.1:8888',
    pathRewrite: {
        '/api': ''
    },
    changeOrigin: true
}

function resolve(dir) {
    return path.join(__dirname, dir)
}

// const srcFltPath = 'D:/front/index.html'
const srcStaticPath = 'D:/front'

module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === 'development' ? '/' : '/',
    // 输出文件目录
    outputDir: process.env.NODE_ENV === 'development' ? 'dist' : path.resolve(__dirname, srcStaticPath),
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    // assetsDir: "./",
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
    // indexPath: process.env.NODE_ENV === 'development' ? './' : path.resolve(__dirname, srcFltPath),
    // Eslint关闭
    lintOnSave: isProduction,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    configureWebpack: config => {
        if (isProduction) {
            // 为生产环境修改配置...
            config.plugins.push(
                // 生产环境自动删除console
                new UglifyJsPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_debugger: true,
                            drop_console: true
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            )
        } else {
            // 为开发环境修改配置...
        }
    },
    chainWebpack: config => {
        if (isProduction) {
            config.plugins.delete('prefetch')
            config.plugins.delete('preload')
            config.optimization.minimize(true)
            config.optimization.splitChunks({
                chunks: 'all'
            })
        }
    },
    devServer: {
        port: 8080,
        open: true, // 自动开启浏览器
        compress: true, // 开启压缩
        proxy: proxyObj,
        overlay: {
            warnings: true,
            errors: true
        }
    }
}
