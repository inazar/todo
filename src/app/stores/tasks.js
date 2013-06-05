/*jshint dojo:true */
define([
	"dojo/_base/declare",
	"dojo/store/JsonRest",
	"dojo/store/Observable"
], function (declare, JsonRest, Observable) {
	var store = new JsonRest({ target: "/api/tasks/" });
	return Observable(store);
});
