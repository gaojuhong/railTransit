const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    devServer: {
        // host: '127.0.0.1',
        port: 9999,
        // history模式下的url会请求到服务器端，但是服务器端并没有这一个资源文件，就会返回404，所以需要配置这一项
        historyApiFallback: {
            index: '/index.html' //与output的publicPath
        },
        proxy: {
            '/xboot': {
                target: 'http://36.110.161.83:8888',  // http://124.193.134.74:9999/
                ws: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false,
    // 部署优化
    configureWebpack: {
        // 使用CDN
        externals: {
            vue: 'Vue',
            'vue-i18n': 'VueI18n',
            axios: 'axios',
            'vue-router': 'VueRouter',
            vuex: 'Vuex',
            'view-design': 'iview',
            echarts: 'echarts',
            apexcharts: 'ApexCharts',
            'vue-apexcharts': 'VueApexCharts',
            xlsx: 'XLSX',
            dplayer: 'DPlayer',
            'print-js': 'printJS',
            html2canvas: 'html2canvas',
            'vue-json-pretty': 'VueJsonPretty',
            'vue-lazyload': 'VueLazyload',
            gitalk: 'Gitalk',
            'js-cookie': 'Cookies',
            wangEditor: 'wangEditor',
            quill: 'Quill',
            stompjs: 'Stomp',
            'sockjs-client': 'SockJS',
            vuedraggable: 'vuedraggable',
            viewerjs: 'Viewer'
        },
        plugins: [
            // GZIP压缩
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件
                threshold: 10240 // 对超过10k文件压缩
            })
        ]
    }
}