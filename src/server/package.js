/**
 * This file is referenced by the `dojoBuild` key in `package.json` and provides extra hinting specific to the Dojo
 * build system about how certain files in the package need to be handled at build time. Build profiles for the
 * application itself are stored in the `profiles` directory.
 */

var profile = {
	resourceTags: {
		amd: function (filename, mid) {
			return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
		},
		copyOnly: function (filename, mid) {
			return true;
		},
		miniExclude: function (filename, mid) {
			return mid in {
				'server': 1,
				'server/routes': 1,
				'server/stores': 1
			};
		}
	}
};
