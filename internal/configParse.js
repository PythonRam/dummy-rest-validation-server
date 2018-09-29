
const objectParser = require('./objectParse');
const common = require('./commons');

const _removeQueryParams = (oldURL) => {
    var index = 0;
    var newURL = oldURL;
    index = oldURL.indexOf('?');
    if (index == -1) {
        index = oldURL.indexOf('#');
    }
    if (index != -1) {
        newURL = oldURL.substring(0, index);
    }
    newURL = newURL.charAt(newURL.length - 1) == "/" ? newURL.substr(0, newURL.length - 1) : newURL;
    return newURL;
}

const _findMatchUrlAndParams = (url, config) => {
    const __getallConfigUrls = () => {
        let _urls = [];
        for (_url in config) {
            _urls.push(_url.slice(1).split('/'));
        }
        return _urls;
    }


    const checkUrl = (_url) => {
        let found = true;
        let params = {}
        _url.forEach((_part, i) => {
            if (common.isPathVariable(_part)) {
                //
                params[_part] = partsInUrl[i];
            } else {
                if (_part != partsInUrl[i]) {
                    params = {};
                    found = false;
                }
            }
        })
        if (found == true) {
            return {
                url: '/' + _url.join('/'),
                params: params
            };
        }
    }

    let _urls = __getallConfigUrls();
    let partsInUrl = url.slice(1).split('/');
    let result = null;
    _urls.forEach(_url => {
        if (!result && partsInUrl.length == _url.length) {
            result = checkUrl(_url);
        };
    });
    return result;
}

const ioParse = (params, ioConfig) => {
    let resp = ioConfig;
    for (pathvar in params) {
        const value = params[pathvar];
        if (!resp[pathvar]) {
            break;
        }
        if (!resp[pathvar][value]) {
            resp = resp['default'];
            continue;
        }
        resp = resp[pathvar][value];
    }
    return (resp);
}

const getInput = (params, pathConfig) => {
    return ioParse(params, pathConfig);
}
const getOutput = (params, pathConfig) => {
    return ioParse(params, pathConfig);
}


const findMatchedPathConfig = (url, config, mode) => {
    const _url = _removeQueryParams(url);

    if (config[_url]) {
        return {
            pathConfig: config[_url],
            matched: {
                url: _url,
                params: {}
            }
        }
    }
    const matched = _findMatchUrlAndParams(_url, config);

    if (matched && matched.url && config[matched.url]) {
        return {
            pathConfig: config[matched.url],
            matched: {
                url: matched.url,
                params: matched.params
            }
        };
    }

    throw new common.HttpError(404, 'Page not found');
}
const checkMethod = (method, pathConfig) => {
    if (!pathConfig['method']) {
        return 'ALL';
    } else if (pathConfig["method"] == method) {
        return method
    }
    throw new common.HttpError(405, 'Method not allowed');
}


module.exports = {
    findMatchedPathConfig,
    checkMethod,
    getInput,
    getOutput
}