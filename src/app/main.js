/*jshint dojo:true */
define([
	'app/router',
	'dojo/dom',
	"dojo/dom-style",
	'dojo/topic',
	"dojo/request/notify",
	'dojo/domReady!'
], function (router, dom, style, topic, notify) {

	notify("start", function() {
		var pane = dom.byId('error');
		if (pane) {
			style.set(pane, 'color', 'blue');
			pane.innerHTML = "Loading...";
		}
	});
	notify("load", function() {
		var pane = dom.byId('error');
		if (pane) {
			style.set(pane, 'color', 'black');
			pane.innerHTML = "Ready!";
		}
	});
	notify("error", function(err) {
		var pane = dom.byId('error');
		if (pane) {
			style.set(pane, 'color', 'red');
			pane.innerHTML = err.response.data;
		}
		if (err.response.status === 401) {return topic.publish('login'); }
	});
	topic.publish('tasks');
});
