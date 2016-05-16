Crude.Views.Layout = Backbone.Marionette.Layout.extend(
{
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: 'container m-lg-t',

    firstRender: true,
    title: '',

    regions: {
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
            title: ''
        };
    },

    onRender: function()
    {
        if (this.firstRender) {
            for (var key in this.view) {
                var regionName = key + 'Region';
                this.addRegion(regionName, '#' + regionName);
                this.getRegion(regionName).show(this.view[key]);
            }

            if (this.setup.isActionAvailable('form'))
                this.regions.form.show(
                    new Global.Views.FormModule({ setup: this.setup })
                );

            if (this.setup.isActionAvailable('map'))
                this.regions.map.show(
                    new Global.Views.MapModule({ setup: this.setup })
                );

            if (this.setup.isActionAvailable('file'))
                this.regions.file.show(
                    new Global.Views.FileModule({ setup: this.setup })
                );

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});
