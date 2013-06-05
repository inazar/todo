/*jshint dojo:true */
define([
	'dojo/_base/declare',
	"dojo/on",
	"dojo/request",
	"dojo/request/notify",
	"dojo/topic",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	'dojo/text!app/views/login.html',
	'app/util/MD5',
	'dijit/form/Form',
	'dijit/form/ValidationTextBox',
	'dijit/form/MappedTextBox',
	'dijit/form/Button'
], function (declare, on, request, notify, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, md5) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		title: 'Login',
		templateString: template,
		startup: function () {
			if(this._started) return;
			var self = this;
			this.password.format = function () { return this.get("displayedValue"); };
			this.password.parse = function (val) { return val ? md5(val) : ''; };

			this.own(on(this.form.domNode, 'submit', function(e) {
				e.preventDefault();
				if (self.form.validate()) {
					request.post('/login', {
						data: self.form.get('value')
					}).then(function(json) {
						var user;
						try {
							user = JSON.parse(json);
						} catch (e) {
							notify.emit('error', {status: 500, message: e.message});
						}
						topic.publish('login', user);
					});
				}
			}));

			this.own(on(this.register, 'click', function(e) {
				e.preventDefault();
				topic.publish('register');
			}));

			this.own(on(this.fetch, 'click', function(e) {
				e.preventDefault();
				topic.publish('fetch', self.form.get('value'));
			}));

			this.inherited(arguments);
		}
	});
});
