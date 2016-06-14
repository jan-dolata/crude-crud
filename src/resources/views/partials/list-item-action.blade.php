<%
_.each(setup.get('customActions'), function(data, action) {
    if(model.isCustomActionAvailable(action)) {
%>
            <button data-action="<%= action %>"
                class="customAction crude-action-btn"
                <%= data.title ? 'title="' + data.title + '" data-toggle="tooltip" data-placement="bottom"' : '' %>>
                <%= $('#' + action + 'CustomActionButtonTemplate').html() %>
            </button>
<%
    }
});

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

if(setup.get('deleteOption') && model.get('canBeRemoved')) {
%>
    <button id="delete"
        class="crude-action-btn"
        title="{{ trans('CrudeCRUD::crude.delete') }}"
        data-toggle="tooltip" data-placement="bottom">
        <%= $('#crude_deleteActionButtonTemplate').html() %>
    </button>
<%
}
%>
