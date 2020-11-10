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

    pages: {//配置多页面入口
        index: {
            entry: 'src/views/tk/tk.js',
            template: 'public/index.html',
        },
        dl: {
            entry: 'src/views/dl/dl.js',
            template: 'public/dl.html',
        },
        admin: {
            entry: 'src/views/admin/admin.js',
            template: 'public/admin.html',
        },
    },

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
        //host: 'test.sxytest.sitezt.cn',
        proxy: {
            '/api': {
                // target: 'http://sxytest.sitezt.cn', // 后端服务器
                // target: 'https://192.168.9.155:30080', // 后端服务器(wzy本地)
                // target: 'http://47.99.153.221:30081', // 后端服务器(容器测试)
                // target: 'http://192.168.11.129:30080', // 后端服务器
                target: 'https://yfdcallbacktest.comzt.cn:30080', // 155服务器
                //  target: 'https://47.99.153.221:30100', // 后端服务器
                //target: 'https://127.0.0.1:30080', // 后端服务器
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    // '^/api': ''
                }
            },
            '/signalr': {
                // target: 'http://sxytest.sitezt.cn', // 后端服务器
                //  target: 'https://192.168.9.155:30080', // 后端服务器(wzy本地)
                //  target: 'http://47.99.153.221:30081', // 后端服务器(容器测试)
                // target: 'https://47.99.153.221:30100', // 后端服务器
                target: 'https://yfdcallbacktest.comzt.cn:30080', // 155服务器
                // target: 'https://127.0.0.1:30080', // 后端服务器
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    // '^/api': ''
                }
            }
        }
    }
}
