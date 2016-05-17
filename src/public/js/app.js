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

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
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

    var template = _.template($('#crude_alertTemplate').html());
    $('#crude_alertContainer').append(template({ type: type, msg: msg }));
};

/**
 * Clears all messages that were shown
 */
Crude.clearAllAlerts = function()
{
    $('#crude_alertContainer').find('#alertList').empty();
},

/**
 * Short for error alert
 */
Crude.showError = function (msg)
{
    Crude.showAlert('danger', msg);
};


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

    var template = _.template($('#crude_modalTemplate').html());

    $('#crude_modalContainer').html(template({
        title: title,
        content: content,
        btnList: btnList
    }));

    var $modal = $('#crude_modalContainer').find('#modalFade');
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

    inputList.each(function() {
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
 * @param  {object} setup
 * @param  {string} attr    - attribute name
 * @param  {object} model   - model data
 * @return {HTML}
 */
Crude.renderInput = function (type, attr, model)
{
    var defaultName = '#crude_textInputTemplate';
    var templateName = _.isUndefined(type)
        ? defaultName
        : '#crude_' + type + 'InputTemplate';

    var templateScript = $(templateName);
    if (templateScript.lenght == 0)
        templateScript = $(defaultName);

    var template = _.template($(templateName).html());

    return template({ attr: attr, model: model });
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

Crude.Models.Setup = Backbone.Model.extend(
{
    idAttribute: 'name',
    defaults:
    {
        name: null,
        title: '',
        column: [],
        addForm: [],
        editForm: [],
        inputType: [],
        actions: [],
        deleteOption: true,
        editOption: true,
        addOption: true,
        modelDefaults: [],
        config: [],

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
        return '/' + this.config('routePrefix') + '/files/' + url;
    },

    containerId: function ()
    {
        return 'crudeSetup_' + this.getName();
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
    },

    serializeData: function ()
    {
        return {
            model: this.model.toJSON(),
            setup: this.setup.toJSON()
        };
    },

    onActionEnd: function (setupName)
    {
        if (this.setup.getName() == setupName)
            this.slideUp();
    },

    onAction: function (setupName, model)
    {
        if (this.setup.getName() == setupName)
            this.setNewModel(model);
    },

    setNewModel: function (model)
    {
        this.$el.parent().slideDown(100);
        this.model = model;
        this.render();
    },

    slideUp: function ()
    {
        this.$el.parent().slideUp(100);
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

Crude.Views.FormModule = Crude.Views.Module.extend(
{
    template: '#crude_formTemplate',
    moduleName: 'form',

    ui: {
        save: '#save',
        cancel: '#cancel',
        input: '.input',
        autocomplete: '.autocomplete',
        datetimepicker: '.datetimepicker',
    },

    onRender: function ()
    {
        this.bindAutocomplete();
        this.bindDatepicker();
    },

    save: function ()
    {
        var data = Crude.getFormValues(this.ui.input);
        this.model.set(data);

        this.saveModel();
    },

    bindAutocomplete: function ()
    {
        var setup = this.setup;
        var model = this.model;
        this.ui.autocomplete.each(function ()
        {
            var $el = $(this);
            var $valueEl = $($el.siblings('.autocompleteValue')[0]);
            var name = setup.getName();
            var attr = $el.data('attr');

            $.post(
                setup.autocompleteRoute('label'),
                {
                    crudeName: name,
                    attr: attr,
                    value: model.get(attr)
                },
                function (response) {
                    $el.val(response);
                }
            );

            var updateAutocompleteValues = function (el, valueEl)
            {
                $el.val(el);
                $valueEl.val(valueEl);
                $valueEl.trigger('change');
                return;
            };

            $el.autocomplete({
                source: setup.autocompleteRoute('get/' + name + '/' + attr),
                change: function(event, ui)
                {
                    if ($el.val() == '')
                        $valueEl.val('');
                    $valueEl.trigger('change');
                },
                response: function(event, ui) {
                    Crude.data.autocomplete = ui.content;
                },
                close: function(event, ui) {
                    var selected = _.findWhere(Crude.data.autocomplete, {label: $el.val()});

                    if (_.isUndefined(selected))
                        return updateAutocompleteValues('', '');

                    updateAutocompleteValues(selected.label, selected.id);
                }
            });
        });
    },



    bindDatepicker: function ()
    {
        this.ui.datetimepicker.datetimepicker({
            language: 'pl',
            format: 'YYYY-MM-DD hh:mm:00',
            pickerPosition: "bottom-left",
            pickSeconds: true,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        });
    }
});

Crude.Views.FileModule = Crude.Views.Module.extend(
{
    template: '#crude_fileTemplate',
    moduleName: 'file',

    dropzone: '',
    uploadSuccessfull: true,
    errorMesssages: [],

    ui: {
        save: '#save',
        cancel: '#cancel',
        uploadFileDropzone: '#upload_file_dropzone'
    },

    save: function()
    {
        this.dropzone.processQueue();
    },

    onRender: function()
    {
        var that = this;
        this.ui.uploadFileDropzone.dropzone({
            headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: that.setup.filesRoute('upload'),
            previewTemplate: $('#crude_dropzoneTemplate').html(),
            maxFiles: 10,
            parallelUploads: 10,
            uploadMultiple: true,
            autoProcessQueue: false,
            init: function()
            {
                that.dropzone = this;

                this.on("success", function(file, response)
                {
                    if (! response.success) {
                        that.uploadSuccessfull = false;
                        that.errorMessages = response.errors.file;
                        return;
                    }
                    that.setup.triggerNextAction(that.model);
                });

                this.on("queuecomplete", function()
                {
                    if (! that.uploadSuccessfull) {
                        _.each(that.errorMessages, function(error){
                            that.dropzone.removeAllFiles();
                            Crude.showError(error);
                        });

                        that.errorMessages = [];
                        return;
                    }

                    that.slideUp();
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('serverPath')){
                        $.ajax({
                            dataType: "json",
                            type: 'delete',
                            url: that.setup.filesRoute('delete'),
                            data: {
                                file_path   : file.serverPath,
                                file_log_id : file.fileLogId
                            },
                            success: function(response){
                                that.model = response.model;
                                that.setup.triggerNextAction(that.model);
                            }
                        });
                    }
                });

                _.each(that.model.get('files'), function(file, key) {
                    var dzFile = {
                        name: file.file_original_name,
                        thumb: file.path,
                        serverPath: file.path,
                        fileLogId: file.file_log_id
                    };
                    that.dropzone.emit("addedfile", dzFile);
                    that.dropzone.createThumbnailFromUrl(dzFile, dzFile.serverPath);

                    var existingFileCount = 1; // The number of files already uploaded
                    that.dropzone.options.maxFiles = that.dropzone.options.maxFiles - existingFileCount;
                });
            },
            sending: function(file, xhr, formData) {
                formData.append("crudeName", that.setup.getName());
                formData.append("modelId", that.model.id);
            },
            maxfilesexceeded: function(file) {
                this.removeAllFiles();
                this.addFile(file);
            }
        });
    },
});

Crude.Views.MapModule = Crude.Views.Module.extend(
{
    template: '#crude_mapTemplate',
    moduleName: 'map',

    map: null,
    geocoder: null,
    selectedLocation: null,

    ui: {
        save: '#save',
        cancel: '#cancel',
        input: '.input',
        'mapContainer': '#mapContainer',
        'info': '#info',
        'position': '#position',
        'search': '#search',
    },

    onRender: function ()
    {
        this.initMap();
    },

    save: function ()
    {
        this.saveModel();
    },

    initMap: function () {
        this.map = new google.maps.Map(document.getElementById('mapContainer'), {
            center: this.model.getLatLngObject(),
            zoom: 6
        });
        var marker = new google.maps.Marker({
            map: this.map,
            position: this.model.getLatLngObject(),
        });

        this.showSelectedLocation();

        this.map.addListener('click', function(event) {
            this.model.set('lat', event.latLng.lat());
            this.model.set('lng', event.latLng.lng());
            this.showSelectedLocation();

            marker.setPosition(this.model.getLatLngObject());
        }.bind(this));

        this.bindSearch();
    },

    showSelectedLocation: function()
    {
        this.ui.position.html(this.model.get('lat') + ' x ' + this.model.get('lng'));

        var geocoder = new google.maps.Geocoder;

        geocoder.geocode({'location': this.model.getLatLngObject()}, function(results, status) {
            this.ui.info.html('');

            if (status !== google.maps.GeocoderStatus.OK)
                return;

            this.ui.info.html(results[0].formatted_address);
            this.model.set('address', results[0].formatted_address);
        }.bind(this));
    },

    /**
     * Example from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
     */
    bindSearch: function()
    {
        var input = this.ui.search[0];
        var map = this.map;

        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        }.bind(this));

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    },
});

Crude.Views.ListItem = Backbone.Marionette.ItemView.extend(
{
    template: '#crude_listItemTemplate',
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
            Crude.getTrans('crude.confirm_delete', 'title'),
            Crude.getTrans('crude.confirm_delete', 'content'),
            {
                cancel: Crude.getTrans('crude.confirm_delete', 'cancel'),
                delete: Crude.getTrans('crude.confirm_delete', 'confirm')
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
    template: '#crude_listEmptyTemplate',
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
    template: '#crude_listTemplate',
    childView: Crude.Views.ListItem,
    emptyView: Crude.Views.ListEmpty,
    childViewContainer: '#childViewContainer',
    tagName: 'table',
    className: 'table table-hover',

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

Crude.Views.Layout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: 'container m-lg-t',

    firstRender: true,
    title: '',

    regions: {
        'list': '#listRegion',
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
    },

    serializeData: function()
    {
        return {
            title: this.setup.get('title')
        };
    },

    onRender: function()
    {
        if (this.firstRender) {
            var setup = this.setup;

            this.list.show(
                new Crude.Views.List({ setup: setup })
            );

            if (this.setup.isActionAvailable('form'))
                this.form.show(
                    new Crude.Views.FormModule({ setup: setup })
                );

            if (this.setup.isActionAvailable('file'))
                this.file.show(
                    new Crude.Views.FileModule({ setup: setup })
                );

            if (this.setup.isActionAvailable('map'))
                this.map.show(
                    new Crude.Views.MapModule({ setup: setup })
                );

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});

$(function()
{
    var crudeSetup = Crude.getData('crudeSetup', []);
    var $crudeContainer = $('#crudeContainer');

    _.each(crudeSetup, function(setup)
    {
        var setup = new Crude.Models.Setup(setup);

        $crudeContainer.append(
            '<div id="' + setup.containerId() + '" class="container"></div>'
        );

        var view = new Crude.Views.Layout({
            el: '#' + setup.containerId(),
            setup: setup
        });
        view.render();
    });
});

//# sourceMappingURL=app.js.map
