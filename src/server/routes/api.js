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
					res.send(task);
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
			when(Tasks.put(req.body), function (id) {
				res.send(id.toString());
			}, next);
		},
		"post": function(req, res, next) {
			var task = lang.mixin({
				user: req.session.user.name,
				timestamp: new Date().getTime(),
				complete: false,
				priority: "normal"
			}, req.body);
			when(Tasks.add(task), function (id) {
				task.id = id;
				res.send(task);
			}, next);
		},
		"delete": function(req, res, next) {
			if (!req.params.id) return res.send(406, "Not Acceptable");
			when(Tasks.remove(req.params.id), function (status) {
				res.send(status);
			}, next);
		}
	};
});
