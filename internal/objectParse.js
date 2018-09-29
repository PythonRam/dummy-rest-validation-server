function KeyError(key) {
    this.message = 'Expected key not found at ' + key;
}


// this is magic  function I wrote that iterates into an object keeping track of where it is using url type key.   
const _objectParse = (root ,o, fn) => {
    root = root != null ? root : '';
    if (!o) return null;
    for (key in o) {
        if (o[key] && typeof (o[key]) !== 'object') fn(root + '/' + key, key,o[key]); // primitive data types
         else {
            // array, object
            if (Array.isArray(o[key])) {
                for (_key in o[key]) {
                    if (!o[key]) return null;
                    const _o = o[key][_key]; 
                    if (_o && typeof (_o) !== 'object') fn(root + '/' + key + '/' + _key, _key,_o); // if array has primitive data type 
                    else _objectParse(root + '/' + key, o[key], fn); // if array has objects iterate recursively 
                }
            } else _objectParse(root + '/' + key, o[key], fn) // if not array then iterate that object recursively 
        }
    }
}



const compare = (reqBody, input, validator) => {
    const fn = (path, key, value) => {
        const _parts = path.split('/'); // spilt the url from magic funtion to use as keys 
        let parseValue = reqBody; 
        _parts.slice(1).forEach((_part, i) => { // remove the first empty '/' and iterate through rest.
            if (!parseValue[_part]) {
                throw new KeyError(path);  
            }
            parseValue = parseValue[_part];
        })
        validator(path, parseValue, value);
    }

    _objectParse(null, input, fn);
}

const getKeyValue = (obj, validator) =>{
    const fn = (path, key, value) => {
        validator(path, key, value)
    }
    _objectParse(null, obj, fn);
}

module.exports = {
    compare,
    getKeyValue
}