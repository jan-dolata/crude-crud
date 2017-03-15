<script type="text/template" id="crude_mapTemplate">
    <div id="mapContainer" class="map-region"></div>
</script>

<script type="text/template" id="crude_mapInfowindowTemplate">
    <table>
        <% _.each(setup.get('column'), function(attr) { %>
            <% if(! _.isArray(attr)) attr = [attr]; %>
            <% _.each(attr, function(a) { %>
                <tr>
                    <td class="text-right">
                        <strong class="m-r">
                            <%- setup.getAttrName(a) %>:
                        </strong>
                    </td>
                    <td class="p-l">
                        <%= Crude.renderCell(setup, a, model) %>
                    </td>
                </tr>
            <% }); %>
        <% }) %>
    </table>
</script>
