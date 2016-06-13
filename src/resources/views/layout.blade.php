<script type="text/template" id="crude_layoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title" data-title="<%- setup.get('title') %>">
            <%- setup.get('title') %>
        </div>

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
                        </div>
                    </div>
                </div>
            </div>
        <% } else { %>
            <div id="alertContainer" class="crude-alert-container"></div>
            <div id="formRegion" class="crude-module" style="display: none"></div>
            <div id="mapRegion" class="crude-module" style="display: none"></div>
            <div id="fileRegion" class="crude-module" style="display: none"></div>
        <% } %>
    </div>

    <div class="crude-list">
        <div id="listRegion"></div>
    </div>
</script>
