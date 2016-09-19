<div class="pull-right text-right form-inline m-sm-b">

    <div class="input-group input-group crude-table-foot-refresh m-sm-b">
        <button id="refresh" type="button" class="btn btn-default btn-sm">
            {{ trans('CrudeCRUD::crude.update_delay') }}
            <span id="updateDelay"></span>s
            <i class="fa fa-refresh m-sm-l"></i>
        </button>
    </div>

    <div class="input-group crude-table-foot-num-rows m-sm-b">
        <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <%- pagination.count > pagination.numRows ? pagination.numRows : pagination.count %>
            / <%- pagination.count %>
            <i class="fa fa-list m-sm-l"></i>
        </button>
        <% if (setup.config('numRowsOptions')[0] < pagination.count) { %>
            <ul class="dropdown-menu dropdown-menu-right">
                <% _.each(setup.config('numRowsOptions'), function(n) { %>
                    <% if (n < pagination.count) { %>
                        <li><a class="changeNumRows" href="javascript:;"><%- n %></a></li>
                    <% } %>
                <% }) %>
                <li><a class="changeNumRows" href="javascript:;"><%- pagination.count %></a></li>
            </ul>
        <% } %>
    </div>

    <% if(pagination.numPages > 1) { %>
        <div class="input-group crude-table-foot-pagination m-sm-b">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <%- pagination.page %>
                / <%- pagination.numPages %>
                <i class="fa fa-clone m-sm-l"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
                <% for (var i = 1; i <= pagination.numPages; i++ ) { %>
                    <li><a class="changePage" href="javascript:;"><%- i %></a></li>
                <% } %>
            </ul>
        </div>
    <% } %>

    <% if (setup.get('exportOption')) { %>
        <div class="input-group input-group crude-table-foot-csv m-sm-b">
            <a href="/<%= setup.config('routePrefix') %>/export-csv/<%= setup.getName() %>" target="_blank" type="button" class="btn btn-default btn-sm">
                {{ trans('CrudeCRUD::crude.extort_csv') }}
                <i class="fa fa-download m-sm-l"></i>
            </a>
        </div>
    <% } %>
</div>

<div class="form-inline">
    <div class="input-group crude-table-foot-search">
        <div class="input-group-btn">
            <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span id="selectedSearchAttr"><%- setup.getAttrName(search.attr) %></span>
            </button>
            <ul class="dropdown-menu">
                <% _.each(setup.get('filters'), function(attr) { %>
                    <li>
                        <a class="changeSearchAttr" href="javascript:;" data-attr="<%- attr %>">
                            <%- setup.getAttrName(attr) %>
                        </a>
                    </li>
                <% }) %>
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
