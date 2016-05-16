<script type="text/template" id="crude_listItemTemplate">
    <% _.each(setup.get('column'), function(attr) { %>
        <% if(! _.isArray(attr)) attr = [attr]; %>
        <td>
            <% _.each(attr, function(a) { %>
                <% value = model.get(a) %>
                <% if (_.isObject(value)) { %>
                    <%- value.length %>
                <% } else { %>
                    <%- String(value).substring(0, 40) %>
                    <%= String(value).length > 40 ? '...' : '' %>
                <% } %>
                <br>
            <% }); %>
        </td>
    <% }) %>
    <td class="text-right">
        <%
            var iconClassName = setup.config('iconClassName');
            _.each(setup.get('actions'), function(action) {
                if(setup.isActionAvailable(action)) { %>
                    <span data-action="<%- action %>" class="action btn-icon <%- iconClassName[action] %> pointer"></span>
            <% } }) %>

        <% if(setup.get('deleteOption')) { %>
            <span id="delete" class="fa fa-trash fa-lg pointer"></span>
        <% } %>
    </td>
</script>

<script type="text/template" id="crude_listEmptyTemplate">
    <td class="text-center" colspan="<%- setup.get('column').length + 1 %>">
        <h4>{{ trans('crude.empty_list') }}</h4>
    </td>
</script>

<script type="text/template" id="crude_listTemplate">
    <thead>
        <tr>
            <% _.each(setup.get('column'), function(attr) { %>
                <% if(! _.isArray(attr)) attr = [attr]; %>
                <th>
                    <% _.each(attr, function(a) { %>
                        <div class="sort pointer" data-attr="<%- a %>">
                            <%- Crude.getAttrName(a) %>

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

            <th class="text-right">
                <% if(setup.get('actions').length > 0) { %>
                    <span id="add" class="fa fa-plus fa-lg pointer"></span>
                <% } %>
            </th>
        </tr>
    </thead>

    <tbody id="childViewContainer"></tbody>

    <tfoot>
        <tr>
            <td colspan="<%- setup.get('column').length + 1 %>">
                @include('CrudeCRUD::partials.list-foot')
            </td>
        </tr>
    </tfoot>

</script>
