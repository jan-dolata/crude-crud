<script type="text/template" id="crude_layoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title">
            <%- setup.get('title') %>
        </div>

        <% if (setup.get('moduleInPopup')) { %>
            <div id="moduleModal" class="modal fade" role="dialog">
                <div class="modal-dialog tds-modal-dialog">
                    <div class="modal-content tds-box">
                        <div class="modal-body">
                            <%- setup.get('title') %>
                            <div id="formRegion" style="display: none"></div>
                            <div id="mapRegion" style="display: none"></div>
                            <div id="fileRegion" style="display: none"></div>

                            <div id="alertContainer" class="m-t"></div>
                        </div>
                    </div>
                </div>
            </div>
        <% } else { %>
            <div id="formRegion" class="crude-module" style="display: none"></div>
            <div id="mapRegion" class="crude-module" style="display: none"></div>
            <div id="fileRegion" class="crude-module" style="display: none"></div>
            <div id="alertContainer" class="crude-alert-container"></div>
        <% } %>
    </div>

    <div class="crude-list">
        <div id="listRegion"></div>
    </div>
</script>
