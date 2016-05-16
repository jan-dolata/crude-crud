Crude.Views.Layout = Backbone.Marionette.LayoutView.extend(
{
    el: '#layoutContainer',
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion'
    },

    initialize: function (options)
    {
        this.title = options.title;

        var views = [], view;
        this.collection.each(function (model)
        {
            view = new Global.Views[model.getViewName()]({
                settings: model
            });

            views[model.get('key')] = view;
        });
        this.view = views;

        this.listenTo(Global.vent, 'sectionLinkClick', this.sectionLinkClick);
    },

    serializeData: function()
    {
        return {
            title: this.title
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

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },

    sectionLinkClick: function(sectionId)
    {
        if (this.$el.selector == sectionId && this.hideMode)
            this.showBody();

        // hide other tabs after select from tabs nav
        // if (this.$el.selector != sectionId && ! this.hideMode)
        //     this.hideBody();
    },

    togglePanelBody: function (event)
    {
        if (! this.toggle)
            return;

        if (this.hideMode)
            this.showBody();
        else
            this.hideBody();
    },

    hideBody: function ()
    {
        this.hideMode = true;
        this.ui.panelBody.slideUp(200);
        this.ui.togglePanelBody.find('.fa').removeClass('fa-chevron-up');
        this.ui.togglePanelBody.find('.fa').addClass('fa-chevron-down');
    },

    showBody: function ()
    {
        this.hideMode = false;
        this.ui.panelBody.slideDown(200);
        this.ui.togglePanelBody.find('.fa').removeClass('fa-chevron-down');
        this.ui.togglePanelBody.find('.fa').addClass('fa-chevron-up');
    },
});
