<script type="text/template" id="crude_textColumnFormatTemplate">
    <% value = model.get(attr) %>
    <% if (_.isObject(value)) { %>
        <%- value.length %>
    <% } else { %>
        <%- s.truncate(String(value), 20) %>
    <% } %>
</script>

<script type="text/template" id="crude_longtextColumnFormatTemplate">
    <%- model.get(attr) %>
</script>

<script type="text/template" id="crude_linkColumnFormatTemplate">
    <a
        href="<%- format.url %>/<%- model.get(format.attr) %>"
        data-toggle="tooltip"
        data-placement="bottom"
        title="<%- format.title ? format.title : format.url %>"
        >
        <sub><i class="fa fa-external-link"></i></sub>
        <%- model.get(attr) %>
    </a>
</script>

<script type="text/template" id="crude_boolColumnFormatTemplate">
    <%- model.get(attr) ? setup.interfaceTrans('yes') : setup.interfaceTrans('no') %>
</script>

<script type="text/template" id="crude_statusColumnFormatTemplate">
    <%
    var value = model.get(attr),
        format = setup.getColumnFormat(attr),
        option = _.findWhere(format.options, {id: value});
    %>
    <div class="text-center" style="padding: 2px 4px; border-radius: 2px; <%= option && ('color' in option) ? 'background:' + option.color : '' %>">
        <%- option && ('label' in option) ? option.label : '-' %>
    </div>
</script>

<script type="text/template" id="crude_numberColumnFormatTemplate">
    <%- s.numberFormat(parseFloat(model.get(attr)), 2, ".", " ")  %>
</script>

<script type="text/template" id="crude_filesColumnFormatTemplate">
    <% files = model.get(attr) %>
    <% for (var i in files) { %>
    <%
        var max_length = 20;
        var file = files[i];
        var fileOriginalName = file.file_original_name;
        var fileDisplayName = fileOriginalName.length > max_length
            ? fileOriginalName.substring(0,max_length-1) + "..."
            : fileOriginalName;
    %>
        <div>
            <form method="post" action="{{ route('download') }}" style="display: inline">
                {{ csrf_field() }}

                <input type="hidden" name="path" value="<%= file.path %>">
                <input type="hidden" name="name" value="<%= fileOriginalName %>">

                <button type="submit" class="crude-action-btn">
                    <i class="fa fa-download m-r m-l" aria-hidden="true"></i>
                </button>
            </form>

            <a href="<%- files[i]['path'] %>" target="_blank" data-toggle="tooltip" data-placement="top" title="<%- fileOriginalName %>">
                <%- fileDisplayName %>
            </a>
        </div>
    <% } %>

    <% if (files.length > 1) { %>
        <a href="{{ route('download_all') }}/<%- setup.getName() %>/<%- model.get('id') %>">
            <i class="fa fa-archive m-r m-l" aria-hidden="true"></i>
            <small>.zip</small>
        </a>
    <% } %>
</script>
