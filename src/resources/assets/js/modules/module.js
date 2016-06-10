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

    alertContainer: function()
    {
        return this.$el.parents('#header').find('#alertContainer');
    },

    slideUp: function ()
    {
        if (this.setup.get('moduleInPopup')) {
            this.$el.parent().hide();
            this.$el.parents('#moduleModal').modal('hide');
            Crude.clearAllAlerts(this.alertContainer());
            return;
        }

        this.$el.parent().slideUp(100);
        Crude.clearAllAlerts(this.alertContainer());
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
        this.model
            .save()
            .done(function(response) {
                if ('message' in  response)
                    Crude.showAlert('success', response.message);

                this.setup.triggerNextAction(this.model);
            }.bind(this))
            .fail(function(response) {
                var responseTextJSON = JSON.parse(response.responseText);

                if (response.status == 422) {
                    var msg = _.values(responseTextJSON).join('<br>');
                    Crude.showError(msg, this.alertContainer());
                }

                if (response.status == 403) {
                    var msg = responseTextJSON.error.message;
                    Crude.showError(msg, this.alertContainer());
                    this.setup.triggerCancel();
                }
            }.bind(this));
    }
});
