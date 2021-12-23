module.exports = {
    // Eslint关闭 false
    lintOnSave: false,
    pluginOptions: {
        mock: { debug: false }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
