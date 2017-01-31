<div class="form-inline">

    <button type="button" id="useRichFilters" class="btn btn-default btn-sm pull-right m-xs-t">
        <i class="fa fa-search"></i>
    </button>

    <%
    var setupRichFilters = setup.get('richFilters');
    for(var i in setupRichFilters) {
        var setupRichFilter = setupRichFilters[i];
    %>
        <%= Crude.renderRichFilter(setup, setupRichFilter, richFilters[setupRichFilter.name]) %>
    <% } %>

</div>
