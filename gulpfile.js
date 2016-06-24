var elixir = require('laravel-elixir');

var assets = './src/resources/assets/';
var node = './node_modules/';

elixir(function(mix) {

    mix.sass(assets + 'sass/app.scss', 'src/public/css/');

    mix.copy(node + 'font-awesome/fonts/**', 'src/public/fonts');

    mix.scripts([
        'jquery/dist/jquery.min.js',
        'jquery-ui-bundle/jquery-ui.min.js',
        'underscore/underscore-min.js',
        'underscore.string/dist/underscore.string.min.js',
        'backbone/backbone.js',
        'backbone.marionette/lib/backbone.marionette.min.js',
        'bootstrap-sass/assets/javascripts/bootstrap.min.js',
        'moment/min/moment.min.js',
        'dropzone/dist/dropzone.js',
        'bootstrap-datetimepicker-sass/src/js/bootstrap-datetimepicker.js',
        'bootstrap-datetimepicker-sass/src/js/locales/bootstrap-datetimepicker.pl.js',
        'markdown-it/dist/markdown-it.min.js'
    ], 'src/public/js/lib.js', node);

    mix.scripts([
        'js/app.js',
        'js/helper.js',
        'js/model.js',
        'js/modules/module.js',
        'js/modules/form.js',
        'js/modules/file.js',
        'js/modules/map.js',
        'js/list.js',
        'js/layout.js',
        'js/start.js',
    ], 'src/public/js/app.js', assets);

});
