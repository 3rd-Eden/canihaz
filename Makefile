ALL_TESTS = $(shell find test/ -name '*.test.js')
NPM_TARBALL = $(shell npm pack -q)

test:
	@tar -xvzf $(NPM_TARBALL)
	@mv ./package ./node_modules/canihaz
	@rm $(NPM_TARBALL)
	@./node_modules/.bin/mocha $(ALL_TESTS)
	@rm -rf ./node_modules
	@npm install .

.PHONY: test
