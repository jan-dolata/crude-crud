$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

Crude = {
    Models: {},
    Views: {},
    Collections: {},

    /**
     * Event agregator
     * @type Object
     */
    vent: _.extend({}, Backbone.Events),

    /**
     * Translations
     * @type Object
     */
    trans: {},

    /**
     * Data
     * @type Object
     */
    data: {},
};

app = new Backbone.Marionette.Application();

app.addInitializer(function(options)
{
    Backbone.history.start();
});

$(function()
{
    app.start();
});

