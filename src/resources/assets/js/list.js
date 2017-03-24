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
        delete: '#delete',
        crudeCell: '.crudeCell',
        microEditBtn: '.microEditBtn',
        microEditCancel: '.microEditCancel',
        microEditSave: '.microEditSave'
    },

    events: {
        'click @ui.action': 'action',
        'click @ui.delete': 'delete',
        'click @ui.customAction': 'customAction',

        'mouseover @ui.microEditBtn': 'showMicroEditBtn',
        'mouseout @ui.microEditBtn': 'hideMicroEditBtn',
        'click @ui.microEditBtn': 'clickMicroEditBtn',
        'click @ui.microEditCancel': 'clickMicroEditCancel',
        'click @ui.microEditSave': 'clickMicroEditSave'
    },

    initialize: function (options)
    {
        this.setup = options.setup;
        this.listenTo(Crude.vent, 'item_selected', this.itemSelected);
    },

    onRender: function ()
    {
        // initialize all tooltips
        this.$('[data-toggle="tooltip"]').tooltip();

        // initialize all popovers
        this.$('[data-toggle="popover"]').popover({
            html: true
        });
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
        this.setup.triggerAction(action, this.model, '#' + this.setup.containerId());
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

        if (this.model.get('id') == Crude.data.selectedItem) {
            this.$el.addClass('active');
            this.ui.microEditBtn.hide();
        } else {
            this.$el.removeClass('active');
            this.ui.microEditBtn.show();
        }
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

    showMicroEditBtn: function (e)
    {
        var target = $(e.target);
        if (! target.hasClass('microEditBtn'))
            target = target.parents('.microEditBtn');

        target.css('opacity', 1);
    },

    hideMicroEditBtn: function (e)
    {
        var target = $(e.target);
        if (! target.hasClass('microEditBtn'))
            target = target.parents('.microEditBtn');

        target.css('opacity', 0.3);
    },

    clickMicroEditBtn: function (e)
    {
        var target = $(e.target);
        if (! target.hasClass('microEditBtn'))
            target = target.parents('.microEditBtn');

        var attr = target.data('attr');

        if (! this.setup.microEditAllow(attr))
            return;

        // popover is visible
        if (target.next('div.popover:visible').length)
            return this.closeMicroEditPopover(target);

        this.closeMicroEditPopover($('.microEditBtn'));

        var template = _.template($('#crude_microEditPopoverTemplate').html());

        target.popover({
            html: true,
            trigger: 'manual',
            placement: 'bottom',
            content: template({
                attr: attr,
                setup: this.setup,
                model: this.model.toJSON()
            })
        });

        target.popover('show');
    },

    clickMicroEditCancel: function (e)
    {
        var crudeCellContent = $(e.target).parents('.crudeCellContent');
        this.closeMicroEditPopover(crudeCellContent.find('.microEditBtn'));
    },

    clickMicroEditSave: function (e)
    {
        var popoverContent = $(e.target).parents('.popover-content');

        var input = popoverContent.find('.input');
        var attr = input.data('attr');
        var oldValue = this.model.get(attr);

        this.model.set(attr, Crude.getFormValue(input));

        this.model.save()
            .done(function (response)
            {
                if (('data' in response) && ('model' in  response.data))
                    this.model.set(response.data.model);

                this.closeMicroEditPopover(popoverContent.parents('.crudeCellContent').find('.microEditBtn'));
                this.render();
            }.bind(this))
            .fail(function (response)
            {
                popoverContent.find('.microEditAlertContainer').html('');
                this.setup.onAjaxFail(response, popoverContent.find('.microEditAlertContainer'));
                this.model.set(attr, oldValue);
            }.bind(this));

    },

    closeMicroEditPopover: function (trigger)
    {
        trigger.popover('hide');
        trigger.popover('destroy');
    }
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
    tagName: 'div',

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

        var actions = _.clone(this.setup.get('actions')),
            newModel = this.setup.getNewModel(),
            containerId = this.setup.containerId();

        this.setup.triggerAction(actions, newModel, '#' + containerId);
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
