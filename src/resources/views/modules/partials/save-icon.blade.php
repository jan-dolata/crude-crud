<div class="m-md-t m-md-b">
    <% if (model.id) { %>
        <%- setup.interfaceTrans('edit_mode') %>: # <%- model.id %>
    <% } else { %>
        <%- setup.interfaceTrans('add_mode') %>:
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

        <button id="cancel" title="<%- setup.interfaceTrans('close') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
            <%= _.template($('#crude_cancelActionButtonTemplate').html())({
                setup: setup
            }) %>
        </button>
    </div>
</div>
