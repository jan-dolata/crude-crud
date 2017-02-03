<%
_.each(setup.get('customActions'), function(data, action) {
    if(model.isCustomActionAvailable(action)) {
        if(data.type && data.type == 'link') {
%>
        <a href="<%= data.url ? data.url : '#' %><%= data.attr ? '/' + model.get(data.attr) : '' %>" <%= data.target ? 'target="' + data.target + '"' : '' %>>
            <button class="crude-action-btn"
                <%= data.title ? 'title="' + data.title + '" data-toggle="tooltip" data-placement="bottom"' : '' %>>
                <%= _.template($('#' + action + 'CustomActionButtonTemplate').html())({
                    setup: setup
                }) %>
            </button>
        </a>
<%
        } else {
%>
            <button data-action="<%= action %>"
                class="customAction crude-action-btn"
                <%= data.title ? 'title="' + data.title + '" data-toggle="tooltip" data-placement="bottom"' : '' %>>
                <%= _.template($('#' + action + 'CustomActionButtonTemplate').html())({
                    setup: setup
                }) %>
            </button>
<%
        }
    }
});

if(setup.get('editOption') && model.get('canBeEdited')) {
    _.each(setup.get('actions'), function(action) {
        if(setup.isActionAvailable(action)) {
%>
            <button data-action="<%= action %>"
                class="action crude-action-btn"
                title="<%= setup.interfaceTrans('action', action) %>"
                data-toggle="tooltip" data-placement="bottom">
                <%= _.template($('#crude_' + action + 'ActionButtonTemplate').html())({
                    setup: setup
                }) %>
            </button>
<%
        }
    })
}

if(setup.get('deleteOption') && model.get('canBeRemoved')) {
%>
    <button id="delete"
        class="crude-action-btn"
        title="<%- setup.interfaceTrans('delete') %>"
        data-toggle="tooltip" data-placement="bottom">
        <%= _.template($('#crude_deleteActionButtonTemplate').html())({
            setup: setup
        }) %>
    </button>
<%
}
%>
