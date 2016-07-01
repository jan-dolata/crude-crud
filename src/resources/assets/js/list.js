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
        'click @ui.sort': 'sort',
        'click @ui.changeNumRows': 'changeNumRows',
        'click @ui.changePage': 'changePage',
        'click @ui.changeSearchAttr': 'changeSearchAttr',
        'click @ui.search': 'search',
        'keyup @ui.searchValue': 'searchOnEnter',
        'click @ui.clearSearch': 'clearSearch',
        'click @ui.refresh': 'updateList'
    },

    initialize: function (options)
    {
        this.setup = options.setup;

        this.updateTime = Date.now();

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

    order: function ()
    {
        $(':focus').blur();

        var alertContainer = $('#' + this.setup.containerId()).find('#alertContainer');
        var list = this.collection.toJSON();
        var options = this.setup.get('orderParameters');
        list = _.sortBy(list, function(model) {
            return model[options.orderAttr];
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
            return num;
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
                    Crude.vent.trigger('action_update', that.setup.getName());
                    $modal.modal('hide');
                    Crude.showAlert('success', response.data.message, alertContainer);
                },
                error: function(response)
                {
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
        this.collection.fetchWithOptions().done(function ()
        {
            Crude.vent.trigger('fetched_completed');
            this.updateTime = Date.now();
            this.render();
        }.bind(this));
    },

    updateThisList: function (setupName)
    {
        if (this.setup.getName() == setupName || this.setup.config('refreshAll'))
            this.updateList();
    },
});
