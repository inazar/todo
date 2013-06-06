/*jshint dojo:true */
define([
	'require',
	"dojo/topic",
	"dojo/cookie",
	"dojo/request",
	"dojo/request/notify",
	'dijit/Dialog'
], function (require, topic, cookie, request, notify, Dialog) {

	var widgets = [], route = '', loggedInUser = null;

	function _destroyWidgets() {
		widgets.forEach(function (widget) {
			widget.destroyRecursive();
		});
		widgets = [];
	}

	function _Dialog (Content) {
		var dialog = new Dialog({
			closable: false,
			draggable: false,
			content: new Content()
		}).placeAt(document.body);
		dialog.set('title', dialog.content.title);
		dialog.startup();
		dialog.show();
		widgets.push(dialog);
	}

	topic.subscribe('login', function (user) {
		if (!user && route === 'login') return;
		route = 'login';
		_destroyWidgets();
		if (user) {
			loggedInUser = user;
			topic.publish('tasks');
		} else {
			require(['app/widgets/login'], _Dialog);
		}
	});

	topic.subscribe('register', function () {
		if (route === 'register') return;
		route = 'register';
		_destroyWidgets();
		require(['app/widgets/register'], _Dialog);
	});

	topic.subscribe('logout', function () {
		_destroyWidgets();
		cookie('sid', null);
		loggedInUser = null;
		topic.publish('login');
	});

	topic.subscribe('tasks', function () {
		if (!loggedInUser) {
			if (cookie('sid')) {
				request.get('/login').then(function (json) {
					var user;
					try {
						user = JSON.parse(json);
					} catch (e) {
						notify.emit('error', {status: 500, message: e.message});
					}
					loggedInUser = user;
					topic.publish(user ? 'tasks' : 'login');
				});
			} else topic.publish('login');
			return;
		}
		route = 'tasks';
		_destroyWidgets();
		require(['app/widgets/tasks'], function (Tasks) {
			var tasks = new Tasks({user: loggedInUser}).placeAt(document.body);
			tasks.startup();
			widgets.push(tasks);
		});
	});

	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	function encode64(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				keyStr.charAt(enc1) +
				keyStr.charAt(enc2) +
				keyStr.charAt(enc3) +
				keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);

		return output;
	}

	topic.subscribe('fetch', function (params) {
		request.get('/api/tasks/', {
			handleAs: 'json',
			headers: {
				'Authorization': 'Basic '+encode64((params.name || '')+':'+(params.password || ''))
			}
		}).then(function(res) { console.warn(res); });
	});
});
