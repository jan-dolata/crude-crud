<%
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
%>
