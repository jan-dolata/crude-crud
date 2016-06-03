Crude.Models.Base = Backbone.Model.extend
    parse: (response, options) ->
        return response.data.model if response.data && response.data.model
        response

    getLatLngObject: ->
        lat: parseFloat @get 'lat'
        lng: parseFloat @get 'lng'

Crude.Collections.Base = Backbone.Collection.extend
    sort:
        attr: 'id',
        order: 'asc'

    pagination:
        page: 1,
        numRows: 20,
        numPages: 1,
        count: 0,

    search:
        attr: 'id',
        value: ''

    changeSortOptions: (attr) ->
        return @toggleSortOrder() if @sort.attr == attr
        @sort.attr = attr;
        @sort.order = 'asc';
        @

    toggleSortOrder: ->
        @sort.order = 'asc' if @sort.order == 'desc'
        @sort.order = 'desc' if @sort.order == 'asc'
        @

    fetchWithOptions: ->
        @.fetch data:
            sortAttr: @sort.attr,
            sortOrder: @sort.order,
            page: @pagination.page,
            numRows: @pagination.numRows,
            searchAttr: @search.attr,
            searchValue: @search.value

    parse: (response, options) ->
        return response if not response.data
        data = response.data
        @sort = data.sort if data.sort
        @pagination = data.pagination if data.pagination
        @search = data.search if data.search
        data.collection if data.collection

Crude.Models.Setup = Backbone.Model.extend
    idAttribute: 'name'
    defaults:
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
        config: [],
        filters: [],
        actionToTrigger: []

    getName: ->
        @.get 'name'

    config: (attr) ->
        config = @get 'config'
        return config[attr]

    route: (a,b) ->
        '/' + @config('routePrefix') + '/' + a + '/' + b

    apiRoute: ->
        @route 'api', @getName()

    autocompleteRoute: (url) ->
        @route 'autocomplete',url

    filesRoute: (url) ->
        @route 'file', url;

    containerId: () ->
        'crudeSetup_' + @getName()

    getColumnFormat: (attr) ->
        columnFormat = @get 'columnFormat'
        return columnFormat[attr] if attr in columnFormat
        type: 'text'

    getNewCollection: ->
        apiRoute = @apiRoute()
        defaults = @get 'modelDefaults'

        model = Crude.Models.Base.extend
            urlRoot: apiRoute
            defaults: defaults

        collection = Crude.Collections.Base.extend
            model: model
            url: apiRoute

        new collection

    getNewModel: ->
        apiRoute = @apiRoute()
        defaults = @get 'modelDefaults'

        model = Crude.Models.Base.extend
            urlRoot: apiRoute
            defaults: defaults

        new model;

    isActionAvailable: (action) ->
        action in @get 'actions'

    getNextAction: (action) ->
        index = indexOf @get('actions'), action
        next = @get('actions')[index + 1];
        return '' if _.isUndefined(next)
        next

    trigger: (action, attr, attr2, ...) ->
       Crude.vent.trigger action, attr, attr2 if attr2?
       Crude.vent.trigger action, attr if attr?
       Crude.vent.trigger action

    triggerAction: (actionToTrigger, model) ->
        actionToTrigger = [actionToTrigger] if not _.isArray(actionToTrigger)

        @set 'actionToTrigger', actionToTrigger
        @trigger 'action_end', this.getName()
        @triggerNextAction model
        @

    # Trigger next action
    triggerNextAction: (model) ->
        Crude.vent.trigger 'item_selected', this.getName()

        actionToTrigger = @get 'actionToTrigger' 
        return @triggerCancel() if actionToTrigger.length == 0

        action = actionToTrigger[0]
        actionToTrigger.shift()
        @trigger 'action_end', @getName()
        @trigger 'action_' + action, @getName(), model
        @

    triggerCancel: ->
        Crude.data.selectedItem = null;
        @trigger 'action_end', @getName()
        @trigger 'action_update', @getName()
        @
