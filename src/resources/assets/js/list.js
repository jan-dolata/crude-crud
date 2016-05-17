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
