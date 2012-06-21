var express = require('express');

module.exports = function (config) {
    var app = express.createServer();

    app.get('/favicon.ico', function (req, res, next) {
        return res.send(404);
    });
    app.use('/', require('./handlers/doc')(config));

    return app;
};
