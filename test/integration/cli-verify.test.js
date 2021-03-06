'use strict';

const fs = require('fs');
const path = require('path');
const nixt = require('nixt');
const oist = path.join(__dirname, '../../', require('../../package.json').bin.oist);
const rimraf = require('rimraf');
const testDirectory = fs.mkdtempSync('/tmp/oist-integration');
describe('oist verify', function() {
	let sourceDirectory;

	beforeEach(function() {
		sourceDirectory = path.join(testDirectory, 'src');
		fs.mkdirSync(sourceDirectory);
		fs.writeFileSync(path.join(sourceDirectory, 'example.png'), 'not-really-a-png');
		fs.writeFileSync(path.join(sourceDirectory, 'valid.svg'), '<svg></svg>');
	});

	afterEach(function() {
		fs.unlinkSync(path.join(sourceDirectory, 'example.png'));
		fs.unlinkSync(path.join(sourceDirectory, 'valid.svg'));
		rimraf.sync(sourceDirectory);
	});

	it('outputs a success message', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify`)
			.stdout(/verifying images/i)
			.stdout(/verified all images/i)
			.end(done);
	});

	it('exits with a code of 0', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify`)
			.code(0)
			.end(done);
	});

});

describe('oist verify (with invalid images present)', function() {
	let sourceDirectory;

	beforeEach(function() {
		sourceDirectory = path.join(testDirectory, 'src');
		fs.mkdirSync(sourceDirectory);
		fs.writeFileSync(path.join(sourceDirectory, 'example.png'), 'not-really-a-png');
		fs.writeFileSync(path.join(sourceDirectory, 'valid.svg'), '<svg width="100" height="100"></svg>');
	});

	afterEach(function() {
		fs.unlinkSync(path.join(sourceDirectory, 'example.png'));
		fs.unlinkSync(path.join(sourceDirectory, 'valid.svg'));
		rimraf.sync(sourceDirectory);
	});

	it('outputs an error', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify`)
			.stdout(/verifying images/i)
			.stderr(/root svg element must not have a `width` attribute/i)
			.stderr(/root svg element must not have a `height` attribute/i)
			.end(done);
	});

	it('exits with a code of 1', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify`)
			.code(1)
			.end(done);
	});

});

describe('oist verify --source-directory is-a-directory', function() {
	let sourceDirectory;

	beforeEach(function() {
		sourceDirectory = path.join(testDirectory, 'is-a-directory');
		fs.mkdirSync(sourceDirectory);
		fs.writeFileSync(path.join(sourceDirectory, 'example.png'), 'not-really-a-png');
		fs.writeFileSync(path.join(sourceDirectory, 'valid.svg'), '<svg></svg>');
	});

	afterEach(function() {
		fs.unlinkSync(path.join(sourceDirectory, 'example.png'));
		fs.unlinkSync(path.join(sourceDirectory, 'valid.svg'));
		rimraf.sync(sourceDirectory);
	});

	it('outputs a success message', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify --source-directory is-a-directory`)
			.stdout(/verifying images/i)
			.stdout(/verified all images/i)
			.end(done);
	});

	it('exits with a code of 0', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify --source-directory is-a-directory`)
			.code(0)
			.end(done);
	});

});

describe('IMAGESET_SOURCE_DIRECTORY=is-a-directory oist verify', function() {
	let sourceDirectory;

	beforeEach(function() {
		sourceDirectory = path.join(testDirectory, 'is-a-directory');
		fs.mkdirSync(sourceDirectory);
		fs.writeFileSync(path.join(sourceDirectory, 'example.png'), 'not-really-a-png');
		fs.writeFileSync(path.join(sourceDirectory, 'valid.svg'), '<svg></svg>');
	});

	afterEach(function() {
		fs.unlinkSync(path.join(sourceDirectory, 'example.png'));
		fs.unlinkSync(path.join(sourceDirectory, 'valid.svg'));
		rimraf.sync(sourceDirectory);
	});

	it('outputs a success message', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.env('IMAGESET_SOURCE_DIRECTORY', 'is-a-directory')
			.run(`${oist} verify`)
			.stdout(/verifying images/i)
			.stdout(/verified all images/i)
			.end(done);
	});

	it('exits with a code of 0', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.env('IMAGESET_SOURCE_DIRECTORY', 'is-a-directory')
			.run(`${oist} verify`)
			.code(0)
			.end(done);
	});

});

describe('oist verify --source-directory not-a-directory', function() {
	it('exits with a code of 1', function(done) {
		nixt({ colors: false }).cwd(testDirectory)
			.run(`${oist} verify --source-directory is-a-directory`)
			.code(1)
			.end(done);
	});

});
