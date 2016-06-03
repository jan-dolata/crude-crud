$ ajaxSetup
    headers:
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr 'content'

Crude =
    Models: {}
    Views: {}
    Collections: {}
    vent: _.extend {},Backbone.Events
    trans: {}
    data: {}

app = new Backbone.Marionette.Application()

app.addInitializer (options) ->
    Backbone.history.start
    return

$ ->
    app.start()
    return
