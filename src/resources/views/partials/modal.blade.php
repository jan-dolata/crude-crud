<div id="crude_modalContainer" class="modal-container"></div>

<script type="text/template" id="crude_modalTemplate">
    <div id="modalFade" class="modal fade" role="dialog">
        <div class="modal-dialog tds-modal-dialog">
            <div class="modal-content tds-box">
                <div class="modal-header">
                    <button class="close" data-dismiss="modal" aria-hidden="true" style="width: auto">&times;</button>

                    <%- title %>
                </div>
                <div class="modal-body">
                    <%- content %>
                </div>
                <% if (_.keys(btnList).length > 0) { %>
                    <div class="modal-footer">
                        <div class="row">
                            <%
                            for(var key in btnList) {
                                var label = btnList[key];

                                %> <div class="col-sm-4 pull-right"> <%

                                if (label instanceof jQuery) {
                                    %><%= label.html() %><%
                                } else {
                                    var btnAttr = key == 'cancel'
                                        ? ' class="btn form-control" data-dismiss="modal" '
                                        : ' class="btn btn-success form-control" data-key="' + key + '" ';
                            %>
                                    <button <%= btnAttr %> >
                                        <%- label %>
                                    </button>
                            <%
                                }
                                %> </div> <%
                            }
                            %>
                        </div>
                    </div>
                <% } %>
            </div>
        </div>
    </div>
</script>
