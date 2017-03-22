<% if(setup.get('deleteOption') && model.get('canBeRemoved')) { %>
    <button id="delete"
        class="crude-action-btn"
        title="<%- setup.interfaceTrans('delete') %>"
        data-toggle="tooltip" data-placement="bottom">
        <%= _.template($('#crude_deleteActionButtonTemplate').html())({
            setup: setup
        }) %>
    </button>
<% } %>
