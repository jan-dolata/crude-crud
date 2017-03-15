<script type="text/template" id="crude_formLayoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title" data-title="<%- setup.get('title') %>">
            <%- setup.get('title') %>
        </div>

        <% if (setup.get('description')) { %>
            <div class="crude-header-description">
                <%= setup.get('description') %>
            </div>
        <% } %>

        <style>
            .crude-module.no-border {
                border: 0 !important;
            }
        </style>

        <div id="alertContainer" class="crude-alert-container"></div>
        <div id="formRegion" class="crude-module no-border" style="display: none"></div>
        <div id="mapRegion" class="crude-module no-border" style="display: none"></div>
        <div id="fileRegion" class="crude-module no-border" style="display: none"></div>
        <div id="thumbnailRegion" class="crude-module no-border" style="display: none"></div>

        <div id="layoutAction" class="crude-module no-border">
            <div class="text-right">
                <span id="loader" style="display: none">
                    <%= _.template($('#crude_moduleLoaderTemplate').html())({
                        setup: setup
                    }) %>
                </span>

                <button id="save" title="<%- setup.interfaceTrans('save') %>" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
                    <%= _.template($('#crude_saveActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
            </div>
        </div>
    </div>
</script>
