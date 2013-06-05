/*jshint node:true, dojo:true */
define([
	"server/stores/tasks",
	"dojo/when",
	"dojo/_base/lang"
], function (Tasks, when, lang) {
	"use strict";
	return {
		"get": function(req, res, next) {
			if (req.params.id) {
				when(Tasks.get(req.params.id), function (task) {
					if (!task) return res.send(406, "Not Acceptable");
					if (task.user !== (req.user && req.user.name || req.session.user && req.session.user.name)) {
						res.send(401, 'Unauthorized');
					} else res.send(task);
				}, next);
			} else {
				when(Tasks.query(lang.mixin({user: req.user && req.user.name || req.session.user && req.session.user.name}, req.query), {sort: [{attribute: "timestamp", descending: true}]}), function (tasks) {
					res.send(tasks);
				}, next);
			}
		},
		"put": function(req, res, next) {
			if (!req.params.id) {
				if (req.body.id) req.params.id = req.body.id;
				else return res.send(406, "Not Acceptable");
			}
			when(Tasks.get(req.params.id), function (task) {
				if (!task) return res.send(406, "Not Acceptable");
				if (task.user !== (req.user && req.user.name || req.session.user && req.session.user.name)) return res.send(401, 'Unauthorized');
				delete req.body;
				lang.mixin(task, req.body);
				when(Tasks.put(task), function (id) {
					res.send(id.toString());
				}, next);
			}, next);
		},
		"post": function(req, res, next) {
			var task = lang.mixin({
				complete: false,
				priority: "normal"
			}, req.body);
			delete task.id;
			if (!(task.user = (req.user && req.user.name || req.session.user && req.session.user.name))) return res.send(401, 'Unauthorized');
			task.timestamp = new Date().getTime();
			when(Tasks.add(task), function (id) {
				task.id = id;
				res.send(task);
			}, next);
		},
		"delete": function(req, res, next) {
			if (!req.params.id) return res.send(406, "Not Acceptable");
			when(Tasks.get(req.params.id), function (task) {
				if (!task) return res.send(406, "Not Acceptable");
				if (task.user !== (req.user && req.user.name || req.session.user && req.session.user.name)) return res.send(401, 'Unauthorized');
				when(Tasks.remove(req.params.id), function (status) {
					res.send(status);
				}, next);
			}, next);
		}
	};
});
