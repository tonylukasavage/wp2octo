var fs = require('fs'),
	path = require('path'),
	xmldom = require('xmldom');

module.exports = function main(exportFile, octopress) {

	// validate input
	if (!exportFile) {
		throw new Error('exportFile must be defined');
	} else if (!fs.existsSync(exportFile)) {
		throw new Error('exportFile does not exist');
	}

	octopress = path.resolve(octopress || '.');
	if (!fs.existsSync(octopress)) {
		throw new Error('octopress does not exist');
	}

	postsDir = path.join(octopress, 'source', '_posts');
	if (!fs.existsSync(postsDir)) {
		throw new Error('octopress source/_posts dir not found');
	}

	// read export xml
	var xml = fs.readFileSync(exportFile, 'utf8');
		doc = new xmldom.DOMParser().parseFromString(xml);

}