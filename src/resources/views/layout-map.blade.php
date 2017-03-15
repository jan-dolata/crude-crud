<script type="text/template" id="crude_mapLayoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title" data-title="<%- setup.get('title') %>">
            <%- setup.get('title') %>
        </div>

        <% if (setup.get('description')) { %>
            <div class="crude-header-description">
                <%= setup.get('description') %>
            </div>
        <% } %>
    </div>

    <div class="crude-list">
        <% if (! _.isEmpty(setup.get('richFilters'))) { %>
            <div id="richFiltersRegion" class="form-inline rich-filters-region"></div>
        <% } %>

        <div id="mapRegion"></div>
    </div>
</script>
