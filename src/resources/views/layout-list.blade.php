<script type="text/template" id="crude_layoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title pointer"
            data-title="<%- setup.get('title') %>"
            data-toggle="collapse"
            href=".crudeListCollapse<%- setup.getName() %>"
            >
            <%- setup.get('title') %>
        </div>

        <div class="crudeListCollapse<%- setup.getName() %> collapse in">

            <% if (setup.get('description')) { %>
                <div class="crude-header-description">
                    <%= setup.get('description') %>
                </div>
            <% } %>

            <% if (setup.get('moduleInPopup')) { %>
                <div id="moduleModal" class="modal fade" role="dialog">
                    <div class="modal-dialog crude-modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <%- setup.get('title') %>
                            </div>
                            <div class="modal-body">
                                <div id="alertContainer" class="crude-alert-container"></div>
                                <div id="formRegion" class="crude-module" style="display: none"></div>
                                <div id="mapRegion" class="crude-module" style="display: none"></div>
                                <div id="fileRegion" class="crude-module" style="display: none"></div>
                                <div id="thumbnailRegion" class="crude-module" style="display: none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            <% } else { %>
                <div id="alertContainer" class="crude-alert-container"></div>
                <div id="formRegion" class="crude-module" style="display: none"></div>
                <div id="mapRegion" class="crude-module" style="display: none"></div>
                <div id="fileRegion" class="crude-module" style="display: none"></div>
                <div id="thumbnailRegion" class="crude-module" style="display: none"></div>
            <% } %>
        </div>
    </div>

    <div class="crude-list crudeListCollapse<%- setup.getName() %> collapse in">
        <% if (! _.isEmpty(setup.get('richFilters'))) { %>
            <div id="richFiltersRegion" class="form-inline crude-rich-filters-region"></div>
        <% } %>

        <div id="listRegion" class="crude-list-region"></div>
    </div>
</script>
