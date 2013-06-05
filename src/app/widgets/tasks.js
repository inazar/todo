/*jshint dojo:true */
define([
	"dojo/_base/declare",
	"dojo/topic",
	"dojo/on",
	"dojo/_base/lang",
	"app/stores/tasks",
	"app/widgets/task",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"app/widgets/taskTable"
], function (declare, topic, on, lang, TasksStore, Task, BorderContainer, ContentPane, Button, taskTable) {
	return declare([BorderContainer], {
		user: null,
		style: "width: 500px; margin: 0 auto; height: 100%;",
		constructor: function (options) {
			this.user = options.user;
		},
		startup: function () {
			if(this._started) return;
			var title = new ContentPane({
				region: "top",
				style: "height:1.2em;font-size:x-large;font-weight:bold;overflow:hidden;",
				content: "Task list for '"+this.user.name+"'"
			});
			title.addChild(new Button({
				label: "Logout",
				style: "float:right;font-size:small;font-weight:normal;",
				onClick: function () { topic.publish('logout'); }
			}));
			var err = new ContentPane({
				region: "top",
				style: "height: 1em; color: red;",
				id: "error"
			});
			this.addChild(title);
			this.addChild(err);

			var contentPane = new ContentPane({ region: "center" });

			this.addChild(contentPane);
			this.inherited(arguments);

			var content = new taskTable(), tableNode = content.tableNode, taskList = [];

			contentPane.addChild(content);

			function _insertTask (task, i) {
				var taskRow = new Task({task: task});
				taskList.splice(i, 0, taskRow);
				taskRow.placeAt(tableNode, i);
			}

			function _removeTask (i) {
				taskList.splice(i, 1)[0].destroyRecursive();
			}

			function _renderTasks(tasks) {
				tasks.forEach(_insertTask);
				tasks.observe(function (task, rIndex, iIndex) {
					if (rIndex > -1) _removeTask(rIndex);
					if (iIndex > -1) _insertTask(task, iIndex);
				}, true);
			}

			content.own(on(content.insertRow, 'click', function() {
				var newTask = { content: "New task" };
				TasksStore.add(newTask).then(function (task) {
					lang.mixin(newTask, task);
				});
			}));

			_renderTasks(TasksStore.query({}));
		}
	});
});
