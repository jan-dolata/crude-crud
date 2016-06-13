<script type="text/template" id="crude_listItemTemplate">
    <% _.each(setup.get('column'), function(attr) { %>
        <% if(! _.isArray(attr)) attr = [attr]; %>
        <td class="crude-table-body-cell">
            <% _.each(attr, function(a) { %>
                <%= Crude.renderCell(setup, a, model) %>
                <br>
            <% }); %>
        </td>
    <% }) %>
    <td class="text-right crude-table-body-cell">
        <%
            if(setup.get('editOption') && model.get('canBeEdited')) {
                _.each(setup.get('actions'), function(action) {
                    if(setup.isActionAvailable(action)) {
                        %>
                            <button data-action="<%= action %>"
                                class="action crude-action-btn"
                                title="<%= Crude.getTrans('crude.action', action) %>"
                                data-toggle="tooltip" data-placement="bottom">
                                <%= $('#crude_' + action + 'ActionButtonTemplate').html() %>
                            </button>
                        <%
                    }
                })
            }
        %>

        <% if(setup.get('deleteOption') && model.get('canBeRemoved')) { %>
            <button id="delete" title="{{ trans('CrudeCRUD::crude.delete') }}" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                <%= $('#crude_deleteActionButtonTemplate').html() %>
            </button>
        <% } %>
    </td>
</script>

<script type="text/template" id="crude_listEmptyTemplate">
    <td class="text-center crude-table-body-cell" colspan="<%- setup.get('column').length + 1 %>">
        <h4>{{ trans('CrudeCRUD::crude.empty_list') }}</h4>
    </td>
</script>

<script type="text/template" id="crude_listTemplate">
    <thead class="crude-table-head">
        <tr class="crude-table-head-row">
            <% _.each(setup.get('column'), function(attr) { %>
                <% if(! _.isArray(attr)) attr = [attr]; %>
                <th class="crude-table-head-cell">
                    <% _.each(attr, function(a) { %>
                        <div class="sort pointer" data-attr="<%- a %>">
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

            <th class="crude-table-head-cell text-right">
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
            <td class="crude-table-foot-cell" colspan="<%- setup.get('column').length + 1 %>">
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
