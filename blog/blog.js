var Blog = function() {

	var app,
		handlers = [
		require('./handlers/assets.js'),
		require('./handlers/error.js'),
		require('./handlers/homepage.js'),
		require('./handlers/article.js'),
		require('./handlers/archive.js'),
		require('./handlers/feed.js'),
		require('./handlers/tag.js')
	];

	return {

		/**
		 * Create and setup http server for serving blog dynamically
		 */
		createApp : function(config) {
			var express = require('express');

			app = express.createServer();
			app.configure(function(){
				app.set('views', config.templates);
				app.set('view engine', config.view_engine);
				app.set('view options', config.view_options);
				app.set('view cache', config.view_cache);
				app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
				app.use(express.bodyParser());
				app.use(express.static(__dirname + '/../theme/static'));
				app.use(app.router);
			});
			handlers.forEach(function(handler) {
				handler.register && handler.register(app);
			});
			return this;
		},

		/**
		 * Load article data into memory
		 */
		load : function(cb) {
			var self = this;
			require('./article.js').load(function() {
				cb.call(self);
			});
		},

		/**
		 * Create static version of blog in specified directory
		 */
		generate : function(dir) {
			var fs = require('fs');

			if(require('path').existsSync(dir)) {
				require('wrench').rmdirSyncRecursive(dir);
				console.log('removed directory: ', dir);
			}
			fs.mkdir(dir, function(err) {
				if(err) {
					console.log(err);
				}else {
					console.log('create directory: ', dir);
					handlers.forEach(function(handler) {
						handler.generate(dir);
					});
				}
			});
		},

		/**
		 * Pass-thru
		 */
		listen : function(port) {
			app.listen(port);
			console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
			return this;
		}

	};
};

module.exports = {

	create : function() {
		return new Blog();
	}

};