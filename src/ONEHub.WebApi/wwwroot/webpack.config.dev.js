const merge = require("webpack-merge");

const { environment } = require("./config-utils/constant");
const config = require("./webpack.config");

const { projectPath } = require("./config-utils/constant");

const jsDist = projectPath.relativeOutputPath + "/js";
const styleDist = projectPath.relativeOutputPath + "/style";

const clientRoot = projectPath.clientInputPath;

const devConfig = config(environment.development)[0];

devConfig.entry = {
    //Campaign Management
    [`${jsDist}/pages/campaign-management`]: clientRoot + "/js/pages/campaign-management/index.jsx",
    [`${styleDist}/pages/campaign-management`]: clientRoot + "/style/pages/campaign-management.scss",
}

module.exports = devConfig;