/*jshint dojo:true */
define([
	"dojo/_base/declare",
	"dojo/on",
	"app/stores/tasks",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	'dojo/text!app/views/task.html',
	"dijit/InlineEditBox",
	"dijit/form/Select",
	"dijit/form/TextBox",
	"dijit/form/CheckBox"
], function (declare, on, TasksStore, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		task: null,
		templateString: template,
		constructor: function (options) {
			this.task = options.task;
		},
		startup: function () {
			if(this._started) return;
			var self = this;
			this.editor.set('value', this.task.content);
			this.complete.set('checked', !!this.task.complete);
			this.priority.set('value', this.task.priority || "normal");
			this.own(on(this.editor, 'change', function (value) {
				if (self.task.content !== value) {
					self.task.content = value;
					TasksStore.put(self.task);
				}
			}));
			this.own(on(this.complete, 'change', function (value) {
				if (self.task.complete !== value) {
					self.task.complete = value;
					TasksStore.put(self.task);
				}
			}));
			this.own(on(this.remove, 'click', function () {
				TasksStore.remove(self.task.id);
			}));
			this.own(on(this.priority, 'change', function (value) {
				if (self.task.priority !== value) {
					self.task.priority = value;
					TasksStore.put(self.task);
				}
			}));

			this.inherited(arguments);
		}
	});
});
