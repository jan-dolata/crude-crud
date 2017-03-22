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
            lat: parseFloat(this.get('map_lat')),
            lng: parseFloat(this.get('map_lng'))
        };
    },

    hasLatLngObject: function()
    {
        return ! _.isNaN(this.getLatLngObject().lat)
            && ! _.isNaN(this.getLatLngObject().lng);
    },

    isCustomActionAvailable: function(action)
    {
        return this.get(action + 'CustomActionAvailable');
    },
});

Crude.Collections.Base = Backbone.Collection.extend(
{
    sortAttributes: {
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

    richFilters: {},

    changeSortOptions: function (attr)
    {
        if (this.sortAttributes.attr == attr) {
            this.sortAttributes.order = this.sortAttributes.order == 'asc' ? 'desc' : 'asc';
            return;
        }

        this.sortAttributes.attr = attr;
        this.sortAttributes.order = 'asc';
    },

    fetchWithOptions: function ()
    {
        return this.fetch({data: {
            sortAttr: this.sortAttributes.attr,
            sortOrder: this.sortAttributes.order,
            page: this.pagination.page,
            numRows: this.pagination.numRows,
            searchAttr: this.search.attr,
            searchValue: this.search.value,
            richFilters: this.richFilters
        }});
    },

    parse: function(response, options)
    {
        if(! response.data)
            return response;

        if(response.data.sortAttributes)
            this.sortAttributes = response.data.sort;
        if(response.data.pagination)
            this.pagination = response.data.pagination;
        if(response.data.search)
            this.search = response.data.search;

        if(response.data.richFilters)
            this.richFilters = response.data.richFilters;

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
        description: '',
        column: [],
        extraColumn: {},
        columnFormat: [],
        addForm: [],
        editForm: [],
        inputType: [],
        actions: [],
        deleteOption: true,
        editOption: true,
        addOption: true,
        orderOption: true,
        exportOption: true,
        modelDefaults: [],
        selectOptions: [],
        customeActions: [],
        config: [],
        filters: [],
        richFilters: [],
        showFilters: true,
        trans: [],
        moduleInPopup: false,
        panelView: false,
        checkboxColumn: false,
        orderParameters: {
            idAttr: 'id',
            orderAttr: 'order',
            labelAttr: 'name',
            sortAttr: 'id'
        },

        actionToTrigger: [],
        interfaceTrans: {}
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

    interfaceTrans: function (key, key2)
    {
        return _.isUndefined(key2)
            ? this.get('interfaceTrans')[key]
            : this.get('interfaceTrans')[key][key2];
    },

    baseRoute: function (name, uri)
    {
        return '/' + this.config('routePrefix') + '/' + name + '/' + uri;
    },

    apiRoute: function ()
    {
        return this.baseRoute('api', this.getName());
    },

    autocompleteRoute: function(url)
    {
        return this.baseRoute('autocomplete', url);
    },

    filesRoute: function (url)
    {
        return this.baseRoute('file', url);
    },

    thumbnailRoute: function (url)
    {
        return this.baseRoute('thumbnail', url);
    },

    customActionRoute: function (action, id)
    {
        return this.baseRoute('custom-action', this.getName() + '/' + action + '/' + id);
    },

    orderedListRoute: function ()
    {
        return this.baseRoute('ordered-list', this.getName());
    },

    containerId: function ()
    {
        return 'crudeSetup_' + this.getName();
    },

    formContainerId: function ()
    {
        return 'crudeForm_' + this.getName();
    },

    mapContainerId: function ()
    {
        return 'crudeMap_' + this.getName();
    },

    getVisibleColumns: function ()
    {
        var columns = this.get('column');
        var extraColumns = this.get('extraColumn');

        if (_.isEmpty(extraColumns))
            return columns;

        var visibleColumns = [];
        for (var i in columns) {
            var column = columns[i];

            if (! _.isArray(column)) {
                if (! (column in extraColumns) || extraColumns[column].visible)
                    visibleColumns.push(column);
            } else {
                var newItem = [];
                for (var j in column) {
                    var item = column[j];

                    if (! (item in extraColumns) || extraColumns[item].visible)
                        newItem.push(item);
                }

                if (newItem.length)
                    visibleColumns.push(newItem);
            }
        }

        return visibleColumns;
    },

    getColumnFormat: function (attr)
    {
        var columnFormat = this.get('columnFormat');

        return attr in columnFormat
            ? columnFormat[attr]
            : {type: 'default'};
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
            url: apiRoute,
            sortAttributes: {
                attr: this.get('defaultSortAttr'),
                order: this.get('defaultSortOrder')
            },
        });

        var col = new collection;

        // if (this.config('sortAttr') != 'id')
        //     col.changeSortOptions(this.config('sortAttr'));

        return col;
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

    triggerAction: function (actionToTrigger, model, containerId)
    {
        if (! _.isArray(actionToTrigger))
            actionToTrigger = [actionToTrigger];

        $('html, body').animate({
            scrollTop: $(containerId).offset().top - 200
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
    },

    getInputType: function (attr) {
        return this.get('inputType')[attr];
    }
});
