test:
	npm install
	@NODE_ENV=test ./node_modules/.bin/mocha tests -R spec -t 5000 -s 0

.PHONY: test
