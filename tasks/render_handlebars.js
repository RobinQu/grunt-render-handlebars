/*
 * grunt-render-handlebars
 * https://github.com/RobinQu/grunt-render-handlebars
 *
 * Copyright (c) 2014 RobinQu
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
  
  
  var engine = require("handlebar-middleware").engine,
      path = require("path"),
      async = require("async");
  
  
  grunt.registerMultiTask("renderHandlebars", "Render handlebars into static files", function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(),
        render = engine(options);

    async.eachLimit(this.files, 5, function(f, callback) {
      var name = path.resolve(f.src[0]).replace(path.resolve(f.orig.cwd), "").replace(/\.hbs$/, ""),
          dest = f.dest.replace(/hbs$/, "html");
          render(name, function(e, content) {
        if(e) {
          grunt.log.error(e);
          return callback(e);
        }
        if(content) {
          grunt.file.write(dest, content);
          grunt.log.ok("hbs " + f.src[0] + " is translated to " + name + " and ouput to " + dest);
          callback();
        } else {
          grunt.log.warn("render result of hbs " + f.src + " is invalid");
          callback(null, false);
        }
        
      });
    }, this.async());
  });

};
