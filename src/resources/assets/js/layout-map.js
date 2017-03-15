Crude.Views.MapLayout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_mapLayoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        map:            '#mapRegion',
        richFilters:    '#richFiltersRegion'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
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

            this.map.show(
                new Crude.Views.Map({ setup: setup })
            );

            if (! _.isEmpty(setup.get('richFilters')))
                this.richFilters.show(
                    new Crude.Views.RichFilterList({ setup: setup })
                );

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});
