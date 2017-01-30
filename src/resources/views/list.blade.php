<script type="text/template" id="crude_listItemTemplate">
    <% if(setup.get('checkboxColumn')) { %>
        <td class="crude-table-body-cell">
            <input type="checkbox" class="checkboxColumn<%- setup.getName() %> checkboxColumn" data-id="<%- model.id %>" data-crude="<%- setup.getName() %>" />
        </td>
    <% } %>

    <% _.each(setup.get('column'), function(attr) { %>
        <% if(! _.isArray(attr)) attr = [attr]; %>
        <td class="crude-table-body-cell">
            <% _.each(attr, function(a) { %>
                <span class="crude-table-body-cell-label">
                    <%- setup.getAttrName(a) %>
                </span>
                <span class="crude-table-body-cell-content">
                    <%= Crude.renderCell(setup, a, model) %>
                </span>
                <br>
            <% }); %>
        </td>
    <% }) %>
    <td class="crude-table-body-cell crude-table-body-cell-action">
        @include('CrudeCRUD::partials.list-item-action')
    </td>
</script>

<script type="text/template" id="crude_listEmptyTemplate">
    <td class="hide"></td>
    <td class="crude-table-body-cell" colspan="<%- setup.get('column').length + 1 %>">
        <h4>{{ trans('CrudeCRUD::crude.empty_list') }}</h4>
    </td>
</script>

<script type="text/template" id="crude_listTemplate">
    <thead class="crude-table-head">
        <% if (! _.isEmpty(setup.get('richFilters'))) { %>
            <tr class="crude-table-head-filters-row">
                <td colspan="<%- setup.get('column').length + 1 + (setup.get('checkboxColumn') ? 1 : 0) %>">
                    @include('CrudeCRUD::partials.rich-filters')
                </td>
            </tr>
        <% } %>

        <tr class="crude-table-head-row">
            <% if(pagination.count) { %>
                <% if(setup.get('checkboxColumn')) { %>
                    <th class="crude-table-head-cell">
                        <button id="check" title="{{ trans('CrudeCRUD::crude.check') }}" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                            <%= $('#crude_checkActionButtonTemplate').html() %>
                        </button>
                    </th>
                <% } %>

                <% _.each(setup.get('column'), function(attr) { %>
                    <% if(! _.isArray(attr)) attr = [attr]; %>
                    <th class="crude-table-head-cell">
                        <% _.each(attr, function(a) { %>
                            <div class="sort crude-sort pointer" data-attr="<%- a %>">
                                <%- setup.getAttrName(a) %>

                                <% if(sort.attr == a) { %>
                                    <span class="fa-stack">
                                        <i class="fa fa-sort fa-stack-1x" style="color: #ddd"></i>
                                        <i class="fa fa-sort-<%- sort.order %> fa-stack-1x"></i>
                                    </span>
                                <% } %>
                            </div>
                        <% }); %>
                    </th>
                <% }) %>
            <% } %>

            <th class="crude-table-head-cell crude-table-head-cell-action">
                <% if(setup.get('orderOption') && pagination.count > 1) { %>
                    <button id="order" title="{{ trans('CrudeCRUD::crude.order') }}" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                        <%= $('#crude_orderActionButtonTemplate').html() %>
                    </button>
                <% } %>

                <% if(setup.get('addOption') && setup.get('actions').length > 0) { %>
                    <button id="add" title="{{ trans('CrudeCRUD::crude.add') }}" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                        <%= $('#crude_addActionButtonTemplate').html() %>
                    </button>
                <% } %>
            </th>
        </tr>
    </thead>

    <tbody id="childViewContainer" class="crude-table-body"></tbody>

    <tfoot class="crude-table-foot">
        <tr class="crude-table-foot-row">
            <td class="crude-table-foot-cell" colspan="<%- setup.get('column').length + 1 + (setup.get('checkboxColumn') ? 1 : 0) %>">
                @include('CrudeCRUD::partials.list-foot')
            </td>
        </tr>
    </tfoot>

</script>

<div id="deleteItemConfirmModal" class="modal fade" role="dialog">
    <div class="modal-dialog crude-modal">
        <div class="modal-content"></div>
    </div>
</div>

<script type="text/template" id="crude_deleteItemConfirmModalTemplate">
    <div class="modal-header">
        {{ trans('CrudeCRUD::crude.confirm_delete.title') }}
    </div>
    <div class="modal-body">
        <div class="content">
            {{ trans('CrudeCRUD::crude.confirm_delete.content') }}
            <div class="pull-right">
                <button id="confirm" class="crude-action-btn m-lg-r">
                    <%= _.template($('#crude_confirmDeleteActionButtonTemplate').html())({}) %>
                </button>
                <button class="crude-action-btn" data-dismiss="modal">
                    <%= _.template($('#crude_cancelDeleteActionButtonTemplate').html())({}) %>
                </button>
            </div>
        </div>
    </div>
</script>

<script type="text/template" id="crude_moduleLoaderTemplate">
    <i class="fa fa-cog fa-spin fa-lg fa-fw m-sm-r"></i>
</script>

<div id="orderedListModal" class="modal fade" role="dialog">
    <div class="modal-dialog crude-modal">
        <div class="modal-content" id="content"></div>
    </div>
</div>

<script type="text/template" id="crude_orderedListModalTemplate">
    <div class="modal-header">
        {{ trans('CrudeCRUD::crude.order_list.title') }}
    </div>
    <div class="modal-body">
        <div class="content">
            {{ trans('CrudeCRUD::crude.order_list.content') }}

            <ul id="collection" class="crude-order-list">
                <%
                _.each(list, function (model, index) {
                %>
                    <li data-id="<%- model[options.idAttr] %>" >
                        <span class="pull-right text-muted m-sm-l">
                            <%= (index + 1) %>
                            <i class="fa fa-sort m-sm-l"></i>
                        </span>
                        <%- model[options.labelAttr] %>
                    </li>
                <% }) %>
            </ul>
            <div class="text-right">
                <button id="confirm" class="crude-action-btn m-lg-r">
                    <%= _.template($('#crude_confirmOrderActionButtonTemplate').html())({}) %>
                </button>
                <button class="crude-action-btn" data-dismiss="modal">
                    <%= _.template($('#crude_cancelOrderActionButtonTemplate').html())({}) %>
                </button>
            </div>
        </div>
    </div>
</script>
