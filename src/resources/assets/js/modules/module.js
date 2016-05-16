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
        this.moduleInitialize();
    },

    moduleInitialize: function (options)
    {
        this.setup = options.setup;
        this.model = this.setup.getNewModel();

        this.listenTo(Global.vent, 'action_' + this.moduleName, this.onAction);
        this.listenTo(Global.vent, 'action_end', this.onActionEnd);
    },

    serializeData: function ()
    {
        return {
            model: this.model.toJSON(),
            setup: this.setup.toJSON()
        };
    },

    onActionEnd: funcion (setupName)
    {
        if (this.setup.getName() == onActionEnd)
            this.slideUp();
    },

    onAction: funcion (setupName, model)
    {
        if (this.setup.getName() == onActionEnd)
            this.setNewModel(model);
    },

    setNewModel: function (model)
    {
        this.$el.slideDown(100);
        this.model = model;
        this.render();
    },

    slideUp: function ()
    {
        this.$el.slideUp(100);
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
                    Crude.showError(_.values(responseTextJSON).join('<br>'));
                }

                if (response.status == 403) {
                    Crude.showError(responseTextJSON.error.message);
                    this.setup.triggerCancel();
                }
            }.bind(this));
    }
});
