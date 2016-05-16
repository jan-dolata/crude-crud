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
        this.setup = options.setup;
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

            if (this.setup.isActionAvailable('form'))
                new Global.Views.Form({
                    el: '#formContainer',
                    section: section
                }).render();

    if (section.isActionAvailable('map'))
        new Global.Views.Map({
            el: '#mapContainer',
            section: section
        }).render();

    if (section.isActionAvailable('file'))
        new Global.Views.File({
            el: '#fileContainer',
            section: section
        }).render();

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
