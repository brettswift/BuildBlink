REPORTER = spec
FILTERPATH = test/**

all: 
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) *test/**
test: 
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) test/**
integrationtest: 
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) integrationtest/**
filter:
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) -G $(FILTERPATH)

#use these shortcuts for continuous testing
allw: 
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) -w -G *test/**
testw: 
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) -w -G test/**
integrationtestw: 
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) -w -G integrationtest/**
filterw:
	@./node_modules/.bin/mocha -u tdd --reporter $(REPORTER) -w -G $(FILTERPATH)
#filterw usage: make filterw FILTERPATH='test/parsers/PropertiesParserTest.js'

help:
		clear
		@echo  'Targets:'
		@echo  '  	test 			- runs unit tests only'
		@echo  '  	integrationtest 	- runs integration tests only'
		@echo  '  	all 			- runs both unit tests and integration tests'
		@echo  '	filterw 		- runs a specific test'
		@echo  "	  - usage: "
		@echo  "		make filterw FILTERPATH='test/parsers/PropertiesParserTest.js'"
		@echo  ''
		@echo  'Continuous Targets:'
		@echo  '	watches for saved files and re-runs tests automatically'
		@echo  '	to run: suffix "w" onto the target above. '
		@echo  '	ex:   testw '
		@echo  ''
		@echo  ' ===== Usage ====='
		@echo  '	make [target][w]'
		@echo  ''

.PHONY: all test integrationtest allw testw integrationtestw filterw

