Crude.Views.Layout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: 'container m-lg-t',

    firstRender: true,
    title: '',

    regions: {
        'list': '#listRegion',
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
    },

    serializeData: function()
    {
        return {
            title: this.setup.get('title')
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

            if (this.setup.isActionAvailable('map'))
                this.map.show(
                    new Crude.Views.MapModule({ setup: setup })
                );

            if (this.setup.isActionAvailable('file'))
                this.file.show(
                    new Crude.Views.FileModule({ setup: setup })
                );

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});
