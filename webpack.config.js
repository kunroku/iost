const path = require('path');
const moduleName = 'iost';
const entry = './src/iost.js'
let webConfig = {
    mode: 'production',
    target: 'web',
    entry,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${moduleName}.min.js`,
        library: `${moduleName}`,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};
let nodeConfig = {
    mode: 'production',
    target: 'node',
    entry,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${moduleName}.js`,
        library: `${moduleName}`,
        libraryTarget: 'commonjs2',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};

module.exports = [webConfig, nodeConfig];
