function HttpError(code, message) {
    this.code = code;
    this.message = message;
}

const noInputMethods = ["GET", "DELETE"];

function Http422Error(message) {
    this.code = 422;
    this.message = message;
}
const getInputMode = (pathConfig) => {
    if (!pathConfig['inputMode']) return 'MOCK';
    return pathConfig['inputMode'].toUpperCase();
}


const isPathVariable = (_part) => {
    return new RegExp("^<[a-zA-Z0-9]*>$").test(_part);
}

module.exports = { Http422Error, HttpError , noInputMethods, isPathVariable, getInputMode}