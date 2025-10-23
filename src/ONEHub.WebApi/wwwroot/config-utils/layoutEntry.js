const { projectPath } = require("./constant");

const jsDist = projectPath.relativeOutputPath + "/js";

const clientRoot = projectPath.clientInputPath;

module.exports = {
    [`${jsDist}/pages/Recheckin/recheckin`]: clientRoot + "/js/pages/RecheckIn/recheckin",
    [`${jsDist}/pages/layout/pagelayout`]: clientRoot + "/js/pagelayout/pagelayout.js"
};