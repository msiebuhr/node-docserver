node-docserver
==============

Simple, security-less documentation server for handling HTML documentation from
any source.

Add documentation over HTTP by PUT'ing an uncompressed TAR-ball of HTML to the
correct project+tag;

    cd my_generated_docs
	tar -cv . | curl -X PUT http://docs.example.com/project_name/some_tag/ --data-binary @-
	cd -

You can now browse the docs at `http://docs.example.com/project_name/some_tag/`.

Installation
------------

Git clone and run:

    git clone https://github.com/msiebuhr/node-docserver.git
	cd node-docserver
	npm install
	mkdir /tmp/docserver/
	node ./server.js

Issues
------

[Always!](https://github.com/msiebuhr/node-docserver/issues)

License
-------

ISC - see [LICENSE](https://github.com/msiebuhr/node-docserver/blob/master/LICENSE).
