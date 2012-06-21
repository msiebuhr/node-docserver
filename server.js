#!/usr/bin/env node

/*
 * Launch server
 */

var appBuild = require('./lib/app');

var app = appBuild({
    docDir: '/tmp/docserver/'
});
app.listen(3000);
