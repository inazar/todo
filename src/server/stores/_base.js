/*jshint node:true, dojo:true */
define([
	"dojo/store/Memory"
], function (Store) {
	"use strict";
	var collections = {};
	return function (collection) {
		return (collection in collections) ? collections[collection] : collections[collection] = new Store({ data: [] });
	};
});
