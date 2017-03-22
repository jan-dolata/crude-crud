<div id="moduleButtons" class="m-md-t m-md-b">

    <i class="fa fa-info-circle"></i>
    <% if (model.id) { %>
        <strong><%- setup.interfaceTrans('edit_mode') %>:</strong>
        <%- setup.getAttrName('id') %>
        <%- model.id %>
    <% } else { %>
        <strong><%- setup.interfaceTrans('add_mode') %></strong>
    <% } %>

    <div class="pull-right">
        <span id="loader" style="display: none">
            <%= _.template($('#crude_moduleLoaderTemplate').html())({
                setup: setup
            }) %>
        </span>

        <button id="save" title="<%- setup.interfaceTrans('save') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
            <%= _.template($('#crude_saveActionButtonTemplate').html())({
                setup: setup
            }) %>
        </button>

        <% if (module == 'map') { %>
            <button id="clear" title="<%- setup.interfaceTrans('clear') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                <%= _.template($('#crude_clearActionButtonTemplate').html())({
                    setup: setup
                }) %>
            </button>
        <% } %>

        <button id="cancel" title="<%- setup.interfaceTrans('close') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
            <%= _.template($('#crude_cancelActionButtonTemplate').html())({
                setup: setup
            }) %>
        </button>
    </div>
</div>
