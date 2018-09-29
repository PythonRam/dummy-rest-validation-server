const config = require('./config.json');
const server = require('./internal/server');
const configValidator = require('./internal/configValidator');
const PORT = 3000;


try {
    configValidator.validate(config);
    server.runApp(PORT, config); 
} catch (error) {
    console.error(error);
}