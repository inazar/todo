/*jshint node:true, dojo:true */
define([
	"server/stores/user",
	"dojo/when",
	"dojo/Deferred"
], function (User, when, Deferred) {
	"use strict";

	var login = function(req, res, next) {
		var parsed = req.body;
		when(User.query({name: parsed.name}), function(users) {
			if (!users || !users.length) return res.send(403, "User not found");
			var user = users[0];
			if (user.password === parsed.password) {
				req.session.user = user;
				res.send(user);
			} else res.send(403, "Wrong password");
		}, next);
	};

	login.authenticate = function (user, pass, fn) {
		when(User.query({name: user}), function(users) {
			if (!users || !users.length) return fn(true);
			var user = users[0];
			if (user.password === pass) fn(null, user);
			else fn(true);
		}, fn);
	};

	login.verify = function (user) {
		if (!user) return false;
		var d = new Deferred();
		when(User.query(user), function (users) {
			d.resolve(users && users.length);
		}, d.reject);
		return d.promise;
	};

	return login;
});
