Crude = {
    Models: {},
    Views: {},
    Collections: {},

    /**
     * Event agregator
     * @type Object
     */
    vent: _.extend({}, Backbone.Events),

    /**
     * Translations
     * @type Object
     */
    trans: {},

    /**
     * Data
     * @type Object
     */
    data: {},
};

app = new Backbone.Marionette.Application();

app.addInitializer(function(options)
{
    Backbone.history.start();
});

$(function()
{
    app.start();
});


/**
 * Get data from Crude.data
 * @param  string key
 * @param  mixed  defaultValue
 * @return mixed
 */
Crude.getData = function(key, defaultValue)
{
    if (_.isUndefined('undefined'))
        defaultValue = null;

    if (_.isUndefined(this.data[key]))
        return defaultValue;

    return this.data[key];
};

/**
 * Get trans from Crude.trans
 * @param  string key
 * @param  string secondKey
 * @return mixed
 */
Crude.getTrans = function(key, secondKey)
{
    if (_.isUndefined(secondKey)) {
        if (_.isUndefined(this.trans[key]))
            return key;

        return this.trans[key];
    }

    if (_.isUndefined(this.trans[key][secondKey]))
        return String(key) + String(secondKey);

    return this.trans[key][secondKey];
};

/**
 * Show alert
 * @param {string} type - info / danger / warning / success
 * @param {string} msg
 */
Crude.showAlert = function (type, msg)
{
    if (String(msg) == '')
        return;

    if (! jQuery.inArray( type, ['info', 'danger', 'warning', 'success'] ))
        type = 'info';

    var template = _.template($('#alertTemplate').html());
    $('#alertContainer').find('#alertList').append(template({ type: type, msg: msg }));
};

/**
 * Clears all messages that were shown
 */
Crude.clearAllAlerts = function()
{
    $('#alertContainer').find('#alertList').empty();
},

/**
 * Show modal
 * @param  {string} title
 * @param  {string} content
 * @param  {array} btnList
 * @return {JQuery Modal}
 */
Crude.showModal = function (title, content, btnList)
{
    if(title == '')
        title = '&nbsp;';

    var template = _.template($('#modalTemplate').html());

    $('#modalContainer').html(template({
        title: title,
        content: content,
        btnList: btnList
    }));

    var $modal = $('#modalFade');
    var $footer = $modal.find('.modal-footer');
    $modal.modal('show');

    $modal.on("shown.bs.modal", function(event)
    {
        $modal.find('.btn:first').focus();
    });

    $modal.on('hidden.bs.modal', function (event)
    {
        $modal.off('hidden.bs.modal');
        $modal.remove();
    });

    return $modal;
};

/**
 * Get values from input list
 * @param  {JQuery object collection} inputList
 * @return {array}
 */
Crude.getFormValues = function (inputList)
{
    var values = {};

    inputList.each( function() {
        var $this = $(this);

        values[$this.data('attr')] = $this.attr('type') == 'checkbox'
            ? $this.is(':checked')
            : $this.val();
    });

    return values;
};

/**
 * Get attribute label from 'validation.attributes' trans
 * @param  {string} attr - attribute name
 * @return {string}      - label
 */
Crude.getAttrName = function (attr)
{
    return Crude.getTrans('validation.attributes', attr);
};

/**
 * Render input
 * @param  {object} section
 * @param  {string} attr    - attribute name
 * @param  {object} model   - model data
 * @return {HTML}
 */
Crude.renderInput = function (section, attr, model)
{
    var defaultName = '#textInputTemplate';

    var type = section.inputType[attr];
    var templateName = _.isUndefined(type)
        ? defaultName
        : '#' + type + 'InputTemplate';

    var templateScript = $(templateName);
    if (templateScript.lenght == 0)
        templateScript = $(defaultName);

    var template = _.template($(templateName).html());

    return template({ section: section, attr: attr, model: model });
};

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
    }
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

