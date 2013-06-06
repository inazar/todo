/*jshint node:true, dojo:true */
define([
	"server/config",
	"server/routes/login",
	"server/routes/register",
	"server/routes/api",
	"dojo/when",
	"dojo/node!util",
	"dojo/node!path",
	"dojo/node!express"
], function(config, login, register, api, when, util, path, express) {
	"use strict";
	var app = express();

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		key: 'sid',
		secret: 'secret',
		cookie: { httpOnly: false }
	}));

	var staticPath = '';

	app.configure('production', function(){ staticPath = 'dist/'; });

	['app', 'dojo', 'dijit'].forEach(function(p) {
		app.use('/' + p, express['static'](staticPath + p)); // jslint consider this .static as error
	});

	app.get('/', function(req, res){ res.sendfile(staticPath+'index.html'); });

	app.post('/login', login);
	app.get('/login', function(req, res) {
		res.send(req.session.user || 'null');
	});
	app.post('/register', register);

	app.all('*', function (req, res, next) {
		if (req.headers.authorization) {
			express.basicAuth(function(user, pass, fn){
				if (!user || !pass) return fn(true);
				login.authenticate(user, pass, fn);
			})(req, res, function () {
				if (req.user) next();
				else next({status: 401, message: 'Unauthorized'});
			});
		} else {
			when(login.verify(req.session.user), function (result) {
				if (!result) {
					req.session = null;
					return res.send(401, 'Unauthorized');
				} else next();
			}, next);
		}
	});

	app['get']('/api/tasks/', api['get']);
	app['get']('/api/tasks/:id', api['get']);
	app['put']('/api/tasks/:id', api['put']);
	app['post']('/api/tasks/', api['post']);
	app['delete']('/api/tasks/:id', api['delete']);

	app.use(function(err, req, res, next) {
		if (req.xhr) res.send(err.status ? err.status : 500, err.message);
		else next(err);
	});

	var port = process.env.VCAP_APP_PORT || config.port || 80;

	app.listen(port, function() {
		util.log("Express server listening on "+port+" in "+app.get('env')+" mode");
	});
});
