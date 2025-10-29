const path = require("path");

module.exports = {
    environment: {
        development: 'development',
        production: 'production'
    },
    projectPath: {
        rootPath: path.resolve(__dirname, '../'),
        clientInputPath: path.resolve(__dirname, '../source'),
        clientOutputPath: path.resolve(__dirname, '../dist'),
        relativeOutputPath: 'dist'
    }
}