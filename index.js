var fs = require('fs'),
	_ = require('lodash'),
	path = require('path'),
	xmldom = require('xmldom');

var serializer = new xmldom.XMLSerializer(),
	doc;

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

	// find posts
	getElements('table').filter(function(table) {
		return getElement({
			node: table,
			name: 'column',
			attr: 'name',
			attrValue: 'post_type',
			value: 'post'
		});
	}).forEach(function(elem) {
		var col = function(n) { return getColumnValue(elem, n); };
		var post = {
			content: col('post_content')
				.replace(/&amp;/g, "&")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, "\"")
				.replace(/&#039;/g, "'"),
			date: col('post_date'),
			status: col('post_status'),
			title: col('post_title')
		};
		if (post.status !== 'publish') {
			return;
		}
		console.log(post);
		//process.exit();
	});

}

function getColumnValue(node, name) {
	return getElementText({
		node: node,
		name: 'column',
		attr: 'name',
		attrValue: name
	});
}

function getElements(opts) {
	opts = opts || {};
	if (_.isString(opts)) {
		opts = { name: opts };
	}

	var elems = [],

		// determine base node
		node = opts.node || doc.documentElement,

		// get list of child nodes
		children = getElementsFromNodes(opts.name ?
			node.getElementsByTagName(opts.name) : node.childNodes);

	// filter based on opts
	children.forEach(function(child) {
		if ((!opts.attr || child.hasAttribute(opts.attr)) &&
			(!opts.attrValue || child.getAttribute(opts.attr) === opts.attrValue) &&
			(!opts.value || getNodeText(child) === opts.value) ) {
			elems.push(child);
		}
	});

	return elems;
}

function getElement(opts) {
	return getElements(opts)[0];
}

function getElementText(opts) {
	return getNodeText(getElements(opts)[0]);
}

function getNodeText(node) {
	if (!node) { return ''; }
	var str = '';
	for (var i = 0; i < node.childNodes.length; i++) {
		if (node.childNodes[i].nodeType === 3) {
			str += serializer.serializeToString(node.childNodes[i]).trim();
		}
	}
	return str;
}

function getElementsFromNodes(nodeList) {
	var elems = [];
	if (nodeList && nodeList.length) {
		for (var i = 0, l = nodeList.length; i < l; i++) {
			var node = nodeList.item(i);
			if (node.nodeType === 1) {
				elems.push(node);
			}
		}
	}
	return elems;
}
