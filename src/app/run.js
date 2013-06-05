/*jshint dojo:true */
require({
	baseUrl: '',
	packages: [ 'dojo', 'dijit', 'app', 'server' ]
}, [ 'dojo/has', 'require' ], function (has, require) {
	if (has('host-browser')) require([ 'app' ]);
	else require([ 'server' ]);
});
