Crude.Models.Base = Backbone.Model.extend(
{
    parse: function(response, options)
    {
        return response.data && response.data.model
            ? response.data.model       // after model update
            : response;                 // after fetch / reset collection
    },

    getLatLngObject: function()
    {
        return {
            lat: parseFloat(this.get('lat')),
            lng: parseFloat(this.get('lng'))
        };
    },

    isCustomActionAvailable: function(action)
    {
        return this.get(action + 'CustomActionAvailable');
    },
});

Crude.Collections.Base = Backbone.Collection.extend(
{
    sort: {
        attr: 'id',
        order: 'asc'
    },

    pagination: {
        page: 1,
        numRows: 20,
        numPages: 1,
        count: 0,
    },

    search: {
        attr: 'id',
        value: ''
    },

    changeSortOptions: function (attr)
    {
        if (this.sort.attr == attr) {
            this.sort.order = this.sort.order == 'asc' ? 'desc' : 'asc';
            return;
        }

        this.sort.attr = attr;
        this.sort.order = 'asc';
    },

    fetchWithOptions: function ()
    {
        return this.fetch({data: {
            sortAttr: this.sort.attr,
            sortOrder: this.sort.order,
            page: this.pagination.page,
            numRows: this.pagination.numRows,
            searchAttr: this.search.attr,
            searchValue: this.search.value
        }});
    },

    parse: function(response, options)
    {
        if(! response.data)
            return response;

        if(response.data.sort)
            this.sort = response.data.sort;
        if(response.data.pagination)
            this.pagination = response.data.pagination;
        if(response.data.search)
            this.search = response.data.search;

        if(response.data.collection)
            return response.data.collection;
    }
});

Crude.Models.Setup = Backbone.Model.extend(
{
    idAttribute: 'name',
    defaults:
    {
        name: null,
        title: '',
        column: [],
        columnFormat: [],
        addForm: [],
        editForm: [],
        inputType: [],
        actions: [],
        deleteOption: true,
        editOption: true,
        addOption: true,
        modelDefaults: [],
        selectOptions: [],
        customeActions: [],
        config: [],
        filters: [],
        trans: [],
        moduleInPopup: false,

        actionToTrigger: []
    },

    getName: function ()
    {
        return this.get('name');
    },

    config: function (attr)
    {
        var config = this.get('config');
        return config[attr];
    },

    apiRoute: function ()
    {
        return '/' + this.config('routePrefix') + '/api/' + this.getName();
    },

    autocompleteRoute: function(url)
    {
        return '/' + this.config('routePrefix') + '/autocomplete/' + url;
    },

    filesRoute: function (url)
    {
        return '/' + this.config('routePrefix') + '/file/' + url;
    },

    customActionRoute: function (action, id)
    {
        return '/' + this.config('routePrefix') + '/custom-action/' + this.getName() + '/' + action + '/' + id;
    },

    containerId: function ()
    {
        return 'crudeSetup_' + this.getName();
    },

    getColumnFormat: function(attr)
    {
        var columnFormat = this.get('columnFormat');

        return attr in columnFormat
            ? columnFormat[attr]
            : {type: 'text'};
    },

    getNewCollection: function ()
    {
        var apiRoute = this.apiRoute();
        var defaults = this.get('modelDefaults');

        var model = Crude.Models.Base.extend({
            urlRoot: apiRoute,
            defaults: defaults
        });
        var collection = Crude.Collections.Base.extend({
            model: model,
            url: apiRoute
        });

        return new collection;
    },

    getNewModel: function ()
    {
        var apiRoute = this.apiRoute();
        var defaults = this.get('modelDefaults');

        var model = Crude.Models.Base.extend({
            urlRoot: apiRoute,
            defaults: defaults
        });

        return new model;
    },

    isActionAvailable: function (action)
    {
        return _.indexOf(this.get('actions'), action) != -1;
    },

    getNextAction: function (action)
    {
        var index = _.indexOf(this.get('actions'), action) + 1;
        var next = this.get('actions')[index];
        return _.isUndefined(next) ? '' : next;
    },

    triggerAction: function (actionToTrigger, model)
    {
        if (! _.isArray(actionToTrigger))
            actionToTrigger = [actionToTrigger];

        $('html, body').animate({
            scrollTop: $('#' + this.containerId()).offset().top - 200
        }, 500);

        this.set('actionToTrigger', actionToTrigger);
        Crude.vent.trigger('action_end', this.getName());
        this.triggerNextAction(model);
    },

    /**
     * Trigger next action
     */
    triggerNextAction: function (model)
    {
        Crude.vent.trigger('item_selected', this.getName());

        var actionToTrigger = this.get('actionToTrigger');
        if (actionToTrigger.length == 0) {
            this.triggerCancel();
            return;
        }

        var action = actionToTrigger[0];
        actionToTrigger.shift();
        Crude.vent.trigger('action_change', this.getName());
        Crude.vent.trigger('action_' + action, this.getName(), model);
    },

    triggerCancel: function ()
    {
        Crude.data.selectedItem = null;
        Crude.vent.trigger('action_end', this.getName());
        Crude.vent.trigger('action_update', this.getName());
    },

    getAttrName: function (attr)
    {
        var trans = this.get('trans');

        if (attr in trans)
            return trans[attr];

        return Crude.getAttrName(attr);
    },

    onAjaxFail: function(response, alertContainer)
    {
        if (! this.IsJsonString(response.responseText)) {
            Crude.showAlert('danger', response.responseText, alertContainer);
            return;
        }

        var responseTextJSON = JSON.parse(response.responseText);

        if (response.status == 422) {
            var msg = _.values(responseTextJSON).join('<br>');
            Crude.showError(msg, alertContainer);
        }

        if (response.status == 403) {
            var msg = responseTextJSON.error.message;
            Crude.showError(msg, alertContainer);
            this.setup.triggerCancel();
        }
    },

    IsJsonString: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
});
