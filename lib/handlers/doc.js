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

    // Dumb down express a wee bit.
    app.set("view options", { layout: false });

    app.get('/', function (err, res, next) {
        fs.readdir(config.docDir, function (err, listing) {
            if (err) { return next(err); }
            res.render('project_listing.jinjs', { projects: listing });
        });
    });

    app.get('/:proj', function (req, res, next) {
        var dir = path.join( config.docDir, req.params.proj);

        fs.readdir(dir, function (err, listing) {
            if (err) { return next(err); }
            res.render('tag_listing.jinjs', {
                project: req.params.proj,
                tags: listing
            });
        });
    });

    app.get('/:proj/:tag/*', function (req, res, next) {
        // TODO: Do proper file serving
        var dir = path.join(config.docDir, req.params.proj, req.params.tag, req.params[0]);

        // Fail if it doesn't exist
        if (!path.existsSync(dir)) {
            return res.send(404);
        }

        // See that the request is pointing at.
        fs.stat(dir, function (err, stat) {
            if (err) { return next(err); }

            // Send files directly
            if (stat.isFile()) {
                return fs.createReadStream(dir).pipe(res);
            } else if (stat.isDirectory()) {
            // Directory listings?
                fs.readdir(dir, function (err, listing) {
                    if (err) { return next(err); }

                    // Look for index.html
                    if (listing.indexOf('index.html') !== -1) {
                        return fs.createReadStream(path.join(dir, 'index.html')).pipe(res);
                    }

                    return res.json(listing)
                }); // fs.readDir()
            } else {
                // Neither file nor directory
                return next();
            }
        }); // fs.stat()

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
