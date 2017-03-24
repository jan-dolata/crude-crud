<script type="text/template" id="crude_formActionsTemplate">
    @include('CrudeCRUD::partials.actions.custom')
    @include('CrudeCRUD::partials.actions.edit')
</script>

<script type="text/template" id="crude_formLayoutTemplate">
    <div id="header" class="crude-header">
        <div class="crude-header-title pointer"
            data-title="<%- setup.get('title') %>"
            data-toggle="collapse"
            href=".crudeFormCollapse<%- setup.getName() %>"
            >
            <%- setup.get('title') %>

            <div id="actionsRegion" class="pull-right"></div>
        </div>

        <div class="crudeFormCollapse<%- setup.getName() %> collapse in">

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
        </div>
    </div>
</script>
