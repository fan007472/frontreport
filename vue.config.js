module.exports = {
    // Eslint关闭
    lintOnSave: true,
    pluginOptions: {
        mock: { debug: false }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
