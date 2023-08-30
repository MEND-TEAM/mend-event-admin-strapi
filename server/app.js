let express = require('express')
let webpack = require('webpack')
let path = require('path')
let webpackConfig = require('../webpack.config.dev')

let app = express()

const devMode = process.env.NODE_ENV !== 'production'
// const devMode = false

if (devMode) {
    let reactCompiler = webpack(webpackConfig);
    
    app.use(require('webpack-dev-middleware')(reactCompiler, {
        hot:true,
        noInfo: true,
        publicPath: '/bundle/',
        stats: {
            colors: true
        },
        historyApiFallback: true
    }));
    
    app.use(require('webpack-hot-middleware')(reactCompiler, {
        log: console.log,
        path: "/__webpack_hmr_admin",
        heartbeat: 10 * 1000
    }));
}
    

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

module.exports = app