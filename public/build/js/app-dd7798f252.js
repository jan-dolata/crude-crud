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

/**
 * Render filter input
 * @param  {model} setup
 * @param  {object} richFilter - rich filter data
 * @param  {mixed} value - filter input value
 * @return {HTML}
 */
Crude.renderRichFilter = function (setup, richFilter, value)
{
    var defaultName = '#crude_textRichFilterTemplate';
    var type = richFilter.type;
    var templateName = _.isUndefined(type)
        ? defaultName
        : '#crude_' + type + 'RichFilterTemplate';

    var templateScript = $(templateName);
    if (templateScript.lenght == 0)
        templateScript = $(defaultName);

    var template = _.template($(templateName).html());

    return template({
        setup: setup,
        richFilter: richFilter,
        value: value
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
        clear: '#clear',
        input: '.input',
        loader: '#loader'
    },

    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'cancel',
        'click @ui.clear': 'clear'
    },

    initialize: function (options)
    {
        this.moduleInitialize(options);
    },

    moduleInitialize: function (options)
    {
        this.setup = options.setup;

        this.model = 'model' in options ? options.model : this.setup.getNewModel();

        this.slideUpAllow = 'slideUpAllow' in options ? options.slideUpAllow : this.slideUpAllow;

        this.listenTo(Crude.vent, 'action_' + this.moduleName, this.onAction);
        this.listenTo(Crude.vent, 'action_end', this.onActionEnd);
        this.listenTo(Crude.vent, 'action_change', this.onActionChange);
        this.listenTo(Crude.vent, 'save_this_model', this.saveThisModel);
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

    lockForm: function ()
    {
        this.formIsLocked = true;
        this.ui.loader.show(200);
        this.ui.save.attr('disabled', true);
        this.ui.cancel.attr('disabled', true);
    },

    unlockForm: function ()
    {
        this.formIsLocked = false;
        this.ui.loader.hide(200);
        this.ui.save.removeAttr('disabled');
        this.ui.cancel.removeAttr('disabled');
    },

    saveThisModel: function (crudeName)
    {
        if (this.setup.getName() == crudeName)
            this.save();
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
                                file_path    : file.serverPath,
                                file_log_id  : file.fileLogId,
                                crudeName    : that.setup.getName(),
                                crudeModelId : that.model.id
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

            dictMaxFilesExceeded: that.setup.interfaceTrans("dictMaxFilesExceeded")
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
    marker: null,

    ui: {
        save: '#save',
        cancel: '#cancel',
        clear: '#clear',
        input: '.input',
        loader: '#loader',
        'mapContainer': '#mapContainer',
        'info': '#info',
        'position': '#position',
        'search': '#search',
    },

    initialize: function (options)
    {
        this.moduleInitialize(options);

        this.listenTo(Crude.vent, 'slide_down_finished', this.refreshMap);
    },

    onRender: function ()
    {
        this.parentOnRender();

        this.whenAvailable("google", function() {
            this.initMap();
        }.bind(this));
    },

    whenAvailable: function (name, callback) {
        var interval = 10; // ms
        var that = this;

        if (window[name])
            callback();
        else
            window.setTimeout(function() {
                if (window[name])
                    callback();
                else
                    window.setTimeout(that.whenAvailable(name, callback), interval);
            }, interval);
    },

    save: function ()
    {
        this.saveModel();
    },

    initMap: function () {
        this.map = new google.maps.Map(this.ui.mapContainer[0], {
            center: this.getMapCenter(),
            zoom: 6
        });

        if (this.model.hasLatLngObject()) {
            this.marker = this.showNewMarker();
            this.showSelectedLocation();
        }

        this.map.addListener('click', function (event) {
            this.setMarker(event);
        }.bind(this));

        this.bindSearch();
    },

    setMarker: function (event) {
        this.model.set('map_lat', event.latLng.lat());
        this.model.set('map_lng', event.latLng.lng());
        this.showSelectedLocation();

        if (this.marker === null)
            this.marker = this.showNewMarker();
        else
            this.marker.setPosition(this.model.getLatLngObject());
    },

    getMapCenter: function () {
        return this.model.hasLatLngObject()
            ? this.model.getLatLngObject()
            : this.setup.config('mapCenter');
    },

    showNewMarker: function () {
        return new google.maps.Marker({
            map: this.map,
            position: this.model.getLatLngObject()
        });
    },

    refreshMap: function (name) {
        if (name != this.setup.getName())
            return;

        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter(this.getMapCenter());
    },

    showSelectedLocation: function()
    {
        this.ui.position.html(this.model.get('map_lat') + ' x ' + this.model.get('map_lng'));

        var geocoder = new google.maps.Geocoder;

        geocoder.geocode({'location': this.model.getLatLngObject()}, function(results, status) {
            this.ui.info.html('');

            if (status !== google.maps.GeocoderStatus.OK)
                return;

            this.ui.info.html(results[0].formatted_address);

            var components = results[0].address_components;
            this.model.set('map_postal_code', this.getComponentOfSelectedLocation(components, 'postal_code'));
            this.model.set('map_province', this.getComponentOfSelectedLocation(components, 'administrative_area_level_1'));
            this.model.set('map_locality', this.getComponentOfSelectedLocation(components, 'locality'));

            var street = this.getComponentOfSelectedLocation(components, 'route');
            var streetNumber = this.getComponentOfSelectedLocation(components, 'street_number');
            var number = streetNumber === '' ? '' : ' ' + streetNumber;

            this.model.set('map_address', street + number);
        }.bind(this));
    },

    getComponentOfSelectedLocation: function (components, type) {
        for (var i in components) {
            var component = components[i];

            var isOneOfType = _.filter(component.types, function (cType) {
                return cType == type;
            }).length > 0;

            if (isOneOfType)
                return component.long_name;
        }

        return '';
    },

    clear: function () {
        this.model.set('map_lat', null);
        this.model.set('map_lng', null);
        this.model.set('map_postal_code', null);
        this.model.set('map_province', null);
        this.model.set('map_locality', null);
        this.model.set('map_address', null);

        this.saveModel();
    },

    /**
     * Example from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
     */
    bindSearch: function()
    {
        var that = this;
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

            if (places.length === 0) {
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
                var marker = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                });

                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function (event) {
                    that.setMarker(event);
                });

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
            this.$('#upload_file_dropzone_' + column.name).dropzone(
                that.dropzoneSetup(column.name)
            );
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

Crude.Models.RichFilter = Backbone.Model.extend(
{
    idAttribute: 'name',

    defaults: {
        name: '',
        label: '',
        type: 'text',
        options: [],

        value: '',
        hidden: true
    },

    showWithValue: function (value) {
        this.set('hidden', false);
        this.set('value', value);
    },

    clearAndHide: function () {
        this.set('hidden', true);
        this.set('value', '');
    },

    isActive: function () {
        return ! this.get('hidden') && this.get('value');
    }
});

Crude.Collections.RichFilters = Backbone.Collection.extend(
{
    model: Crude.Models.RichFilter,

    getFiltersValues: function () {
        var filters = {};

        this.each(function (model) {
            if (model.isActive())
                filters[model.get('name')] = model.get('value');
        });

        return filters;
    }
});

Crude.Views.RichFilterListItem = Backbone.Marionette.ItemView.extend(
{
    template: '#crude_richFilterListItemTemplate',
    tagName: 'span',

    ui: {
        'clearRichFilter': '.clearRichFilter',
        'richFilterValue': '.richFilterValue'
    },

    events: {
        'click @ui.clearRichFilter': 'clearRichFilter',
        'change @ui.richFilterValue': 'changeRichFilterValue'
    },

    className: function () {
        return this.model.get('hidden') ? 'hidden' : '';
    },

    initialize: function (options) {
        this.setup = options.setup;
    },

    serializeData: function () {
        return {
            setup: this.setup,
            model: this.model
        };
    },

    onRender: function () {
        if (this.model.get('type') == 'datetime')
            this.bindDatepickerInRichFilters();
    },

    changeRichFilterValue: function () {
        var value = $(this.ui.richFilterValue).val();
        this.model.set('value', value);
        Crude.vent.trigger('rich_filter_value_change', this.setup.getName());
    },

    clearRichFilter: function () {
        this.model.clearAndHide();
        Crude.vent.trigger('rich_filter_value_change', this.setup.getName());
    },

    bindDatepickerInRichFilters: function ()
    {
        // check default in JanDolata\CrudeCRUD\Engine\CrudeSetupTrait\DateTimePickerOptions
        var defaultOptions = this.setup.get('dateTimePickerOptions');

        var options = _.isEmpty(this.model.get('options'))
            ? defaultOptions
            : this.model.get('options');

        var $input = $(this.ui.richFilterValue).parent();
        $input.datetimepicker(options);

        $input.on('dp.hide', function(e) {
            this.changeRichFilterValue();
        }.bind(this));
    },
});

Crude.Views.RichFilterList = Backbone.Marionette.CompositeView.extend(
{
    template: '#crude_richFilterListTemplate',
    childView: Crude.Views.RichFilterListItem,
    childViewContainer: '#childViewContainer',
    tagName: 'div',

    ui: {
        'showRichFilter': '#showRichFilter'
    },

    events: {
        'change @ui.showRichFilter': 'showRichFilter'
    },

    initialize: function (options) {
        this.setup = options.setup;

        this.collection = new Crude.Collections.RichFilters(
            _.values(this.setup.get('richFilters'))
        );

        this.listenTo(Crude.vent, 'rich_filter_value_change', this.richFilterValueChange);

        this.getFiltersFromUrlHash();
        this.triggerUpdateList();
    },

    childViewOptions: function ()
    {
        return {
            setup: this.setup
        };
    },

    serializeData: function () {
        return {
            setup: this.setup,
            collection: this.collection
        };
    },

    showRichFilter: function () {
        var name = $(this.ui.showRichFilter).val();
        var model = this.collection.get(name);

        model.showWithValue('');
        this.render();
    },

    richFilterValueChange: function (name) {
        if (this.setup.getName() == name)
            this.triggerUpdateList();
    },

    triggerUpdateList: function () {
        var filters = this.collection.getFiltersValues();

        Crude.vent.trigger('rich_filters_change', this.setup.getName(), filters);
        this.updateUrlHash(filters);
        this.render();
    },

    updateUrlHash: function (filters) {
        window.location.hash = '';

        for (var name in filters)
            window.location.hash += '#' + name + '=' + filters[name];
    },

    getFiltersFromUrlHash: function () {
        var hash = window.location.hash.split('#');
        this.collection.richFilters = {};

        for (var i in hash) {
            if (hash[i] != '') {
                var values = hash[i].split('=');
                var model = this.collection.get(values[0]);

                if (model)
                    model.showWithValue(values[1]);
            }
        }
    },
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

        $modal.find('.modal-content').html(
            _.template($('#crude_deleteItemConfirmModalTemplate').html())({
                setup: this.setup
            })
        );

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
        selectColumn: '#selectColumn',

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
        'click @ui.order': 'order',
        'click @ui.selectColumn': 'selectColumn',
        'click @ui.sort': 'sort',
        'click @ui.check': 'check',
        'click @ui.changeNumRows': 'changeNumRows',
        'click @ui.changePage': 'changePage',
        'click @ui.changeSearchAttr': 'changeSearchAttr',
        'click @ui.search': 'search',
        'keyup @ui.searchValue': 'searchOnEnter',
        'click @ui.clearSearch': 'clearSearch',
        'click @ui.refresh': 'updateList',
    },

    initialize: function (options)
    {
        this.setup = options.setup;

        this.updateTime = Date.now();

        this.collection = this.setup.getNewCollection();
        this.updateList();

        this.listenTo(Crude.vent, 'action_update', this.updateThisList);
        this.listenTo(Crude.vent, 'open_add_form', this.add);
        this.listenTo(Crude.vent, 'rich_filters_change', this.richFiltersChange);
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
            search: this.collection.search
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
            options: options,
            setup: this.setup
        });

        var $modal = $('#orderedListModal');
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

    selectColumn: function ()
    {
        $(':focus').blur();

        var template = _.template($('#crude_columnSelectorModalTemplate').html())({
            setup: this.setup
        });

        var $modal = $('#columnSelectorModal');
        $modal.find('#content').html(template);
        $modal.modal('show');

        $modal.find('#confirm').click(function() {
            var extraColumn = this.setup.get('extraColumn');

            $modal.find('.columnCheckbox').each(function () {
                var check = $(this);
                extraColumn[check.data('name')].visible = check.is(':checked');
            });

            this.setup.set('extraColumn', extraColumn);

            $modal.modal('hide');
            this.render();
        }.bind(this));
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

    richFiltersChange: function (setupName, richFilters)
    {
        if (this.setup.getName() == setupName) {
            this.collection.richFilters = richFilters;
            this.updateList();
        }
    }

});

Crude.Views.Layout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_layoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        'richFilters': '#richFiltersRegion',
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

            if (! _.isEmpty(setup.get('richFilters')))
                this.richFilters.show(
                    new Crude.Views.RichFilterList({ setup: setup })
                );

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});

