define([
	'dojo/_base/declare',
	"dojo/on",
	"dojo/request",
	"dojo/topic",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	'dojo/text!app/views/register.html',
	'app/util/MD5',
	'dijit/form/Form',
	'dijit/form/ValidationTextBox',
	'dijit/form/MappedTextBox',
	'dijit/form/Button'
], function (declare, on, request, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, md5) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		title: 'Register',
		templateString: template,
		startup: function () {
			if(this._started) return;
			var self = this;
			this.password.format = this.confirm.format = function () { return this.get("displayedValue"); };
			this.password.parse = this.confirm.parse = function (val) { return val ? md5(val) : ''; };
			this.confirm.validator = function (value) { return value === self.password.get('displayedValue'); };

			this.own(on(this.form.domNode, 'submit', function(e) {
				e.preventDefault();
				if (self.form.validate()) {
					request.post('/register', {
						data: self.form.get('value')
					}).then(function() {
						topic.publish('login');
					});
				}
			}));

			this.own(on(this.login, 'click', function(e) {
				e.preventDefault();
				topic.publish('login');
			}));

			this.inherited(arguments);
		}
	});
});
