<script type="text/template" id="crude_listItemTemplate">
    <% if(setup.get('checkboxColumn')) { %>
        <td class="crude-table-body-cell">
            <input type="checkbox" class="checkboxColumn<%- setup.getName() %> checkboxColumn" data-id="<%- model.id %>" data-crude="<%- setup.getName() %>" />
        </td>
    <% } %>

    <% _.each(setup.getVisibleColumns(), function(attr) { %>
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
    <td class="crude-table-body-cell" colspan="<%- setup.getVisibleColumns().length + 1 %>">
        <h4><%- setup.interfaceTrans('empty_list') %></h4>
    </td>
</script>

<script type="text/template" id="crude_listTemplate">
    <thead class="crude-table-head">
        <tr class="crude-table-head-row">
            <% if(pagination.count) { %>
                <% if(setup.get('checkboxColumn')) { %>
                    <th class="crude-table-head-cell">
                        <button id="check" title="<%- setup.interfaceTrans('check') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                            <%= _.template($('#crude_checkActionButtonTemplate').html())({
                                setup: setup
                            }) %>
                        </button>
                    </th>
                <% } %>

                <% _.each(setup.getVisibleColumns(), function(attr) { %>
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
                    <button id="order" title="<%- setup.interfaceTrans('order') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                        <%= _.template($('#crude_orderActionButtonTemplate').html())({
                            setup: setup
                        }) %>
                    </button>
                <% } %>

                <% if(! _.isEmpty(setup.get('extraColumn')) && pagination.count > 1) { %>
                    <button id="selectColumn" title="<%- setup.interfaceTrans('select_column') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                        <%= _.template($('#crude_selectColumnActionButtonTemplate').html())({
                            setup: setup
                        }) %>
                    </button>
                <% } %>

                <% if(setup.get('addOption') && setup.get('actions').length > 0) { %>
                    <button id="add" title="<%- setup.interfaceTrans('add') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                        <%= _.template($('#crude_addActionButtonTemplate').html())({
                            setup: setup
                        }) %>
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
        <%- setup.interfaceTrans('confirm_delete', 'title') %>
    </div>
    <div class="modal-body">
        <div class="content">
            <%- setup.interfaceTrans('confirm_delete', 'content') %>

            <div class="pull-right">
                <button id="confirm" class="crude-action-btn m-lg-r">
                    <%= _.template($('#crude_confirmDeleteActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
                <button class="crude-action-btn" data-dismiss="modal">
                    <%= _.template($('#crude_cancelDeleteActionButtonTemplate').html())({
                        setup: setup
                    }) %>
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
        <%- setup.interfaceTrans('order_list', 'title') %>
    </div>
    <div class="modal-body">
        <div class="content">
            <%- setup.interfaceTrans('order_list', 'content') %>

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
                    <%= _.template($('#crude_confirmOrderActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
                <button class="crude-action-btn" data-dismiss="modal">
                    <%= _.template($('#crude_cancelOrderActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
            </div>
        </div>
    </div>
</script>


<div id="columnSelectorModal" class="modal fade" role="dialog">
    <div class="modal-dialog crude-modal">
        <div class="modal-content" id="content"></div>
    </div>
</div>

<script type="text/template" id="crude_columnSelectorModalTemplate">
    <div class="modal-header">
        <%- setup.interfaceTrans('column_selector', 'title') %>
    </div>
    <div class="modal-body">
        <div class="content">
            <%- setup.interfaceTrans('column_selector', 'content') %>

            <ul id="collection" class="crude-order-list">
                <%
                _.each(setup.get('extraColumn'), function (column) {
                %>
                    <li>
                        <label>
                            <input type="checkbox" class="columnCheckbox" <%= column.visible ? 'checked' : '' %> data-name="<%- column.name %>">
                            <%- setup.getAttrName(column.name) %>
                        </label>
                        <%- column.description %>
                    </li>
                <% }) %>
            </ul>
            <div class="text-right">
                <button id="confirm" class="crude-action-btn m-lg-r">
                    <%= _.template($('#crude_confirmColumnSelectorActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
                <button class="crude-action-btn" data-dismiss="modal">
                    <%= _.template($('#crude_cancelColumnSelectorActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
            </div>
        </div>
    </div>
</script>
