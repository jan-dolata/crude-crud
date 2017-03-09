<script type="text/template" id="crude_richFilterListItemTemplate">
    <%= Crude.renderRichFilter(setup, model.toJSON(), model.get('value')) %>
</script>

<script type="text/template" id="crude_richFilterListTemplate">
    <% if (collection.where({hidden: true}).length) { %>
        <div class="pull-right input-group input-group-sm m-xs-b m-xs-t">
            <span class="input-group-addon">
                <i class="fa fa-filter"></i>
            </span>

            <select id="showRichFilter" class="form-control">
                <option><%- setup.interfaceTrans('add_new_filter') %></option>

                <% collection.each(function (model) {
                    if (model.get('hidden')) {
                    %> <option value="<%- model.get('name') %>">
                        <%- model.get('label') %>
                    </option> <%
                    }
                }) %>
            </select>
        </div>
    <% } %>

    <span id="childViewContainer"></span>
</script>