Crude.Views.FormLayout = Backbone.Marionette.LayoutView.extend(
{
    template: '#crude_formLayoutTemplate',
    tagName:  'div',
    className: '',

    firstRender: true,
    title: '',

    regions: {
        'form': '#formRegion',
        'map': '#mapRegion',
        'file': '#fileRegion',
        'thumbnail': '#thumbnailRegion'
    },

    ui: {
        'save': '#layoutAction #save'
    },

    events: {
        'click @ui.save': 'save'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.model = this.setup.getNewModel().set(options.modelData);
    },

    serializeData: function()
    {
        return {
            setup: this.setup,
            model: this.model
        };
    },

    onRender: function()
    {
        if (this.firstRender) {
            var data = {
                setup: this.setup,
                model: this.model,
                slideUpAllow: false
            };

            if (this.setup.isActionAvailable('form')) {
                this.form.show(
                    new Crude.Views.FormModule(data)
                );
                $('#formRegion').show();
                $('#formRegion').find('#moduleButtons').hide();
            }

            if (this.setup.isActionAvailable('file')) {
                this.file.show(
                    new Crude.Views.FileModule(data)
                );
                $('#fileRegion').show();
                $('#fileRegion').find('#moduleButtons').hide();
            }

            if (this.setup.isActionAvailable('map')) {
                this.map.show(
                    new Crude.Views.MapModule(data)
                );
                $('#mapRegion').show();
                $('#mapRegion').find('#moduleButtons').hide();
            }

            if (this.setup.isActionAvailable('thumbnail')) {
                this.thumbnail.show(
                    new Crude.Views.ThumbnailModule(data)
                );
                $('#thumbnailRegion').show();
                $('#thumbnailRegion').find('#moduleButtons').hide();
            }

            this.firstRender = false;
        }

        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();
    },
});

