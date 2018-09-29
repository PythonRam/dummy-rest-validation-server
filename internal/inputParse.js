const objectParser = require('./objectParse');
const configParser = require('./configParse');
const common = require('./commons');


const _checkMockInput = (reqBody, input) => {
    try {
        // magic function path, request input and config input 
        const validateMock = (path, _reqinput, _input) => {
            if (_reqinput !== _input) {
                throw new common.Http422Error('Values do not match at key: ' + path)
            }
        }
        objectParser.compare(reqBody, input, validateMock)

    } catch (error) {
        throw new common.Http422Error(error.message);
    };
}

const _checkRegexInput = (reqBody, inputRegex) => {
    try {
        const validateRegex = (path, _reqinput, _input) => {
            if (!new RegExp(_input).test(_reqinput)) throw new common.Http422Error('Regex does not match at key: ' + path);
        }
        objectParser.compare(reqBody, inputRegex, validateRegex)

    } catch (error) {
        throw new common.Http422Error(error.message);
    };
}

const checkInput = (mode, reqMethod, reqBody, pathConfig, params) => {
    if (!common.noInputMethods.includes(reqMethod.toUpperCase())) {
        switch (mode) {
            case "MOCK":
                _checkMockInput(reqBody, configParser.getInput(params, pathConfig['input']));
                break;
            case "REGEX":
                _checkRegexInput(reqBody, configParser.getInput(params, pathConfig['inputRegex']));
                break;
        }
    }
}



module.exports = {
    checkInput
}