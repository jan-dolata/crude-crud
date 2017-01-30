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
