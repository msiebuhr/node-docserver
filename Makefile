PATH:=./node_modules/.bin:${PATH}

.PHONY: lint

lint:
	jshint lib/
