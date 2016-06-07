<script type="text/template" id="crude_layoutTemplate">
    <div class="m-t">
        <h4><%- setup.get('title') %></h4>

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
            <div id="formRegion" style="display: none"></div>
            <div id="mapRegion" style="display: none"></div>
            <div id="fileRegion" style="display: none"></div>
            <hr>
        <% } %>
    </div>

    <div class="m-t">
        <div id="listRegion"></div>
    </div>
</script>
