/*
 * Handler that knows about documentation.
 */

var fs = require('fs'),
    path = require('path'),
    tar = require('tar'),
    assert = require('assert'),
    express = require('express');

module.exports = function (config) {
    var app = express.createServer();

    assert('docDir' in config, 'docDir missing from config');
    assert(path.existsSync(config.docDir), 'docDir ('+config.docDir+') does not exist');

    app.get('/', function (err, res, next) {
        fs.readdir(config.docDir, function (err, listing) {
            if (err) { return next(err); }
            res.json(listing);
        });
    });

    app.get('/:proj', function (req, res, next) {
        var dir = path.join( config.docDir, req.params.proj);

        fs.readdir(dir, function (err, listing) {
            if (err) { return next(err); }
            res.json(listing)
        });
    });

    app.get('/:proj/:tag/*', function (req, res, next) {
        // TODO: Do proper file serving
        var dir = path.join(config.docDir, req.params.proj, req.params.tag, req.params[0]);

        fs.readdir(dir, function (err, listing) {
            if (err) { return next(err); }

            // Look for index.html
            if (listing.indexOf('index.html') !== -1) {
                return fs.createReadStream(path.join(dir, 'index.html')).pipe(res);
            }

            res.json(listing)
        });
    });

    app.put('/:project/:tag', function (req, res, next) {
        var extractDir = path.join( config.docDir, req.params.project, req.params.tag),
            extractor = tar.Extract({ path: extractDir })

        extractor
            .on('error', function (err) {
                return res.send(500, err);
            }).on('end', function () {
                return res.send(200);
            });

        req.pipe(extractor);
    });

    return app;
};