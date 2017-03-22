Crude.Views.FormActions = Backbone.Marionette.ItemView.extend(
{
    template: '#crude_formActionsTemplate',
    tagName:  'div',

    ui: {
        action: '.action',
        customAction: '.customAction'
    },

    events: {
        'click @ui.action': 'action',
        'click @ui.customAction': 'customAction',
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.model = 'model' in options ? options.model : this.setup.getNewModel();

        this.listenTo(Crude.vent, 'action_end', this.render);
        this.listenTo(Crude.vent, 'action_change', this.render);
    },

    serializeData: function ()
    {
        return {
            setup: this.setup,
            model: this.model
        };
    },

    onRender: function ()
    {
        // initialize all tooltips on a page
        this.$('[data-toggle="tooltip"]').tooltip();

        if (this.ui.action.length + this.ui.customAction.length == 1)
            this.ui.action.hide();
    },

    action: function (event)
    {
        $(':focus').blur();

        var target = $(event.target);
        if (! target.hasClass('action'))
            target = target.parents('.action');

        var action = target.data('action');
        this.setup.triggerAction(action, this.model, '#' + this.setup.formContainerId());
    },

    customAction: function (event)
    {
        $(':focus').blur();

        var target = $(event.target);
        if (! target.hasClass('customAction'))
            target = target.parents('.customAction');

        var alertContainer = $('#' + this.setup.formContainerId()).find('#alertContainer');
        var action = target.data('action');
        var id = this.model.get('id');

        var that = this;
        $.ajax(
        {
            url: that.setup.customActionRoute(action, id),
            type: 'get',
            success: function(response)
            {
                Crude.showAlert('success', response.data.message, alertContainer);
                Crude.vent.trigger('action_update', that.setup.getName());
            },
            error: function(response)
            {
                that.setup.onAjaxFail(response, alertContainer);
            }
        });
    },
});

Crude.Views.FormLayout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_formLayoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        actions: '#actionsRegion',
        form: '#formRegion',
        map: '#mapRegion',
        file: '#fileRegion',
        thumbnail: '#thumbnailRegion'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.model = this.setup.getNewModel().set(options.modelData);
    },

    serializeData: function ()
    {
        return {
            setup: this.setup,
            model: this.model
        };
    },

    onRender: function ()
    {
        if (this.firstRender) {
            var data = {
                setup: this.setup,
                slideUpAllow: false,
                unlockCancel: true
            };

            this.actions.show(
                new Crude.Views.FormActions({
                    setup: this.setup,
                    model: this.model
                })
            );

            if (this.setup.isActionAvailable('form')) {
                this.form.show(
                    new Crude.Views.FormModule(data)
                );
            }

            if (this.setup.isActionAvailable('file')) {
                this.file.show(
                    new Crude.Views.FileModule(data)
                );
            }

            if (this.setup.isActionAvailable('map')) {
                this.map.show(
                    new Crude.Views.MapModule(data)
                );
            }

            if (this.setup.isActionAvailable('thumbnail')) {
                this.thumbnail.show(
                    new Crude.Views.ThumbnailModule(data)
                );
            }

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        this.$('[data-toggle="tooltip"]').tooltip();

        this.setup.triggerAction(_.clone(this.setup.get('actions')), this.model, this.el);
    },

});
