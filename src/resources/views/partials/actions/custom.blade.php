<%
_.each(setup.get('customActions'), function(data, action) {
    if(model.isCustomActionAvailable(action)) {
        if(data.type && data.type == 'link') {
            var href = data.url ? data.url : '#';
            href += data.attr ? '/' + model.get(data.attr) : '';
            var target = data.target ? 'target="' + data.target + '"' : '';
            var title = data.title ? 'title="' + data.title + '" data-toggle="tooltip" data-placement="bottom"' : '';

            %>
            <a href="<%= href %>" <%= target %> class="none-text-decoration">
                <button class="crude-action-btn" <%= title %>>
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
%>
