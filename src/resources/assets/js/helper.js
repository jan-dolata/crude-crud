
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
        values[$this.data('attr')] = Crude.getFormValue($this);
    });

    return values;
};

Crude.getFormValue = function (input)
{
    if (input.attr('type') == 'custom')
        return window[$this.data('method')](input);

    if (input.attr('type') == 'checkbox')
        return input.is(':checked');

    if (input.attr('type') == 'select' || input.attr('type') == 'selectize')
        return input.find(':selected').val();

    if (input.attr('type') == 'json')
        return JSON.parse(input.val());

    return input.val();
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
    var type = setup.getInputType(attr);
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

Crude.whenAvailable = function (name, callback)
{
    var interval = 10; // ms
    var that = this;

    if (window[name])
        callback();
    else
        window.setTimeout(function() {
            if (window[name])
                callback();
            else
                window.setTimeout(Crude.whenAvailable(name, callback), interval);
        }, interval);
};

Crude.isUrl = function (string)
{
    var reg = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
    return reg.test(string);
};

Crude.isEmail = function (string)
{
    var reg = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    return reg.test(string);
};

Crude.nl2br = function (str, is_xhtml)
{
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};
