module.exports = function(grunt) {

  // A very basic default task.
  grunt.registerTask('default', 'libs');
  grunt.registerTask('libs', 'Install libs', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

};
