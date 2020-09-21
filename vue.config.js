const path = require('path')
// const webpack = require('webpack');

function resolve(dir) {
    return path.join(__dirname, dir)
}

let sourceMap = ''
let productionSourceMap
if (process.env.NODE_ENV === 'production') {
    // 为生产环境修改配置...
    sourceMap = 'nosources-source-map'
    productionSourceMap = true
} else {
    // 为开发环境修改配置...
    productionSourceMap = false
}

// vue.config.js
module.exports = {
    publicPath: '/',
    lintOnSave: false,
    transpileDependencies: ['resize-detector', 'ant-design-vue'],

    // configureWebpack: {
    //   plugins: [
    //     // Ignore all locale files of moment.js
    //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    //   ],
    //   devtool: '(none)',
    // },

    productionSourceMap: productionSourceMap,

    chainWebpack: config => {
        config.resolve.alias
            .set('public', resolve('public'))
            .set('@', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
    },

    devServer: {
        // overlay: {
        //     warnings: false,
        //     errors: false
        // },
        // lintOnSave: false,
        disableHostCheck: true,
        // host: 'test.sxytest.sitezt.cn',
        proxy: {
            '/api': {
                target: 'http://sxytest.sitezt.cn', // 后端服务器
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    // '^/api': ''
                }
            }
        }
    }
}
