# grunt-include-js

> Grunt module. Includes javascript-files between <!--Scripts--><!--/Scripts--> at templates.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-include-js --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-include-js');
```

## The "include_js" task

### What is it

There is stack of javascript-files you need to include to your templates. But after concat or uglify or something else you will have another one stack.
This module allows to replace the part in templates when you include your javascript.

### Example

You have `index.html` with included javascript:

```js
<!DOCTYPE html>
<html>
<head>
  <title>Custom options first set</title>
</head>
<body>
  <script type="text/javascript" src="js/jquery-1.10.1.min.js"></script>
  <script type="text/javascript" src="js/jquery.fileupload.js"></script>
  <script type="text/javascript" src="js/jquery.cookie.js"></script>
  <script type="text/javascript" src="js/underscore.min.js"></script>
  <script type="text/javascript" src="js/views.js"></script>
  <script type="text/javascript" src="js/scripts.js"></script>
</body>
</html>
```

After some manipulations you need another picture:
```js
<!DOCTYPE html>
<html>
<head>
  <title>Custom options first set</title>
</head>
<body>
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/application.js"></script>
</body>
</html>
```

And you want make it automatically. All right. Make next task:

```js
grunt.initConfig({
  include_js: {
    source: {
      files: {
        'index.html': [
          'js/jquery-1.10.1.min.js',
          'js/jquery.fileupload.js',
          'js/jquery.cookie.js',
          'js/underscore.min.js',
          'js/views.js',
          'js/scripts.js'
        ]
      }
    },
    build: {
      files: {
        'index.html': [
          'js/jquery.js',
          'js/application.js'
        ]
      }
    }
  },
})
```

Into `index.html` paste `<!--Scripts--><!--/Scripts-->` at the place when you want to see your files.
And launch tasks. `include_js:source` for default task and `include_js:build` for build.

### Overview
In your project's Gruntfile, add a section named `include_js` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  include_js: {
    your_target: {
      options: { // optional
        prefix: '', // prefix for path to js-files. May be you want prepend ../ or something else
        required: ['array of js-file for include to all templates at this target']
      },
      files: {
        'path-to-template': ['array of js-files to include']
      }
    },
  },
})
```
