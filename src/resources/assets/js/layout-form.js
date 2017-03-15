Crude.Views.FormLayout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_formLayoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion',
        'thumbnail': '#thumbnailRegion'
    },

    ui: {
        'save': '#layoutAction #save'
    },

    events: {
        'click @ui.save': 'save'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.model = this.setup.getNewModel().set(options.modelData);
    },

    serializeData: function()
    {
        return {
            setup: this.setup,
            model: this.model
        };
    },

    onRender: function()
    {
        if (this.firstRender) {
            var data = {
                setup: this.setup,
                model: this.model,
                slideUpAllow: false
            };

            if (this.setup.isActionAvailable('form')) {
                this.form.show(
                    new Crude.Views.FormModule(data)
                );
                $('#formRegion').show();
                $('#formRegion').find('#moduleButtons').hide();
            }

            if (this.setup.isActionAvailable('file')) {
                this.file.show(
                    new Crude.Views.FileModule(data)
                );
                $('#fileRegion').show();
                $('#fileRegion').find('#moduleButtons').hide();
            }

            if (this.setup.isActionAvailable('map')) {
                this.map.show(
                    new Crude.Views.MapModule(data)
                );
                $('#mapRegion').show();
                $('#mapRegion').find('#moduleButtons').hide();
            }

            if (this.setup.isActionAvailable('thumbnail')) {
                this.thumbnail.show(
                    new Crude.Views.ThumbnailModule(data)
                );
                $('#thumbnailRegion').show();
                $('#thumbnailRegion').find('#moduleButtons').hide();
            }

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});
