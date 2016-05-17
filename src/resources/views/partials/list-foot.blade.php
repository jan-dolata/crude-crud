<div class="pull-right text-right form-inline">
    <div class="input-group">
        <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <%- pagination.count > pagination.numRows ? pagination.numRows : pagination.count %> / <%- pagination.count %>
            <i class="fa fa-list m-sm-l"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-right">
            <% _.each(setup.config('numRowsOptions'), function(n) { %>
                <li><a class="changeNumRows" href="javascript:;"><%- n %></a></li>
            <% }) %>
        </ul>
    </div>

    <% if(pagination.numPages > 1) { %>
        <div class="input-group">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <%- pagination.page %> / <%- pagination.numPages %>
                <i class="fa fa-clone m-sm-l"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
                <% for (var i = 1; i <= pagination.numPages; i++ ) { %>
                    <li><a class="changePage" href="javascript:;"><%- i %></a></li>
                <% } %>
            </ul>
        </div>
    <% } %>
</div>

<div class="form-inline">
    <div class="input-group">
        <div class="input-group-btn">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span id="selectedSearchAttr"><%- Crude.getAttrName(search.attr) %></span>
            </button>
            <ul class="dropdown-menu">
                <%
                _.each(setup.get('column'), function(attr) {
                    if(! _.isArray(attr)) attr = [attr];
                    _.each(attr, function(a) {
                        if(a == 'files') return;
                %>
                    <li><a class="changeSearchAttr" href="javascript:;" data-attr="<%- a %>"><%- Crude.getAttrName(a) %></a></li>
                <% }) }) %>
            </ul>
        </div>
        <input id="searchValue" size="20" type="text" class="form-control input-sm" value="<%- search.value %>" placeholder="{{ trans('CrudeCRUD::crude.search_value') }}" />
        <div class="input-group-btn">
            <button type="button" id="clearSearch" class="btn btn-default btn-sm">
                <i class="fa fa-times"></i>
            </button>
            <button type="button" id="search" class="btn btn-default btn-sm">
                <i class="fa fa-search"></i>
            </button>
        </div>
    </div>
</div>
