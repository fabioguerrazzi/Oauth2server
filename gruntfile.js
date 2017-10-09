module.exports = function (grunt) {
    // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

            // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', 'src/**/*.js']
    },

    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },

      build: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            dest: 'build/',
            src: ['**/*.js']
          }
        ]
      }
    },

    copy: {
      build: {
        cwd: './',
        src: ['package.json'],
        dest: 'build',
        expand: true
      }
    },

    clean: ['build']
  });

    // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-nsp-shrinkwrap');

    // Default task(s).
  grunt.registerTask('default', ['clean', 'uglify', 'copy']);
};
