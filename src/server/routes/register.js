/*jshint node:true, dojo:true */
define([
	"server/stores/user",
	"dojo/when"
], function (User, when) {
	"use strict";

	return function(req, res, next) {
		var parsed = req.body;
		when(User.query({name: parsed.name}), function(users) {
			if (users && users.length) return res.send(403, "User already exists");
			if (parsed.confirm !== parsed.password) res.send(403, "Passwords do not match");
			delete parsed.confirm;
			when(User.add(parsed), function(id) {
				res.send(id.toString());
			}, next);
		}, next);
	};
});
