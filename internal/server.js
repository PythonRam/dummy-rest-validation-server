const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const core = require('./core');

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
            res.status(200);
            res.send(output);
        } catch (e) {
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