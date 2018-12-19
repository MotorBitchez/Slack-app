module.exports = (env) => {
    return {
        mode: env.mode,
        entry: './index.js',
        output: {
            filename: 'index_bundled.js',
            path: __dirname
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            node: '8'
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        },
        target: 'node'
    }
};