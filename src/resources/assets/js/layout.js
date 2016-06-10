Crude.Views.Layout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: 'container m-lg-t',

    firstRender: true,
    title: '',
    updateTime: '',

    ui: {
        updateDelay: '#updateDelay',
        refresh: '#refresh'
    },

    events: {
        'click @ui.refresh': 'refresh'
    },

    regions: {
        'list': '#listRegion',
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion'
    },

    initialize: function (options)
    {
        this.setup = options.setup;

        this.updateDelay();
        this.listenTo(Crude.vent, 'fetched_completed', this.updateDelay);
    },

    updateDelay: function ()
    {
        this.updateTime = Date.now();
    },

    refresh: function ()
    {
        Crude.vent.trigger('action_update', this.setup.getName());
    },

    serializeData: function()
    {
        return {
            setup: this.setup
        };
    },

    onRender: function()
    {
        if (this.firstRender) {
            var setup = this.setup;

            this.list.show(
                new Crude.Views.List({ setup: setup })
            );

            if (this.setup.isActionAvailable('form'))
                this.form.show(
                    new Crude.Views.FormModule({ setup: setup })
                );

            if (this.setup.isActionAvailable('file'))
                this.file.show(
                    new Crude.Views.FileModule({ setup: setup })
                );

            if (this.setup.isActionAvailable('map'))
                this.map.show(
                    new Crude.Views.MapModule({ setup: setup })
                );

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();

        setInterval(function()
        {
            var delay = Date.now() - this.updateTime;
            delay = parseInt(delay / 1000);
            var s = delay % 60;
            var m = parseInt(delay / 60);

            s = String("00" + s).slice(-2);

            this.ui.updateDelay.html( m + ':' + s );
        }.bind(this), 1000);
    },
});
