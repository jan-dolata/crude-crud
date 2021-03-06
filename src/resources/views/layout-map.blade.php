<script type="text/template" id="crude_mapLayoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title pointer"
            data-title="<%- setup.get('title') %>"
            data-toggle="collapse"
            href=".crudeMapCollapse<%- setup.getName() %>"
            >
            <%- setup.get('title') %>
        </div>

        <div class="crudeMapCollapse<%- setup.getName() %> collapse in">
            <% if (setup.get('description')) { %>
                <div class="crude-header-description">
                    <%= setup.get('description') %>
                </div>
            <% } %>
        </div>
    </div>

    <div class="crude-list crudeMapCollapse<%- setup.getName() %> collapse in">
        <% if (! _.isEmpty(setup.get('richFilters'))) { %>
            <div id="richFiltersRegion" class="form-inline crude-rich-filters-region"></div>
        <% } %>

        <div id="mapRegion"></div>
    </div>
</script>
