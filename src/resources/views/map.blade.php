<script type="text/template" id="crude_mapTemplate">
    <div id="mapContainer" class="map-region"></div>
</script>

<script type="text/template" id="crude_mapInfowindowTemplate">
    <dl class="dl-horizontal m-lg-t">
        <% _.each(setup.get('column'), function(attr) { %>
            <% if(! _.isArray(attr)) attr = [attr]; %>
            <% _.each(attr, function(a) { %>
                <dt>
                    <strong class="m-r">
                        <%- setup.getAttrName(a) %>:
                    </strong>
                </dt>
                <dd>
                    <%= Crude.renderCell(setup, a, model) %>
                </dd>
            <% }); %>
        <% }) %>
    </dl>
</script>
