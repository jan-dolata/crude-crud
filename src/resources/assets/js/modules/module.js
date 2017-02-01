Crude.Views.Module = Backbone.Marionette.ItemView.extend(
{
    tagName: 'div',
    moduleName: '',
    formIsLocked: false,
    slideUpAllow: true,

    ui: {
        save: '#save',
        cancel: '#cancel',
        input: '.input',
        loader: '#loader'
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
        this.slideUpAllow = 'slideUpAllow' in options ? options.slideUpAllow : this.slideUpAllow;

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
            this.$el.parent().slideDown(100, function () {
                Crude.vent.trigger('slide_down_finished', this.setup.getName());
            }.bind(this));
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
        if (! this.slideUpAllow)
            return;

        this.clearAllAlerts();

        if (this.setup.get('moduleInPopup')) {
            this.$el.parent().hide();
            this.$el.parents('#moduleModal').modal('hide');
            return;
        }

        this.$el.parent().slideUp(100, function () {
            Crude.vent.trigger('slide_up_finished', this.setup.getName());
        }.bind(this));
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
        if (this.formIsLocked)
            return;

        this.clearAllAlerts();
        $(':focus').blur();
        this.lockForm();

        this.model.save()
            .done(function (response) { this.onSaveSuccess(response); }.bind(this))
            .fail(function (response) { this.onSaveFail(response); }.bind(this));
    },

    onSaveSuccess: function (response)
    {
        this.unlockForm();

        if (('data' in response) && ('message' in  response.data))
            this.showMessage(response.data.message);

        if (('data' in response) && ('model' in  response.data))
            this.model.set(response.data.model);

        this.setup.triggerNextAction(this.model);
    },

    onSaveFail: function (response)
    {
        this.unlockForm();

        this.setup.onAjaxFail(response, this.alertContainer());
    },

    lockForm: function()
    {
        this.formIsLocked = true;
        this.ui.loader.show(200);
        this.ui.save.attr('disabled', true);
        this.ui.cancel.attr('disabled', true);
    },

    unlockForm: function()
    {
        this.formIsLocked = false;
        this.ui.loader.hide(200);
        this.ui.save.removeAttr('disabled');
        this.ui.cancel.removeAttr('disabled');
    },
});
