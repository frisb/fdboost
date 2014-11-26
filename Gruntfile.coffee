module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    clean:
      default:
        src: ['lib']

    coffee:
      compile:
        options:
          bare: false
          join: false
        files: [
          expand: true
          cwd: 'src'
          src: '**/*.coffee'
          dest: 'lib'
          ext: '.js'
        ]

    #mochaTest:
      #test:
        #options:
          #reporter: 'spec'
          #require: 'coffee-script/register'
        #src: ['test/**/*.coffee']

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.registerTask('default', ['clean', 'coffee']) # , 'mochaTest'])
