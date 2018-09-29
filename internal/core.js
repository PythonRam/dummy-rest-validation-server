const inputParser = require('./inputParse');
const configParse = require('./configParse');
const common = require('./commons');

const getResponse = (req, config) => {
    
    const pathConfigAndMatched = configParse.findMatchedPathConfig(req.url, config); // gets the inputs, outputs and methods for the url
    const pathConfig = pathConfigAndMatched.pathConfig; 
    const matched = pathConfigAndMatched.matched;

    const inputMode = common.getInputMode(pathConfig); // mode of operation MOCK or REGEX
    
    configParse.checkMethod(req.method, pathConfig); // throws error if method not valid 
    inputParser.checkInput(inputMode,req.method,req.body, pathConfig, matched.params); // throws error if input not valid
    
    const output = configParse.getOutput(matched.params, pathConfig["output"]); // gets the output for given input 

    return output
}

module.exports = {
    getResponse
}