$(function()
{
    // lists
    var crudeSetup = Crude.getData('crudeSetup', []);
    var $crudeContainer = $('#crudeContainer');

    _.each(crudeSetup, function(setup)
    {
        var setup = new Crude.Models.Setup(setup);

        var panelClass = setup.get('panelView') ? ' crude-box-panel' : '';
        var containerId = setup.containerId();

        $crudeContainer.append(
            '<div id="' + containerId + '" class="container crude-box' + panelClass + '"></div>'
        );

        var view = new Crude.Views.Layout({
            el: '#' + containerId,
            setup: setup
        });
        view.render();
    });

    // forms
    var crudeForm = Crude.getData('crudeForm', []);
    var $crudeFormContainer = $('#crudeFormContainer');

    _.each(crudeForm, function(form)
    {
        if (! 'setup' in form)
            return;

        var setup = new Crude.Models.Setup(form.setup);
        var containerId = setup.formContainerId();
        var modelData = 'model' in form ? form.model : {};

        $crudeFormContainer.append(
            '<div id="' + containerId + '" class="container crude-box"></div>'
        );

        var view = new Crude.Views.FormLayout({
            el: '#' + containerId,
            setup: setup,
            modelData: modelData
        });
        view.render();
    });

    // initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip();
});

//# sourceMappingURL=app.js.map
