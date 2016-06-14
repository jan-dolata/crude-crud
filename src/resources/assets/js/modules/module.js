Crude.Views.Module = Backbone.Marionette.ItemView.extend(
{
    tagName: 'div',
    moduleName: '',

    ui: {
        save: '#save',
        cancel: '#cancel',
        input: '.input'
    },

    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'cancel'
    },

    initialize: function (options)
    {
        this.moduleInitialize(options);
    },

    moduleInitialize: function (options)
    {
        this.setup = options.setup;
        this.model = this.setup.getNewModel();

        this.listenTo(Crude.vent, 'action_' + this.moduleName, this.onAction);
        this.listenTo(Crude.vent, 'action_end', this.onActionEnd);
        this.listenTo(Crude.vent, 'action_change', this.onActionChange);
    },

    serializeData: function ()
    {
        return {
            model: this.model.toJSON(),
            setup: this.setup
        };
    },

    onRender: function ()
    {
        this.parentOnRender();
    },

    parentOnRender: function ()
    {
        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },

    onActionEnd: function (setupName)
    {
        if (this.setup.getName() == setupName)
            this.slideUp();
    },

    onActionChange: function (setupName)
    {
        if (this.setup.getName() == setupName)
            this.changeUp();
    },

    onAction: function (setupName, model)
    {
        if (this.setup.getName() == setupName)
            this.setNewModel(model);
    },

    setNewModel: function (model)
    {
        if (! this.setup.get('moduleInPopup')) {
            this.$el.parent().slideDown(100);
        } else {
            this.$el.parent().show();
            this.$el.parents('#moduleModal').modal('show');
        }

        this.model = model;
        this.render();
    },

    alertContainer: function ()
    {
        return $('#' + this.setup.containerId()).find('#alertContainer');
    },

    clearAllAlerts: function ()
    {
        Crude.clearAllAlerts(this.alertContainer());
    },

    showError: function (msg)
    {
        Crude.showError(msg, this.alertContainer());
    },

    showMessage: function (msg)
    {
        Crude.showAlert('success', msg, this.alertContainer());
    },

    slideUp: function ()
    {
        this.clearAllAlerts();

        if (this.setup.get('moduleInPopup')) {
            this.$el.parent().hide();
            this.$el.parents('#moduleModal').modal('hide');
            return;
        }

        this.$el.parent().slideUp(100);
    },

    changeUp: function ()
    {
        this.$el.parent().hide();
    },

    cancel: function ()
    {
        this.setup.triggerCancel();
    },

    saveModel: function (response)
    {
        this.clearAllAlerts();
        $(':focus').blur();

        this.model.save()
            .done(function (response) { this.onSaveSuccess(response); }.bind(this))
            .fail(function (response) { this.onSaveFail(response); }.bind(this));
    },

    onSaveSuccess: function (response)
    {
        if ('message' in  response)
            this.showMessage(response.data.message);

        this.setup.triggerNextAction(this.model);
    },

    onSaveFail: function (response)
    {
        this.setup.onAjaxFail(response, this.alertContainer());
    }
});
