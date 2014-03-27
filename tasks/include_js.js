/*
 * grunt-include-js
 * https://github.com/makingoff/include-js
 *
 * Copyright (c) 2014 makingoff
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('include_js', 'Includes javascript-files between <!--Scripts--><!--/Scripts--> at templates.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      prefix: '',
      required: []
    });

    var match = /<\!\-\-Scripts\-\->([\s\S.]*)<\!\-\-\/Scripts\-\->/igm;
		var replacement = function (arr)
		{
			return '\n<script type="text/javascript" src="' + arr.join('"></script>\n<script type="text/javascript" src="') + '"></script>';
		};
    var source;
    var required;
    var srcText = '';
    var requiredText = '';

    if (options.required.length) {
      required = options.required.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return options.prefix + filepath;
      });
      requiredText = replacement(required);
    }
    this.files.forEach(function(f) {
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return options.prefix + filepath;
      });
      srcText = replacement (src);
      source = grunt.file.read(f.dest);

      // Write the destination file.
      grunt.file.write(f.dest, source.replace(match, '<!--Scripts-->' + requiredText + srcText + '\n<!--/Scripts-->'));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" including:' + (required ? '\n• ' + required.join('\n• ') : '') + (src ? '\n• ' + src.join('\n• ') : ''));
    });
  });

};
