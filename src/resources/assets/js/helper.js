
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
    $('#crude_alertContainer').find('#alertList').append(template({ type: type, msg: msg }));
};

/**
 * Clears all messages that were shown
 */
Crude.clearAllAlerts = function()
{
    $('#crude_alertContainer').find('#alertList').empty();
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
    var defaultName = '#crude_textInputTemplate';

    var type = section.inputType[attr];
    var templateName = _.isUndefined(type)
        ? defaultName
        : '#crude_' + type + 'InputTemplate';

    var templateScript = $(templateName);
    if (templateScript.lenght == 0)
        templateScript = $(defaultName);

    var template = _.template($(templateName).html());

    return template({ section: section, attr: attr, model: model });
};
