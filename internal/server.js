const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const core = require('./core');
const logger = require('./logger');
const app = express();


app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const runApp = (port, config) =>{
    app.all('*', (req, res, next) => {
        try {
            const output = core.getResponse(req, config)
            logger(req.method,200,req.url);
            res.status(200);
            res.send(output);
        } catch (e) {
            logger(req.method,e.code,req.url);
            res.status(e.code); // sends error messages to client
            res.send(e.message);
        }
    });
    var server = app.listen(port, function () {
        console.log("Application running on port:", server.address().port);
    });    
} 


module.exports = {
    runApp
}