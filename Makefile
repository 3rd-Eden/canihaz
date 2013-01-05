ALL_TESTS = $(shell find test/ -name '*.test.js')
NPM_TARBALL = $(shell npm pack)

test:
	# Install the module as node_module, so it can parse our package.json for
	# details.
	@npm install $(NPM_TARBALL)
	@rm $(NPM_TARBALL)
	@./node_modules/.bin/mocha $(ALL_TESTS)

.PHONY: test
