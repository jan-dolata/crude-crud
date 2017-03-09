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
        var filters = [];

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
