#!/usr/bin/env node

/*
 * Launch server
 */

var appBuild = require('./lib/app'),
    opt = require('optimist')
        .usage('$0 [-p port] [-d directory]')
        .options('port', { alias: 'p', default: 3000 })
        .options('docDir', { alias: 'd', default: '/tmp/docserver/' }),
    argv = opt.argv;

if ('help' in argv) {
    opt.showHelp();
    process.exit();
}

var app = appBuild(argv);
app.listen(argv.port);