Crude.Models.setup = Backbone.Model.extend(
{
    idAttribute: 'name',
    defaults:
    {
        name: null,
        column: [],
        addForm: [],
        editForm: [],
        inputType: [],
        actions: [],
        deleteOption: true,
        actionToTrigger: [],
        config: []
    },

    getName: function()
    {
        return this.get('name');
    },

    config: function(attr)
    {
        var config = this.get('config');
        return config[attr];
    },

    apiRoute: function()
    {
        return this.config('routePrefix') + '/api/' + this.getName();
    },

    getNewCollection: function ()
    {
        var apiRoute = this.apiRoute();

        var model = Crude.Models.Base.extend({
            urlRoot: apiRoute
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

        var model = Crude.Models.Base.extend({
            urlRoot: apiRoute
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

        this.set('actionToTrigger', actionToTrigger);
        Crude.vent.trigger('action_end', this.getName());
        this.triggerNextAction(model);
    },

    /**
     * Trigger next action
     */
    triggerNextAction: function (model)
    {
        Crude.vent.trigger('item_selected');

        var actionToTrigger = this.get('actionToTrigger');
        if (actionToTrigger.length == 0) {
            this.triggerCancel();
            return;
        }

        var action = actionToTrigger[0];
        actionToTrigger.shift();
        Crude.vent.trigger('action_end', this.getName());
        Crude.vent.trigger('action_' + action, this.getName(), model);
    },

    triggerCancel: function ()
    {
        Crude.vent.trigger('action_end', this.getName());
        Crude.vent.trigger('action_update', this.getName());
    },
});

Crude.Views.ListItem = Backbone.Marionette.ItemView.extend(
{
    template: '#listItemTemplate',
    tagName: 'tr',

    className: function ()
    {
        return Crude.data.selectedItem == this.model.get('id') ? 'active' : '';
    },

    ui: {
        action: '.action',
        delete: '#delete'
    },

    events: {
        'click @ui.action': 'action',
        'click @ui.delete': 'delete'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.listenTo(Crude.vent, 'item_selected', this.itemSelected);
    },

    serializeData: function ()
    {
        return {
            model: this.model,
            setup: this.setup
        };
    },

    action: function (event)
    {
        Crude.data.selectedItem = this.model.get('id');
        var action = $(event.target).data('action');
        this.setup.triggerAction(action, this.model);
    },

    itemSelected: function (setupName)
    {
        if (this.setup.getName() != setupName)
            return;

        if (this.model.get('id') == Crude.data.selectedItem)
            this.$el.addClass('active');
        else
            this.$el.removeClass('active');
    },

    delete: function ()
    {
        $modal = Crude.showModal(
            Crude.getTrans('admin.confirm_delete', 'title'),
            Crude.getTrans('admin.confirm_delete', 'content'),
            {
                cancel: Crude.getTrans('admin.confirm_delete', 'cancel'),
                delete: Crude.getTrans('admin.confirm_delete', 'confirm')
            }
        );

        $modal.find('[data-key="delete"]').bind('click', function (event)
        {
            this.model.destroy({wait: true})
                .done(function(response) {
                    if ('message' in  response)
                        Crude.showAlert('success', response.message);

                    $modal.modal('hide');
                }.bind(this))
                .fail(function(response) {
                    var responseTextJSON = JSON.parse(response.responseText);

                    if (response.status == 422) {
                        errors = _.values(responseTextJSON).join('<br>');
                        Crude.showAlert('danger', errors);
                    }

                    if (response.status == 403)
                        Crude.showAlert('danger', responseTextJSON.error.message);

                    $modal.modal('hide');
                    this.setup.triggerCancel();
                }.bind(this));
        }.bind(this));

    },
});

Crude.Views.ListEmpty = Backbone.Marionette.ItemView.extend(
{
    template: '#listEmptyTemplate',
    tagName: 'tr',

    initialize: function (options)
    {
        this.setup = options.setup;
    },

    serializeData: function ()
    {
        return {
            setup: this.setup
        };
    },
});

Crude.Views.List = Backbone.Marionette.CompositeView.extend(
{
    template: '#listTemplate',
    childView: Crude.Views.ListItem,
    emptyView: Crude.Views.ListEmpty,
    childViewContainer: '#childViewContainer',

    ui: {
        add: '#add',
        sort: '.sort',

        changeNumRows: '.changeNumRows',

        changePage: '.changePage',

        changeSearchAttr: '.changeSearchAttr',
        searchValue: '#searchValue',
        search: '#search',
        selectedSearchAttr: '#selectedSearchAttr',
        clearSearch: '#clearSearch'
    },

    events: {
        'click @ui.add': 'add',
        'click @ui.sort': 'sort',
        'click @ui.changeNumRows': 'changeNumRows',
        'click @ui.changePage': 'changePage',
        'click @ui.changeSearchAttr': 'changeSearchAttr',
        'click @ui.search': 'search',
        'click @ui.clearSearch': 'clearSearch'
    },

    initialize: function (options)
    {
        this.setup = options.setup;

        this.collection = this.setup.getNewCollection();

        this.updateList();
        this.listenTo(Crude.vent, 'action_update', this.updateThisList);
    },

    childViewOptions: function ()
    {
        return {
            setup: this.setup
        };
    },

    serializeData: function ()
    {
        return {
            setup: this.setup,
            sort: this.collection.sort,
            pagination: this.collection.pagination,
            search: this.collection.search
        };
    },

    add: function ()
    {
        Crude.data.selectedItem = null;
        this.setup.triggerAction(_.clone(this.setup.get('actions')), this.setup.getNewModel());
    },

    sort: function (event)
    {
        var $target = $(event.target);
        if (! $target.hasClass('sort'))
            $target = $target.parents('.sort');

        this.collection.changeSortOptions($target.data('attr'));
        this.updateList();
    },

    changeNumRows: function (event)
    {
        var $target = $(event.target);
        this.collection.pagination.numRows = $target.html();
        this.updateList();
    },

    changePage: function ()
    {
        var $target = $(event.target);
        this.collection.pagination.page = $target.html();
        this.updateList();
    },

    changeSearchAttr: function (event)
    {
        var $target = $(event.target);

        this.collection.search.attr = $target.data('attr');
        this.ui.selectedSearchAttr.html($target.html());
    },

    search: function ()
    {
        this.collection.search.value = this.ui.searchValue.val();
        this.updateList();
    },

    clearSearch: function ()
    {
        this.collection.search.attr = 'id',
        this.collection.search.value = '';
        this.updateList();
    },

    updateList: function ()
    {
        this.collection.fetchWithOptions().done(function ()
        {
            Crude.data.selectedItem = null;
            this.render();
        }.bind(this));
    },

    updateThisList: function (setupName)
    {
        if (this.setup.getName() == setupName)
            this.updateList();
    },
});


//# sourceMappingURL=app.js.map
