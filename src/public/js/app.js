$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

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
    if (_.isUndefined(defaultValue))
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
Crude.showAlert = function (type, msg, $container)
{
    if (_.isUndefined($container))
        $container = $('#crude_alertContainer');

    Crude.showAlertInContainer(type, msg, $container);
};

Crude.showAlertInContainer = function (type, msg, $container)
{
    if (_.isUndefined($container))
        $container = $('#crude_alertContainer');

    if (String(msg) == '')
        return;

    if (! jQuery.inArray( type, ['info', 'danger', 'warning', 'success'] ))
        type = 'info';

    var template = _.template($('#crude_alertTemplate').html());
    $container.append(template({ type: type, msg: msg }));
};

/**
 * Clears all messages that were shown
 */
Crude.clearAllAlerts = function($container)
{
    if (_.isUndefined($container))
        $container = $('#crude_alertContainer');

    $container.empty();
},

/**
 * Short for error alert
 */
Crude.showError = function (msg, $container)
{
    if (_.isUndefined($container))
        $container = $('#crude_alertContainer');

    Crude.showAlertInContainer('danger', msg, $container);
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

        if ($this.attr('type') == 'custom')
            values[$this.data('attr')] = window[$this.data('method')]($this);
        else if ($this.attr('type') == 'checkbox')
            values[$this.data('attr')] = $this.is(':checked');
        else if ($this.attr('type') == 'select')
            values[$this.data('attr')] = $this.find(':selected').val();
        else if ($this.attr('type') == 'json') {
            values[$this.data('attr')] = JSON.parse($this.val());
        }
        else
            values[$this.data('attr')] = $this.val();
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
 * @param  {model} setup
 * @param  {string} attr    - attribute name
 * @param  {object} model   - model data
 * @return {HTML}
 */
Crude.renderInput = function (setup, attr, model)
{
    var defaultName = '#crude_textInputTemplate';
    var type = setup.get('inputType')[attr];
    var templateName = _.isUndefined(type)
        ? defaultName
        : '#crude_' + type + 'InputTemplate';

    var templateScript = $(templateName);
    if (templateScript.lenght == 0)
        templateScript = $(defaultName);

    var template = _.template($(templateName).html());

    return template({
        setup: setup,
        attr: attr,
        model: model
    });
};

Crude.renderCell = function (setup, attr, model)
{
    var defaultName = '#crude_textColumFormatTemplate';
    var format = setup.getColumnFormat(attr);
    var templateName = '#crude_' + format.type + 'ColumnFormatTemplate';

    var templateScript = $(templateName);
    if (templateScript.lenght == 0)
        templateScript = $(defaultName);

    var template = _.template($(templateName).html());

    return template({
        setup: setup,
        format: format,
        attr: attr,
        model: model
    });
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
        if (! this.slideUpAllow)
            return;

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

Crude.Views.FormModule = Crude.Views.Module.extend(
{
    template: '#crude_formTemplate',
    moduleName: 'form',

    ui: {
        save: '#save',
        cancel: '#cancel',
        input: '.input',
        loader: '#loader',
        autocomplete: '.autocomplete',
        datetimepicker: '.datetimepicker',
        showMarkdownPrieview: '.showMarkdownPrieview',
        markdownInput: '.markdownInput'
    },

    onRender: function ()
    {
        this.parentOnRender();
        this.bindAutocomplete();
        this.bindDatepicker();
        this.bindMarkdownPreview();
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

            var updateAutocompleteValues = function (label, id)
            {
                $el.val(label);
                $valueEl.val(id);
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
                        return updateAutocompleteValues($el.val(), '');

                    updateAutocompleteValues(selected.label, selected.id);
                }
            });
        });

        this.ui.autocomplete.blur(function (event)
        {
            var $el = $(this);
            var val = $($el.siblings('.autocompleteValue')[0]).val();
            if (_.isEmpty(val))
                $el.val('');
        });
    },

    bindDatepicker: function ()
    {
        // check default in JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\DateTimePickerOptions
        this.ui.datetimepicker.datetimepicker(
            this.setup.get('dateTimePickerOptions')
        );
    },

    bindMarkdownPreview: function ()
    {
        var md = window.markdownit();

        var updateMarkdownPreview = function (el) {
            var val = $(el).val();
            $(el).parents('.row').find('.markdownPreview').html(md.render(val));
        };

        this.ui.markdownInput.bind('keyup', function () {
            updateMarkdownPreview(this);
        });

        this.ui.markdownInput.bind('click', function () {
            updateMarkdownPreview(this);
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
    maxFiles: 10,
    parallelUploads: 10,
    cleaningUp: false,

    ui: {
        save: '#save',
        cancel: '#cancel',
        loader: '#loader',
        uploadFileDropzone: '#upload_file_dropzone'
    },

    save: function() { },

    initialize: function(options)
    {
        this.moduleInitialize(options);

        this.maxFiles = options.hasOwnProperty("maxFiles") ? options.maxFiles : this.maxFiles;
        this.parallelUploads = options.hasOwnProperty("parallelUploads") ? options.parallelUploads : this.parallelUploads;
    },

    onRender: function()
    {
        this.parentOnRender();

        this.ui.save.hide(100);

        var that = this;
        this.ui.uploadFileDropzone.dropzone({
            headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: that.setup.filesRoute('upload'),
            previewTemplate: $('#crude_dropzoneTemplate').html(),
            maxFiles: that.maxFiles,
            parallelUploads: that.parallelUploads,
            uploadMultiple: true,
            autoProcessQueue: true,
            init: function()
            {
                that.dropzone = this;

                this.on("success", function(file, response)
                {
                    if (response.success && "model" in response && "files" in response.model) {
                        var fileIndex = _.findKey(response.model.files, {'file_original_name': file.name});
                        file.fileLogId = response.model.files[fileIndex].file_log_id;
                    }
                });

                this.on("successmultiple", function(file, response) {
                    if (response.hasOwnProperty("errors")) {
                        that.uploadSuccessfull = false;
                        Crude.showError(response.errors, that.alertContainer());
                    }

                    updateModelFiles(response.model.files);
                    updateFiles();

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('fileLogId') && !that.cleaningUp){
                        $.ajax({
                            dataType: "json",
                            type: 'delete',
                            url: that.setup.filesRoute('delete'),
                            data: {
                                file_path   : file.serverPath,
                                file_log_id : file.fileLogId,
                                crudeName   : that.setup.getName()
                            },
                            success: function(response){
                                updateModelFiles(response.model.files);

                                Crude.vent.trigger('action_update', that.setup.getName());
                            }
                        });
                    }
                });

                var updateModelFiles = function (files) {
                    that.model.set(
                        that.setup.get('fileAttrName'),
                        files
                    );
                };

                var updateFiles = function() {
                    that.cleaningUp = true;
                    that.dropzone.removeAllFiles();
                    that.cleaningUp = false;

                    var files = that.model.get(that.setup.get('fileAttrName'));
                    _.each(files, function(file, key) {
                        var dzFile = {
                            name: file.file_original_name,
                            thumb: file.path,
                            serverPath: file.path,
                            fileLogId: file.file_log_id
                        };
                        that.dropzone.emit("addedfile", dzFile);
                        that.dropzone.createThumbnailFromUrl(dzFile, dzFile.serverPath);
                        that.dropzone.files.push(dzFile);

                        that.dropzone.options.maxFiles = that.maxFiles - files.length;
                    });
                };
                updateFiles();
            },
            sending: function(file, xhr, formData) {
                formData.append("crudeName", that.setup.getName());
                formData.append("modelId", that.model.id);
            },

            dictMaxFilesExceeded: that.setup.get("dropzoneTrans")["dictMaxFilesExceeded"]
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
        loader: '#loader',
        'mapContainer': '#mapContainer',
        'info': '#info',
        'position': '#position',
        'search': '#search',
    },

    onRender: function ()
    {
        this.parentOnRender();
        this.initMap();
    },

    save: function ()
    {
        this.saveModel();
    },

    initMap: function () {
        this.map = new google.maps.Map(this.ui.mapContainer[0], {
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

Crude.Views.ThumbnailModule = Crude.Views.Module.extend(
{
    template: '#crude_thumbnailTemplate',
    moduleName: 'thumbnail',

    dropzone: '',
    uploadSuccessfull: true,
    errorMesssages: [],

    ui: {
        save: '#save',
        cancel: '#cancel',
        loader: '#loader',
    },

    save: function() { },

    onRender: function()
    {
        var that = this;
        _.each(this.setup.get('thumbnailColumns'), function(column) {
            this.$('#upload_file_dropzone_'+column).dropzone(that.dropzoneSetup(column));
        });

        this.parentOnRender();

        this.ui.save.hide(100);
    },

    dropzoneSetup: function(column)
    {
        var that = this;
        return {
            headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: that.setup.thumbnailRoute('upload'),
            previewTemplate: $('#crude_dropzoneThumbnailTemplate').html(),
            maxFiles: 1,
            uploadMultiple: false,
            autoProcessQueue: true,
            init: function()
            {
                that.dropzone = this;

                this.on("success", function(file, response)
                {
                    if (response.success) {
                        file.serverPath = response.model[column].original_path;
                    }

                    if (! response.success) {
                        that.uploadSuccessfull = false;
                        that.errorMessages = response.errors.file;
                        return;
                    }

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("queuecomplete", function()
                {
                    if (! that.uploadSuccessfull) {
                        _.each(that.errorMessages, function(error){
                            that.dropzone.removeAllFiles();
                            Crude.showError(error, that.alertContainer());
                        });

                        that.errorMessages = [];
                        return;
                    }

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('serverPath')){
                        $.ajax({
                            dataType: "json",
                            type: 'delete',
                            url: that.setup.thumbnailRoute('delete'),
                            data: {
                                model_id    : that.model.id,
                                model_column : column,
                                file_path   : file.serverPath,
                                crudeName   : that.setup.getName()
                            },
                            success: function(response){
                                that.model = response.model;

                                Crude.vent.trigger('action_update', that.setup.getName());
                            }
                        });
                    }
                });

                var file = that.model.get(column);
                if (file) {
                    var dzFile = {
                        name: file.file_original_name,
                        thumb: file.original_path,
                        serverPath: file.original_path,
                        accepted: true
                    };
                    that.dropzone.emit("addedfile", dzFile);
                    that.dropzone.createThumbnailFromUrl(dzFile, dzFile.serverPath);

                    that.dropzone.files.push(dzFile);

                    // var existingFileCount = 1; // The number of files already uploaded
                    // that.dropzone.options.maxFiles = that.dropzone.options.maxFiles - existingFileCount;
                }

            },
            sending: function(file, xhr, formData) {
                formData.append("crudeName", that.setup.getName());
                formData.append("modelId", that.model.id);
                formData.append("columnName", column);
            },
            maxfilesexceeded: function(file) {
                this.removeAllFiles();
                this.addFile(file);
            }
        }
    }
});

Crude.Views.ListItem = Backbone.Marionette.ItemView.extend(
{
    template: '#crude_listItemTemplate',
    tagName: 'tr',

    className: function ()
    {
        var className = 'crude-table-body-row ';
        className += Crude.data.selectedItem == this.model.get('id') ? 'active' : '';
        return className;
    },

    ui: {
        action: '.action',
        customAction: '.customAction',
        delete: '#delete'
    },

    events: {
        'click @ui.action': 'action',
        'click @ui.delete': 'delete',
        'click @ui.customAction': 'customAction',
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.listenTo(Crude.vent, 'item_selected', this.itemSelected);
    },

    onRender: function ()
    {
        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
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
        $(':focus').blur();

        Crude.data.selectedItem = this.model.get('id');

        var target = $(event.target);
        if (! target.hasClass('action'))
            target = target.parents('.action');

        var action = target.data('action');
        this.setup.triggerAction(action, this.model);
    },

    customAction: function (event)
    {
        $(':focus').blur();

        var target = $(event.target);
        if (! target.hasClass('customAction'))
            target = target.parents('.customAction');

        var alertContainer = $('#' + this.setup.containerId()).find('#alertContainer');
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
        $(':focus').blur();

        this.setup.triggerCancel();

        var $modal = $('#deleteItemConfirmModal');
        $modal.modal('show');
        var alertContainer = $('#' + this.setup.containerId()).find('#alertContainer');

        $modal.find('#confirm').click(function (event)
        {
            this.model.destroy({wait: true})
                .done(function(response) {
                    Crude.vent.trigger('action_update', this.setup.getName());

                    if ('message' in  response)
                        Crude.showAlert('success', response.data.message, alertContainer);

                    $modal.modal('hide');
                }.bind(this))
                .fail(function(response) {
                    var responseTextJSON = JSON.parse(response.responseText);

                    if (response.status == 422) {
                        errors = _.values(responseTextJSON).join('<br>');
                        Crude.showAlert('danger', errors, alertContainer);
                    }

                    if (response.status == 403)
                        Crude.showAlert('danger', responseTextJSON.error.message, alertContainer);

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
    className: 'crude-table-body-row',

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
    className: 'table table-hover crude-table',

    updateTime: '',

    ui: {
        updateDelay: '#updateDelay',
        refresh: '#refresh',

        add: '#add',
        order: '#order',
        sort: '.sort',
        check: '#check',

        changeNumRows: '.changeNumRows',

        changePage: '.changePage',

        changeSearchAttr: '.changeSearchAttr',
        searchValue: '#searchValue',
        search: '#search',
        selectedSearchAttr: '#selectedSearchAttr',
        clearSearch: '#clearSearch',

        clearRichFilter: '.clearRichFilter',
        useRichFilter: '.useRichFilter',
        richFilterValue: '.richFilterValue'
    },

    events: {
        'click @ui.add': 'add',
        'click @ui.order': 'order',
        'click @ui.sort': 'sort',
        'click @ui.check': 'check',
        'click @ui.changeNumRows': 'changeNumRows',
        'click @ui.changePage': 'changePage',
        'click @ui.changeSearchAttr': 'changeSearchAttr',
        'click @ui.search': 'search',
        'keyup @ui.searchValue': 'searchOnEnter',
        'click @ui.clearSearch': 'clearSearch',
        'click @ui.refresh': 'updateList',
        'click @ui.clearRichFilter': 'clearRichFilter',
        'click @ui.useRichFilter': 'updateList',
        'keyup @ui.richFilterValue': 'richFilterValue'
    },

    initialize: function (options)
    {
        this.setup = options.setup;

        this.updateTime = Date.now();

        this.collection = this.setup.getNewCollection();

        this.updateList();
        this.listenTo(Crude.vent, 'action_update', this.updateThisList);

        this.listenTo(Crude.vent, 'open_add_form', this.add);
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
            sort: this.collection.sortAttributes,
            pagination: this.collection.pagination,
            search: this.collection.search,
            richFilters: this.collection.richFilters
        };
    },

    onRender: function ()
    {
        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();

        setInterval(function()
        {
            var delay = Date.now() - this.updateTime;
            delay = parseInt(delay / 1000);
            var s = delay % 60;
            var m = parseInt(delay / 60);

            s = String("00" + s).slice(-2);

            this.ui.updateDelay.html( m + ':' + s );
        }.bind(this), 1000);
    },

    add: function ()
    {
        $(':focus').blur();

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

    check: function ()
    {
        var list = $('.checkboxColumn' + this.setup.getName());
        var checkedList = $('.checkboxColumn' + this.setup.getName() + ':checked');

        var shoudCheck = list.length > checkedList.length;

        list.each(function () {
            $(this).prop('checked', shoudCheck);
        });
    },

    order: function ()
    {
        $(':focus').blur();

        this.setup.triggerCancel();

        var alertContainer = $('#' + this.setup.containerId()).find('#alertContainer');
        var list = this.collection.toJSON();
        var options = this.setup.get('orderParameters');
        list = _.sortBy(list, function(model) {
            return parseInt(model[options.orderAttr]);
        });

        var template = _.template($('#crude_orderedListModalTemplate').html())({
            list: list,
            options: options
        });

        $modal = $('#orderedListModal');
        $modal.find('#content').html(template);

        $modal.modal('show');
        $modal.find('#collection').sortable();

        var orders = _.pluck(list, options.orderAttr);
        orders = _.sortBy(orders, function(num) {
            return parseInt(num);
        });

        var url = this.setup.orderedListRoute();
        var that = this;

        $modal.find('#confirm').click(function() {
            var orderList = [];
            var i = 0;
            $modal.find('#collection').find('li').each(function () {
                orderList.push({
                    id: $(this).data('id'),
                    order: orders[i]
                });
                i++;
            });

            $.ajax({
                url: url,
                type: 'post',
                data: {
                    orderList: orderList
                },
                success: function(response)
                {
                    $modal.modal('hide');
                    Crude.vent.trigger('action_update', that.setup.getName());
                    Crude.showAlert('success', response.data.message, alertContainer);
                },
                error: function(response)
                {
                    $modal.modal('hide');
                    that.setup.onAjaxFail(response, alertContainer);
                }
            });
        });
    },

    changeNumRows: function (event)
    {
        var $target = $(event.target);
        this.collection.pagination.numRows = $target.html();
        this.updateList();
    },

    changePage: function (event)
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

    searchOnEnter: function (event)
    {
        if (event.keyCode == 13)
            this.search();
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
        this.collection.fetchWithOptions().done(function (response)
        {
            Crude.vent.trigger('fetched_completed');
            this.updateTime = Date.now();

            // todo
            // this broke actionToTrigger, refactor needed in order to
            // update crude setup model with list
            // this.setup = new Crude.Models.Setup(response.data.setup);

            this.render();
        }.bind(this));
    },

    updateThisList: function (setupName)
    {
        if (this.setup.getName() == setupName || this.setup.config('refreshAll'))
            this.updateList();
    },

    clearRichFilter: function (event)
    {
        var $target = $(event.target);
        if (! $target.hasClass('clearRichFilter'))
            $target = $target.parent();

        var name = $target.data('name');
        var $input = $('#richFilterValue' + name);

        if (_.isEmpty($input.val()))
            return;

        $input.val('');
        delete this.collection.richFilters[name];
        this.updateList();
    },

    richFilterValue: function (event)
    {
        if (event.keyCode == 13)
            return this.updateList();

        var $target = $(event.target);

        if (! _.isEmpty($target.val()))
            this.collection.richFilters[$target.data('name')] = $target.val();
    },

});

Crude.Views.Layout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        'list': '#listRegion',
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion',
        'thumbnail': '#thumbnailRegion'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
    },

    serializeData: function()
    {
        return {
            setup: this.setup
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

            if (this.setup.isActionAvailable('thumbnail'))
                this.thumbnail.show(
                    new Crude.Views.ThumbnailModule({ setup: setup })
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

        var panelClass = setup.get('panelView') ? ' crude-box-panel' : '';

        $crudeContainer.append(
            '<div id="' + setup.containerId() + '" class="container crude-box' + panelClass + '"></div>'
        );

        var view = new Crude.Views.Layout({
            el: '#' + setup.containerId(),
            setup: setup
        });
        view.render();
    });

    // initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip();

    $('#deleteItemConfirmModal').find('.modal-content').html(
        _.template($('#crude_deleteItemConfirmModalTemplate').html())({})
    );
});

//# sourceMappingURL=app.js.map
