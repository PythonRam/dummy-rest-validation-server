const common = require('./commons');
const objectParser = require('./objectParse');

const _validateRegex = (path, key, value) => {
    try {
        if (value)
            new RegExp(value);
    } catch (error) {
        throw new Error('Reg exp: ' + value + ' not valid at path: ' + path);
    };
}

const _validateMock = (path, key, value) => {
    if (key.includes('/')) throw new Error('Keys cannot have "/", but contains one at path: ' + path + ' at key: ' + key);
}

const _validatePathInput = (path, pathConfig) => {
    const inputMode = common.getInputMode(pathConfig[path]);
    const method = pathConfig[path]['method'] ? pathConfig[path]['method'] : "ALL";
    try {
        switch (inputMode) {
            case 'MOCK':
                if (!common.noInputMethods.includes(method.toUpperCase()) && !pathConfig[path]['input']) throw new Error('Path: ' + path + ' does not contain input in mock mode');
                else objectParser.getKeyValue(pathConfig[path]['input'],_validateMock)
                break;
            case 'REGEX':
                if (!common.noInputMethods.includes(method.toUpperCase()) && !pathConfig[path]['inputRegex']) throw new Error('Path: ' + path + ' does not contain inputRegex in regex mode');
                else objectParser.getKeyValue(pathConfig[path]['inputRegex'],_validateRegex);
                break;
        }
    } catch (error) {
        throw error; //propogate
    }


}

const validate = (config) => {
    for (let path in config) {
        _validatePathInput(path, config);
    }
}


module.exports = {
    validate
}