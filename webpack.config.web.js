
var path = require('path');

module.exports = {
    mode: 'production',
    target: ['web', 'es5'],
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'live2d-render.bundle.js',
        publicPath: '/dist/',
        libraryTarget: 'umd',
        library: 'Live2dRender'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@framework': path.resolve(__dirname, '../../../Framework/src')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    devServer: {
        static: [
            {
                directory: path.resolve(__dirname, './'),
                serveIndex: true,
                watch: true,
            }
        ],
        hot: true,
        port: 5000,
        host: '0.0.0.0',
        compress: true,
        devMiddleware: {
            writeToDisk: true,
        },
    },
    devtool: false
}
