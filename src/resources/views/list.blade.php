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
                var iconClassName = setup.config('iconClassName');
                _.each(setup.get('actions'), function(action) {
                    if(setup.isActionAvailable(action)) {
                        %>
                        <span data-action="<%- action %>" class="action btn-icon <%- iconClassName[action] %> pointer"></span>
                        <%
                    }
                })
            }
        %>

        <% if(setup.get('deleteOption') && model.get('canBeRemoved')) { %>
            <span id="delete" class="fa fa-trash fa-lg pointer"></span>
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
                    <span id="add" class="fa fa-plus fa-lg pointer"></span>
                <% } %>
            </th>
        </tr>
    </thead>

    <tbody id="childViewContainer" class="crude-table-body"></tbody>

    <tfoot class="crude-table-foot">
        <tr>
            <td colspan="<%- setup.get('column').length + 1 %>">
                @include('CrudeCRUD::partials.list-foot')
            </td>
        </tr>
    </tfoot>

</script>
